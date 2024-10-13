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
  Tag,
} from "antd";
import subjectApi from "../../services/Subject.js";
import examApi from "../../services/Exam.js";
import { DeleteOutlined, DownOutlined, EditOutlined } from "@ant-design/icons";
import Header from "../../components/Header/Header.jsx";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import { examType } from "../../configs/data.js";
const { Content, Sider } = Layout;
const { Option } = Select;

const Exam = () => {
  const [data, setData] = useState([]); // For exam data
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const { selectedSemester, setSelectedSemester, semesters } = useSemester(); // Access shared semester state
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Fetch exam data based on selected semester
  const fetchExams = async (semesterId) => {
    setLoading(true);
    try {
      const result = await examApi.getExamBySemesterId(semesterId);
      setData(result);
    } catch (error) {
      message.error("Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects based on selected semester
  const fetchSubjects = async (semesterId) => {
    try {
      const result = await subjectApi.getSubjectBySemester(semesterId);
      setSubjects(result);
      setFilteredSubjects(result);
    } catch (error) {
      message.error("Failed to fetch subjects");
    }
  };

  // When selectedSemester changes, fetch both exams and subjects
  useEffect(() => {
    if (selectedSemester?.id) {
      fetchExams(selectedSemester.id); // Fetch exams for the selected semester
      fetchSubjects(selectedSemester.id); // Fetch subjects for the selected semester
    }
  }, [selectedSemester]);

  // Handle subject search in dropdown
  const handleSearch = (value) => {
    const filtered = subjects.filter((subject) =>
      subject.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSubjects(filtered);
  };

  // Handle semester selection change
  const handleMenuClick = (e) => {
    console.log(semesters);
    const selected = semesters.find((semester) => semester.id == e.key);
    console.log(selected);
    if (selected) {
      setSelectedSemester({
        id: selected.id,
        name: selected.name,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    try {
      await examApi.deleteExam(id);
      message.success("Exam deleted successfully");
      fetchExams(selectedSemester.id); // Reload exams after deletion
    } catch (error) {
      message.error("Failed to delete exam");
    }
  };

  const handleOk = async () => {
    setLoadingSubmit(true);
    try {
      const values = await form.validateFields();
      const subject = subjects.find((sub) => sub.name === values.subjectName);
      values.subjectId = subject.id;

      if (isEditing) {
        values.id = editingExam.id;
        await examApi.updateExam(values);
        message.success("Exam updated successfully");
      } else {
        await examApi.addExam(values);
        message.success("Exam added successfully");
      }
      fetchExams(selectedSemester.id); // Reload exams after adding/updating
      handleCancel();
    } catch (error) {
      message.error("Failed to submit exam");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Table columns
  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Subject Code",
      dataIndex: "subjectCode",
      key: "subjectCode",
    },
    {
      title: "Subject Name",
      dataIndex: "subjectName",
      key: "subjectName",
    },
    {
      title: "Type",
      dataIndex: "examType",
      key: "examType",
      // using tag of ant to display
      render: (text) => {
        if (text === "PE") {
          const color = "blue";
          return <Tag color={color}>{text}</Tag>;
        } else if (text === "FE") {
          const color = "green";
          return <Tag color={color}>{text}</Tag>;
        } else if (text === "PE&TE") {
          const color = "orange";
          return <Tag color={color}>{text}</Tag>;
        } else {
          const color = "red";
          return <Tag color={color}>{text}</Tag>;
        }
      },
    },
    {
      title: "Duration (minutes)",
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
              setEditingExam(record);
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
              name="subjectName"
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
                  name="examType"
                  label="Type"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Select placeholder="Exam type">
                    {examType.map((type) => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
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
                  <Input type="number" placeholder="Duration" />
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
                <Button
                  type="primary"
                  onClick={handleOk}
                  loading={loadingSubmit}
                >
                  {isEditing ? "Update" : "Add"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Sider>

        {/* Content for Table and Dropdown */}
        <Content style={{ padding: 12, margin: 0, background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Dropdown
              menu={{
                items: semesters.map((sem) => ({
                  key: sem.id,
                  label: sem.name,
                })),
                onClick: handleMenuClick,
              }}
            >
              <Button style={{ width: "150px" }}>
                <Space>
                  {selectedSemester?.name || "Select Semester"}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <span style={{ margin: "0 25%", fontSize: "20px" }}>
              <h2>Exam Management</h2>
            </span>
          </div>

          <Spin spinning={loading}>
            <Table
              dataSource={data.map((item) => ({ ...item, key: item.id }))}
              columns={columns}
              pagination={{
                pageSize,
                current: currentPage,
                onChange: (page) => setCurrentPage(page),
              }}
            />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Exam;
