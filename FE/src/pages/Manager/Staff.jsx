import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import NavBar from "../../components/NavBar/NavBar";
import { API_BASE_URL } from "../../configs/urlApi";
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
import {
  ADD_STAFF_FAILED,
  ADD_STAFF_FAILED_SERVER,
  ADD_STAFF_SUCCESS,
  DELETE_STAFF_FAILED,
  DELETE_STAFF_FAILED_SERVER,
  DELETE_STAFF_SUCCESS,
  EDIT_STAFF_FAILED,
  EDIT_STAFF_FAILED_SERVER,
  EDIT_STAFF_SUCCESS,
} from "../../configs/messages";
import { processExcelFile } from "../../utils/ImportExcel.js";
import { ExcelTemplate } from "../../utils/ExcelTemplate.js";
// Ant Design Layout Components
const { Content, Sider } = Layout;

const Staff = () => {
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
      const response = await fetch(API_BASE_URL + "/staffs");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch staff data.");
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
          `${API_BASE_URL}/staffs/${editingStaff.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (response.ok) {
          message.success(EDIT_STAFF_SUCCESS);
          fetchData();
          handleCancel();
        } else {
          throw new Error(EDIT_STAFF_FAILED);
        }
      } else {
        // Add new staff
        const response = await fetch(API_BASE_URL + "/staffs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          message.success(ADD_STAFF_SUCCESS);
          fetchData();
          handleCancel();
        } else {
          throw new Error(ADD_STAFF_FAILED);
        }
      }
    } catch (error) {
      message.error(
        isEditing ? EDIT_STAFF_FAILED_SERVER : ADD_STAFF_FAILED_SERVER
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
      const response = await fetch(`${API_BASE_URL}/staffs/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success(DELETE_STAFF_SUCCESS);
        fetchData();
      } else {
        throw new Error(DELETE_STAFF_FAILED);
      }
    } catch (error) {
      message.error(DELETE_STAFF_FAILED_SERVER);
    }
  };

  const handleFileUpload = async ({ file }) => {
    setFileLoading(true); // Set loading for file upload
    try {
      const staffData = await processExcelFile(file);
      console.log("Staff data:", staffData);
      const responses = await Promise.all(
        staffData.map(async (staff) => {
          const response = await fetch(API_BASE_URL + "/staffs", {
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
        message.success("All staffs imported successfully!");
      } else {
        message.error("Some staffs could not be imported.");
      }

      fetchData();
    } catch (error) {
      console.error("Error importing staffs:", error);
      message.error("Failed to import staffs.");
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
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ color: "blue", cursor: "pointer" }}
          />
          <Popconfirm
            title="Are you sure to delete this staff?"
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
      <Header />
      <Layout>
        <Sider width={256} style={{ backgroundColor: "#fff" }}>
          <NavBar />
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
                Add New Staff
              </Button>

              <Upload
                beforeUpload={() => false}
                showUploadList={false}
                onChange={handleFileUpload}
                maxCount={1}
                method="POST"
              >
                <Button icon={<UploadOutlined />} loading={fileLoading}>
                  Import Staffs
                </Button>
              </Upload>

              <Button onClick={ExcelTemplate} type="default">
                Download Import Template
              </Button>
            </Space>

            <Spin spinning={loading}>
              <Table
                dataSource={data}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 9 }}
              />
            </Spin>
          </Content>
        </Layout>
      </Layout>

      {/* Add/Edit Staff Modal */}
      <Modal
        title={isEditing ? "Edit Staff" : "Add New Staff"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="add_staff_form">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please input the staff name!" },
            ]}
          >
            <Input placeholder="Enter staff name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the staff email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter staff email" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Staff;
