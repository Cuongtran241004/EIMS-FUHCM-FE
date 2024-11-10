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
  notification,
  InputNumber,
} from "antd";
import subjectApi from "../../services/Subject.js";
import examApi from "../../services/Exam.js";
import {
  CaretRightFilled,
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header/Header.jsx";
import { useSemester } from "../../components/Context/SemesterContextStaff.jsx";
import { examType } from "../../configs/data.js";
import { examTypeTag } from "../../design-systems/CustomTag.jsx";
import {
  addButtonStyle,
  selectButtonStyle,
} from "../../design-systems/CSS/Button.js";
import { titleStyle } from "../../design-systems/CSS/Title.js";
import "./CustomForm.css";
import {
  deleteNotification,
  editNotification,
} from "../../design-systems/CustomNotification.jsx";
import { DELETE_EXAM_FAILED } from "../../configs/messages.js";
const { Content, Sider } = Layout;
const { Option } = Select;

const Exam = () => {
  const [data, setData] = useState([]); // For exam data
  const [filteredData, setFilteredData] = useState([]); // For filtered exam data
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const {
    selectedSemester,
    setSelectedSemester,
    semesters,
    availableSemesters,
  } = useSemester(); // Access shared semester state
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Fetch exam data based on selected semester
  const fetchExams = async (semesterId) => {
    setLoading(true);
    try {
      const result = await examApi.getExamBySemesterId(semesterId);

      setData(result || []);
      setFilteredData(result || []);
    } catch (error) {
      message.error("Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects based on selected semester
  const fetchSubjects = async (semesterId) => {
    try {
      const response = await subjectApi.getSubjectBySemester(semesterId);
      const result = response.sort((a, b) => b.id - a.id);
      setSubjects(result || []);
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
      subject.code.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSubjects(filtered);
  };

  const handleSearchExam = (event) => {
    const { value } = event.target;
    const filtered = data.filter(
      (subject) =>
        `${subject.subjectCode}`.toLowerCase().includes(value.toLowerCase()) ||
        `${subject.subjectName}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered); // Update the filtered data displayed in the table
  };

  // Handle semester selection change
  const handleMenuClick = (e) => {
    const selected = semesters.find((semester) => semester.id == e.key);

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

  const handleEdit = (record) => {
    if (
      availableSemesters.find((semester) => semester.id === selectedSemester.id)
    ) {
      setIsEditing(true);
      setEditingExam(record);
      form.setFieldsValue(record);
    } else {
      editNotification();
    }
  };

  const handleDelete = async (id) => {
    if (
      availableSemesters.find((semester) => semester.id === selectedSemester.id)
    ) {
      try {
        await examApi.deleteExam(id);
        message.success("Exam deleted successfully");
        fetchExams(selectedSemester.id); // Reload exams after deletion
        handleCancel();
      } catch (error) {
        notification.error({ message: DELETE_EXAM_FAILED });
      }
    } else {
      deleteNotification();
    }
  };

  const handleOk = async () => {
    await form.validateFields().then(async () => {
      setLoadingSubmit(true);
      try {
        const values = await form.validateFields();
        const subject = subjects.find((sub) => sub.code === values.subjectCode);
        values.subjectId = subject.id;

        if (isEditing) {
          values.id = editingExam.id;
          await examApi.updateExam(values);
          message.success("Exam updated successfully");
        } else {
          await examApi.addExam(values);
          message.success("Exam added successfully");
        }
        if (selectedSemester.id === values.semesterId) {
          fetchExams(selectedSemester.id);
        }
        handleCancel();
      } catch (error) {
        message.error("Failed to submit exam");
      } finally {
        setLoadingSubmit(false);
      }
    });
  };

  // Handle semester selection in the form
  const handleSemesterChange = async (value) => {
    const selectedSemesterForm = availableSemesters.find(
      (sem) => sem.id === value
    );

    if (selectedSemesterForm) {
      form.setFieldsValue({ semesterId: selectedSemesterForm.id }); // Update semesterId in the form
      fetchSubjects(selectedSemesterForm.id); // Fetch subjects for the selected semester
    }
  };

  // Table columns
  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
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
      align: "center",
      render: (examType) => examTypeTag(examType),
      filters: examType.map((type) => ({ text: type, value: type })), // Filter by exam type
      onFilter: (value, record) => record.examType === value,
    },
    {
      title: "Duration (minutes)",
      dataIndex: "duration",
      key: "duration",
      align: "center",
      width: "15%",
    },

    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => handleEdit(record)}
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
      <Layout>
        {/* Sider for Form */}
        <Sider
          width={300}
          style={{
            background: "#4D908E",
            padding: "24px",
            boxShadow: "3px 0 5px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Form form={form} layout="vertical" name="add_exam_form">
            <Form.Item
              name="semesterId"
              label={<span className="custom-label">Semester</span>}
              rules={[
                {
                  required: true,
                  message: "Please select semester!",
                },
              ]}
            >
              <Select
                placeholder="Select semester"
                onChange={handleSemesterChange}
              >
                {availableSemesters.map((semester) => (
                  <Select.Option key={semester.id} value={semester.id}>
                    {semester.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {/* Subject Field */}
            <Form.Item
              name="subjectCode"
              label={<span className="custom-label">Subject</span>}
              rules={[{ required: true, message: "Please select a subject!" }]}
            >
              <Select
                showSearch
                placeholder="Select subject"
                onSearch={handleSearch}
                filterOption={false} // Use custom search logic
              >
                {filteredSubjects.map((subject) => (
                  <Option key={subject.id} value={subject.code}>
                    {subject.code}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Type Field */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="examType"
                  label={<span className="custom-label">Type</span>}
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
                  label={<span className="custom-label">Duration</span>}
                  rules={[
                    {
                      required: true,
                      message: "Please input the duration!",
                    },
                    {
                      type: "number",
                      min: 0,
                      max: 240,
                      message: "Invalid duration",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Duration"
                    style={{ width: "100%" }}
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
                  <CloseOutlined />
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={handleOk}
                  loading={loadingSubmit}
                  style={addButtonStyle}
                >
                  {isEditing ? "Update" : "Add"}
                  <CaretRightFilled />
                </Button>
              </Col>
            </Row>
          </Form>
        </Sider>

        {/* Content for Table and Dropdown */}
        <Content style={{ padding: 12, margin: 0, background: "#fff" }}>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h2 style={titleStyle}>Exam Management</h2>
          </div>
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
              <Button style={{ ...selectButtonStyle, width: "150px" }}>
                <Space>
                  {selectedSemester?.name || "Select Semester"}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <Input
              placeholder="Search by Code or Name"
              onChange={handleSearchExam}
              allowClear
              suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
              style={{
                width: 250,
                marginLeft: "20px",
                marginBottom: "10px",
              }}
            />
          </div>

          <Spin spinning={loading}>
            <Table
              dataSource={filteredData.map((item) => ({
                ...item,
                key: item.id,
              }))}
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
