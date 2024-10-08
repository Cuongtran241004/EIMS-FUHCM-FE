import React from "react";
import { Layout } from "antd";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";

const { Sider } = Layout;
const AttendanceCheck = () => {
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

export default AttendanceCheck;
