import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  message,
  Table,
  Spin,
  Space,
  Dropdown,
  Modal,
} from "antd";
import {
  titleAssignmentStyle,
  titleStyle,
} from "../../design-systems/CSS/Title";
import { PlusCircleOutlined, DownOutlined } from "@ant-design/icons";
import invigilatorAssignmentApi from "../../services/InvigilatorAssignment";
import examSlotApi from "../../services/ExamSlot";
import { staffMapperUtil } from "../../utils/Mapper/StaffMapperUtil";
import moment from "moment";
import Header from "../../components/Header/Header.jsx";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import { selectButtonStyle } from "../../design-systems/CSS/Button.js";
import { FETCH_EXAM_SCHEDULE_FAILED } from "../../configs/messages";

const { Content } = Layout;

const AssignmentInvigilator = () => {
  const [examSchedule, setExamSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAssignment, setSelectedAssignment] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedSemester, setSelectedSemester, semesters } = useSemester(); // Access shared semester state
  const pageSize = 7;

  const fetchExamSchedule = async (semesterId, page) => {
    setLoading(true);
    try {
      const response = await examSlotApi.getExamSlotBySemesterId(
        semesterId,
        page
      );
      const mapResponse = staffMapperUtil.mapExamSchedule(response);

      const result = mapResponse.filter((item) => item.status === "APPROVED");
      result.sort((a, b) => {
        return (
          moment(a.startAt).format("YYYYMMDDHHmm") -
          moment(b.startAt).format("YYYYMMDDHHmm")
        );
      });

      setExamSchedule(result || []);
    } catch (error) {
      console.error("Error fetching exam schedule:", error);
      message.error(FETCH_EXAM_SCHEDULE_FAILED);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSemester) {
      fetchExamSchedule(selectedSemester.id, currentPage);
    }
  }, [selectedSemester, currentPage]);

  const fetchInvigilatorAssignment = async (examSlotId) => {
    const response =
      await invigilatorAssignmentApi.getAllAssignmentByExamSlotId(examSlotId);
    return staffMapperUtil.mapAssignment(response);
  };

  const handleAssignmentClick = async (examSlotId) => {
    setLoading(true);
    try {
      // Assign invigilators
      const assignmentResult = await fetchInvigilatorAssignment(examSlotId);
      // Here, you can implement the logic to assign invigilators
      // For demonstration, let's assume assignment was successful and set the selected assignment
      setSelectedAssignment(assignmentResult);
      setModalVisible(true);
    } catch (error) {
      message.error("Failed to assign invigilators.");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (e) => {
    const selected = semesters.find((semester) => semester.id == e.key);
    if (selected) {
      setSelectedSemester({
        id: selected.id,
        name: selected.name,
      });
    }
  };

  const columns = [
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
    },
    {
      title: "Date (DD-MM-YYYY)",
      dataIndex: "startAt",
      key: "date",
      align: "center",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Time",
      key: "time",
      align: "center",
      render: (text, record) => {
        const startTime = new Date(record.startAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTime = new Date(record.endAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${startTime} - ${endTime}`;
      },
    },
    {
      title: "Invigilator",
      key: "invigilator",
      align: "center",
      render: (text, record) => (
        <Button type="text" onClick={() => handleAssignmentClick(record.id)}>
          <PlusCircleOutlined style={{ fontSize: "20px", color: "#43AA8B" }} />
        </Button>
      ),
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    // },
  ];

  const assignmentColumns = [
    {
      title: "Room Name",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Room Invigilator",
      key: "roomInvigilator",
      render: (text, record) => (
        <span>{`${record.roomLastName} ${record.roomFirstName}`}</span>
      ),
    },
    {
      title: "Hall Invigilator",
      key: "hallInvigilator",
      render: (text, record) => (
        <span>{`${record.hallLastName} ${record.hallFirstName}`}</span>
      ),
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout style={{ backgroundColor: "#fff" }}>
        <Spin spinning={loading}>
          <Content style={{ padding: "0 50px" }}>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <h2 style={titleStyle}>ASSIGNMENT INVIGILATORS</h2>
            </div>
            <Dropdown
              menu={{
                items: semesters.map((sem) => ({
                  key: sem.id,
                  label: sem.name,
                })),
                onClick: handleMenuClick,
              }}
            >
              <Button style={{ width: "150px", ...selectButtonStyle }}>
                {selectedSemester?.name || "Select Semester"}
                <DownOutlined />
              </Button>
            </Dropdown>
            <Table
              columns={columns}
              dataSource={examSchedule}
              pagination={{
                pageSize: pageSize,
                current: currentPage,
                onChange: (page) => setCurrentPage(page),
              }}
            />
            <Modal
              title="Invigilator Assignment Details"
              open={modalVisible}
              onCancel={() => setModalVisible(false)}
              footer={null}
            >
              <Table
                columns={assignmentColumns}
                dataSource={selectedAssignment} // Use the selected assignment data
                pagination={false} // Disable pagination for simplicity
                rowKey="id" // Ensure each row has a unique key
              />
            </Modal>
          </Content>
        </Spin>
      </Layout>
    </Layout>
  );
};

export default AssignmentInvigilator;
