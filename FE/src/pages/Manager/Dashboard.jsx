import React, { useState, useEffect } from "react";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";
import { Layout, Typography, Row, Col, Divider, Table, Button } from "antd";
import moment from "moment";
import examSlotApi from "../../services/ExamSlot.js";
import attendanceApi from "../../services/InvigilatorAttendance.js";
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
    try {
      // Fetch exam slot today
      const response = await examSlotApi.getExamSlotTodayManager();
      const result = managerMapperUtil.mapTodayExamSlots(response);
      // sort by startAt
      result.sort((a, b) => {
        return new Date(a.startAt) - new Date(b.startAt);
      });
      setTodayExamSlots(result || []);
    } catch (error) {}
  };

  const fetchInvigilatorToday = async () => {
    try {
      // Fetch invigilator today
      const response = await attendanceApi.getAllAttendanceToday();
      const result = managerMapperUtil.mapTodayInvigilators(response);
      // remove duplicate by fuId
      const uniqueResult = result.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.fuId === item.fuId)
      );
      setTodayInvigilators(uniqueResult || []);
    } catch (error) {}
  };

  useEffect(() => {
    fetchExamSlotToday();
    fetchInvigilatorToday();
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

  const todayInvigilatorColumns = [
    {
      title: "#",
      dataIndex: "no",
      key: "no",
      align: "center",
      width: "10%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "FuID",
      dataIndex: "fuId",
      key: "fuId",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => {
        return `${record.lastName} ${record.firstName}`;
      },
    },

    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
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
              ></Col>
            </Row>
          </div>
          <Divider style={{ margin: "5px 0" }} />
          <div style={{ height: "49%" }}>
            <Row style={{ height: "100%" }}>
              <Col
                span={9}
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "0",
                  overflow: "auto",
                }}
              >
                <h4 style={{ textAlign: "center" }}>Today's Exam Slots</h4>
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
                span={9}
                style={{ backgroundColor: "#f9f9f9", padding: "0" }}
              >
                <h4 style={{ textAlign: "center" }}>Today's Invigilators</h4>
                <Table
                  className="custom-table-today-invigilators"
                  columns={todayInvigilatorColumns}
                  dataSource={todayInvigilators}
                  pagination={false}
                  scroll={{
                    y: 200, // Vertical scrolling if data exceeds 400px in height
                    x: "100%", // Horizontal scrolling for wide tables
                  }}
                />
              </Col>
              <Col
                span={6}
                style={{ backgroundColor: "#f9f9f9", padding: "0" }}
              >
                <h4 style={{ textAlign: "center" }}>Today's Report</h4>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
