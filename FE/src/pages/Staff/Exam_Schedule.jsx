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
  Space,
  Dropdown,
  Spin,
  notification,
  Input,
} from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import Header from "../../components/Header/Header.jsx";
import examApi from "../../services/Exam.js";
import examSlotApi from "../../services/ExamSlot.js";
import {
  CaretRightFilled,
  CloseOutlined,
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import {
  addButtonStyle,
  selectButtonStyle,
} from "../../design-systems/CSS/Button.js";
import { staffMapperUtil } from "../../utils/Mapper/StaffMapperUtil.jsx";
import { examScheduleTable } from "../../design-systems/CustomTable.jsx";
import { titleStyle } from "../../design-systems/CSS/Title.js";
import "./CustomForm.css";
import {
  deleteNotification,
  editNotification,
} from "../../design-systems/CustomNotification.jsx";
import {
  ADD_EXAM_SCHEDULE_FAILED,
  ADD_EXAM_SCHEDULE_SUCCESS,
  DELETE_EXAM_SCHEDULE_FAILED,
  DELETE_EXAM_SCHEDULE_SUCCESS,
  EDIT_EXAM_SCHEDULE_FAILED,
  EDIT_EXAM_SCHEDULE_SUCCESS,
  FETCH_EXAM_SCHEDULE_FAILED,
} from "../../configs/messages.js";
const { Option } = Select;
const { Content } = Layout;
const PAGE_SIZE = 6;

const Exam_Schedule = () => {
  const [form] = Form.useForm();
  const [examSchedule, setExamSchedule] = useState([]);
  const [filteredExamSchedule, setFilteredExamSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const {
    selectedSemester,
    setSelectedSemester,
    semesters,
    availableSemesters,
  } = useSemester(); // Access shared semester state
  const [isEditing, setIsEditing] = useState(false);
  const [editingExamSlot, setEditingExamSlot] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [examId, setExamId] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const navigate = useNavigate();

  const fetchExamSchedule = async (semesterId, page) => {
    setLoading(true);
    try {
      const response = await examSlotApi.getExamSlotBySemesterId(
        semesterId,
        page
      );
      const result = staffMapperUtil.mapExamSchedule(response);
      // sort by startAt, format: DD/MM/YYYY HH:mm
      result.sort((a, b) => {
        return (
          moment(b.startAt).format("YYYYMMDDHHmm") -
          moment(a.startAt).format("YYYYMMDDHHmm")
        );
      });
      setExamSchedule(result || []);
      setFilteredExamSchedule(result || []);
      setTotalItems(result.length || 0);
    } catch (error) {
      console.error("Error fetching exam schedule:", error); // Log the error
      message.error(FETCH_EXAM_SCHEDULE_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const fetchExamScheduleById = async (id) => {
    try {
      const response = await examSlotApi.getExamSlotById(id);
      return response;
    } catch (error) {
      console.error("Error fetching exam schedule by ID:", error);
    }
  };
  const fetchExams = async (semesterId) => {
    try {
      const result = await examApi.getExamBySemesterId(semesterId);
      setExams(result || []);
      setFilteredExams(result);
    } catch (error) {
      message.error("Failed to load subjects. Please try again.");
    }
  };

  useEffect(() => {
    const semesterId = selectedSemester?.id;
    if (semesterId) {
      fetchExamSchedule(semesterId, currentPage);
    }
  }, [selectedSemester, currentPage]);

  const handleSearch = (event) => {
    const { value } = event.target;
    const filtered = examSchedule.filter(
      (subject) =>
        `${subject.subjectCode}`.toLowerCase().includes(value.toLowerCase()) ||
        `${subject.subjectName}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredExamSchedule(filtered); // Update the filtered data displayed in the table
  };

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

  const isAvailable = async (id) => {
    const examSlot = await fetchExamScheduleById(id);
    const result =
      availableSemesters.find(
        (semester) => semester.id === selectedSemester.id
      ) &&
      examSlot.status != "APPROVED" &&
      examSlot.status != "REJECTED";
    console.log("isAvailable", result);
    return result;
  };

  const handleDelete = async (id) => {
    if (isAvailable(id)) {
      try {
        await examSlotApi.deleteExamSlot(id);
        message.success(DELETE_EXAM_SCHEDULE_SUCCESS);
        fetchExamSchedule(selectedSemester.id); // Refresh schedule
      } catch (error) {
        notification.warning({
          message: "Warning",
          description: DELETE_EXAM_SCHEDULE_FAILED,
        });
      }
    } else {
      deleteNotification();
    }
  };

  const handleEdit = async (record) => {
    if (await isAvailable(record.id)) {
      setIsEditing(true);
      setEditingExamSlot(record);
      setExamId(record.examId);
      form.setFieldsValue({
        id: record.id,
        semesterId: selectedSemester.id,
        exam: record.subjectCode + " - " + record.examType,
        date: moment(record.startAt),
        startTime: moment(record.startAt),
        endTime: moment(record.endAt),
      });
      //  await fetchExams(selectedSemester.id);
    } else {
      editNotification();
    }
  };

  const handleOK = async () => {
    await form.validateFields().then(async () => {
      const values = await form.validateFields();
      const selectedExam = exams.find((exam) => exam.id === values.exam);
      const selectedDate = values.date.format("YYYY-MM-DD");
      const startTime = values.startTime.format("HH:mm");
      const endTime = values.endTime.format("HH:mm");

      const examSlotDataUpdate = {
        examSlotId: isEditing ? editingExamSlot.id : null,
        subjectExamId: examId,
        startAt: `${selectedDate}T${startTime}:00+07:00`,
        endAt: `${selectedDate}T${endTime}:00+07:00`,
        id: isEditing ? editingExamSlot.id : null,
      };

      const examSlotDataAdd = {
        examSlotId: isEditing ? editingExamSlot.id : null,
        subjectExamId: examId,
        startAt: `${selectedDate}T${startTime}:00+07:00`,
        endAt: `${selectedDate}T${endTime}:00+07:00`,
        requiredInvigilators: 15,
      };
      setLoadingSubmit(true); // Start loading
      try {
        if (isEditing) {
          await examSlotApi.updateExamSlotByStaff(examSlotDataUpdate);
          message.success(EDIT_EXAM_SCHEDULE_SUCCESS);
        } else {
          await examSlotApi.addExamSlot(examSlotDataAdd); // Assuming API returns the new slot
          message.success(ADD_EXAM_SCHEDULE_SUCCESS);
        }

        if (values.semesterId === selectedSemester.id) {
          fetchExamSchedule(selectedSemester.id); // Refresh schedule
        }
      } catch (error) {
        console.error("Error saving exam slot:", error);
        message.error(
          isEditing ? EDIT_EXAM_SCHEDULE_FAILED : ADD_EXAM_SCHEDULE_FAILED
        );
      } finally {
        setLoadingSubmit(false); // Stop loading
        handleCancel(); // Reset form
      }
    });
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

  // Handle semester selection in the form
  const handleSemesterChange = async (value) => {
    console.log("Selected semester:", value);
    const selectedSemesterForm = availableSemesters.find(
      (sem) => sem.id === value
    );

    if (selectedSemesterForm) {
      form.setFieldsValue({ semesterId: selectedSemesterForm.id }); // Update semesterId in the form
      fetchExams(selectedSemesterForm.id); // Fetch subjects for the selected semester
    }
  };

  const validateTime = (rule, value) => {
    const startTime = form.getFieldValue("startTime");
    if (startTime && value && value.isBefore(startTime)) {
      return Promise.reject("End time must be after start time");
    }
    return Promise.resolve();
  };
  const handleChooseTime = async (value) => {
    const exam = await examApi.getExamById(examId);
    const duration = exam?.duration;
    if (duration) {
      const endTime = value.clone().add(duration, "minutes");
      form.setFieldsValue({ endTime });
    }
  };

  const handleChooseExam = (value) => {
    setExamId(value);
    console.log("Selected exam:", value);
    // Reset time fields when a new exam is selected
    setStartTime(null);
    setEndTime(null);
  };
  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        <Sider
          width={300}
          style={{
            background: "#4D908E",
            padding: "24px",
            boxShadow: "3px 0 5px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Form form={form} layout="vertical" name="add_exam_slot_form">
            <Form.Item
              name="semesterId"
              label={<span className="custom-label">Semester</span>}
              rules={[
                {
                  required: true,
                  message: "Please select semester!",
                },
              ]}
            >
              <Select
                placeholder="Select semester"
                onChange={handleSemesterChange}
              >
                {availableSemesters.map((semester) => (
                  <Select.Option key={semester.id} value={semester.id}>
                    {semester.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="exam"
              label={<span className="custom-label">Exam</span>}
              rules={[{ required: true, message: "Required" }]}
            >
              <Select
                placeholder="Select Exam"
                style={{ width: "100%" }}
                showSearch
                onSearch={handleExamSearch}
                optionFilterProp="children"
                filterOption={false}
                onChange={handleChooseExam}
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
              label={<span className="custom-label">Date</span>}
              rules={[{ required: true, message: "Required" }]}
            >
              <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startTime"
                  label={<span className="custom-label">Start Time</span>}
                  rules={[{ required: true, message: "Required" }]}
                >
                  <TimePicker
                    format="HH:mm"
                    style={{
                      width: "100%",
                      backgroundColor: "#FFF",
                    }}
                    onChange={handleChooseTime}
                    disabled={!examId}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="endTime"
                  label={<span className="custom-label">End Time</span>}
                  rules={[
                    { required: true, message: "Required" },
                    { validator: validateTime },
                  ]}
                >
                  <TimePicker
                    format="HH:mm"
                    style={{ width: "100%", backgroundColor: "#FFF" }}
                    disabled
                  />
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
                  <CloseOutlined />
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={handleOK}
                  loading={loadingSubmit}
                  style={addButtonStyle}
                >
                  {isEditing ? "Update" : "Add"}
                  <CaretRightFilled />
                </Button>
              </Col>
            </Row>
          </Form>
        </Sider>

        <Content style={{ padding: "24px", background: "#fff" }}>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h2 style={titleStyle}>Exam Schedule Management</h2>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
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
            <Input
              placeholder="Search by Code or Name"
              onChange={handleSearch}
              allowClear
              suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
              style={{
                width: 250,
                marginLeft: "20px",
                marginBottom: "10px",
              }}
            />
          </div>
          <Spin spinning={loading}>
            <Table
              className="custom-table-exam-schedule"
              dataSource={filteredExamSchedule}
              columns={examScheduleTable(
                handleRoomClick,
                handleEdit,
                handleDelete
              )}
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
