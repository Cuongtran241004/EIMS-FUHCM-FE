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
  Popover,
  Input,
} from "antd";
import { DownOutlined, EyeOutlined } from "@ant-design/icons";
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
import userApi from "../../services/User.js";

const { Content, Sider } = Layout;

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedSemester, setSelectedSemester, semesters } = useSemester();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailLoading, setDetailLoading] = useState({});

  const fetchData = async (semesterId) => {
    setLoading(true);
    try {
      const response = await requestApi.getAllRequestsBySemesterId(semesterId);
      const result = managerMapperUtil.mapRequest(response);
      result.sort((a, b) => new Date(b.requestId) - new Date(a.requestId));
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

  const handleDetailClick = async (record) => {
    setDetailLoading((prev) => ({ ...prev, [record.requestId]: true })); // Set loading for the specific row
    try {
      const requestUser = await userApi.getUserByFuId(record.fuId);
      const response = {
        ...record,
        ...requestUser,
      };
      setSelectedRequest(response);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch user info");
    } finally {
      setDetailLoading((prev) => ({ ...prev, [record.requestId]: false })); // Reset loading for the specific row
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRequest(null);
  };

  // Approve the request
  const handleApprove = async (record) => {
    try {
      setDetailLoading((prev) => ({ ...prev, [record.requestId]: true }));
      // Call API to approve the request
      await requestApi.approveRequest(record.requestId);
      message.success("Request approved successfully");

      // Optionally refetch the updated requests
      fetchData(selectedSemester.id);
    } catch (error) {
      message.error("Failed to approve the request");
    } finally {
      setDetailLoading((prev) => ({ ...prev, [record.requestId]: false }));
    }
  };

  // Reject the request (with reason)
  const handleReject = (record) => {
    let rejectionReason = "";

    const handleRejectConfirm = async () => {
      if (!rejectionReason) {
        message.error("Please enter a reason for rejection");
        return;
      }

      try {
        setDetailLoading((prev) => ({ ...prev, [record.requestId]: true }));
        // Call API to reject the request with the provided reason
        await requestApi.rejectRequest(record.requestId, rejectionReason);
        message.success("Request rejected successfully");

        // Optionally refetch the updated requests
        fetchData(selectedSemester.id);
      } catch (error) {
        message.error("Failed to reject the request");
      } finally {
        setDetailLoading((prev) => ({ ...prev, [record.requestId]: false }));
      }
    };

    Modal.confirm({
      title: "Reject Request",
      content: (
        <>
          <p>Please enter the reason for rejection:</p>
          <Input.TextArea
            onChange={(e) => (rejectionReason = e.target.value)}
            rows={4}
            placeholder="Enter rejection reason"
          />
        </>
      ),
      onOk: handleRejectConfirm,
      onCancel: () => (rejectionReason = ""), // Reset reason if canceled
    });
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
      render: (text, record) => `${record.subjectCode} `,
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
      render: (text, record) => moment(record.startAt).format("DD/MM/YYYY"),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (text, record) =>
        `${moment(record.startAt).format("HH:mm")} - ${moment(record.endAt).format("HH:mm")}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => requestTag(record.status),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Space size="large">
          <Button
            type="text"
            onClick={() => handleDetailClick(record)}
            style={{ ...detailButtonStyle, width: "50px" }}
            loading={detailLoading[record.requestId] || false} // Use loading state for the specific row
          >
            <EyeOutlined style={{ fontSize: "20px", color: "#43AA8B" }} />
          </Button>
          <Button style={buttonStyle} onClick={() => handleApprove(record)}>
            Approve
          </Button>
          <Button danger onClick={() => handleReject(record)}>
            Reject
          </Button>
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
                <strong>FuID:</strong> {selectedRequest.fuId}
              </p>
              <p>
                <strong>Fullname:</strong> {selectedRequest.lastName}{" "}
                {selectedRequest.firstName}
              </p>
              <p>
                <strong>Phone: </strong> {selectedRequest.phoneNumber}
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
