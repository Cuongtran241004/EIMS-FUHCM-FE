import React, { useState, useEffect } from "react";
import { Layout, Button, message, Table, Spin } from "antd";
import { titleStyle } from "../../design-systems/CSS/Title";
import { EditOutlined } from "@ant-design/icons";
import invigilatorAssignmentApi from "../../services/InvigilatorAssignment";
const { Content } = Layout;
const AssignmentInvigilator = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const fetchInvigilatorAssignment = async () => {
    setLoading(true);
    try {
      const response = invigilatorAssignmentApi.getAllAssignmentByExamSlotId();
      setData(response || []);
    } catch (error) {
      message.error(error.message);
    }
    setLoading(false);
  };

  //   useEffect(() => {
  //     fetchInvigilatorAssignment();
  //   }, []);

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
      dataIndex: "fuId",
      key: "fuId",
    },
    {
      title: "Full Name",
      dataIndex: "fuId",
      key: "fuId",
    },
    {
      title: "Room Name",
      dataIndex: "room",
      key: "room",
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
            onClick={() => handleEdit(record)}
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
          <p>Start Time: </p>
          <p>End Time: </p>
        </div>
      </div>
      <Content
        style={{
          padding: "24px",
          background: "#fff",
        }}
      >
        <Spin>
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
        <Layout></Layout>
      </Content>
    </Layout>
  );
};
export default AssignmentInvigilator;
