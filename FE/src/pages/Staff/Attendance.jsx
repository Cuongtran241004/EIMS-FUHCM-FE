import React, { useState, useEffect, useContext } from "react";
import Header from "../../components/Header/Header.jsx";
import {
  Table,
  Spin,
  message,
  Layout,
  Space,
  Dropdown,
  Button,
  Form,
  Select,
} from "antd";
import examSlotApi from "../../services/ExamSlot.js";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import { DownOutlined } from "@ant-design/icons";
const { Content, Sider } = Layout;
import { selectButtonStyle } from "../../design-systems/CSS/Button.js";
import { titleStyle } from "../../design-systems/CSS/Title.js";
import "./CustomForm.css";
const Attendance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    selectedSemester,
    setSelectedSemester,
    semesters,
    availableSemesters,
  } = useSemester(); // Access shared semester state
  const [form] = Form.useForm();
  // Fetch attendance data
  const fetchExams = async (term) => {
    setLoading(true);
    try {
      const result = await examSlotApi.getExamSlotBySemesterId(term);
      setData(result);
    } catch (error) {
      message.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSemester?.id) {
      fetchExams(selectedSemester.id);
      // fetchExamSchedule(selectedSemester.id);
    }
  }, [selectedSemester]);

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

  // Define columns for the Table
  const columns = [
    {
      title: "No",
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
      title: "Action",
    },
    // Add more columns as necessary
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        {/* Sider for Form */}
        <Sider width={300} style={{ background: "#4D908E", padding: "24px" }}>
          {/* Add form components here */}
          <Form form={form} layout="vertical" name="add_exam_slot_form">
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
              <Select placeholder="Select semester">
                {availableSemesters.map((semester) => (
                  <Select.Option key={semester.id} value={semester.id}>
                    {semester.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Sider>

        {/* Content for Table */}
        <Content style={{ padding: 12, margin: 0, background: "#fff" }}>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h2 style={titleStyle}>Attendance Management</h2>
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
          </div>

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

export default Attendance;
