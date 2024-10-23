import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";
import { Dropdown, Button, Space, Table, Spin, DatePicker } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import dayjs from "dayjs";
import moment from "moment";
import { titleStyle } from "../../design-systems/CSS/Title.js";
import { selectButtonStyle } from "../../design-systems/CSS/Button.js";
import attendanceApi from "../../services/InvigilatorAttendance.js";
import { managerMapperUtil } from "../../utils/Mapper/ManagerMapperUtil.jsx";
import { examTypeTag } from "../../design-systems/CustomTag.jsx";
import "./AttendanceCheck.css";
const { Content, Sider } = Layout;
const AttendanceCheck = () => {
  const [attendances, setAttendances] = useState([]);
  const [examSlots, setExamSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const { selectedSemester, setSelectedSemester, semesters } = useSemester(); // Access shared semester state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const fetchData = async (semesterId) => {
    setLoading(true);
    try {
      const response =
        await attendanceApi.getExamSlotBySemesterIdManager(semesterId);

      const result = managerMapperUtil.mapExamSlotforAttendance(response);
      setExamSlots(result || []);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const fetchExamSlotByDate = async (date) => {
    setLoading(true);
    try {
      const response = await attendanceApi.getExamSlotByDateManager(date);
      const result = managerMapperUtil.mapExamSlotforAttendance(response);
      setExamSlots(result || []);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSemester.id) {
      fetchData(selectedSemester.id);
    }
  }, [selectedSemester]);

  const items = semesters.map((semester) => ({
    key: semester.id,
    label: semester.name,
  }));

  const handleMenuClick = (e) => {
    const selected = items.find((item) => item.key == e.key);
    if (selected) {
      setSelectedSemester({
        id: selected.key,
        name: selected.label,
      });
    }
  };

  const showListAttendance = async (examSlotId) => {
    setListLoading(true);
    try {
      const response =
        await attendanceApi.getAttendanceByExamSlotIdManager(examSlotId);
      setAttendances(response || []);
    } catch (error) {
      // Handle error
    } finally {
      setListLoading(false);
    }
  };

  const onchangeSelectedDate = (date) => {
    if (date) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      fetchExamSlotByDate(formattedDate); // Pass the formatted date directly
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Subject Code",
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
      render: (text, record) =>
        `${moment(record.startAt).format("HH:mm")} - ${moment(
          record.endAt
        ).format("HH:mm")}`,
    },
    {
      title: "Invigilator List",
      dataIndex: "invigilatorList",
      key: "invigilatorList",
      align: "center",
      // a button to show the list of invigilators
      render: (text, record) => (
        <Button
          type="link"
          loading={listLoading}
          onClick={() => showListAttendance(record.id)}
        >
          Show
        </Button>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary">Approve</Button>
        </Space>
      ),
    },
  ];
  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        <Sider width={256} style={{ backgroundColor: "#4D908E" }}>
          <NavBar_Manager />
        </Sider>
        <Content style={{ padding: 12, margin: 0, background: "#fff" }}>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h2 style={titleStyle}> Attendance Check</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Space>
              <Dropdown
                menu={{
                  items,
                  onClick: handleMenuClick,
                }}
              >
                <Button style={{ width: "150px", ...selectButtonStyle }}>
                  <Space>
                    {selectedSemester.name}
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
              <DatePicker
                onChange={onchangeSelectedDate}
                style={{ marginBottom: "10px" }}
                format={"DD/MM/YYYY"}
              />
            </Space>
          </div>

          <Spin spinning={loading}>
            <Table
              className="custom-table-attendance"
              dataSource={examSlots} // Add a key property to each request object
              columns={columns}
              pagination={{ pageSize }}
            />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AttendanceCheck;
