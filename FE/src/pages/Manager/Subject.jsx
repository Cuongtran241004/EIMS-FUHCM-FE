import React, { useState, useEffect } from "react";
import Header_Manager from "../../components/Header/Header_Manager";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import {
  Layout,
  Button,
  Space,
  Modal,
  Form,
  Spin,
  Table,
  Input,
  message,
  Upload,
} from "antd";
import subjectApi from "../../services/Subject.js";
import { UploadOutlined } from "@ant-design/icons";
import {
  ADD_SUBJECT_FAILED,
  ADD_SUBJECT_SUCCESS,
  EDIT_SUBJECT_FAILED,
  EDIT_SUBJECT_SUCCESS,
  FETCH_SUBJECTS_FAILED,
  IMPORT_SUBJECTS_FAILED,
  IMPORT_SUBJECTS_SUCCESS,
} from "../../configs/messages.jsx";
import { Subject_Import_Excel } from "../../utils/Subject_Import_Excel.js";
import { Subject_Excel_Template } from "../../utils/Subject_Excel_Template.js";

// Ant Design Layout Components
const { Content, Sider } = Layout;
const Subject = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // For file upload loading state
  const [fileLoading, setFileLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await subjectApi.getAllSubjects();
      setData(result);
    } catch (error) {
      message.error(FETCH_SUBJECTS_FAILED);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    form.resetFields();
  };

  const handleFileUpload = async ({ file }) => {
    setFileLoading(true);
    try {
      const data = await Subject_Import_Excel(file);
      await Promise.all(data.map((item) => subjectApi.addSubject(item)));
      message.success(IMPORT_SUBJECTS_SUCCESS);
      fetchData();
    } catch (error) {
      message.error(IMPORT_SUBJECTS_FAILED);
    } finally {
      setFileLoading(false);
    }
  };
  const columns = [
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
          <Button
            type="primary"
            onClick={() => {
              setIsEditing(true);
              setEditingSubject(record);
              form.setFieldsValue(record);
              showModal();
            }}
          >
            Edit
          </Button>
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

      fetchData();
      handleCancel();
    } catch (error) {
      message.error(isEditing ? EDIT_SUBJECT_FAILED : ADD_SUBJECT_FAILED);
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header_Manager />
      <Layout>
        <Sider width={256} style={{ backgroundColor: "#fff" }}>
          <NavBar_Manager />
        </Sider>
        <Layout style={{ padding: "16px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              background: "#fff",
              minHeight: 280,
            }}
          >
            <Space>
              <Button type="primary" onClick={showModal}>
                Add New Subject
              </Button>

              <Upload
                beforeUpload={() => false}
                showUploadList={false}
                onChange={handleFileUpload}
                maxCount={1}
                method="POST"
              >
                <Button icon={<UploadOutlined />} loading={fileLoading}>
                  Import Subjects
                </Button>
              </Upload>

              <Button onClick={Subject_Excel_Template} type="default">
                Download Import Template
              </Button>
            </Space>

            <Spin spinning={loading}>
              <Table
                dataSource={data}
                columns={columns}
                rowKey={Math.random}
                pagination={{ pageSize: 8 }}
              />
            </Spin>
          </Content>
        </Layout>
      </Layout>

      {/* Add/Edit Staff Modal */}
      <Modal
        title={isEditing ? "Edit Subject" : "Add New Subject"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="add_subject_form">
          <Form.Item
            name="code"
            label="Code"
            rules={[
              { required: true, message: "Please input the subject code!" },
            ]}
          >
            <Input placeholder="Enter subject code" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please input the subject name!" },
            ]}
          >
            <Input placeholder="Enter subject name" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Subject;
