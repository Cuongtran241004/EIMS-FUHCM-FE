import React, { useState, useEffect } from "react";
import Header_Manager from "../../components/Header/Header_Manager";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import {
  Spin,
  Table,
  Layout,
  Button,
  Form,
  Modal,
  Input,
  message,
  Space,
  Popconfirm,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Invigilator_Excel_Template } from "../../utils/Invigilator_Excel_Template";
import { Invigilator_Import_Excel } from "../../utils/Invigilator_Import_Excel";
import {
  ADD_INVIGILATOR_FAILED,
  ADD_INVIGILATOR_FAILED_SERVER,
  ADD_INVIGILATOR_SUCCESS,
  DELETE_INVIGILATOR_FAILED,
  DELETE_INVIGILATOR_FAILED_SERVER,
  DELETE_INVIGILATOR_SUCCESS,
  EDIT_INVIGILATOR_FAILED,
  EDIT_INVIGILATOR_FAILED_SERVER,
  EDIT_INVIGILATOR_SUCCESS,
  FETCH_INVIGILATORS_FAILED,
  IMPORT_INVIGILATOR_FAILED,
  IMPORT_INVIGILATOR_FAILED_SERVER,
  IMPORT_INVIGILATOR_SUCCESS,
} from "../../configs/messages";
import { API_BASE_URL } from "../../configs/urlApi";
// Ant Design Layout Components
const { Content, Sider } = Layout;
const Invigilator = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false); // For file upload loading state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL + "/invigilators");
      const result = await response.json();
      setData(result);
    } catch (error) {
      message.error(FETCH_INVIGILATORS_FAILED);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing) {
        // Update existing staff
        const response = await fetch(
          `${API_BASE_URL}/invigilators/${editingStaff.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (response.ok) {
          message.success(EDIT_INVIGILATOR_SUCCESS);
          fetchData();
          handleCancel();
        } else {
          throw new Error(EDIT_INVIGILATOR_FAILED);
        }
      } else {
        // Add new staff
        const response = await fetch(API_BASE_URL + "/invigilators", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          message.success(ADD_INVIGILATOR_SUCCESS);
          fetchData();
          handleCancel();
        } else {
          throw new Error(ADD_INVIGILATOR_FAILED);
        }
      }
    } catch (error) {
      message.error(
        isEditing
          ? EDIT_INVIGILATOR_FAILED_SERVER
          : ADD_INVIGILATOR_FAILED_SERVER
      );
    }
  };

  const handleEdit = (staff) => {
    setIsEditing(true);
    setEditingStaff(staff);
    form.setFieldsValue({
      name: staff.name,
      email: staff.email,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/invigilators/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success(DELETE_INVIGILATOR_SUCCESS);
        fetchData();
      } else {
        throw new Error(DELETE_INVIGILATOR_FAILED);
      }
    } catch (error) {
      message.error(DELETE_INVIGILATOR_FAILED_SERVER);
    }
  };

  const handleFileUpload = async ({ file }) => {
    setFileLoading(true); // Set loading for file upload
    try {
      const staffData = await Invigilator_Import_Excel(file);
      const responses = await Promise.all(
        staffData.map(async (staff) => {
          const response = await fetch(API_BASE_URL + "/invigilators", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(staff),
          });
          return response.ok;
        })
      );

      if (responses.every((response) => response)) {
        message.success(IMPORT_INVIGILATOR_SUCCESS);
      } else {
        message.error(IMPORT_INVIGILATOR_FAILED);
      }

      fetchData();
    } catch (error) {
      message.error(IMPORT_INVIGILATOR_FAILED_SERVER);
    } finally {
      setFileLoading(false); // Reset loading state after process
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ color: "blue", cursor: "pointer" }}
          />
          <Popconfirm
            title="Are you sure to delete this invigilator?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      <Header_Manager />
      <Layout>
        <Sider width={256} style={{ backgroundColor: "#fff" }}>
          <NavBar_Manager />
        </Sider>
        <Layout style={{ padding: "16px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              background: "#fff",
              minHeight: 280,
            }}
          >
            <Space>
              <Button type="primary" onClick={showModal}>
                Add New Invigilator
              </Button>

              <Upload
                beforeUpload={() => false}
                showUploadList={false}
                onChange={handleFileUpload}
                maxCount={1}
                method="POST"
              >
                <Button icon={<UploadOutlined />} loading={fileLoading}>
                  Import Invigilators
                </Button>
              </Upload>

              <Button onClick={Invigilator_Excel_Template} type="default">
                Download Import Template
              </Button>
            </Space>

            <Spin spinning={loading}>
              <Table
                dataSource={data}
                columns={columns}
                rowKey={Math.random}
                pagination={{ pageSize: 8 }}
              />
            </Spin>
          </Content>
        </Layout>
      </Layout>

      {/* Add/Edit Staff Modal */}
      <Modal
        title={isEditing ? "Edit Invigilator" : "Add New Invigilator"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="add_invigilator_form">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please input the invigilator name!" },
            ]}
          >
            <Input placeholder="Enter invigilator name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please input the invigilator email!",
              },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter invigilator email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              {
                required: true,
                message: "Please input the invigilator phone!",
              },
              { type: "text", message: "Please enter a valid phone!" },
            ]}
          >
            <Input placeholder="Enter invigilator phone" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Invigilator;
