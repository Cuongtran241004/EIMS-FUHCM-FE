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
  Dropdown,
  Col,
  Row,
} from "antd";
import subjectApi from "../../services/Subject.js";
import Header_Staff from "../../components/Header/Header_Staff.jsx";
import { DeleteOutlined, DownOutlined } from "@ant-design/icons";

const items = [
  {
    key: "1",
    label: "Fall24",
  },
  {
    key: "2",
    label: "Summer24",
  },
  {
    key: "3",
    label: "Spring24",
  },
];
// Ant Design Layout Components
const { Content } = Layout;
const Exam_Subject = ({ isLogin }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedItem, setSelectedItem] = useState("Fall24");
  const [form] = Form.useForm();

  const fetchData = async (term) => {
    setLoading(true);
    try {
      const result = await subjectApi.getAllSubjects(term);
      setData(result);
    } catch (error) {
      message.error(FETCH_EXAM_FAILED);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data when the component mounts and when selectedItem changes
    fetchData(selectedItem);
  }, [selectedItem]); // Add selectedItem as a dependency

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

  const handleMenuClick = (e) => {
    const newTerm = items.find((item) => item.key === e.key).label;
    setSelectedItem(newTerm); // Update selectedItem
    fetchData(newTerm); // Fetch data for the new selected term
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
          <Dropdown
            menu={{
              items,
              onClick: handleMenuClick,
            }}
          >
            <Button style={{ width: "100px" }}>
              <Space>
                {selectedItem}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
          <Button type="primary" onClick={showModal}>
            Add New Exam Subject
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
          {/* First Row: Code and Name */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Code"
                rules={[
                  { required: true, message: "Please input the subject code!" },
                ]}
              >
                <Input placeholder="Enter subject code" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  { required: true, message: "Please input the subject name!" },
                ]}
              >
                <Input placeholder="Enter subject name" />
              </Form.Item>
            </Col>
          </Row>

          {/* Second Row: Type and Duration */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Type"
                rules={[
                  { required: true, message: "Please input the exam type!" },
                ]}
              >
                <Input placeholder="Enter exam type" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="duration"
                label="Duration"
                rules={[
                  { required: true, message: "Please input the duration!" },
                ]}
              >
                <Input type="number" placeholder="Enter exam duration" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Exam_Subject;
