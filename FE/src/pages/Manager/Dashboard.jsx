import React, { useState, useEffect } from "react";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";
import {
  Layout,
  Typography,
  Row,
  Col,
  Divider,
  Table,
  Button,
  Empty,
  DatePicker,
} from "antd";
import moment from "moment";
import examSlotApi from "../../services/ExamSlot.js";
import attendanceApi from "../../services/InvigilatorAttendance.js";
import { managerMapperUtil } from "../../utils/Mapper/ManagerMapperUtil.jsx";
import { examTypeTag } from "../../design-systems/CustomTag.jsx";
import { EyeOutlined } from "@ant-design/icons";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const { Content, Sider } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [todayExamSlots, setTodayExamSlots] = useState([]);
  const [todayInvigilators, setTodayInvigilators] = useState([]);
  const [examSlotSummary, setExamSlotSummary] = useState([]);
  const [invigilationSummary, setInvigilationSummary] = useState([]);

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
  const fetchExamSlotSummary = async (startTime, endTime) => {
    try {
      const response = await examSlotApi.getExamSlotsSummary(
        startTime,
        endTime
      );
      const result = managerMapperUtil.mapExamSlotSummary(response);
      // sort by date
      result.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      setExamSlotSummary(result || []);
    } catch (error) {}
  };

  const fetchInvigilationSummary = async (startTime, endTime) => {
    try {
      const response = await examSlotApi.getInvigilatorsSummary(
        startTime,
        endTime
      );
      const result = managerMapperUtil.mapInvigilatorSummary(response);
      // sort by startAt
      result.sort((a, b) => {
        return new Date(a.startAt) - new Date(b.startAt);
      });
      const combinedData = result.map((item) => {
        return {
          ...item,
          exam_slot: `${item.subjectCode} - ${item.examType} 
          (${moment(item.startAt).format(
            "HH:MM"
          )} - ${moment(item.endtAt).format("HH:MM")} ${moment(
            item.startAt
          ).format("DD/MM/YYYY")})`,
        };
      });
      console.log(combinedData);
      setInvigilationSummary(combinedData || []);
    } catch (error) {}
  };
  useEffect(() => {
    fetchExamSlotToday();
    fetchInvigilatorToday();
    // startAt and endAt is a week contains today
    const startTime = moment().startOf("week").toISOString();
    const endTime = moment().endOf("week").toISOString();
    fetchExamSlotSummary(startTime, endTime);
    fetchInvigilationSummary(startTime, endTime);
  }, []);

  const handleDateChangeExamSlots = (selectedDates) => {
    console.log(selectedDates);
    if (selectedDates && selectedDates.length === 2) {
      const startTime = selectedDates[0].startOf("day").toISOString();
      const endTime = selectedDates[1].endOf("day").toISOString();

      fetchExamSlotSummary(startTime, endTime);
    }
  };
  const handleDateChangeInvigilators = (selectedDates) => {
    if (selectedDates && selectedDates.length === 2) {
      const startTime = selectedDates[0].startOf("day").toISOString();
      const endTime = selectedDates[1].endOf("day").toISOString();
      fetchInvigilationSummary(startTime, endTime);
    }
  };
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
      width: "20%",
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
      width: "25%",
    },
  ];
  const formatXAxis = (tickItem) => {
    return moment(tickItem).format("DD/MM/YYYY");
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
                style={{ backgroundColor: "#f0f2f5", padding: "10px" }}
              >
                <RangePicker
                  onChange={handleDateChangeExamSlots}
                  style={{ marginBottom: "5px" }}
                  format={"DD/MM/YYYY"}
                />
                {examSlotSummary.length > 0 ? (
                  <ResponsiveContainer width="100%" height={270}>
                    <BarChart data={examSlotSummary}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatXAxis} />
                      <YAxis dataKey="total" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" fill="#8884d8" />
                      <text
                        x="50%" // Adjust x position based on your chart width
                        y={20} // Adjust y position for desired height from the top
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={14}
                        fontWeight="bold"
                      >
                        Exam Slots Summary
                      </text>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty />
                )}
              </Col>
              <Col
                span={12}
                style={{ backgroundColor: "#e6f7ff", padding: "10px" }}
              >
                <RangePicker
                  onChange={handleDateChangeInvigilators}
                  style={{ marginBottom: "5px" }}
                  format={"DD/MM/YYYY"}
                />
                <ResponsiveContainer width="100%" height={270}>
                  <LineChart data={invigilationSummary}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="exam_slot" hide={true} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="registered"
                      stroke="#8884d8"
                      name="Registered"
                    />
                    <Line
                      type="monotone"
                      dataKey="assigned"
                      stroke="#82ca9d"
                      name="Assigned"
                    />
                    <text
                      x="50%" // Adjust x position based on your chart width
                      y={20} // Adjust y position for desired height from the top
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={14}
                      fontWeight="bold"
                    >
                      Invigilation Summary
                    </text>
                  </LineChart>
                </ResponsiveContainer>
              </Col>
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
                }}
              >
                <h4 className="today-exam-slots-title">Today's Exam Slots</h4>
                {todayExamSlots.length > 0 ? (
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
                ) : (
                  <Empty />
                )}
              </Col>
              <Col
                span={9}
                style={{ backgroundColor: "#f9f9f9", padding: "0" }}
              >
                <h4 className="today-invigilators-title">
                  Today's Invigilators
                </h4>
                {todayInvigilators.length > 0 ? (
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
                ) : (
                  <Empty />
                )}
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
