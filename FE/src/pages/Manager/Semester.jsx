import React, { useState, useEffect } from "react";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import moment from "moment";
import {
  Layout,
  Button,
  Space,
  Modal,
  Form,
  Spin,
  Table,
  Input,
  message,
  DatePicker,
} from "antd";

import semesterApi from "../../services/Semester.js";
import {
  ADD_SEMESTER_FAILED,
  ADD_SEMESTER_SUCCESS,
  EDIT_SEMESTER_FAILED,
  EDIT_SEMESTER_SUCCESS,
  FETCH_SEMESTERS_FAILED,
} from "../../configs/messages.jsx";
import Header from "../../components/Header/Header.jsx";

// Ant Design Layout Components
const { Content, Sider } = Layout;

const Semester = ({ isLogin }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await semesterApi.getAllSemesters();
      setData(result);
    } catch (error) {
      message.error(FETCH_SEMESTERS_FAILED);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateEndDate = (_, value) => {
    const { startAt } = form.getFieldsValue();
    if (value && startAt && value.isBefore(startAt)) {
      return Promise.reject(new Error("End date cannot be before start date!"));
    }
    return Promise.resolve();
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
    try {
      const values = await form.validateFields();
      const { startAt, endAt } = values;

      // Convert moment objects to date strings if necessary
      const formattedStartAt = startAt.format("YYYY-MM-DD");
      const formattedEndAt = endAt.format("YYYY-MM-DD");

      if (isEditing) {
        // Update existing semester
        await semesterApi.updateSemester({
          ...editingSemester,
          startAt: formattedStartAt,
          endAt: formattedEndAt,
        });
        message.success(EDIT_SEMESTER_SUCCESS);
      } else {
        // Add new semester
        await semesterApi.addSemester({
          ...values,
          startAt: formattedStartAt,
          endAt: formattedEndAt,
        });
        message.success(ADD_SEMESTER_SUCCESS);
      }
      fetchData();
      handleCancel();
    } catch (error) {
      message.error(isEditing ? EDIT_SEMESTER_FAILED : ADD_SEMESTER_FAILED);
    }
  };

  const handleEdit = (semester) => {
    setIsEditing(true);
    setEditingSemester(semester);
    form.setFieldsValue({
      name: semester.name,
      // Use moment for date formatting
      startAt: moment(semester.startAt),
      endAt: moment(semester.endAt),
    });
    setIsModalVisible(true);
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Start Date",
      dataIndex: "startAt",
      key: "startAt",
    },
    {
      title: "End Date",
      dataIndex: "endAt",
      key: "  endAt",
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
      <Header />
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
                Add New Semester
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
        title={isEditing ? "Edit Semester" : "Add New Semester"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="add_semester_form">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input semester name!" }]}
          >
            <Input placeholder="Enter semester name" />
          </Form.Item>
          <Form.Item
            name="startAt"
            label="Start Date"
            rules={[
              { required: true, message: "Please select the start date!" },
            ]}
          >
            <DatePicker
              placeholder="Select start date"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="endAt"
            label="End Date"
            rules={[
              { required: true, message: "Please select the end date!" },
              { validator: validateEndDate }, // Custom validator for end date
            ]}
          >
            <DatePicker
              placeholder="Select end date"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Semester;
