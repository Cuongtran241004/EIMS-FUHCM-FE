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
  notification,
  Select,
} from "antd";
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import requestApi from "../../services/Request.js";
import moment from "moment";
import { examTypeTag, requestTag } from "../../design-systems/CustomTag.jsx";
import { managerMapperUtil } from "../../utils/Mapper/ManagerMapperUtil.jsx";
import {
  buttonStyle,
  detailButtonStyle,
  selectButtonStyle,
} from "../../design-systems/CSS/Button.js";
import { titleStyle } from "../../design-systems/CSS/Title.js";
import userApi from "../../services/User.js";
import { requestNotification } from "../../design-systems/CustomNotification.jsx";
import invigilatorAssignmentApi from "../../services/InvigilatorAssignment.js";
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
      // Sort by status, with priority: PENDING -> APPROVED -> REJECTED
      result.sort((a, b) => {
        const statusPriority = { PENDING: 1, APPROVED: 2, REJECTED: 3 };

        // Compare statuses first
        if (statusPriority[a.status] !== statusPriority[b.status]) {
          return statusPriority[a.status] - statusPriority[b.status];
        }

        // If statuses are the same, sort by requestId in descending order
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

  const [selectedInvigilator, setSelectedInvigilator] = useState(null); // Declare the state for selected invigilator

  const handleApprove = async (record) => {
    if (record.status === "PENDING") {
      setDetailLoading((prev) => ({ ...prev, [record.requestId]: true }));

      try {
        // Fetch the list of available invigilators
        const response =
          await invigilatorAssignmentApi.getUnassignedInvigilatorByExamSlotId(
            record.examSlotId
          );
        const unassignedInvigilator =
          managerMapperUtil.mapUnassignedInvigilator(response);

        const user = await userApi.getAllUsers();
        const invigilators = user.filter((user) => user.role == 3);
        const allInvigilators =
          managerMapperUtil.mapUnassignedInvigilator(invigilators);

        // Show a modal to select an invigilator
        Modal.confirm({
          title: "Select Invigilator",
          content: (
            <Select
              placeholder="Select an invigilator"
              style={{ width: "100%" }}
              showSearch
              optionFilterProp="children"
              onChange={(value) => setSelectedInvigilator(value)}
            >
              {allInvigilators.map((invigilator) => (
                <Select.Option key={invigilator.fuId} value={invigilator.fuId}>
                  {unassignedInvigilator.some(
                    (unassigned) => unassigned.fuId === invigilator.fuId
                  ) ? (
                    <Tag icon={<CheckCircleOutlined />} color="cyan">
                      {invigilator.fuId} - {invigilator.lastName}{" "}
                      {invigilator.firstName}
                    </Tag>
                  ) : (
                    <>
                      {invigilator.fuId} - {invigilator.lastName}{" "}
                      {invigilator.firstName}
                    </>
                  )}
                </Select.Option>
              ))}
            </Select>
          ),
          onOk: async () => {
            if (!selectedInvigilator) {
              notification.warning({
                message: "Warning",
                description: "Please select an invigilator",
              });
              return;
            }

            try {
              const requestData = {
                newInvigilatorFuId: selectedInvigilator,
                requestId: record.requestId,
                status: "APPROVED",
              };
              // Call API to approve the request with the selected invigilator
              await requestApi.updateRequest(requestData);
              message.success("Request approved successfully");

              // Optionally refetch the updated requests
              fetchData(selectedSemester.id);
            } catch (error) {
              message.error("Failed to approve the request");
              console.error(error); // Log the error for debugging
            } finally {
              setDetailLoading((prev) => ({
                ...prev,
                [record.requestId]: false,
              }));
              setSelectedInvigilator(null); // Reset selected invigilator after approval
            }
          },
          onCancel: () => {
            setSelectedInvigilator(null); // Reset selected invigilator if cancelled
          },
        });
      } catch (error) {
        message.warning("No available invigilators");
      } finally {
        setDetailLoading((prev) => ({ ...prev, [record.requestId]: false }));
      }
    } else {
      requestNotification();
    }
  };

  // Reject the request (with reason)
  const handleReject = (record) => {
    if (record.status === "PENDING") {
      let rejectionReason = "";

      const handleRejectConfirm = async () => {
        if (!rejectionReason) {
          notification.warning({
            message: "Warning",
            description: "Please enter a reason for rejection",
          });
          return;
        }

        try {
          setDetailLoading((prev) => ({ ...prev, [record.requestId]: true }));
          // Call API to reject the request with the provided reason
          const requestData = {
            requestId: record.requestId,
            status: "REJECTED",
            note: rejectionReason,
          };
          await requestApi.updateRequest(requestData);
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
        title: "Reject Reason",
        content: (
          <div style={{ paddingBottom: "20px" }}>
            {" "}
            {/* Add padding to avoid overlap */}
            <Input.TextArea
              onChange={(e) => (rejectionReason = e.target.value)}
              rows={4}
              maxLength={1000}
              showCount
              placeholder="Enter rejection reason"
            />
          </div>
        ),
        onOk: handleRejectConfirm,
        onCancel: () => (rejectionReason = ""), // Reset reason if canceled
      });
    } else {
      requestNotification();
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "FUID",
      dataIndex: "fuId",
      key: "fuId",
      align: "center",
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
      render: (text) => examTypeTag(text),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
      render: (text, record) => moment(record.startAt).format("DD/MM/YYYY"),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      align: "center",
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
      align: "center",
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
            <CheckOutlined />
          </Button>
          <Button danger onClick={() => handleReject(record)}>
            <CloseOutlined />
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
