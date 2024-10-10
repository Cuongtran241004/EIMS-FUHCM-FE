import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import {
  Table,
  Spin,
  message,
  Select,
  Layout,
  Space,
  Dropdown,
  Button,
} from "antd";
import examSlotApi from "../../services/ExamSlot.js";
import semesterApi from "../../services/Semester.js";
import { DownOutlined } from "@ant-design/icons";
const { Content, Sider } = Layout;
const { Option } = Select;

const Attendance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [semesters, setSemesters] = useState([]);

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
        <Sider
          width={300}
          style={{ background: "#f1f1f1", padding: "24px" }}
        ></Sider>

        {/* Content for Table */}
        <Content style={{ padding: 24, margin: 0, background: "#fff" }}>
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
