import React, { useState, useEffect } from "react";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";
import { Layout, Typography, Row, Col, Divider } from "antd";
import moment from "moment";
import attendanceApi from "../../services/InvigilatorAttendance.js";

const { Content, Sider } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [todayExamSlot, setTodayExamSlot] = useState([]);
  const fetchExamSlotToday = async () => {
    // Fetch exam slot today

    const response = await attendanceApi.getAllAttendanceByDate();
  };
  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        <Sider width={256} style={{ backgroundColor: "#4D908E" }}>
          <NavBar_Manager />
        </Sider>
        <Content style={{ padding: "0 5px", width: "100%" }}>
          <div style={{ height: "49%" }}>
            <Row style={{ height: "100%" }}>
              <Col
                span={17}
                style={{ backgroundColor: "#f0f2f5", padding: "20px" }}
              >
                {/* Content for the left part (70%) */}
                <h2>Dashboard Summary</h2>
                {/* Your content here */}
              </Col>
              <Col
                span={7}
                style={{ backgroundColor: "#e6f7ff", padding: "20px" }}
              >
                {/* Content for the right part (30%) */}
                <h2>Quick Actions</h2>
                {/* Your content here */}
              </Col>
            </Row>
          </div>
          <Divider style={{ margin: "5px 0" }} />
          <div style={{ height: "49%" }}>
            <Row style={{ height: "100%" }}>
              <Col
                span={8}
                style={{ backgroundColor: "#f9f9f9", padding: "5px" }}
              >
                {/* Table for today's exam slots */}
                <h3>Today's Exam Slots</h3>
                {/* Your table component here */}
              </Col>
              <Col
                span={8}
                style={{ backgroundColor: "#f9f9f9", padding: "5px" }}
              >
                {/* Table for today's invigilators */}
                <h3>Today's Invigilators</h3>
                {/* Your table component here */}
              </Col>
              <Col
                span={8}
                style={{ backgroundColor: "#f9f9f9", padding: "20px" }}
              >
                {/* Table for today's reports */}
                <h3>Today's Reports</h3>
                {/* Your table component here */}
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
