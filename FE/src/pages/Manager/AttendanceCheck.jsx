import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";
import { Dropdown, Button, Space, Table, Spin } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import moment from "moment";

const { Content, Sider } = Layout;
const AttendanceCheck = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedSemester, setSelectedSemester, semesters } = useSemester(); // Access shared semester state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const fetchData = async (semesterId) => {
    setLoading(true);
    try {
      // Fetch attendance data
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSemester.id) {
      fetchData(selectedSemester.id);
    }
  }, [selectedSemester.id]);
  const items = semesters.map((semester) => ({
    key: semester.id,
    label: semester.name,
  }));

  const handleMenuClick = (e) => {
    const selected = items.find((item) => item.key == e.key);
    if (selected) {
      setSelectedSemester({
        id: selected.key,
        name: selected.label,
      });
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Subject Code",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "Exam Type",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Date",
      dataIndex: "attendance",
      key: "attendance",
    },
    {
      title: "Time",
      dataIndex: "attendance",
      key: "attendance",
    },
    {
      title: "Invigilator List",
      dataIndex: "attendance",
      key: "attendance",
    },
    {
      title: "Action",
      dataIndex: "studentId",
      key: "studentId",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary">Approve</Button>
          <Button danger>Reject</Button>
        </Space>
      ),
    },
  ];
  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        <Sider width={256} style={{ backgroundColor: "#4D908E" }}>
          <NavBar_Manager />
        </Sider>
        <Content style={{ padding: 12, margin: 0, background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Dropdown
              menu={{
                items,
                onClick: handleMenuClick,
              }}
            >
              <Button style={{ width: "150px" }}>
                <Space>
                  {selectedSemester.name}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <span style={{ margin: "0 25%", fontSize: "20px" }}>
              <h2>Attendance Management</h2>
            </span>
          </div>

          <Spin spinning={loading}>
            <Table
              dataSource={attendances.map((attendance) => ({
                ...attendance,
                key: attendance.id,
              }))} // Add a key property to each request object
              columns={columns}
              pagination={{ pageSize: 8 }}
            />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AttendanceCheck;
