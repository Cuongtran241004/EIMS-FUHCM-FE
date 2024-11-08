import React, { useState, useEffect } from "react";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";
import {
  Layout,
  Spin,
  Row,
  Col,
  Divider,
  Table,
  Button,
  Empty,
  DatePicker,
  Modal,
  message,
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
import examSlotRoomApi from "../../services/ExamSlotRoom.js";

const { Content, Sider } = Layout;
const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [todayExamSlots, setTodayExamSlots] = useState([]);
  const [todayInvigilators, setTodayInvigilators] = useState([]);
  const [examSlotSummary, setExamSlotSummary] = useState([]);
  const [invigilationSummary, setInvigilationSummary] = useState([]);
  const [todayRooms, setTodayRooms] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roomLoading, setRoomLoading] = useState(false);
  const [invigilationLoading, setInvigilationLoading] = useState(false);
  const [examSlotLoading, setExamSlotLoading] = useState(false);
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
    } catch (error) {
      message.error("Failed to fetch today's exam slots");
    }
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
    } catch (error) {
      message.error("Failed to fetch today's invigilators");
    }
  };

  const fetchExamSlotSummary = async (startTime, endTime) => {
    setExamSlotLoading(true);
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
    } catch (error) {
      message.error("Failed to fetch exam slot summary");
    } finally {
      setExamSlotLoading(false);
    }
  };

  const fetchInvigilationSummary = async (startTime, endTime) => {
    setInvigilationLoading(true);
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
          )} - ${moment(item.endAt).format("HH:MM")} ${moment(
            item.startAt
          ).format("DD/MM/YYYY")})`,
        };
      });

      setInvigilationSummary(combinedData || []);
    } catch (error) {
      message.error("Failed to fetch invigilation summary");
    } finally {
      setInvigilationLoading(false);
    }
  };

  const fetchRoomTodayByExamSlotId = async (examSlotId) => {
    setTodayRooms([]);
    setRoomLoading(true);
    try {
      // Fetch exam slot today
      const response =
        await examSlotRoomApi.getRoomTodayByExamSlotId(examSlotId);
      setTodayRooms(response || []);
    } catch (error) {
      message.error("Failed to fetch today's rooms");
    } finally {
      setRoomLoading(false);
    }
  };
  useEffect(() => {
    fetchExamSlotToday();
    fetchInvigilatorToday();
    // startAt and endAt is a week contains today
    const startTime = moment().startOf("month").toISOString();
    const endTime = moment().endOf("month").toISOString();
    fetchExamSlotSummary(startTime, endTime);
    fetchInvigilationSummary(startTime, endTime);
  }, []);

  const handleDateChange = (selectedDates) => {
    if (selectedDates && selectedDates.length === 2) {
      const startTime = selectedDates[0].startOf("day").toISOString();
      const endTime = selectedDates[1].endOf("day").toISOString();
      setExamSlotSummary([]);
      setInvigilationSummary([]);
      fetchExamSlotSummary(startTime, endTime);
      fetchInvigilationSummary(startTime, endTime);
    }
  };

  const handleTodayRoomDetails = (record) => {
    fetchRoomTodayByExamSlotId(record.examSlotId);
    setIsModalVisible(true);
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
          <Button
            type="link"
            size="small"
            onClick={() => handleTodayRoomDetails(record)}
          >
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <RangePicker
                onChange={handleDateChange}
                style={{ margin: "2px auto", width: "30%" }} // Set the width to control the RangePicker's size
                format={"DD/MM/YYYY"}
                defaultValue={[
                  moment().startOf("month"),
                  moment().endOf("month"),
                ]}
              />
            </div>

            <Row style={{ height: "100%" }}>
              <Col
                span={12}
                style={{ backgroundColor: "#f0f2f5", padding: "5px" }}
              >
                <p style={{ padding: "0", margin: "0", textAlign: "center" }}>
                  <strong>Exam Slots Summary</strong>
                </p>
                {examSlotLoading ? (
                  <Spin
                    size="large"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "50%",
                    }}
                  />
                ) : examSlotSummary.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={examSlotSummary}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatXAxis} />
                      <YAxis dataKey="total" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </Col>
              {/* RangePicker between the two columns */}

              <Col
                span={12}
                style={{ backgroundColor: "#e6f7ff", padding: "5px" }}
              >
                <p style={{ padding: "0", margin: "0", textAlign: "center" }}>
                  <strong> Invigilation Summary</strong>
                </p>
                {invigilationLoading ? (
                  <Spin
                    size="large"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "50%",
                    }}
                  />
                ) : invigilationSummary.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
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
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </Col>
            </Row>
          </div>
          <Divider style={{ margin: "5px 0" }} />
          <div style={{ height: "49%" }}>
            <Row style={{ height: "100%" }}>
              <Col
                span={12}
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
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </Col>
              <Col
                span={12}
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
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </Col>
              {/* <Col
                span={6}
                style={{ backgroundColor: "#f9f9f9", padding: "0" }}
              >
                <h4 style={{ textAlign: "center" }}>Today's Report</h4>
              </Col> */}
            </Row>
          </div>
          <Modal
            title="Today Rooms Details"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setIsModalVisible(false)}>
                Close
              </Button>,
            ]}
            loading={roomLoading}
          >
            {todayRooms.length > 0 ? (
              todayRooms.map((room) => (
                <span key={room} style={{ marginRight: "1em" }}>
                  {room}
                </span>
              ))
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
