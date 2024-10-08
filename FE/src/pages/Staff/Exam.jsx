import React, { useState, useEffect } from "react";
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
  Select,
} from "antd";
import subjectApi from "../../services/Subject.js";
import semesterApi from "../../services/Semester.js";
import { DeleteOutlined, DownOutlined, EditOutlined } from "@ant-design/icons";
import Header from "../../components/Header/Header.jsx";
import examApi from "../../services/Exam.js";

const { Content, Sider } = Layout;
const { Option } = Select;

const Exam = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [form] = Form.useForm();

  // Fetch exam data
  const fetchData = async (term) => {
    setLoading(true);
    try {
      const result = await examApi.getExamById();
      setData(result);
    } catch (error) {
      message.error("Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedSemester);
  }, [selectedSemester]);

  // Fetch semesters and subjects on initial load
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const result = await semesterApi.getAllSemesters();
        setSemesters(result);
        const sortedSemesters = result.sort(
          (a, b) => new Date(b.startAt) - new Date(a.startAt)
        );
        setSelectedSemester(sortedSemesters[0]?.name);
        fetchData(sortedSemesters[0]?.id);
      } catch (error) {
        message.error("Failed to fetch semesters");
      }
    };

    const fetchSubjects = async () => {
      try {
        const result = await subjectApi.getAllSubjects();
        setSubjects(result);
        setFilteredSubjects(result);
      } catch (error) {
        message.error("Failed to fetch subjects");
      }
    };

    fetchSemesters();
    fetchSubjects();
  }, []);

  // Handle subject search in dropdown
  const handleSearch = (value) => {
    const filtered = subjects.filter((subject) =>
      subject.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSubjects(filtered);
  };

  const handleMenuClick = (e) => {
    const selected = semesters.find((semester) => semester.id == e.key);
    if (selected) {
      setSelectedSemester(selected.name);
      fetchData(selected.id);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    try {
      await subjectApi.deleteSubject(id);
      message.success("Exam deleted successfully");
      fetchData(selectedSemester);
    } catch (error) {
      message.error("Failed to delete exam");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing) {
        await subjectApi.updateSubject({ ...editingSubject, ...values });
        message.success("Exam updated successfully");
      } else {
        await subjectApi.addSubject(values);
        message.success("Exam added successfully");
      }
      fetchData(selectedSemester);
      handleCancel();
    } catch (error) {
      message.error("Failed to submit exam");
    }
  };

  // Table columns
  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
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
          <EditOutlined
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => {
              setIsEditing(true);
              setEditingSubject(record);
              form.setFieldsValue(record);
            }}
          />
          <Popconfirm
            title="Are you sure to delete this exam?"
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
        {/* Sider for Form */}
        <Sider width={300} style={{ background: "#f1f1f1", padding: "24px" }}>
          <Form form={form} layout="vertical" name="add_exam_form">
            {/* Subject Field */}
            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true, message: "Please select a subject!" }]}
            >
              <Select
                showSearch
                placeholder="Select subject"
                onSearch={handleSearch}
                filterOption={false} // Use custom search logic
              >
                {filteredSubjects.map((subject) => (
                  <Option key={subject.id} value={subject.name}>
                    {subject.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Type Field */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Type"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Select placeholder="Exam type" disabled={isEditing}>
                    <Option value="PE">PE</Option>
                    <Option value="FE">FE</Option>
                    <Option value="PE&FE">PE&FE</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Duration Field */}
              <Col span={12}>
                <Form.Item
                  name="duration"
                  label="Duration"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input
                    type="number"
                    placeholder="Duration"
                    disabled={isEditing}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Clear and Add/Submit buttons */}
            <Row justify="space-between">
              <Col>
                <Button
                  onClick={handleCancel}
                  style={{ borderColor: "orange", color: "orange" }}
                >
                  Clear
                </Button>
              </Col>
              <Col>
                <Button type="primary" onClick={handleOk}>
                  {isEditing ? "Save" : "Add"}
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
                items: semesters.map((semester) => ({
                  key: semester.id,
                  label: semester.name,
                })),
                onClick: handleMenuClick,
              }}
            >
              <Button style={{ width: "150px" }}>
                <Space>
                  {selectedSemester}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Space>

          <Spin spinning={loading}>
            <Table
              dataSource={data}
              columns={columns}
              rowKey={(record) => record.id}
              pagination={{ pageSize: 8 }}
            />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Exam;
