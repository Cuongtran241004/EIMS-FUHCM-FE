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
  const [allAttendance, setAllAttendance] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Fetch exam schedule data
  const fetchExamSchedule = async (term) => {
    setLoading(true);
    try {
      const response = await examSlotApi.getExamSlotBySemesterId(term);
      const result = staffMapperUtil.mapExamSchedule(response);
      setAllAttendance(result || []);

      // Define today's date at the start of the day (without time)
      const today = moment().startOf("day");

      // Filter for available exam slots where startAt is today or in the future
      const available = result.filter((item) => {
        return moment(item.startAt).isSameOrAfter(today);
      });

      // Sort available exam slots by startAt in ascending order
      available.sort((a, b) => {
        return moment(a.startAt).diff(moment(b.startAt));
      });

      setAvailableAttendance(available || []);
      setData(available || []);
    } catch (error) {
      message.error("Failed to fetch exam schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSemester?.id) {
      fetchExamSchedule(selectedSemester.id);
    }
  }, [selectedSemester]);

  // Handle semester selection change
  const handleMenuClick = (e) => {
    const selected = semesters.find((semester) => semester.id == e.key);

    if (selected) {
      setSelectedSemester({
        id: selected.id,
        name: selected.name,
      });
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
          >
            Check-in
          </Button>
          <Button
            type="link"
            size="middle"
            style={{ backgroundColor: "#F9844A", color: "#fff" }}
          >
            Check-out
          </Button>
        </Space>
      ),
    },
    // Add more columns as necessary
  ];
  const { token } = theme.useToken();
  const wrapperStyle = {
    width: 280,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    marginTop: "20px",
  };
  const handleClear = () => {
    setSelectedDate(currentDate); // Clear the selected date
    // view available attendance
    setData(availableAttendance);
  };
  const [currentDate, setCurrentDate] = useState(dayjs()); // Use dayjs instead of Date
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const onNextMonth = () => {
    setSelectedDate(selectedDate.add(1, "month")); // Use dayjs to add a month
  };

  const onPrevMonth = () => {
    setSelectedDate(selectedDate.subtract(1, "month")); // Use dayjs to subtract a month
  };
  // Function to handle date selection
  const onDateSelect = (date) => {
    setSelectedDate(date); // Set the selected date
    console.log(date);
  };
  const onPanelChange = () => {
    setSelectedDate(null); // Update the selected date
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
              value={selectedDate || currentDate} // Use selected date or current date
              headerRender={headerRender} // Use custom header
              onPanelChange={onPanelChange} // Update the current date if needed
              fullscreen={false} // Render the calendar without fullscreen
              onSelect={onDateSelect} // Handle date selection
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
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Attendance;
