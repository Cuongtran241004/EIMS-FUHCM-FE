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
  Upload,
  Radio,
  Col,
  Row,
  Select,
  Tag,
} from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  CloseOutlined,
  PlusOutlined,
  SendOutlined,
  CloseCircleFilled,
  SearchOutlined,
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
} from "../../configs/messages.js";
import { User_Import_Excel } from "../../utils/Import-Excel/User_Import_Excel.js";
import { User_Excel_Template } from "../../utils/Import-Excel/User_Excel_Template.js";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager.jsx";
import Header from "../../components/Header/Header.jsx";
import { departments, roleOptions } from "../../configs/data.js";
import { userTable } from "../../design-systems/CustomTable.jsx";
import { selectButtonStyle } from "../../design-systems/CSS/Button.js";
import { titleStyle } from "../../design-systems/CSS/Title.js";
const { Content, Sider } = Layout;

const Users = ({ isLogin }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // To store filtered users
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await userApi.getAllUsers();
      // only return if role != 1
      const result = response.filter((user) => user.role !== 1);
      result.sort((a, b) => {
        // sort by createAt
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setData(result);
      setFilteredData(result); // Initialize filteredData with all users
    } catch (error) {
      message.error(FETCH_USERS_FAILED);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (event) => {
    const { value } = event.target;
    const filtered = data.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        `${user.fuId}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered); // Update the filtered data displayed in the table
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    form.resetFields();
  };

  const handleOk = async () => {
    await form.validateFields().then(async () => {
      try {
        setLoadingSubmit(true);
        // Gather form values
        const values = form.getFieldsValue();
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
      } finally {
        setLoadingSubmit(false);
      }
    });
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
  // Validate file type and size before upload
  const beforeUpload = (file) => {
    const isXlsx =
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const isLt4M = file.size / 1024 / 1024 < 4;

    if (!isXlsx) {
      message.error("You can only upload .xlsx files!");
      return false; // Prevent upload if file type is not .xlsx
    }

    if (!isLt4M) {
      message.error("File must be smaller than 4MB!");
      return false; // Prevent upload if file is larger than 4MB
    }

    return true; // Accept file if both conditions are met
  };

  const handleFileUpload = async ({ file }) => {
    setFileLoading(true);
    try {
      const data = await User_Import_Excel(file);

      // Mapping definitions
      const roleMapping = {
        manager: 1,
        staff: 2,
        invigilator: 3,
      };

      const genderMapping = {
        male: true,
        female: false,
      };

      // Transform the user data
      const transformedData = data.map((user) => ({
        ...user,
        role: roleMapping[user.role] || null, // Map role to backend value
        gender: genderMapping[user.gender] || null, // Map gender to backend value
      }));

      // Send transformed data to backend
      await userApi.addMultipleUsers(transformedData);

      message.success("Users imported successfully!");
      fetchData(); // Refresh data after import
    } catch (error) {
      console.error("Import error:", error);
      message.error(IMPORT_USERS_FAILED);
    } finally {
      setFileLoading(false);
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        <Sider width={256} style={{ backgroundColor: "#4D908E" }}>
          <NavBar_Manager isLogin={isLogin} />
        </Sider>
        <Layout>
          <Content
            style={{
              padding: 12,
              margin: 0,
              background: "#fff",
              minHeight: 280,
            }}
          >
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <h2 style={titleStyle}>User Management</h2>
            </div>
            <div style={{ margin: "5px" }}>
              <Button
                type="primary"
                onClick={showModal}
                style={selectButtonStyle}
                icon={<PlusOutlined />}
              >
                Add New User
              </Button>
              <Input
                placeholder="Search by ID or Name"
                onChange={handleSearch}
                allowClear
                suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
                style={{
                  width: 250,
                  marginLeft: "20px",
                }}
              />
              <div style={{ float: "right" }}>
                <Upload
                  beforeUpload={(file) => {
                    const isValid = beforeUpload(file);
                    if (isValid) {
                      handleFileUpload({ file }); // Trigger file upload only if valid
                    }
                    return false; // Prevent default upload behavior
                  }}
                  showUploadList={false}
                  maxCount={1}
                  method="POST"
                >
                  <Button
                    icon={<UploadOutlined />}
                    loading={fileLoading}
                    style={{ marginRight: "15px" }}
                  >
                    Import Users
                  </Button>
                </Upload>

                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => User_Excel_Template()}
                  type="default"
                >
                  Download Template
                </Button>
              </div>
            </div>

            <Spin spinning={loading}>
              <Table
                dataSource={filteredData}
                columns={userTable(handleEdit, handleDelete)}
                rowKey={(record) => record.fuId}
                pagination={{
                  pageSize: 7,
                  showSizeChanger: false,
                  showQuickJumper: false,
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
        loading={loadingSubmit}
        closeIcon={<CloseCircleFilled />}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
            <CloseOutlined />
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
            <SendOutlined />
          </Button>,
        ]}
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
                <Input placeholder="Enter FUID" maxLength={15} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  { required: true, message: "Please input first name!" },
                ]}
              >
                <Input placeholder="Enter first name" maxLength={15} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: "Please input last name!" }]}
              >
                <Input placeholder="Enter last name" maxLength={50} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input email!" },
                  { type: "email", message: "Please enter a valid email!" },
                  {
                    pattern: /^[\w.-]+@(fpt\.edu\.vn|fe\.edu\.vn)$/,
                    message: "Email must be @fpt.edu.vn or @fe.edu.vn",
                  },
                ]}
              >
                <Input placeholder="Enter email" maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="phoneNumber"
                label="Phone"
                rules={[
                  { required: true, message: "Please input phone number!" },
                  {
                    pattern: /^0\d{9,10}$/,
                    message: "Invalid phone number",
                  },
                ]}
              >
                <Input placeholder="Phone number" maxLength={10} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="department"
                label="Department"
                rules={[
                  { required: true, message: "Please select department!" },
                ]}
              >
                <Select
                  placeholder="Select department"
                  showSearch
                  optionFilterProp="children" // Allows searching based on option text
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  } // Filters options based on input
                >
                  {departments.map((department) => (
                    <Select.Option key={department} value={department}>
                      {department}
                    </Select.Option>
                  ))}
                </Select>
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
          </Row>
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
        </Form>
      </Modal>
    </Layout>
  );
};

export default Users;
