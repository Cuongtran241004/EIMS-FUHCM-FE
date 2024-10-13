import React from "react";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";
import { Layout, Typography, Row, Col, Card, Statistic } from "antd";
import { Bar } from "react-chartjs-2"; // Make sure you have installed react-chartjs-2
import { useEffect, useState } from "react";

const { Content, Sider } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        <Sider width={256} style={{ backgroundColor: "#fff" }}>
          <NavBar_Manager />
        </Sider>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
