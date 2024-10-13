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
  Popover,
  Select,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import requestApi from "../../services/Request.js";
import moment from "moment";

const { Content, Sider } = Layout;
const { Option } = Select;

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedSemester, setSelectedSemester, semesters } = useSemester(); // Access shared semester state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [popoverVisible, setPopoverVisible] = useState({});
  const [alternativeUser, setAlternativeUser] = useState({}); // Store selected alternative user

  // Example list of alternative users
  const [users, setUsers] = useState([
    { id: 1, name: "Invigilator A" },
    { id: 2, name: "Invigilator B" },
    { id: 3, name: "Invigilator C" },
  ]);

  const fetchData = async (semesterId) => {
    setLoading(true);
    try {
      const result = await requestApi.getAllRequestsBySemesterId(semesterId);

      // sort request by createdAt
      result.sort((a, b) => {
        return new Date(b.requestId) - new Date(a.requestId);
      });

      setRequests(result || []);
    } catch (error) {
      message.error("Failed to fetch requests");
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

  const handleApproveClick = (record) => {
    // Toggle popover visibility for the selected request
    setPopoverVisible((prevVisible) => ({
      ...prevVisible,
      [record.requestId]: !prevVisible[record.requestId],
    }));
  };

  const handleUserChange = (value, requestId) => {
    setAlternativeUser((prevUser) => ({
      ...prevUser,
      [requestId]: value,
    }));
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
      dataIndex: "fuId",
      key: "fuId",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "studentId",
      render: (text, record) => {
        return `${record.subjectCode} `;
      },
    },
    {
      title: "Exam Type",
      dataIndex: "examType",
      key: "examType",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text, record) => {
        return moment(record.startAt).format("DD/MM/YYYY");
      },
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
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Space size="large">
          <Popover
            content={
              <div>
                <p>Choose alternative invigilator</p>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select alternative user"
                  onChange={(value) =>
                    handleUserChange(value, record.requestId)
                  }
                >
                  {users.map((user) => (
                    <Option key={user.id} value={user.id}>
                      {user.name}
                    </Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  onClick={() => {
                    // Logic to handle approval and alternative assignment here
                    message.success(
                      `Approved with alternative user ID: ${
                        alternativeUser[record.requestId]
                      }`
                    );
                  }}
                  style={{ marginTop: 8, width: "100%" }}
                >
                  Save
                </Button>
              </div>
            }
            title="Approve Request"
            trigger="click"
            open={popoverVisible[record.requestId] || false}
            onOpenChange={() => handleApproveClick(record)}
          >
            <Button type="default" color="blue">
              Approve
            </Button>
          </Popover>
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
                requestId: request.requestId,
                reason: request.reason,
                examSlotId: request.examSlotDetail?.examSlotId,
                startAt: request.examSlotDetail?.startAt,
                endAt: request.examSlotDetail?.endAt,
                fuId: request.fuId,
                email: request.email,
                subjectName: request.subject?.name,
                subjectCode: request.subject?.code,
                examType: request.examSlotDetail?.examType,
                status: request.status,
                note: request.note,
                key: request.requestId,
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

export default Request;
