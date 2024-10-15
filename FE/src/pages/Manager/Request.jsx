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
  Modal,
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null); // Store selected request details

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

  const handleDetailClick = (record) => {
    setSelectedRequest(record); // Set the selected request data
    setIsModalVisible(true); // Show modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Hide modal
    setSelectedRequest(null); // Clear selected request data
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
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (text, record) => {
        return `${moment(record.startAt).format("HH:mm")} - ${moment(
          record.endAt
        ).format("HH:mm")}`;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status === "PENDING") {
          return (
            <Tag color="orange">
              <strong>{status}</strong>
            </Tag>
          );
        } else if (status === "APPROVED") {
          return (
            <Tag color="green">
              <strong>{status}</strong>
            </Tag>
          );
        } else {
          return (
            <Tag color="red">
              <strong>{status}</strong>
            </Tag>
          );
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Space size="large">
          <Button type="primary" onClick={() => handleDetailClick(record)}>
            Detail
          </Button>
          <Button type="primary" style={buttonStyle}>
            Approve
          </Button>
          <Button danger>Reject</Button>
        </Space>
      ),
    },
  ];

  const buttonStyle = {
    backgroundColor: "#43AA8B",
    borderColor: "#43AA8B",
    color: "#fff",
    borderRadius: "5px",
  };

  const titleStyle = {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "20px 0",
  };

  const contentStyle = {
    padding: "20px",
    background: "#f9f9f9",
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Sider width={256} style={{ backgroundColor: "#4D908E" }}>
          <NavBar_Manager />
        </Sider>
        <Content
          style={{ padding: "20px", margin: "0", background: "#f9f9f9" }}
        >
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h2 style={titleStyle}>Request Management</h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Dropdown
              menu={{ items, onClick: handleMenuClick }}
              style={{ marginRight: "auto" }}
            >
              <Button style={{ width: "200px", ...buttonStyle }}>
                <Space>
                  {selectedSemester.name} <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
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
              }))}
              columns={columns}
              pagination={{ pageSize: pageSize }}
              rowClassName="table-row"
            />
          </Spin>

          {/* Modal for displaying request details */}
          {selectedRequest && (
            <Modal
              title="Request Details"
              open={isModalVisible}
              onCancel={handleModalClose}
              footer={[
                <Button key="close" onClick={handleModalClose}>
                  Close
                </Button>,
              ]}
            >
              <p>
                <strong>FU ID:</strong> {selectedRequest.fuId}
              </p>

              <p>
                <strong>Email:</strong> {selectedRequest.email}
              </p>
              <p>
                <strong>Reason:</strong> {selectedRequest.reason}
              </p>
              <p>
                <strong>Note:</strong> {selectedRequest.note}
              </p>
            </Modal>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Request;
