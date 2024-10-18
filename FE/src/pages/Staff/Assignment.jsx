import React, { useState, useEffect } from "react";
import { Layout, Button, message, Table, Spin, Space } from "antd";
import { titleStyle } from "../../design-systems/CSS/Title";
import { EditOutlined } from "@ant-design/icons";
import invigilatorAssignmentApi from "../../services/InvigilatorAssignment";
import examSlotApi from "../../services/ExamSlot";
import { useParams } from "react-router-dom";
import { staffMapperUtil } from "../../utils/Mapper/StaffMapperUtil";

const { Content } = Layout;

const AssignmentInvigilator = () => {
  const { examSlotId } = useParams(); // Destructure directly from useParams
  const [examSlot, setExamSlot] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const fetchExamSlot = async () => {
    try {
      const response = await examSlotApi.getExamSlotById(examSlotId);
      const result = staffMapperUtil.mapExamSchedule(response);
      console.log(result);
      setExamSlot(result || {});
    } catch (error) {
      message.error("Failed to fetch exam slot data.");
    }
  };

  const fetchInvigilatorAssignment = async () => {
    setLoading(true);
    try {
      await fetchExamSlot(); // Await the fetchExamSlot
      const response =
        await invigilatorAssignmentApi.getAllAssignmentByExamSlotId(examSlotId);
      const result = staffMapperUtil.mapAssignment(response);
      setData(result || []);
    } catch (error) {
      message.error(
        error.message || "Failed to fetch invigilator assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvigilatorAssignment();
  }, [examSlotId]); // Added examSlotId as a dependency

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "FuID",
      dataIndex: "invigilatorFuId",
      key: "invigilatorFuId",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => {
        return `${record.invigilatorFirstName} ${record.invigilatorLastName}`;
      },
    },
    {
      title: "Room Name",
      dataIndex: "roomName",
      key: "roomName",
      width: "10%",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => handleEdit(record)} // Make sure handleEdit is defined
          />
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ maxWidth: "80%", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h2 style={titleStyle}>INVIGILATOR ASSIGNMENT</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>Exam Slot: </p>
          <p>Subject: </p>
        </div>
        <div>
          <p>Start Time: {examSlot.startAt}</p>
          <p>End Time: {examSlot.endAt}</p>{" "}
          {/* Assuming endAt is a valid field */}
        </div>
      </div>
      <Content style={{ padding: "24px", background: "#fff" }}>
        <Spin spinning={loading}>
          <Table
            dataSource={data}
            columns={columns}
            pagination={{
              pageSize,
              current: currentPage,
              onChange: (page) => setCurrentPage(page),
            }}
          />
        </Spin>
      </Content>
    </Layout>
  );
};

export default AssignmentInvigilator;
