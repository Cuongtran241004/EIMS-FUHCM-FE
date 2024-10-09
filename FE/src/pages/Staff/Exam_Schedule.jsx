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
} from "antd";
import React, { useState, useEffect } from "react";
import Sider from "antd/es/layout/Sider";
import Header from "../../components/Header/Header.jsx";
import semesterApi from "../../services/Semester.js";
import examApi from "../../services/Exam.js";
import examSlotApi from "../../services/ExamSlot.js";

const { Option } = Select;
const { Content } = Layout;

const Exam_Schedule = () => {
  const [form] = Form.useForm();
  const [examSchedule, setExamSchedule] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const result = await semesterApi.getAllSemesters();
        setSemesters(result);
        const sortedSemesters = result.sort(
          (a, b) => new Date(b.startAt) - new Date(a.startAt)
        );
        setSelectedSemester(sortedSemesters[0]?.name);
      } catch (error) {
        message.error("Failed to load semesters. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchExams = async () => {
      try {
        const result = await examApi.getAllExams();

        setExams(result);
        setFilteredExams(result);
      } catch (error) {
        message.error("Failed to load subjects. Please try again.");
      }
    };

    fetchSemesters();
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedSemester) {
      form.setFieldsValue({ semester: selectedSemester });
      fetchExamSchedule(selectedSemester);
    }
  }, [selectedSemester, form]);

  const fetchExamSchedule = async (semester) => {
    try {
      const result = await examSlotApi.getAllExamSlots();
      setExamSchedule(result);
    } catch (error) {
      message.error("Failed to load exam schedule. Please try again.");
    }
  };

  const handleExamSearch = (value) => {
    if (value) {
      const filtered = exams.filter((exam) =>
        exam.subjectName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredExams(filtered);
    } else {
      setFilteredExams(exams); // Reset to original list if search is empty
    }
  };

  const columns = [
    {
      title: "Subject",
      dataIndex: "subjectExamId.subjectId.name",
      key: "subject",
    },
    {
      title: "Exam Type",
      dataIndex: "subjectExamId.examType",
      key: "examType",
    },
    {
      title: "Date",
      dataIndex: "startAt", // Use startAt to extract date
      key: "date",
      render: (text) => {
        // Format the date as needed (e.g., YYYY-MM-DD)
        return new Date(text).toLocaleDateString(); // Adjust formatting as needed
      },
    },
    {
      title: "Start Time",
      dataIndex: "startAt",
      key: "startTime",
      render: (text) => {
        // Format the time as needed (e.g., HH:mm)
        return new Date(text).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      title: "End Time",
      dataIndex: "endAt",
      key: "endTime",
      render: (text) => {
        // Format the time as needed (e.g., HH:mm)
        return new Date(text).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => <Button>Room</Button>,
    },
  ];

  const handleSubmit = async (values) => {
    const selectedExam = exams.find((exam) => exam.id === values.exam);

    // Combine date with start and end time to create full datetime strings
    const selectedDate = values.date.format("YYYY-MM-DD");
    const startTime = values.startTime.format("HH:mm");
    const endTime = values.endTime.format("HH:mm");

    const newExamSlot = {
      subjectExamId: selectedExam.id,
      startAt: `${selectedDate}T${startTime}:00Z`, // Combine date and time in ISO format
      endAt: `${selectedDate}T${endTime}:00Z`, // Combine date and time in ISO format
    };
    console.log(newExamSlot);
    try {
      await examSlotApi.addExamSlot(newExamSlot);
      message.success("Exam slot added successfully.");
      setExamSchedule((prev) => [...prev, newExamSlot]);
      form.resetFields();
    } catch (error) {
      message.error("Failed to add exam slot.");
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
              name="semester"
              label="Semester"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                placeholder="Select Semester"
                style={{ width: "100%" }}
                loading={loading}
                onChange={(value) => setSelectedSemester(value)}
              >
                {semesters.map((semester) => (
                  <Option key={semester.id} value={semester.name}>
                    {semester.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="exam"
              label="Exam"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                placeholder="Select Subject"
                style={{ width: "100%" }}
                showSearch
                onSearch={handleExamSearch} // Handle search
                optionFilterProp="children"
                filterOption={false} // Prevent default filtering
              >
                {filteredExams.map((exam) => (
                  <Option key={exam.id} value={exam.id}>
                    {exam.subjectName} - {exam.examType}
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
                  onClick={() => form.resetFields()}
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
          <Table
            dataSource={examSchedule.map((item) => ({ ...item, key: item.id }))}
            columns={columns}
            pagination={{ pageSize: 5 }}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Exam_Schedule;
