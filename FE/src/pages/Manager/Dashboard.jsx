import React, { useState, useEffect } from "react";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";
import { Layout, Typography, Row, Col, Card, Statistic } from "antd";
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
        <Content style={{ padding: "0 50px" }}></Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
