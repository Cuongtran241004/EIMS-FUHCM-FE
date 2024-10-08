import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import { Table, Spin, message, Select, Layout } from "antd";
import examSlotApi from "../../services/ExamSlot.js";
import semesterApi from "../../services/Semester.js";

const { Content, Sider } = Layout;
const { Option } = Select;

const Attendance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [semesters, setSemesters] = useState([]);

  // Fetch attendance data
  const fetchData = async (term) => {
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
    if (selectedSemester) {
      fetchData(selectedSemester);
    }
  }, [selectedSemester]);

  // Fetch semesters on initial load
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const result = await semesterApi.getAllSemesters();
        setSemesters(result);
        const sortedSemesters = result.sort(
          (a, b) => new Date(b.startAt) - new Date(a.startAt)
        );
        setSelectedSemester(sortedSemesters[0]?.id); // Set the default semester ID
        fetchData(sortedSemesters[0]?.id); // Fetch data for the default semester
      } catch (error) {
        message.error("Failed to fetch semesters");
      }
    };

    fetchSemesters();
  }, []);

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
        <Sider width={300} style={{ background: "#f1f1f1", padding: "24px" }}>
          <Select
            placeholder="Select Semester"
            style={{ width: "100%" }}
            onChange={(value) => setSelectedSemester(value)} // Update selected semester
            value={selectedSemester}
          >
            {semesters.map((semester) => (
              <Option key={semester.id} value={semester.id}>
                {semester.name}
              </Option>
            ))}
          </Select>
        </Sider>

        {/* Content for Table */}
        <Content style={{ padding: 24, margin: 0, background: "#fff" }}>
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
