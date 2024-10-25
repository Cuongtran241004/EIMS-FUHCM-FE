import React, { useState, useEffect } from "react";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";
import { Layout, Typography, Row, Col, Divider, Table, Button } from "antd";
import moment from "moment";
import examSlotApi from "../../services/ExamSlot.js";
import { managerMapperUtil } from "../../utils/Mapper/ManagerMapperUtil.jsx";
import { examTypeTag } from "../../design-systems/CustomTag.jsx";
import { EyeFilled, EyeOutlined } from "@ant-design/icons";
import "./Dashboard.css";

const { Content, Sider } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [todayExamSlots, setTodayExamSlots] = useState([]);
  const [todayInvigilators, setTodayInvigilators] = useState([]);

  const fetchExamSlotToday = async () => {
    // Fetch exam slot today
    const response = await examSlotApi.getExamSlotTodayManager();
    const result = managerMapperUtil.mapTodayExamSlots(response);
    // sort by startAt
    result.sort((a, b) => {
      return new Date(a.startAt) - new Date(b.startAt);
    });
    setTodayExamSlots(result || []);
  };

  useEffect(() => {
    fetchExamSlotToday();
  }, []);

  const todayExamSlotColumns = [
    {
      title: "#",
      dataIndex: "no",
      key: "no",
      align: "center",
      width: "10%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Subject",
      dataIndex: "subjectCode",
      key: "subjectCode",
    },
    {
      title: "Type",
      dataIndex: "examType",
      key: "examType",
      align: "center",
      render: (text) => examTypeTag(text),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      align: "center",
      render: (text, record) => {
        return (
          <p>
            {moment(record.startAt).format("HH:mm")} -{" "}
            {moment(record.endAt).format("HH:mm")}
          </p>
        );
      },
    },
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
      align: "center",
      render: (text, record) => {
        return (
          <Button type="link" size="small">
            <EyeOutlined />
          </Button>
        );
      },
    },
  ];
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
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "5px",
                  overflow: "auto",
                }}
              >
                <Table
                  className="custom-table-today-exam-slots"
                  columns={todayExamSlotColumns}
                  dataSource={todayExamSlots}
                  pagination={false}
                  scroll={{
                    y: 200, // Vertical scrolling if data exceeds 400px in height
                    x: "100%", // Horizontal scrolling for wide tables
                  }}
                />
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
