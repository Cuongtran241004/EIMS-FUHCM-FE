import {
  Layout,
  Select,
  DatePicker,
  TimePicker,
  Button,
  Form,
  Table,
  Row,
  Col,
  message,
  Popconfirm,
  Space,
  Dropdown,
  Spin,
} from "antd";
import React, { useState, useEffect } from "react";
import Sider from "antd/es/layout/Sider";
import Header from "../../components/Header/Header.jsx";
import semesterApi from "../../services/Semester.js";
import examApi from "../../services/Exam.js";
import examSlotApi from "../../services/ExamSlot.js";
import { DeleteOutlined, EditOutlined, DownOutlined } from "@ant-design/icons";
import moment from "moment";
import { useSemester } from "../../components/Context/SemesterContext";
const { Option } = Select;
const { Content } = Layout;

const Exam_Schedule = () => {
  const [form] = Form.useForm();
  const [examSchedule, setExamSchedule] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const { selectedSemester, setSelectedSemester } = useSemester(); // Access shared semester state
  const [isEditing, setIsEditing] = useState(false);
  const [editingExamSlot, setEditingExamSlot] = useState(null);

  const fetchExams = async (semesterId) => {
    try {
      setLoading(true);
      const result = await examApi.getExamBySemesterId(semesterId);
      setExams(result);
      setFilteredExams(result);
    } catch (error) {
      message.error("Failed to load subjects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchExamSchedule = async (semesterId) => {
    try {
      const result = await examSlotApi.getExamSlotBySemesterId(semesterId);
      console.log(result);
      setExamSchedule(result || []);
    } catch (error) {
      message.error("Failed to load exam schedule. Please try again.");
    }
  };

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const result = await semesterApi.getAllSemesters();
        setSemesters(result);
        const sortedSemesters = result.sort(
          (a, b) => new Date(b.startAt) - new Date(a.startAt)
        );
        // Set the latest semester as the selected semester
        if (sortedSemesters.length > 0) {
          setSelectedSemester({
            id: sortedSemesters[0]?.id,
            name: sortedSemesters[0]?.name,
          });
        }
      } catch (error) {
        message.error("Failed to load semesters. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSemesters();
  }, []);

  useEffect(() => {
    if (selectedSemester?.id) {
      fetchExams(selectedSemester.id);
      fetchExamSchedule(selectedSemester.id);
    }
  }, [selectedSemester]);

  const handleExamSearch = (value) => {
    if (value) {
      const filtered = exams.filter((exam) =>
        exam.subjectName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredExams(filtered);
    } else {
      setFilteredExams(exams);
    }
  };

  const handleDelete = async (id) => {
    try {
      await examSlotApi.deleteExamSlot(id);
      message.success("Exam deleted successfully");
      fetchExamSchedule(selectedSemester.id); // Refresh schedule
    } catch (error) {
      message.error("Failed to delete exam");
    }
  };
  const handleSubmit = async (values) => {
    const selectedExam = exams.find((exam) => exam.id === values.exam);
    const selectedDate = values.date.format("DD-MM-YYYY");
    const startTime = values.startTime.format("HH:mm");
    const endTime = values.endTime.format("HH:mm");

    const examSlotData = {
      examSlotId: isEditing ? editingExamSlot.id : null,
      subjectExamId: selectedExam.id,
      startAt: `${selectedDate}T${startTime}:00+07:00`,
      endAt: `${selectedDate}T${endTime}:00+07:00`,
      requiredInvigilators: 15,
    };
    if (isEditing) {
      try {
        await examSlotApi.updateExamSlot(examSlotData); // API call to update exam slot
        message.success("Exam slot updated successfully.");
        fetchExamSchedule(selectedSemester.id); // Refresh schedule
        setExamSchedule((prev) =>
          prev.map((slot) =>
            slot.id === editingExamSlot.id ? examSlotData : slot
          )
        );
      } catch (error) {
        message.error("Failed to update exam slot.");
      }
    } else {
      try {
        console.log(examSlotData);
        await examSlotApi.addExamSlot(examSlotData); // API call to create new exam slot
        message.success("Exam slot added successfully.");
        fetchExamSchedule(selectedSemester.id); // Refresh schedule
        setExamSchedule((prev) => [...prev, examSlotData]);
      } catch (error) {
        message.error("Failed to add exam slot.");
      }
    }

    handleCancel();
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };
  const columns = [
    {
      title: "Subject",
      dataIndex: "subjectName",
      key: "subjectName",
    },
    {
      title: "Exam Type",
      dataIndex: "examType",
      key: "examType",
    },
    {
      title: "Date",
      dataIndex: "startAt", // Use startAt to extract date
      key: "date",
      render: (text) => moment(text).format("DD-MM-YYYY"), // Format as DD-MM-YYYY
    },
    {
      title: "Start Time",
      dataIndex: "startAt",
      key: "startTime",
      render: (text) =>
        new Date(text).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "End Time",
      dataIndex: "endAt",
      key: "endTime",
      render: (text) =>
        new Date(text).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "Room",
      render: (text, record) => <Button>Room</Button>,
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
              setEditingExamSlot(record);
              form.setFieldsValue({
                exam: record.subjectExamId.id,
                date: moment(record.startAt), // Ensure you have 'moment' imported
                startTime: moment(record.startAt),
                endTime: moment(record.endAt),
              });
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

  const validateTime = (rule, value) => {
    const startTime = form.getFieldValue("startTime");
    if (startTime && value && value.isBefore(startTime)) {
      return Promise.reject("End time must be after start time");
    }
    return Promise.resolve();
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        <Sider width={300} style={{ background: "#f1f1f1", padding: "24px" }}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="exam"
              label="Exam"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                placeholder="Select Subject"
                style={{ width: "100%" }}
                showSearch
                onSearch={handleExamSearch}
                optionFilterProp="children"
                filterOption={false}
              >
                {filteredExams.map((exam) => (
                  <Option key={exam.id} value={exam.id}>
                    {exam.subjectCode} - {exam.examType}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startTime"
                  label="Start Time"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <TimePicker format="HH:mm" style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="endTime"
                  label="End Time"
                  rules={[
                    { required: true, message: "Required" },
                    { validator: validateTime },
                  ]}
                >
                  <TimePicker format="HH:mm" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col>
                <Button
                  style={{
                    borderColor: "orange",
                    color: "orange",
                  }}
                  onClick={handleCancel}
                >
                  Clear
                </Button>
              </Col>
              <Col>
                <Button type="primary" htmlType="submit">
                  Add
                </Button>
              </Col>
            </Row>
          </Form>
        </Sider>

        <Content style={{ padding: "24px", background: "#fff" }}>
          <Space>
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
          </Space>
          <Spin spinning={loading}>
            <Table
              dataSource={examSchedule.map((item) => ({
                subjectName: item.subjectExamId?.subjectId?.name || "Loading",
                examType: item.subjectExamId?.examType || "Loading",
                startAt: item.startAt,
                endAt: item.endAt,
                key: item.id,
              }))}
              columns={columns}
              pagination={{ pageSize: 8 }}
            />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Exam_Schedule;
