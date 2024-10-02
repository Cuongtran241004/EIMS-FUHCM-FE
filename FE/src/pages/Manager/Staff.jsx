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
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  ADD_STAFF_FAILED,
  ADD_STAFF_SUCCESS,
  DELETE_STAFF_FAILED,
  DELETE_STAFF_SUCCESS,
  EDIT_STAFF_FAILED,
  EDIT_STAFF_SUCCESS,
  IMPORT_STAFFS_SUCCESS,
  IMPORT_STAFFS_FAILED,
  FETCH_STAFFS_FAILED,
} from "../../configs/messages";
import { User_Import_Excel } from "../../utils/User_Import_Excel.js";
import { User_Excel_Template } from "../../utils/User_Excel_Template.js";

import Header_Manager from "../../components/Header/Header_Manager.jsx";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager.jsx";

// Ant Design Layout Components
const { Content, Sider } = Layout;

const Staff = ({isLogin}) => {
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
      const result = await userApi.getAllUsers({}, {

      });
      setData(result);
    } catch (error) {
      message.error(FETCH_STAFFS_FAILED);
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
      console.log(values);
      if (isEditing) {
        // Update existing staff
        await userApi.updateUser({ ...editingStaff, ...values });
        message.success(EDIT_STAFF_SUCCESS);
      } else {
        // Add new staff
        await userApi.addUser(values);
        message.success(ADD_STAFF_SUCCESS);
      }
      await fetchData();
      handleCancel();
    } catch (error) {
      message.error(isEditing ? EDIT_STAFF_FAILED : ADD_STAFF_FAILED);
    }
  };

  const handleEdit = (staff) => {
    setIsEditing(true);
    setEditingStaff(staff);
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
      message.success(DELETE_STAFF_SUCCESS);
      fetchData();
    } catch (error) {
      message.error(DELETE_STAFF_FAILED);
    }
  };

  const handleFileUpload = async ({ file }) => {
    setFileLoading(true); // Set loading for file upload
    try {
      const staffData = await User_Import_Excel(file);
      // Add role to each staff object
      const staffWithrole = staffData.map((staff) => ({ ...staff, role: 3 }));
      await Promise.all(
        // Add each staff to the database
        staffWithrole.map((staff) => userApi.addUser(staff))
      );

      message.success(IMPORT_STAFFS_SUCCESS);
      fetchData();
    } catch (error) {
      message.error(IMPORT_STAFFS_FAILED);
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
            title="Are you sure to delete this staff?"
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
      <Header_Manager isLogin={isLogin}/>
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

              <Button
                onClick={() => User_Excel_Template("Staff_Template")}
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
        title={isEditing ? "Edit Staff" : "Add New Staff"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="add_staff_form">
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
          <Form.Item name="role" initialValue="3" hidden={true}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Staff;
