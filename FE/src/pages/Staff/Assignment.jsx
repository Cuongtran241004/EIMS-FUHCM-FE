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
import Header from "../../components/Header/Header.jsx";
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
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        <Spin spinning={loading}>
          <Content style={{ padding: "0 50px" }}>
            <div style={titleAssignmentStyle}>
              <h1 style={titleStyle}>Assignment</h1>
              <h2>{examSlot.subjectName}</h2>
              <h3>
                {examSlot.subjectCode} - {examSlot.examType}
              </h3>
              <h3>
                {moment(examSlot.startAt).format("DD/MM/YYYY")} -{" "}
                {moment(examSlot.endAt).format("DD/MM/YYYY")}
              </h3>
            </div>
            <Table
              columns={columns}
              dataSource={data}
              pagination={{
                pageSize: pageSize,
                current: currentPage,
                onChange: (page) => setCurrentPage(page),
              }}
            />
          </Content>
        </Spin>
      </Layout>
    </Layout>
  );
};

export default AssignmentInvigilator;
