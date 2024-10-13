import React, { useState, useEffect } from "react";
import {
  Layout,
  Dropdown,
  Button,
  message,
  Space,
  Table,
  Spin,
  Tag,
  Row,
  Col,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import requestApi from "../../services/Request.js";
const { Content, Sider } = Layout;
const Request = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedSemester, setSelectedSemester, semesters } = useSemester(); // Access shared semester state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const fetchData = async (semesterId) => {
    setLoading(true);
    try {
      const result = await requestApi.getAllRequestsBySemesterId(semesterId);

      // sort request by createdAt
      result.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setRequests(result || []);
    } catch (error) {
      message.error(FETCH_SUBJECTS_FAILED);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects whenever the selected semester changes
  useEffect(() => {
    if (selectedSemester.id) {
      fetchData(selectedSemester.id);
    }
  }, [selectedSemester.id]); // This will run whenever selectedSemester.id changes

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
      title: "FUID",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "Subject",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "Exam Type",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "Date",
      dataIndex: "studentId",
      key: "studentId",
    },

    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status === "PENDING") {
          return <Tag color="orange">{status}</Tag>;
        } else if (status === "APPROVED") {
          return <Tag color="green">{status}</Tag>;
        } else {
          return <Tag color="red">{status}</Tag>;
        }
      },
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
        <Sider width={256} style={{ backgroundColor: "#fff" }}>
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
              <h2>Request Management</h2>
            </span>
          </div>

          <Spin spinning={loading}>
            <Table
              dataSource={requests.map((request) => ({
                ...request,
                key: request.requestId,
              }))} // Add a key property to each request object
              columns={columns}
              rowKey="id" // Use a unique key, assuming semester objects have an id property
              pagination={{ pageSize: 8 }}
            />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Request;
