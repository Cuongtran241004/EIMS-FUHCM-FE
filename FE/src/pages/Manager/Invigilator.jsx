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
  Radio,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { User_Excel_Template } from "../../utils/User_Excel_Template";
import { User_Import_Excel } from "../../utils/User_Import_Excel";
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
import userApi from "../../services/User";

// Ant Design Layout Components
const { Content, Sider } = Layout;
const Invigilator = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false); // For file upload loading state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingInvigilator, setEditingInvigilator] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await userApi.getAllusers({ role: 4 });
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
        // Update existing invigilator
        await userApi.updateUser({ ...editingInvigilator, ...values });
        message.success(EDIT_INVIGILATOR_SUCCESS);
      } else {
        // Add new invigilator
        await userApi.addUser(values);
        message.success(ADD_INVIGILATOR_SUCCESS);
      }
      fetchData();
      handleCancel();
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
    setEditingInvigilator(staff);
    form.setFieldsValue({
      fuId: staff.fuId,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      phoneNumber: staff.phoneNumber,
      department: staff.department,
      gender: staff.gender,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (fuId) => {
    try {
      await userApi.deleteUser(fuId);
      message.success(DELETE_INVIGILATOR_SUCCESS);
    } catch (error) {
      message.error(DELETE_INVIGILATOR_FAILED_SERVER);
    }
  };

  const handleFileUpload = async ({ file }) => {
    setFileLoading(true); // Set loading for file upload
    try {
      const InvigilatorData = await User_Import_Excel(file);
      // Add role to each invigilator
      const invigilatorWithRole = InvigilatorData.map((invigilator) => ({
        ...invigilator,
        role: 4,
      }));
      await Promise.all(
        invigilatorWithRole.map(userApi.addUser) // Add each invigilator to the database
      );

      message.success(IMPORT_INVIGILATOR_SUCCESS);
      fetchData();
    } catch (error) {
      message.error(IMPORT_INVIGILATOR_FAILED_SERVER);
    } finally {
      setFileLoading(false); // Reset loading state after process
    }
  };

  const columns = [
    {
      title: "FUID",
      dataIndex: "fuId",
      key: "fuId",
    },
    {
      title: "Full Name",
      key: "fullName",
      render: (text, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
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

              <Button
                onClick={() => User_Excel_Template("Invigilator_Template")}
                type="default"
              >
                Download Import Template
              </Button>
            </Space>

            <Spin spinning={loading}>
              <Table
                dataSource={data}
                columns={columns}
                rowKey={(record) => record.fuId}
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
            name="fuId"
            label="FUID"
            rules={[{ required: true, message: "Please input FUID!" }]}
          >
            <Input placeholder="Enter fuid" />
          </Form.Item>

          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please input first name!" }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please input last name!" }]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter the email" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone"
            rules={[{ required: true, message: "Please input phone number!" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: "Please input department!" }]}
          >
            <Input placeholder="Enter the department" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select gender!" }]}
            initialValue="male"
          >
            <Radio.Group>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Radio.Group>
          </Form.Item>
          {/* Hidden field */}
          <Form.Item name="role" initialValue="4" hidden={true}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Invigilator;
