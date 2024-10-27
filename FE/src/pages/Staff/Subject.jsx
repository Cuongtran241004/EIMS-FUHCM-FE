import React, { useState, useEffect } from "react";
import {
  ADD_SUBJECT_SUCCESS,
  ADD_SUBJECT_FAILED,
  EDIT_SUBJECT_SUCCESS,
  EDIT_SUBJECT_FAILED,
  DELETE_SUBJECT_SUCCESS,
  DELETE_SUBJECT_FAILED,
  FETCH_SUBJECTS_FAILED,
} from "../../configs/messages.js";
import {
  Layout,
  Button,
  Space,
  Form,
  Spin,
  Table,
  Input,
  message,
  Dropdown,
  Col,
  Row,
  Select,
  notification,
} from "antd";
import subjectApi from "../../services/Subject.js";
import {
  CaretRightFilled,
  CloseOutlined,
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header/Header.jsx";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import { subjectTable } from "../../design-systems/CustomTable.jsx";
import { titleStyle } from "../../design-systems/CSS/Title.js";
import {
  addButtonStyle,
  selectButtonStyle,
} from "../../design-systems/CSS/Button.js";
import "./CustomForm.css";
import { staffMapperUtil } from "../../utils/Mapper/StaffMapperUtil.jsx";
import {
  deleteNotification,
  editNotification,
} from "../../design-systems/CustomNotification.jsx";

const { Content, Sider } = Layout;

const Subject = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const {
    selectedSemester,
    setSelectedSemester,
    semesters,
    availableSemesters,
  } = useSemester(); // Access shared semester state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const fetchData = async (semesterId) => {
    setLoading(true);
    try {
      const response = await subjectApi.getSubjectBySemester(semesterId);
      const mapResponse = await staffMapperUtil.mapSubject(response);
      // sort by id
      const result = mapResponse.sort((a, b) => b.id - a.id);
      setData(result || []);
      setFilteredData(result || []);
    } catch (error) {
      message.error(FETCH_SUBJECTS_FAILED);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects whenever the selected semester changes
  useEffect(() => {
    if (selectedSemester.id) {
      fetchData(selectedSemester.id);
    }
  }, [selectedSemester.id]); // This will run whenever selectedSemester.id changes

  const items = semesters.map((semester) => ({
    key: semester.id,
    label: semester.name,
  }));

  const handleSearch = (event) => {
    const { value } = event.target;
    const filtered = data.filter(
      (subject) =>
        `${subject.code}`.toLowerCase().includes(value.toLowerCase()) ||
        `${subject.name}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered); // Update the filtered data displayed in the table
  };

  const handleMenuClick = (e) => {
    const selected = items.find((item) => item.key == e.key);
    if (selected) {
      setSelectedSemester({
        id: selected.key,
        name: selected.label,
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    if (
      availableSemesters.find((semester) => semester.id === selectedSemester.id)
    ) {
      try {
        await subjectApi.deleteSubject(id);
        message.success(DELETE_SUBJECT_SUCCESS);
        fetchData(selectedSemester.id);
      } catch (error) {
        notification.error({ message: DELETE_SUBJECT_FAILED });
      }
    } else {
      deleteNotification();
    }
  };

  const handleEdit = (record) => {
    // only allow when availableSemesters contains selectedSemester
    if (
      availableSemesters.find((semester) => semester.id === selectedSemester.id)
    ) {
      setIsEditing(true);
      setEditingSubject(record);
      form.setFieldsValue({
        code: record.code,
        name: record.name,
        semesterId: record.semesterId,
      });
      setIsModalVisible(true);
    } else {
      editNotification();
    }
  };

  const handleOk = async () => {
    await form.validateFields().then(async () => {
      setLoadingSubmit(true);
      try {
        const values = await form.validateFields();

        if (isEditing) {
          await subjectApi.updateSubject({ ...editingSubject, ...values });
          message.success(EDIT_SUBJECT_SUCCESS);
        } else {
          await subjectApi.addSubject(values);
          message.success(ADD_SUBJECT_SUCCESS);
        }

        if (selectedSemester.id == values.semesterId) {
          fetchData(values.semesterId);
        }

        handleCancel();
      } catch (error) {
        message.error(isEditing ? EDIT_SUBJECT_FAILED : ADD_SUBJECT_FAILED);
      } finally {
        setLoadingSubmit(false);
      }
    });
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
          <Form form={form} layout="vertical" name="add_subject_form">
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
              <Select placeholder="Select semester">
                {availableSemesters.map((semester) => (
                  <Select.Option key={semester.id} value={semester.id}>
                    {semester.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="code"
              label={<span className="custom-label">Code</span>}
              rules={[
                {
                  required: true,
                  message: "Please input the subject code!",
                },
              ]}
            >
              <Input placeholder="Enter subject code" />
            </Form.Item>

            <Form.Item
              name="name"
              label={<span className="custom-label">Name</span>}
              rules={[
                {
                  required: true,
                  message: "Please input the subject name!",
                },
              ]}
            >
              <Input placeholder="Enter subject name" />
            </Form.Item>
            <Row justify="space-between">
              <Col>
                <Button
                  onClick={handleCancel}
                  style={{
                    borderColor: "orange",
                    color: "orange",
                  }}
                >
                  Clear
                  <CloseOutlined />
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={handleOk}
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
        <Content style={{ padding: 12, margin: 0, background: "#fff" }}>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h2 style={titleStyle}>Subject Management</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Dropdown
              menu={{
                items,
                onClick: handleMenuClick,
              }}
            >
              <Button style={{ ...selectButtonStyle, width: "150px" }}>
                <Space>
                  {selectedSemester.name}
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
              dataSource={filteredData}
              columns={subjectTable(
                currentPage,
                pageSize,
                handleEdit,
                handleDelete
              )}
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

export default Subject;
