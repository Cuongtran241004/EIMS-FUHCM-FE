import {
  Layout,
  Divider,
  Select,
  DatePicker,
  TimePicker,
  Button,
  Form,
  Space,
  Table,
} from "antd";
import React, { useState } from "react";
import Sider from "antd/es/layout/Sider";
import { Row, Col } from "antd";
import Header from "../../components/Header/Header.jsx";

const { Option } = Select;
const { Content } = Layout;

const Exam_Schedule = ({ isLogin }) => {
  const [form] = Form.useForm();
  const [examSchedule, setExamSchedule] = useState([]);

  // Mock data for dropdowns
  const semesters = ["Fall24", "Summer24", "Spring24"];
  const subjects = ["Math", "Physics", "Chemistry"];
  const rooms = ["Room A", "Room B", "Room C"];

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
    // Save the new exam schedule
    const newSchedule = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
      startTime: values.startTime.format("HH:mm"),
      endTime: values.endTime.format("HH:mm"),
    };
    setExamSchedule([...examSchedule, newSchedule]);
    form.resetFields(); // Reset form after submission
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        <Sider width={300} style={{ background: "#f1f1f1", padding: "24px" }}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              {/* Semester Dropdown */}
              <Col span={12}>
                <Form.Item
                  name="semester"
                  label="Semester"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Select placeholder="Semester" style={{ width: "100%" }}>
                    {semesters.map((semester) => (
                      <Option key={semester} value={semester}>
                        {semester}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Subject Dropdown */}
              <Col span={12}>
                <Form.Item
                  name="subject"
                  label="Subject"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Select placeholder="Subject" style={{ width: "100%" }}>
                    {subjects.map((subject) => (
                      <Option key={subject} value={subject}>
                        {subject}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Date Picker */}
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Required" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            {/* Time Pickers: Start Time and End Time */}
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
                  rules={[{ required: true, message: "Required" }]}
                >
                  <TimePicker format="HH:mm" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            {/* Room Selection */}
            <Form.Item
              name="room"
              label="Room"
              rules={[{ required: true, message: "Please select a room!" }]}
            >
              <Select placeholder="Select Room" style={{ width: "100%" }}>
                {rooms.map((room) => (
                  <Option key={room} value={room}>
                    {room}
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
