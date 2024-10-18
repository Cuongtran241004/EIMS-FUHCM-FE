import React from "react";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";
import { Layout, Typography, Row, Col, Card, Statistic } from "antd";

const { Content, Sider } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        <Sider width={256} style={{ backgroundColor: "#4D908E" }}>
          <NavBar_Manager />
        </Sider>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
