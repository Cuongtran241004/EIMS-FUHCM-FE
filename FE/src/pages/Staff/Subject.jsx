import React, { useState, useEffect } from "react";
import {
  ADD_SUBJECT_SUCCESS,
  ADD_SUBJECT_FAILED,
  EDIT_SUBJECT_SUCCESS,
  EDIT_SUBJECT_FAILED,
  DELETE_SUBJECT_SUCCESS,
  DELETE_SUBJECT_FAILED,
  FETCH_SUBJECTS_FAILED,
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
const { Content, Sider } = Layout;
const Subject = ({ isLogin }) => {
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
      message.error(FETCH_SUBJECTS_FAILED);
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

  const handleDelete = async (id) => {
    try {
      await subjectApi.deleteSubject(id);
      message.success(DELETE_SUBJECT_SUCCESS);
      fetchData();
    } catch (error) {
      message.error(DELETE_SUBJECT_FAILED);
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
        message.success(EDIT_SUBJECT_SUCCESS);
      } else {
        await subjectApi.addSubject(values);
        message.success(ADD_SUBJECT_SUCCESS);
      }

      fetchData();
      handleCancel();
    } catch (error) {
      message.error(isEditing ? EDIT_SUBJECT_FAILED : ADD_SUBJECT_FAILED);
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header_Staff isLogin={isLogin} />
      <Layout>
        <Sider width={300} style={{ background: "#f1f1f1", padding: "24px" }}>
          <Form form={form} layout="vertical" name="add_subject_form">
            <Form.Item
              name="code"
              label="Code"
              rules={[
                {
                  required: true,
                  message: "Please input the subject code!",
                },
              ]}
            >
              <Input placeholder="Enter subject code" />
            </Form.Item>

            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please input the subject name!",
                },
              ]}
            >
              <Input placeholder="Enter subject name" />
            </Form.Item>
            {/* Add buttons for Clear and Add */}
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
        <Content>
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

export default Subject;
