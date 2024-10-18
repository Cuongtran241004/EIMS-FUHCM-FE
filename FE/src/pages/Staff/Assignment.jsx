import React, { useState, useEffect } from "react";
import { Layout, Button, message, Table, Spin, Space, Tag } from "antd";
import {
  titleAssignmentStyle,
  titleStyle,
} from "../../design-systems/CSS/Title";
import { EditOutlined } from "@ant-design/icons";
import invigilatorAssignmentApi from "../../services/InvigilatorAssignment";
import examSlotApi from "../../services/ExamSlot";
import { useParams } from "react-router-dom";
import { staffMapperUtil } from "../../utils/Mapper/StaffMapperUtil";
import moment from "moment";
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

      const result = staffMapperUtil.mapExamSlot(response);

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
      message.error("Failed to fetch invigilator assignments.");
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
      dataIndex: "roomFuId",
      key: "roomFuId",
      align: "center",
    },
    {
      title: "Room Invigilator",
      dataIndex: "roomFullName",
      key: "roomFullName",
      render: (text, record) => {
        return `${record.roomLastName} ${record.roomFirstName}`;
      },
    },
    {
      title: "Room Name",
      dataIndex: "roomName",
      key: "roomName",
      align: "center",
      width: "10%",
    },
    {
      title: "Hall Invigilator",
      dataIndex: "hallFullName",
      key: "hallFullName",
      render: (text, record) => {
        return `${record.hallLastName} ${record.hallFirstName}`;
      },
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
    <Layout
      style={{ maxWidth: "80%", margin: "0 auto", backgroundColor: "#fff" }}
    >
      <div
        style={{
          margin: "5px",
          textAlign: "center",
          backgroundColor: "#4D908E",
        }}
      >
        <h2 style={titleAssignmentStyle}>INVIGILATOR ASSIGNMENT</h2>

        <Tag
          color="green"
          style={{
            fontSize: "18px",
            marginBottom: "10px",
            textAlign: "center",
            boxShadow: "0 4px 4px 0 rgba(0,0,0,0.4)",
          }}
        >
          <strong>
            {" "}
            {examSlot.subjectCode} - {examSlot.examType}
          </strong>
          <br></br>
          {moment(examSlot.startAt).format("DD-MM-YYYY")} ({" "}
          {moment(examSlot.endAt).format("HH:MM")} -{" "}
          {moment(examSlot.startAt).format("HH:MM")})
        </Tag>
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
