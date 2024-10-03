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
const { Content, Sider } = Layout;

const Exam = ({ isLogin }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
    fetchData(selectedItem);
  }, [selectedItem]);

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    try {
      await subjectApi.deleteSubject(id);
      message.success(DELETE_EXAM_SUCCESS);
      fetchData(selectedItem);
    } catch (error) {
      message.error(DELETE_EXAM_FAILED);
    }
  };

  const handleMenuClick = (e) => {
    const newTerm = items.find((item) => item.key === e.key).label;
    setSelectedItem(newTerm);
    fetchData(newTerm);
  };

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
      fetchData(selectedItem);
      handleCancel();
    } catch (error) {
      message.error(isEditing ? EDIT_EXAM_FAILED : ADD_EXAM_FAILED);
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
      key: "name",
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
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this exam?"
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
      <Header_Staff isLogin={isLogin} />
      <Layout>
        {/* Sider for Form */}
        <Sider width={300} style={{ background: "#f1f1f1", padding: "24px" }}>
          <Form form={form} layout="vertical" name="add_exam_form">
            <Form.Item
              name="code"
              label="Code"
              rules={[
                { required: true, message: "Please input the exam code!" },
              ]}
            >
              <Input placeholder="Enter exam code" />
            </Form.Item>

            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: "Please input the exam name!" },
              ]}
            >
              <Input placeholder="Enter exam name" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Type"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input placeholder="Exam type" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="duration"
                  label="Duration"
                  rules={[
                    {
                      required: true,
                      message: "Required",
                    },
                  ]}
                >
                  <Input placeholder="duration" />
                </Form.Item>
              </Col>
            </Row>

            {/* Clear and Add buttons */}
            <Row justify="space-between">
              <Col>
                <Button
                  onClick={handleCancel}
                  style={{
                    borderColor: "orange",
                    color: "orange",
                  }}
                >
                  Clear
                </Button>
              </Col>
              <Col>
                <Button type="primary" onClick={handleOk}>
                  Add
                </Button>
              </Col>
            </Row>
          </Form>
        </Sider>

        {/* Content for Table and Dropdown */}
        <Content style={{ padding: 24, margin: 0, background: "#fff" }}>
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
  );
};

export default Exam;
