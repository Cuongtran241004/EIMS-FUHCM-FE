import React, { useState, useEffect, useContext } from "react";
import Header from "../../components/Header/Header.jsx";
import {
  Table,
  Spin,
  message,
  Layout,
  Space,
  Dropdown,
  Button,
  Form,
  Select,
  DatePicker,
  Calendar,
  theme,
  Modal,
} from "antd";
import examSlotApi from "../../services/ExamSlot.js";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import {
  BackwardOutlined,
  CloseOutlined,
  DownOutlined,
  EyeOutlined,
  ForwardOutlined,
} from "@ant-design/icons";
const { Content, Sider } = Layout;
import { selectButtonStyle } from "../../design-systems/CSS/Button.js";
import { titleStyle } from "../../design-systems/CSS/Title.js";
import "./CustomForm.css";
import { staffMapperUtil } from "../../utils/Mapper/StaffMapperUtil.jsx";
import moment from "moment";
import dayjs from "dayjs"; // Import dayjs
import attendanceApi from "../../services/InvigilatorAttendance.js";
import {
  examScheduleTag,
  examTypeTag,
} from "../../design-systems/CustomTag.jsx";
const Attendance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    selectedSemester,
    setSelectedSemester,
    semesters,
    availableSemesters,
  } = useSemester(); // Access shared semester state
  const [form] = Form.useForm();
  const [availableAttendance, setAvailableAttendance] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [today, setToday] = useState(dayjs()); // Use dayjs instead of Date
  const [selectedDate, setSelectedDate] = useState(
    dayjs(selectedSemester.startAt)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Fetch exam schedule data
  const fetchExamSlot = async () => {
    setLoading(true);
    try {
      // Define today's date at the start of the day (using currentDate)
      const date = selectedDate.format("YYYY-MM-DD");

      const response = await attendanceApi.getExamSlotByDate(date);
      const result = staffMapperUtil.mapExamSchedule(response);

      setData(result || []);
    } catch (error) {
      message.error("Failed to fetch exam schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSemester?.id) {
      fetchExamSlot();
    }
  }, [selectedSemester, selectedDate]);

  // Handle semester selection change
  const handleMenuClick = (e) => {
    const selected = semesters.find((semester) => semester.id == e.key);
    if (selected) {
      setSelectedSemester({
        id: selected.id,
        name: selected.name,
        startAt: selected.startAt,
        endAt: selected.endAt,
      });
    }
    if (
      dayjs(selected.startAt).isBefore(today) &&
      dayjs(today).isBefore(selected.endAt)
    ) {
      setSelectedDate(dayjs(today));
    } else {
      setSelectedDate(dayjs(selected.startAt));
    }
  };
  const getHistoryAttendance = async () => {
    setLoading(true);
    try {
      const today = moment().startOf("day"); // Get today's date without time

      // Filter attendance for dates before today
      const history = allAttendance.filter((item) => {
        return moment(item.startAt).isBefore(today);
      });

      // Sort by `startAt` in descending order (most recent first)
      history.sort((a, b) => {
        return moment(b.startAt).diff(moment(a.startAt));
      });

      setData(history || []);
    } catch (error) {
      message.error("Failed to fetch history attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (examSlotId) => {
    setLoading(true);
    try {
      // Assign invigilators
      const response =
        await attendanceApi.getAttendanceByExamSlotId(examSlotId);
      console.log(response);
      const result = staffMapperUtil.mapAttendance(response);
      setAttendance(result || []);
      setModalVisible(true);
    } catch (error) {
      message.error("Failed to assign invigilators.");
    } finally {
      setLoading(false);
    }
  };
  const handleCheckOut = () => {
    // Handle check-out action
  };
  // Define columns for the Table
  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Code",
      dataIndex: "subjectCode",
      key: "subjectCode",
      align: "center",
    },
    {
      title: "Exam Type",
      dataIndex: "examType",
      key: "examType",
      align: "center",
      render: (text) => examTypeTag(text),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
      render: (text, record) => moment(record.startAt).format("DD/MM/YYYY"),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      align: "center",
      render: (text, record) => {
        const startTime = moment(record.startAt).format("HH:mm");
        const endTime = moment(record.endAt).format("HH:mm");
        return `${startTime} - ${endTime}`;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      width: "20%",
      render: (text, record) => (
        <Space size="small">
          <Button
            type="text"
            style={{ backgroundColor: "#43AA8B", color: "#fff" }}
            size="middle"
            onClick={() => handleCheckIn(record.id)}
          >
            Check-in
          </Button>
          <Button
            type="link"
            size="middle"
            style={{ backgroundColor: "#F9844A", color: "#fff" }}
            onClick={() => handleCheckOut(record.id)}
          >
            Check-out
          </Button>
        </Space>
      ),
    },
    // Add more columns as necessary
  ];
  const attendanceColumns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "FuId",
      dataIndex: "fuId",
      key: "fuId",
      align: "center",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => `${record.lastName} ${record.firstName} `,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      // checkbox to mark attendance
      render: (text, record) => (
        <Form.Item name="attendance" valuePropName="checked">
          <input type="checkbox" />
        </Form.Item>
      ),
    },
  ];
  const { token } = theme.useToken();
  const wrapperStyle = {
    width: 280,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    marginTop: "20px",
  };
  const handleClear = () => {
    setSelectedDate(today); // Clear the selected date
    // view available attendance
    setData(availableAttendance);
  };

  const onNextMonth = () => {
    setSelectedDate(null); // Set selectedDate to null
    setSelectedDate(selectedDate.add(1, "month")); // Use dayjs to add a month
  };

  const onPrevMonth = () => {
    setSelectedDate(null); // Set selectedDate to null
    setSelectedDate(selectedDate.subtract(1, "month")); // Use dayjs to subtract a month
  };
  // Function to handle date selection
  const onDateSelect = (date) => {
    setSelectedDate(date); // Set the selected date
  };
  const onPanelChange = () => {
    setSelectedDate(null); // Update the selected date
    setToday(dayjs()); // Update the current date
  };
  // Custom header rendering
  const headerRender = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px",
        }}
      >
        <Button onClick={onPrevMonth}>
          <BackwardOutlined />
        </Button>
        <span style={{ alignSelf: "center", fontWeight: "bold" }}>
          {selectedDate.format("MMMM YYYY")} {/* Format the date using dayjs */}
        </span>
        <Button onClick={onNextMonth}>
          <ForwardOutlined />
        </Button>
      </div>
    );
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        {/* Sider for Form */}
        <Sider
          width={300}
          style={{
            background: "#4D908E",
            padding: "10px",
            boxShadow: "3px 0 5px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Button
            onClick={getHistoryAttendance}
            style={{
              width: "100%",
              backgroundColor: "#90BE6D",
              color: "#fff",
              borderColor: "#90BE6D",
            }}
          >
            History Attendance
            <EyeOutlined />
          </Button>
          <div style={wrapperStyle}>
            <Calendar
              value={selectedDate} // Use selected date or current date
              headerRender={headerRender} // Use custom header
              onPanelChange={onPanelChange} // Update the current date if needed
              fullscreen={false} // Render the calendar without fullscreen
              onSelect={onDateSelect} // Handle date selection
              // change startAt to dayjs
              validRange={[
                dayjs(selectedSemester.startAt),
                dayjs(selectedSemester.endAt),
              ]} // Set the valid date
            />
          </div>

          <Button
            style={{ float: "right", marginTop: "10px" }}
            danger
            type="dashed"
            onClick={handleClear}
          >
            Clear
            <CloseOutlined />
          </Button>
        </Sider>

        {/* Content for Table */}
        <Content style={{ padding: 12, margin: 0, background: "#fff" }}>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h2 style={titleStyle}>Attendance Management</h2>
          </div>
          <div>
            <Dropdown
              menu={{
                items: semesters.map((sem) => ({
                  key: sem.id,
                  label: sem.name,
                })),
                onClick: handleMenuClick,
              }}
            >
              <Button style={{ ...selectButtonStyle, width: "150px" }}>
                <Space>
                  {selectedSemester?.name || "Select Semester"}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>

          <Spin spinning={loading}>
            <Table
              dataSource={data}
              columns={columns}
              rowKey={(record) => record.id}
              pagination={{
                pageSize,
                current: currentPage,
                onChange: (page) => setCurrentPage(page),
              }}
            />
            <Modal
              title="Check Attendance"
              open={modalVisible}
              onCancel={() => setModalVisible(false)}
              footer={null}
            >
              <Table
                columns={attendanceColumns}
                dataSource={attendance} // Use the selected assignment data
                pagination={false} // Disable pagination for simplicity
                rowKey="id" // Ensure each row has a unique key
              />
              <Space>
                <Button danger>Return</Button>
                <Button>Save</Button>
              </Space>
            </Modal>
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Attendance;
