import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  message,
  Table,
  Spin,
  Input,
  Dropdown,
  Modal,
} from "antd";
import {
  titleAssignmentStyle,
  titleStyle,
} from "../../design-systems/CSS/Title";
import {
  PlusCircleOutlined,
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import invigilatorAssignmentApi from "../../services/InvigilatorAssignment";
import examSlotApi from "../../services/ExamSlot";
import { staffMapperUtil } from "../../utils/Mapper/StaffMapperUtil";
import moment from "moment";
import Header from "../../components/Header/Header.jsx";
import { useSemester } from "../../components/Context/SemesterContextStaff.jsx";
import { selectButtonStyle } from "../../design-systems/CSS/Button.js";
import { FETCH_EXAM_SCHEDULE_FAILED } from "../../configs/messages";
import { assignmentTag } from "../../design-systems/CustomTag.jsx";
import { examTypeTag } from "../../design-systems/CustomTag.jsx";
import {
  alreadyAssignmentNotification,
  assignmentNotification,
} from "../../design-systems/CustomNotification.jsx";
const { Content } = Layout;

const AssignmentInvigilator = () => {
  const [examSchedule, setExamSchedule] = useState([]);
  const [filteredExamSchedule, setFilteredExamSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAssignment, setSelectedAssignment] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedSemester, setSelectedSemester, semesters } = useSemester(); // Access shared semester state
  const pageSize = 6;

  const fetchExamSchedule = async (semesterId, page) => {
    setLoading(true);
    try {
      const response =
        await invigilatorAssignmentApi.getExamSlotWithStatus(semesterId);

      const mapResponse = staffMapperUtil.mapExamSlotWithStatus(response);

      const result = mapResponse.sort((a, b) => {
        const statusPriority = { UNASSIGNED: 1, ASSIGNED: 2 };

        // Compare status first
        if (statusPriority[a.status] !== statusPriority[b.status]) {
          return statusPriority[a.status] - statusPriority[b.status];
        }

        // If statuses are the same, compare by date
        return moment(a.startAt).valueOf() - moment(b.startAt).valueOf();
      });

      setExamSchedule(result || []);
      setFilteredExamSchedule(result || []);
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
  }, [selectedSemester]);

  const fetchInvigilatorAssignment = async (examSlotId) => {
    const response =
      await invigilatorAssignmentApi.getAllAssignmentByExamSlotId(examSlotId);
    return staffMapperUtil.mapAssignment(response);
  };

  const handleAssignmentClick = async (record) => {
    if (record.status === "ASSIGNED") {
      alreadyAssignmentNotification();
      return;
    }
    // getAssignmentById from examSchedule
    const examSlot = examSchedule.find((slot) => slot.id === record.id);

    if (examSlot.requiredInvigilators <= examSlot.numberOfRegistered) {
      setLoading(true);
      try {
        // Assign invigilators
        const assignmentResult = await fetchInvigilatorAssignment(record.id);
        // Here, you can implement the logic to assign invigilators
        // For demonstration, let's assume assignment was successful and set the selected assignment
        setSelectedAssignment(assignmentResult);
        setModalVisible(true);
      } catch (error) {
        message.error("Failed to assign invigilators.");
      } finally {
        setLoading(false);
        fetchExamSchedule(selectedSemester.id);
      }
    } else {
      assignmentNotification();
    }
  };
  const handleSearch = (event) => {
    const { value } = event.target;
    const filtered = examSchedule.filter((subject) =>
      `${subject.subjectCode}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredExamSchedule(filtered); // Update the filtered data displayed in the table
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
      render: (text) => examTypeTag(text),
    },
    {
      title: "Date",
      dataIndex: "startAt",
      key: "date",
      align: "center",
      render: (text) => moment(text).format("DD/MM/YYYY"),
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
      title: "Registration",
      dataIndex: "registration",
      key: "registration",
      align: "center",
      render: (text, record) =>
        ` ${record.numberOfRegistered}/${record.requiredInvigilators}`,
    },
    {
      title: "Invigilator",
      key: "invigilator",
      align: "center",
      render: (text, record) => (
        <Button type="text" onClick={() => handleAssignmentClick(record)}>
          <PlusCircleOutlined style={{ fontSize: "20px", color: "#43AA8B" }} />
        </Button>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => assignmentTag(text),
    },
  ];

  const assignmentColumns = [
    {
      title: "Room Name",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "FuId Room",
      dataIndex: "roomFuId",
      key: "roomFuId",
    },
    {
      title: "Room Invigilator",
      key: "roomInvigilator",
      render: (text, record) => (
        <span>{`${record.roomLastName} ${record.roomFirstName}`}</span>
      ),
    },
    {
      title: "FuId Hall",
      dataIndex: "hallFuId",
      key: "hallFuId",
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
      <Layout style={{ backgroundColor: "#fff" }}>
        <Spin spinning={loading}>
          <Content style={{ padding: "0 50px" }}>
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={titleAssignmentStyle}>Assignment Invigilators</h2>
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
            <Input
              placeholder="Search by Code"
              onChange={handleSearch}
              allowClear
              suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
              style={{
                width: 250,
                marginLeft: "20px",
                marginBottom: "10px",
              }}
            />
            <Table
              columns={columns}
              dataSource={filteredExamSchedule}
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
