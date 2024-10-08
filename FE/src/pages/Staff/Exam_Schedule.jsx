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
import subjectApi from "../../services/Subject.js";
import examApi from "../../services/Exam.js";
import roomApi from "../../services/Room.js";

const { Option } = Select;
const { Content } = Layout;

const Exam_Schedule = () => {
  const [form] = Form.useForm();
  const [examSchedule, setExamSchedule] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);
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
        console.error("Failed to fetch semesters:", error);
        message.error("Failed to load semesters. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSubjects = async () => {
      try {
        const result = await subjectApi.getAllSubjects();
        console.log(result);
        setSubjects(result);
        setFilteredSubjects(result); // Set filtered subjects initially
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
        message.error("Failed to load subjects. Please try again.");
      }
    };

    const fetchRooms = async () => {
      try {
        const result = await roomApi.getAllRooms();
        console.log(result);
        setRooms(result);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
        message.error("Failed to load rooms. Please try again.");
      }
    };

    fetchSemesters();
    fetchSubjects();
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedSemester) {
      form.setFieldsValue({ semester: selectedSemester });
      fetchExamSchedule(selectedSemester);
    }
  }, [selectedSemester, form]);

  const fetchExamSchedule = async (semester) => {
    try {
      const result = await examApi.getScheduleBySemester(semester);
      setExamSchedule(result);
    } catch (error) {
      console.error("Failed to fetch exam schedule:", error);
      message.error("Failed to load exam schedule. Please try again.");
    }
  };

  const handleSubjectSearch = (value) => {
    if (value) {
      const filtered = subjects.filter((subject) =>
        subject.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects(subjects); // Reset to original list if search is empty
    }
  };

  const columns = [
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
    },
  ];

  const handleSubmit = (values) => {
    const newSchedule = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
      startTime: values.startTime.format("HH:mm"),
      endTime: values.endTime.format("HH:mm"),
    };
    setExamSchedule([...examSchedule, newSchedule]);
    form.resetFields();
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
              name="subject"
              label="Exam"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                placeholder="Select Subject"
                style={{ width: "100%" }}
                showSearch
                onSearch={handleSubjectSearch} // Handle search
                optionFilterProp="children"
                filterOption={false} // Prevent default filtering
              >
                {filteredSubjects.map((subject) => (
                  <Option key={subject.id} value={subject.name}>
                    {subject.name}
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

            <Form.Item
              name="room"
              label="Room"
              rules={[{ required: true, message: "Please select a room!" }]}
            >
              <Select placeholder="Select Room" style={{ width: "100%" }}>
                {rooms.map((room) => (
                  <Option key={room.id} value={room.roomName}>
                    {room.roomName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

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
            dataSource={examSchedule}
            columns={columns}
            rowKey={(record, index) => index}
            pagination={{ pageSize: 5 }}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Exam_Schedule;
