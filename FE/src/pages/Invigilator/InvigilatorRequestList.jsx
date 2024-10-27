import React, { useEffect, useState } from "react";
import { Table, message, Tag } from "antd";
import { getRequests } from "../../components/API/getRequests";
import moment from "moment";
import { titleStyle } from "../../design-systems/CSS/Title";
function InvigilatorRequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await getRequests();
        setRequests(response);
      } catch (error) {
        console.error("fetchRequests Error:", error.message);
        message.error(error.message || "Error fetching requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const columns = [
    {
      title: "Request Type",
      dataIndex: "requestType",
      key: "requestType",
    },
    {
      title: "Semester",
      dataIndex: "semesterName",
      key: "semesterName",
    },
    {
      title: "Slot Details",
      key: "slotDetails",
      render: (record) => {
        const date = moment(record.startAt).format("DD/MM/YYYY");
        const startTime = moment(record.startAt).format("HH:mm");
        const endTime = moment(record.endAt).format("HH:mm");
        return (
          <div>
            <div>
              <strong>Date:</strong> {date}
            </div>
            <div>
              <strong>Start:</strong> {startTime}
            </div>
            <div>
              <strong>End:</strong> {endTime}
            </div>
          </div>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => moment(b.createdAt) - moment(a.createdAt),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: 200,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color;
        switch (status) {
          case "PENDING":
            color = "orange";
            break;
          case "APPROVED":
            color = "green";
            break;
          case "REJECTED":
            color = "red";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      width: 200,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text, record) => {
        if (record.status === "APPROVED" || record.status === "REJECTED") {
          return moment(text).format("DD/MM/YYYY HH:mm");
        }
        return null;
      },
    },
  ];

  return (
    <div style={{ padding: 20, height: "100%" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px", ...titleStyle }}>
        SUBMITTED REQUESTS
      </h2>
      <Table
        columns={columns}
        dataSource={requests}
        loading={loading}
        rowKey="requestId"
        pagination={{
          pageSize: 4,
          showSizeChanger: false,
          showQuickJumper: false,
          position: ["bottomCenter"],
        }}
        style={{ maxWidth: "100%", minWidth: "800px" }}
      />
    </div>
  );
}

export default InvigilatorRequestsList;
