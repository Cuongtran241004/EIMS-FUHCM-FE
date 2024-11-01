import React, { useState, useEffect } from "react";
import { Layout, Popconfirm, message } from "antd";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";
import {
  Dropdown,
  Button,
  Space,
  Table,
  Spin,
  DatePicker,
  Modal,
  Checkbox,
  Input,
} from "antd";
import {
  CloseOutlined,
  DownOutlined,
  EditFilled,
  EyeOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import dayjs from "dayjs";
import moment from "moment";
import { titleStyle } from "../../design-systems/CSS/Title.js";
import { selectButtonStyle } from "../../design-systems/CSS/Button.js";
import attendanceApi from "../../services/InvigilatorAttendance.js";
import { managerMapperUtil } from "../../utils/Mapper/ManagerMapperUtil.jsx";
import {
  attendanceStatusTag,
  examTypeTag,
} from "../../design-systems/CustomTag.jsx";
import "./AttendanceCheck.css";
const { Content, Sider } = Layout;
const AttendanceCheck = () => {
  const [attendances, setAttendances] = useState([]);
  const [examSlots, setExamSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editableRowId, setEditableRowId] = useState(null);
  const [filteredExamSlots, setFilteredExamSlots] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { selectedSemester, setSelectedSemester, semesters } = useSemester(); // Access shared semester state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const fetchData = async (semesterId) => {
    setLoading(true);
    try {
      const response =
        await attendanceApi.getExamSlotBySemesterIdManager(semesterId);
      const result = managerMapperUtil.mapExamSlotforAttendance(response);

      // sort by startAt
      result.sort((a, b) => new Date(a.startAt) - new Date(b.startAt));

      setExamSlots(result || []);
      setFilteredExamSlots(result || []);
    } catch (error) {
      // Handle error
      message.error("Failed to fetch attendance data");
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
      setFilteredExamSlots(result || []);
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

  const handleSearch = (event) => {
    const { value } = event.target;
    const filtered = examSlots.filter((examSlot) =>
      `${examSlot.subjectCode}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredExamSlots(filtered); // Update the filtered data displayed in the table
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setAttendances([]);
  };
  const handleCheckInChange = (e, record) => {
    const updatedAttendances = attendances.map((item) =>
      item.fuId === record.fuId ? { ...item, checkIn: e.target.checked } : item
    );
    setAttendances(updatedAttendances);
  };

  const handleCheckOutChange = (e, record) => {
    const updatedAttendances = attendances.map((item) =>
      item.fuId === record.fuId ? { ...item, checkOut: e.target.checked } : item
    );
    setAttendances(updatedAttendances);
  };

  const showListAttendance = async (examSlotId) => {
    setIsModalVisible(true);
    setListLoading(true);
    try {
      const response =
        await attendanceApi.getAttendanceByExamSlotIdManager(examSlotId);
      console.log(response);
      const result = managerMapperUtil.mapAttendanceList(response);
      setAttendances(result || []);
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
  const toggleEditMode = (record) => {
    // If the row is already being edited, save changes and exit edit mode
    if (editableRowId === record.id) {
      setEditableRowId(null);
      // Optionally save changes here
    } else {
      setEditableRowId(record.id); // Set this row to edit mode
    }
  };

  const handleSaveAttendance = async (record) => {
    try {
      const updateAttendance = {
        id: record.id,
        checkIn: record.checkIn ? true : false,
        checkOut: record.checkOut ? true : false,
      };
      await attendanceApi.updateAttendanceByManager(updateAttendance);
      message.success("Attendance updated successfully");
    } catch (error) {
      // Handle error
      message.error("Failed to update attendance");
    } finally {
      setIsEditing(false);
    }
  };
  const handleConfirmAttendance = async (record) => {
    try {
      console.log(record.examSlotId);
      await attendanceApi.updateConfirmAttendanceByManager(record.examSlotId);
      message.success("Attendance confirmed successfully");
    } catch (error) {
      // Handle error
      message.error("Failed to confirm attendance");
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
      width: "15%",
      align: "center",
      render: (text, record) => moment(record.startAt).format("DD/MM/YYYY"),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: "15%",
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
      width: "15%",
      align: "center",
      // a button to show the list of invigilators
      render: (text, record) => (
        <Button
          type="link"
          size="middle"
          onClick={() => showListAttendance(record.examSlotId)}
          style={{ color: "#4D908E" }}
        >
          <strong>
            <EyeOutlined />
          </strong>
        </Button>
      ),
    },
    {
      title: "Check Attendance By",
      dataIndex: "checkAttendanceBy",
      key: "checkAttendanceBy",
      align: "center",
      render: (text, record) =>
        `${record.updatedByLastName} ${record.updatedByFirstName}`,
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to confirm this attendance?"
            onConfirm={() => handleConfirmAttendance(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" style={{ color: "#F3722C" }}>
              Confirm
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const columnsAttendance = [
    {
      title: "FUID",
      dataIndex: "fuId",
      key: "fuId",
      align: "center",
      width: "10%",
    },
    {
      title: "Invigilator Name",
      dataIndex: "invigilatorName",
      key: "invigilatorName",
      width: "30%",
      render: (text, record) => `${record.lastName} ${record.firstName}`,
    },

    {
      title: "Check In",
      dataIndex: "checkIn",
      key: "checkIn",
      align: "center",
      width: "10%",
      render: (text, record) => {
        if (record.checkIn !== null) {
          return (
            <Checkbox
              checked={record.checkIn}
              disabled={editableRowId !== record.id} // Only allow editing if this row is being edited
              onChange={(e) => handleCheckInChange(e, record)}
            />
          );
        }
        return (
          <Checkbox
            disabled={editableRowId !== record.id} // Only allow editing if this row is being edited
            onChange={(e) => handleCheckInChange(e, record)}
          />
        );
      },
    },
    {
      title: "Check Out",
      dataIndex: "checkOut",
      key: "checkOut",
      align: "center",
      width: "10%",
      render: (text, record) => {
        if (record.checkOut !== null) {
          return (
            <Checkbox
              style={{ margin: "0", padding: "0" }}
              checked={record.checkOut}
              disabled={editableRowId !== record.id} // Only allow editing if this row is being edited
              onChange={(e) => handleCheckOutChange(e, record)}
            />
          );
        }
        return (
          <Checkbox
            style={{ margin: "0", padding: "0" }}
            disabled={editableRowId !== record.id} // Only allow editing if this row is being edited
            onChange={(e) => handleCheckOutChange(e, record)}
          />
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => attendanceStatusTag(record.status),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      width: "10%",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => toggleEditMode(record)} // Pass the current row to toggle edit mode
        >
          {editableRowId === record.id ? (
            <Button type="link" style={{ color: "#F9844A" }}>
              <SaveOutlined onClick={() => handleSaveAttendance(record)} />
            </Button>
          ) : (
            <Button type="link" style={{ color: "#4D908E" }}>
              <EditFilled />
            </Button>
          )}
        </Button>
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

              <Input
                placeholder="Search by subject code"
                onChange={handleSearch}
                allowClear
                suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
                style={{
                  width: 250,
                  marginLeft: "20px",
                  marginBottom: "10px",
                }}
              />
            </Space>
          </div>

          <Spin spinning={loading}>
            <Table
              className="custom-table-attendance"
              dataSource={filteredExamSlots} // Add a key property to each request object
              columns={columns}
              pagination={{ pageSize }}
            />
          </Spin>
        </Content>
        <Modal
          title="Attendance List"
          open={isModalVisible}
          onCancel={handleCancel}
          width={650} // Adjust width as needed
          footer={[
            <Button key="back" danger onClick={handleCancel}>
              <CloseOutlined />
              Close
            </Button>,
          ]}
          bodyProps={{ maxHeight: "500px", overflowY: "auto" }} // Set custom height for content
          loading={listLoading}
        >
          <Table
            className="custom-table-attendance-list"
            dataSource={attendances}
            columns={columnsAttendance}
            pagination={{ pageSize: 8 }}
          />
        </Modal>
      </Layout>
    </Layout>
  );
};

export default AttendanceCheck;
