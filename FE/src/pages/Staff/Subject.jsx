import React, { useState, useEffect } from "react";
import {
  ADD_SUBJECT_SUCCESS,
  ADD_SUBJECT_FAILED,
  EDIT_SUBJECT_SUCCESS,
  EDIT_SUBJECT_FAILED,
  DELETE_SUBJECT_SUCCESS,
  DELETE_SUBJECT_FAILED,
  FETCH_SUBJECTS_FAILED,
} from "../../configs/messages.jsx";
import {
  Layout,
  Button,
  Space,
  Form,
  Spin,
  Table,
  Input,
  message,
  Popconfirm,
  Dropdown,
  Col,
  Row,
} from "antd";
import subjectApi from "../../services/Subject.js";
import semesterApi from "../../services/Semester.js";
import { DeleteOutlined, DownOutlined, EditOutlined } from "@ant-design/icons";
import Header from "../../components/Header/Header.jsx";

const { Content, Sider } = Layout;

const Subject = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState({
    id: null,
    name: null,
  });
  const [semesters, setSemesters] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Fetch semesters and set the default selected semester
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const result = await semesterApi.getAllSemesters();
        setSemesters(result);

        const sortedSemesters = result.sort(
          (a, b) => new Date(b.startAt) - new Date(a.startAt)
        );

        // Set default semester to the latest one
        setSelectedSemester({
          id: sortedSemesters[0]?.id,
          name: sortedSemesters[0]?.name,
        });
      } catch (error) {
        message.error("Failed to fetch semesters");
      }
    };

    fetchSemesters();
  }, []);

  // Fetch subjects whenever the selected semester changes
  useEffect(() => {
    if (selectedSemester.id) {
      fetchData(selectedSemester.id);
    }
  }, [selectedSemester.id]); // This will run whenever selectedSemester.id changes

  const fetchData = async (semesterId) => {
    setLoading(true);
    try {
      const result = await subjectApi.getSubjectBySemester(semesterId);
      setData(result);
    } catch (error) {
      message.error(FETCH_SUBJECTS_FAILED);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    try {
      await subjectApi.deleteSubject(id);
      message.success(DELETE_SUBJECT_SUCCESS);
      fetchData(selectedSemester.id);
    } catch (error) {
      message.error(DELETE_SUBJECT_FAILED);
    }
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingSubject(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
            title="Are you sure to delete this subject?"
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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const subjectData = {
        ...values,
        semesterId: selectedSemester.id,
      };

      if (isEditing) {
        await subjectApi.updateSubject({ ...editingSubject, ...subjectData });
        message.success(EDIT_SUBJECT_SUCCESS);
      } else {
        await subjectApi.addSubject(subjectData);
        message.success(ADD_SUBJECT_SUCCESS);
      }

      fetchData(subjectData.semesterId);
      handleCancel();
    } catch (error) {
      message.error(isEditing ? EDIT_SUBJECT_FAILED : ADD_SUBJECT_FAILED);
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        <Sider width={300} style={{ background: "#f1f1f1", padding: "24px" }}>
          <Form form={form} layout="vertical" name="add_subject_form">
            <Form.Item
              name="code"
              label="Code"
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
              label="Name"
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
                </Button>
              </Col>
              <Col>
                <Button type="primary" onClick={handleOk}>
                  {isEditing ? "Save" : "Add"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Sider>
        <Content style={{ padding: 24, margin: 0, background: "#fff" }}>
          <Dropdown
            menu={{
              items,
              onClick: handleMenuClick,
            }}
          >
            <Button style={{ width: "150px" }}>
              <Space>
                {selectedSemester.name}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
          <Spin spinning={loading}>
            <Table
              dataSource={data.map((item) => ({ ...item, key: item.id }))}
              columns={columns}
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
