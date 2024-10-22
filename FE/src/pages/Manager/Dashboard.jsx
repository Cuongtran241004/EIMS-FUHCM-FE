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
                span={12}
                style={{ backgroundColor: "#f0f2f5", padding: "20px" }}
              >
                {/* Content for the left part (70%) */}
                <h2>Exam Slot Summary</h2>
                <p>
                  Thống kê có bao nhiêu exam slot diễn ra từ ngày A đến ngày B
                </p>
                <p>
                  API nhận start date, end date, và trả về json dạng:{" "}
                  {`{"date": "2021-09-01",
                  "total_exam_slot": 10}`}{" "}
                </p>
                {/* Your content here */}
              </Col>
              <Col
                span={12}
                style={{ backgroundColor: "#e6f7ff", padding: "20px" }}
              >
                {/* Content for the right part (30%) */}
                <h2>Invigilation Summary</h2>
                <p>
                  Thống kê có bao nhiêu invigilator đã đăng ký, bao nhiêu
                  invigilator được assign trong ngày A (bởi vì 1 ngày có nhiều
                  exam slot nên hiển thị trong 1 ngày sẽ dễ nhìn hơn)
                </p>
                <p>
                  API nhận vào date, và trả về json dạng:{" "}
                  {`{"exam slot": {thông tin của exam slot},
                  "registered": 10, "assigned": 8`}{" "}
                </p>
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
                <p>Danh sách exam slot của ngày hôm nay</p>
                {/* Your table component here */}
              </Col>
              <Col
                span={8}
                style={{ backgroundColor: "#f9f9f9", padding: "5px" }}
              >
                {/* Table for today's invigilators */}
                <h3>Today's Invigilators</h3>
                <p>Danh sách các giảng viên coi thi ngày hôm nay</p>
                {/* Your table component here */}
              </Col>
              <Col
                span={8}
                style={{ backgroundColor: "#f9f9f9", padding: "20px" }}
              >
                {/* Table for today's reports */}
                <h3>Today's Reports</h3>
                <p>bao gồm exam slot report và attendance report</p>
                <p>api trả về con số</p>
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
