import { Layout, Divider } from "antd";
import Header_Staff from "../../components/Header/Header_Staff";
import React from "react";

const Exam_Schedule = ({ isLogin }) => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Header_Staff isLogin={isLogin} />
      abc
      <Divider>List of Exam Schedule</Divider>
    </Layout>
  );
};
export default Exam_Schedule;
