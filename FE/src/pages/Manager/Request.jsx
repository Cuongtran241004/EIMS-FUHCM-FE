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
import { requestTag } from "../../design-systems/CustomTag.jsx";
import { managerMapperUtil } from "../../utils/Mapper/ManagerMapperUtil.jsx";
import {
  buttonStyle,
  detailButtonStyle,
  selectButtonStyle,
} from "../../design-systems/CSS/Button.js";
import { titleStyle } from "../../design-systems/CSS/Title.js";

const { Content, Sider } = Layout;

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedSemester, setSelectedSemester, semesters } = useSemester(); // Access shared semester state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null); // Store selected request details

  const fetchData = async (semesterId) => {
    setLoading(true);
    try {
      const response = await requestApi.getAllRequestsBySemesterId(semesterId);
      const result = managerMapperUtil.mapRequest(response); // Map response data to table data
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
      render: (text, record) => {
        requestTag(record.status);
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Space size="large">
          <Button
            onClick={() => handleDetailClick(record)}
            style={detailButtonStyle}
          >
            Detail
          </Button>
          <Button style={buttonStyle}>Approve</Button>
          <Button danger>Reject</Button>
        </Space>
      ),
    },
  ];

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
              <Button style={{ width: "200px", ...selectButtonStyle }}>
                <Space>
                  {selectedSemester.name} <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>

          <Spin spinning={loading}>
            <Table
              dataSource={requests}
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
