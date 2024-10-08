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
import semesterApi from "../../services/Semester.js"; // Import semesterApi
import { DeleteOutlined, DownOutlined, EditOutlined } from "@ant-design/icons";
import Header from "../../components/Header/Header.jsx";

const { Content, Sider } = Layout;

const Subject = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null); // Initialize to null
  const [semesters, setSemesters] = useState([]); // State for semesters
  const [form] = Form.useForm();

  const fetchData = async (term) => {
    setLoading(true);
    try {
      const result = await subjectApi.getAllSubjects(term);
      setData(result);
    } catch (error) {
      message.error(FETCH_SUBJECTS_FAILED);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const result = await semesterApi.getAllSemesters(); // Fetch semesters
        setSemesters(result); // Assuming result is an array of { id, name, startAt }

        // Sort semesters by startAt date to get the latest one
        const sortedSemesters = result.sort(
          (a, b) => new Date(b.startAt) - new Date(a.startAt)
        );
        setSelectedSemester(sortedSemesters[0]?.name); // Set the latest semester as default
        fetchData(sortedSemesters[0]?.id); // Fetch subjects for the latest semester
      } catch (error) {
        message.error("Failed to fetch semesters");
      }
    };

    fetchSemesters();
  }, []);

  const items = semesters.map((semester) => ({
    key: semester.id,
    label: semester.name,
  }));

  const handleMenuClick = (e) => {
    const selected = items.find((item) => item.key == e.key);
    if (selected) {
      setSelectedSemester(selected.label);
      fetchData(selected.key); // Fetch data based on the new selected semester
    }
  };

  const showModal = () => {
    setIsEditing(false);
    form.resetFields();
    setEditingSubject(null);
    setIsModalVisible(true);
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
      fetchData(selectedSemester); // Fetch subjects for the current selected semester
    } catch (error) {
      message.error(DELETE_SUBJECT_FAILED);
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
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
            onClick={() => {
              setIsEditing(true);
              setEditingSubject(record);
              form.setFieldsValue(record);
              showModal();
            }}
          />
          <Popconfirm
            title="Are you sure to delete this subject?"
            onConfirm={() => handleDelete(record.id)} // Ensure you're using the correct ID
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
      if (isEditing) {
        await subjectApi.updateSubject({ ...editingSubject, ...values });
        message.success(EDIT_SUBJECT_SUCCESS);
      } else {
        await subjectApi.addSubject(values);
        message.success(ADD_SUBJECT_SUCCESS);
      }

      fetchData(selectedSemester); // Fetch subjects for the current selected semester
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
                  Add
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
            <Button style={{ width: "100px" }}>
              <Space>
                {selectedSemester}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
          <Spin spinning={loading}>
            <Table
              dataSource={data}
              columns={columns}
              rowKey={(record) => record.id}
              pagination={{ pageSize: 8 }}
            />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Subject;
