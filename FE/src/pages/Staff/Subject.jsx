import React, { useState, useEffect } from "react";
import {
  ADD_EXAM_SUCCESS,
  ADD_EXAM_FAILED,
  EDIT_EXAM_SUCCESS,
  EDIT_EXAM_FAILED,
  DELETE_EXAM_SUCCESS,
  DELETE_EXAM_FAILED,
  FETCH_EXAM_FAILED,
} from "../../configs/messages.jsx";
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
  Popconfirm,
} from "antd";
import subjectApi from "../../services/Subject.js";
import Header_Staff from "../../components/Header/Header_Staff.jsx";
import { DeleteOutlined } from "@ant-design/icons";

// Ant Design Layout Components
const { Content } = Layout;
const Subject = ({ isLogin }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await subjectApi.getAllSubjects();
      setData(result);
    } catch (error) {
      message.error(FETCH_EXAM_FAILED);
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

  const handleEdit = (id) => {
    console.log(id);
  };

  const handleDelete = async (id) => {
    try {
      await subjectApi.deleteSubject(id);
      message.success(DELETE_EXAM_SUCCESS);
      fetchData();
    } catch (error) {
      message.error(DELETE_EXAM_FAILED);
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "Name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              setIsEditing(true);
              setEditingSubject(record);
              form.setFieldsValue(record);
              showModal();
            }}
          >
            Edit
          </Button>
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
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing) {
        await subjectApi.updateSubject({ ...editingSubject, ...values });
        message.success(EDIT_EXAM_SUCCESS);
      } else {
        await subjectApi.addSubject(values);
        message.success(ADD_EXAM_SUCCESS);
      }

      fetchData();
      handleCancel();
    } catch (error) {
      message.error(isEditing ? EDIT_EXAM_FAILED : ADD_EXAM_FAILED);
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header_Staff isLogin={isLogin} />
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
            Add New Subject
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

      {/* Add/Edit Staff Modal */}
      <Modal
        title={isEditing ? "Edit Subject Exam" : "Add New Subject Exam"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="add_subject_exam_form">
          <Form.Item
            name="code"
            label="Code"
            rules={[
              { required: true, message: "Please input the subject code!" },
            ]}
          >
            <Input placeholder="Enter subject code" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please input the subject name!" },
            ]}
          >
            <Input placeholder="Enter subject name" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Subject;
