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
  Radio,
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
import { useSemester } from "../../components/Context/SemesterContextManager.jsx";
import requestApi from "../../services/Request.js";
import moment from "moment";
import {
  examTypeTag,
  requestTag,
  requestTypeTag,
} from "../../design-systems/CustomTag.jsx";
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
  const { selectedSemester, setSelectedSemester, semesters, requestTypes } =
    useSemester();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailLoading, setDetailLoading] = useState({});
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequestType, setSelectedRequestType] = useState(null);

  const fetchData = async (semesterId) => {
    setLoading(true);
    try {
      const response = await requestApi.getAllRequestsBySemesterId(semesterId);
      let result = managerMapperUtil.mapRequest(response);

      // Sort by status, with priority: PENDING -> APPROVED -> REJECTED
      result.sort((a, b) => {
        const statusPriority = { PENDING: 1, APPROVED: 2, REJECTED: 3 };

        // Compare statuses first
        if (statusPriority[a.status] !== statusPriority[b.status]) {
          return statusPriority[a.status] - statusPriority[b.status];
        }

        // If statuses are the same, sort by requestId in descending order
        return b.requestId - a.requestId; // Assuming requestId is numeric
      });

      setRequests(result || []);
      setFilteredRequests(result || []);
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
  // Handle radio button change
  const handleChangeRequestType = (type) => {
    setSelectedRequestType(type);
  };

  useEffect(() => {
    if (selectedRequestType) {
      setFilteredRequests(
        requests.filter(
          (request) => request.requestType === selectedRequestType
        )
      );
    } else {
      // Show all requests if no type is selected
      setFilteredRequests(requests);
    }
  }, [selectedRequestType, requests]);

  const handleApprove = async (record) => {
    if (record.status === "PENDING") {
      setDetailLoading((prev) => ({ ...prev, [record.requestId]: true }));

      try {
        // Fetch the list of available invigilators
        const responseUnassign =
          await invigilatorAssignmentApi.getUnassignedInvigilatorByExamSlotId(
            record.examSlotId
          );
        const responseAssign =
          await invigilatorAssignmentApi.getAssignedInvigilatorByExamSlotId(
            record.examSlotId
          );

        const unassignedInvigilators =
          managerMapperUtil.mapUnassignedInvigilator(responseUnassign);
        const assignedInvigilators =
          managerMapperUtil.mapUnassignedInvigilator(responseAssign);

        const userResponse = await userApi.getAllUsers();
        // exclude assigned invigilators
        const filteredInvigilators = userResponse.filter(
          (user) =>
            !assignedInvigilators.some(
              (assigned) => assigned.fuId === user.fuId
            )
        );

        const allInvigilators = filteredInvigilators
          .filter((user) => user.role === 3) // Assuming role 3 is for invigilators
          .map((invigilator) => ({
            fuId: invigilator.fuId,
            lastName: invigilator.lastName,
            firstName: invigilator.firstName,
            isUnassigned: unassignedInvigilators.some(
              (unassigned) => unassigned.fuId === invigilator.fuId
            ),
          }));
        // Sort by unassigned status, with priority: true -> false
        const unassignedInvigilatorsFirst = allInvigilators.sort(
          (a, b) => b.isUnassigned - a.isUnassigned
        );
        // Use local state for selectedInvigilator within the modal
        let selectedInvigilator = null;

        // Show a modal to select an invigilator
        Modal.confirm({
          title: "Select Invigilator",
          content: (
            <Select
              placeholder="Select an invigilator"
              style={{ width: "100%" }}
              showSearch
              optionFilterProp="children"
              onChange={(value) => {
                selectedInvigilator = value; // Update local variable
              }}
            >
              {unassignedInvigilatorsFirst.map((invigilator) => (
                <Select.Option key={invigilator.fuId} value={invigilator.fuId}>
                  {invigilator.isUnassigned ? (
                    <Tag icon={<CheckCircleOutlined />} color="cyan">
                      {invigilator.fuId} - {invigilator.lastName}{" "}
                      {invigilator.firstName}
                    </Tag>
                  ) : (
                    `${invigilator.fuId} - ${invigilator.lastName} ${invigilator.firstName}`
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
              const alternativeIngivilator =
                await userApi.getUserByFuId(selectedInvigilator);
              const noteRes = `${alternativeIngivilator.fuId} - ${alternativeIngivilator.lastName} ${alternativeIngivilator.firstName}`;

              const requestData = {
                newInvigilatorFuId: selectedInvigilator,
                requestId: record.requestId,
                status: "APPROVED",
                note: noteRes,
              };
              // Call API to approve the request with the selected invigilator
              await requestApi.updateRequest(requestData);
              message.success("Request approved successfully");

              // Optionally refetch the updated requests
              fetchData(selectedSemester.id);
            } catch (error) {
              notification.warning({
                message: "Warning",
                description: "Invigilator is not available at that time!",
              });
            } finally {
              setDetailLoading((prev) => ({
                ...prev,
                [record.requestId]: false,
              }));
            }
          },
          onCancel: () => {
            // Reset logic not needed here since selectedInvigilator is local
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
  const handleApproveAttendance = async (record) => {
    if (record.status === "PENDING") {
      let approveComfirm = "";

      const handleApproveConfirm = async () => {
        if (!approveComfirm) {
          notification.warning({
            message: "Warning",
            description: "Please enter a message",
          });
          return;
        }

        try {
          setDetailLoading((prev) => ({ ...prev, [record.requestId]: true }));
          // Call API to reject the request with the provided reason
          const requestData = {
            requestId: record.requestId,
            status: "APPROVED",
            note: approveComfirm,
          };

          await requestApi.updateRequestStatus(requestData);
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
        title: "Confirmation Message",
        content: (
          <div style={{ paddingBottom: "20px" }}>
            {" "}
            {/* Add padding to avoid overlap */}
            <Input.TextArea
              onChange={(e) => (approveComfirm = e.target.value)}
              rows={4}
              maxLength={1000}
              showCount
              placeholder="Enter confirmation message"
            />
          </div>
        ),
        onOk: handleApproveConfirm,
        onCancel: () => (approveComfirm = ""), // Reset reason if canceled
      });
    } else {
      requestNotification();
    }
  };
  const handleRejectAttendance = (record) => {
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
          await requestApi.updateRequestStatus(requestData);
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
        title: "Reject Attendance Reason",
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
      title: "Type",
      dataIndex: "requestType",
      key: "requestType",
      render: (text, record) => requestTypeTag(record.requestType),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => {
        if (record.requestType == "UPDATE_ATTENDANCE") {
          return (
            <Space size="large">
              <Button
                type="text"
                onClick={() => handleDetailClick(record)}
                style={{ ...detailButtonStyle, width: "50px" }}
                loading={detailLoading[record.requestId] || false} // Use loading state for the specific row
              >
                <EyeOutlined style={{ fontSize: "16px", color: "#277DA1" }} />
              </Button>
              <Button
                type="link"
                style={{ color: "#4D908E", borderColor: "#4D908E" }}
                onClick={() => handleApproveAttendance(record)}
              >
                <CheckOutlined />
              </Button>
              <Button danger onClick={() => handleRejectAttendance(record)}>
                <CloseOutlined />
              </Button>
            </Space>
          );
        } else {
          return (
            <Space size="large">
              <Button
                type="text"
                onClick={() => handleDetailClick(record)}
                style={{ ...detailButtonStyle, width: "50px" }}
                loading={detailLoading[record.requestId] || false} // Use loading state for the specific row
              >
                <EyeOutlined style={{ fontSize: "16px", color: "#277DA1" }} />
              </Button>
              <Button
                type="link"
                style={{ color: "#4D908E", borderColor: "#4D908E" }}
                onClick={() => handleApprove(record)}
              >
                <CheckOutlined />
              </Button>
              <Button danger onClick={() => handleReject(record)}>
                <CloseOutlined />
              </Button>
            </Space>
          );
        }
      },
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
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

            <Radio.Group
              onChange={(e) => handleChangeRequestType(e.target.value)}
              style={{
                marginBottom: "10px",
                marginLeft: "10px",
              }}
            >
              {requestTypes.map((type) => (
                <Radio.Button key={type} value={type}>
                  {type === "CANCEL" ? "Cancel" : "Attendance"}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>

          <Spin spinning={loading}>
            <Table
              dataSource={filteredRequests}
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
                <strong>Fullname:</strong> {selectedRequest.lastName}{" "}
                {selectedRequest.firstName} ({selectedRequest.fuId})
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
