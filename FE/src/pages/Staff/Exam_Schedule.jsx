import {
  Layout,
  Select,
  DatePicker,
  TimePicker,
  Button,
  Form,
  Table,
  Row,
  Col,
  message,
  Popconfirm,
  Space,
  Dropdown,
  Spin,
  Tag,
} from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import Header from "../../components/Header/Header.jsx";
import examApi from "../../services/Exam.js";
import examSlotApi from "../../services/ExamSlot.js";
import { DeleteOutlined, EditOutlined, DownOutlined } from "@ant-design/icons";
import moment from "moment";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import RoomSelectionPopover from "./Room.jsx";
const { Option } = Select;
const { Content } = Layout;
const PAGE_SIZE = 6;

const Exam_Schedule = () => {
  const [form] = Form.useForm();
  const [examSchedule, setExamSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const {
    selectedSemester,
    setSelectedSemester,
    semesters,
    loading: semesterLoading,
  } = useSemester(); // Access shared semester state
  const [isEditing, setIsEditing] = useState(false);
  const [editingExamSlot, setEditingExamSlot] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const navigate = useNavigate();

  const fetchExamSchedule = async (semesterId, page) => {
    setLoading(true);
    try {
      const result = await examSlotApi.getExamSlotBySemesterId(
        semesterId,
        page
      );

      setExamSchedule(result || []);
      setTotalItems(result.length || 0);
    } catch (error) {
      console.error("Error fetching exam schedule:", error); // Log the error
      message.error("Failed to load exam schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchExams = async (semesterId) => {
    try {
      const result = await examApi.getExamBySemesterId(semesterId);
      setExams(result);
      setFilteredExams(result);
    } catch (error) {
      message.error("Failed to load subjects. Please try again.");
    }
  };

  useEffect(() => {
    const semesterId = selectedSemester?.id;
    if (semesterId) {
      fetchExamSchedule(semesterId, currentPage);
      fetchExams(semesterId);
    }
  }, [selectedSemester, currentPage]);

  const handleExamSearch = (value) => {
    if (value) {
      const filtered = exams.filter((exam) =>
        exam.subjectName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredExams(filtered);
    } else {
      setFilteredExams(exams);
    }
  };

  const handleDelete = async (id) => {
    try {
      await examSlotApi.deleteExamSlot(id);
      message.success("Exam slot deleted successfully");
      fetchExamSchedule(selectedSemester.id); // Refresh schedule
    } catch (error) {
      message.error("Failed to delete exam");
    }
  };

  const handleEdit = (record) => {
    console.log(record);
    setIsEditing(true);
    setEditingExamSlot(record);
    form.setFieldsValue({
      id: record.id,
      exam: record.examId,
      date: moment(record.startAt),
      startTime: moment(record.startAt),
      endTime: moment(record.endAt),
    });
  };

  const handleOK = async () => {
    const values = await form.validateFields();
    const selectedExam = exams.find((exam) => exam.id === values.exam);
    const selectedDate = values.date.format("YYYY-MM-DD");
    const startTime = values.startTime.format("HH:mm");
    const endTime = values.endTime.format("HH:mm");

    const examSlotDataUpdate = {
      examSlotId: isEditing ? editingExamSlot.id : null,
      subjectExamId: selectedExam.id,
      startAt: `${selectedDate}T${startTime}:00+07:00`,
      endAt: `${selectedDate}T${endTime}:00+07:00`,
      id: isEditing ? editingExamSlot.id : null,
    };

    const examSlotDataAdd = {
      examSlotId: isEditing ? editingExamSlot.id : null,
      subjectExamId: selectedExam.id,
      startAt: `${selectedDate}T${startTime}:00+07:00`,
      endAt: `${selectedDate}T${endTime}:00+07:00`,
      requiredInvigilators: 15,
    };
    setLoadingSubmit(true); // Start loading
    try {
      if (isEditing) {
        await examSlotApi.updateExamSlot(examSlotDataUpdate);
        message.success("Exam slot updated successfully.");
        fetchExamSchedule(selectedSemester.id);
      } else {
        await examSlotApi.addExamSlot(examSlotDataAdd); // Assuming API returns the new slot
        message.success("Exam slot added successfully.");
        fetchExamSchedule(selectedSemester.id);
      }
    } catch (error) {
      console.error("Error saving exam slot:", error);
      message.error("Failed to save exam slot.");
    } finally {
      setLoadingSubmit(false); // Stop loading
      handleCancel(); // Reset form
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    //fetchExamSchedule(selectedSemester.id, pagination.current); // Re-fetch when page changes
  };

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

  const handleRoomClick = (examSlotId) => {
    // Navigate to RoomSelectionPage with the exam slot ID in the URL
    navigate(`/exam-schedule/${examSlotId}/room`);
  };

  const validateTime = (rule, value) => {
    const startTime = form.getFieldValue("startTime");
    if (startTime && value && value.isBefore(startTime)) {
      return Promise.reject("End time must be after start time");
    }
    return Promise.resolve();
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "subjectCode",
      key: "subjectCode",
    },
    {
      title: "Subject",
      dataIndex: "subjectName",
      key: "subjectName",
    },
    {
      title: "Exam Type",
      dataIndex: "examType",
      key: "examType",
      render: (text) => {
        if (text === "PE") {
          const color = "blue";
          return <Tag color={color}>{text}</Tag>;
        } else if (text === "FE") {
          const color = "green";
          return <Tag color={color}>{text}</Tag>;
        } else if (text === "PE&TE") {
          const color = "orange";
          return <Tag color={color}>{text}</Tag>;
        } else {
          const color = "red";
          return <Tag color={color}>{text}</Tag>;
        }
      },
    },
    {
      title: "Date (DD-MM-YYYY)",
      dataIndex: "startAt", // Use startAt to extract date
      key: "date",
      render: (text) => moment(text).format("DD-MM-YYYY"), // Format as DD-MM-YYYY
    },
    {
      title: "Time",
      key: "time",
      render: (text, record) => {
        const startTime = new Date(record.startAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTime = new Date(record.endAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${startTime} - ${endTime}`; // Combine start and end time
      },
    },
    {
      title: "Room",
      render: (text, record) => (
        <Button onClick={() => handleRoomClick(record.id)}>Room</Button>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";
        let text = "";
        // Define color and label based on the status value
        switch (status) {
          case "NEEDS_ROOM_ASSIGNMENT":
            color = "blue";
            text = "Needs room";
            break;
          case "PENDING":
            color = "orange";
            text = "Pending";
            break;
          case "APPROVED":
            color = "green";
            text = "Approved";
            break;
          case "REJECTED":
            color = "red";
            text = "Rejected";
            break;
          default:
            color = "black";
            text = "Unknown";
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure to delete this exam slot?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        <Sider width={300} style={{ background: "#f1f1f1", padding: "24px" }}>
          <Form form={form} layout="vertical" name="add_exam_slot_form">
            <Form.Item
              name="exam"
              label="Exam"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                placeholder="Select Exam"
                style={{ width: "100%" }}
                showSearch
                onSearch={handleExamSearch}
                optionFilterProp="children"
                filterOption={false}
              >
                {filteredExams.map((exam) => (
                  <Option key={exam.id} value={exam.id}>
                    {exam.subjectCode} - {exam.examType}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Required" }]}
            >
              <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startTime"
                  label="Start Time"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <TimePicker format="HH:mm" style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="endTime"
                  label="End Time"
                  rules={[
                    { required: true, message: "Required" },
                    { validator: validateTime },
                  ]}
                >
                  <TimePicker format="HH:mm" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="space-between">
              <Col>
                <Button
                  style={{
                    borderColor: "orange",
                    color: "orange",
                  }}
                  onClick={handleCancel}
                >
                  Clear
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={handleOK}
                  loading={loadingSubmit}
                >
                  {isEditing ? "Update" : "Add"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Sider>

        <Content style={{ padding: "24px", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Dropdown
              menu={{
                items: semesters.map((sem) => ({
                  key: sem.id,
                  label: sem.name,
                })),
                onClick: handleMenuClick,
              }}
            >
              <Button style={{ width: "150px" }}>
                <Space>
                  {selectedSemester?.name || "Select Semester"}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <span style={{ margin: "0 25%", fontSize: "20px" }}>
              <h2>Exam Schedule Management</h2>
            </span>
          </div>
          <Spin spinning={loading}>
            <Table
              dataSource={examSchedule.map((item) => ({
                id: item.id,
                examId: item.subjectExamDTO?.subjectExamId,
                subjectCode: item.subjectExamDTO?.subjectCode || "Loading",
                subjectName: item.subjectExamDTO?.subjectName || "Loading",
                examType: item.subjectExamDTO?.examType || "Loading",
                startAt: item.startAt,
                endAt: item.endAt,
                status: item.status,
                key: item.id,
              }))}
              columns={columns}
              pagination={{
                pageSize: PAGE_SIZE,
                total: totalItems,
                current: currentPage,
                onChange: handleTableChange,
              }}
            />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Exam_Schedule;
