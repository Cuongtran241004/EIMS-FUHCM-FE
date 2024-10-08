import React, { useState, useEffect } from "react";
import userApi from "../../services/User.js";
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
  Col,
  Row,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  ADD_USER_SUCCESS,
  ADD_USER_FAILED,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILED,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILED,
  FETCH_USERS_FAILED,
  IMPORT_USERS_SUCCESS,
  IMPORT_USERS_FAILED,
} from "../../configs/messages.jsx";
import { User_Import_Excel } from "../../utils/User_Import_Excel.js";
import { User_Excel_Template } from "../../utils/User_Excel_Template.js";

import NavBar_Manager from "../../components/NavBar/NavBar_Manager.jsx";

import Header from "../../components/Header/Header.jsx";
const { Content, Sider } = Layout;

const roleOptions = [
  { label: "Manager", value: 1 },
  { label: "Staff", value: 2 },
  { label: "Invigilator", value: 3 },
];

const Users = ({ isLogin }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch the data
      const result = await userApi.getAllUsers();

      // Ensure that we replace the current data with the new data
      setData(result);
    } catch (error) {
      message.error(FETCH_USERS_FAILED);
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
      console.log("Received values of form: ", values);
      if (isEditing) {
        await userApi.updateUser({ ...editingUser, ...values });
        message.success(EDIT_USER_SUCCESS);
      } else {
        await userApi.addUser(values);
        message.success(ADD_USER_SUCCESS);
      }
      fetchData();
      handleCancel();
    } catch (error) {
      message.error(isEditing ? EDIT_USER_FAILED : ADD_USER_FAILED);
    }
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setEditingUser(user);
    form.setFieldsValue({
      fuId: user.fuId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      department: user.department,
      gender: user.gender,
      role: user.role,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (fuId) => {
    try {
      await userApi.deleteUser(fuId);
      message.success(DELETE_USER_SUCCESS);
      fetchData();
    } catch (error) {
      message.error(DELETE_USER_FAILED);
    }
  };

  const handleFileUpload = async ({ file }) => {
    setFileLoading(true);
    try {
      const data = await User_Import_Excel(file);
      await Promise.all(data.map((user) => userApi.addUser(user)));
      message.success(IMPORT_USERS_SUCCESS);
      fetchData();
    } catch (error) {
      message.error(IMPORT_USERS_FAILED);
    } finally {
      setFileLoading(false);
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
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) =>
        roleOptions.find((option) => option.value === role)?.label || "-",
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
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.fuId)}
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
          <NavBar_Manager isLogin={isLogin} />
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
                Add New User
              </Button>

              <Upload
                beforeUpload={() => false}
                showUploadList={false}
                onChange={handleFileUpload}
                maxCount={1}
                method="POST"
              >
                <Button icon={<UploadOutlined />} loading={fileLoading}>
                  Import Users
                </Button>
              </Upload>

              <Button
                icon={<DownloadOutlined />}
                onClick={() => User_Excel_Template()}
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
                pagination={{
                  pageSize: 8,
                  showSizeChanger: true,
                  pageSizeOptions: ["8", "16", "24"],
                }}
              />
            </Spin>
          </Content>
        </Layout>
      </Layout>

      <Modal
        title={isEditing ? "Edit User" : "Add New User"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          name="add_user_form"
          initialValues={{
            gender: true, // Male selected by default
          }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="fuId"
                label="FUID"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Enter FUID" />
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  { required: true, message: "Please input first name!" },
                ]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: "Please input last name!" }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={15}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item
                name="phoneNumber"
                label="Phone"
                rules={[
                  { required: true, message: "Please input phone number!" },
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="department"
                label="Department"
                rules={[
                  { required: true, message: "Please input department!" },
                ]}
              >
                <Input placeholder="Enter department" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select role!" }]}
              >
                <Select placeholder="Select role">
                  {roleOptions.map((role) => (
                    <Select.Option key={role.value} value={role.value}>
                      {role.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: "Please select gender!" }]}
              >
                <Radio.Group>
                  <Radio value={true}>Male</Radio>
                  <Radio value={false}>Female</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Users;
