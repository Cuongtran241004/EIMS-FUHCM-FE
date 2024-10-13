import React, { useState, useEffect } from "react";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import moment from "moment";
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
  DatePicker,
  InputNumber,
  Row,
  Col,
} from "antd";
import semesterApi from "../../services/Semester.js";
import {
  ADD_SEMESTER_FAILED,
  ADD_SEMESTER_SUCCESS,
  EDIT_SEMESTER_FAILED,
  EDIT_SEMESTER_SUCCESS,
  FETCH_SEMESTERS_FAILED,
} from "../../configs/messages.js";
import Header from "../../components/Header/Header.jsx";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Content, Sider } = Layout;
const { RangePicker } = DatePicker;

const Semester = ({ isLogin }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await semesterApi.getAllSemesters();
      // Sort the semesters by endAt date in ascending order
      const sortedSemesters = result.sort(
        (a, b) => new Date(b.endAt) - new Date(a.endAt)
      );

      setData(sortedSemesters);
    } catch (error) {
      message.error(FETCH_SEMESTERS_FAILED);
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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { dateRange } = values;
      const [startAt, endAt] = dateRange;

      if (isEditing) {
        await semesterApi.updateSemester({
          ...editingSemester,
          startAt: startAt.format("YYYY-MM-DD"),
          endAt: endAt.format("YYYY-MM-DD"),
          ...values,
        });
        message.success(EDIT_SEMESTER_SUCCESS);
      } else {
        await semesterApi.addSemester({
          ...values,
          startAt: startAt.format("YYYY-MM-DD"),
          endAt: endAt.format("YYYY-MM-DD"),
        });
        message.success(ADD_SEMESTER_SUCCESS);
      }
      fetchData();
      handleCancel();
    } catch (error) {
      message.error(isEditing ? EDIT_SEMESTER_FAILED : ADD_SEMESTER_FAILED);
    }
  };

  const handleEdit = (semester) => {
    setIsEditing(true);
    setEditingSemester(semester);
    form.setFieldsValue({
      name: semester.name,
      dateRange: [moment(semester.startAt), moment(semester.endAt)],
      hourlyConfig: semester.hourlyConfig,
      allowedSlotConfig: semester.allowedSlotConfig,
    });
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Start Date",
      dataIndex: "startAt",
      key: "startAt",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "End Date",
      dataIndex: "endAt",
      key: "endAt",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Hour Rate",
      dataIndex: "hourlyConfig",
      key: "hourlyConfig",
      render: (text) => {
        // Format the value as Vietnamese currency
        return `${text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ₫`;
      },
    },
    {
      title: "Max Slot",
      dataIndex: "allowedSlotConfig",
      key: "allowedSlotConfig",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ color: "blue", cursor: "pointer" }}
          />
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
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
            <div style={{ display: "flex", alignItems: "center" }}>
              {" "}
              <Button type="primary" onClick={showModal}>
                Add New Semester
              </Button>
              <span style={{ margin: "0 25%", fontSize: "20px" }}>
                <h2>Semester Management</h2>
              </span>
            </div>

            <Spin spinning={loading}>
              <Table
                dataSource={data}
                columns={columns}
                rowKey="id" // Use a unique key, assuming semester objects have an id property
                pagination={{ pageSize: 8 }}
              />
            </Spin>
          </Content>
        </Layout>
      </Layout>

      {/* Add/Edit Semester Modal */}
      <Modal
        title={isEditing ? "Edit Semester" : "Add New Semester"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="add_semester_form">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  { required: true, message: "Please input semester name!" },
                ]}
              >
                <Input placeholder="Semester name" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item style={{ marginBottom: 0 }}>
                <Form.Item
                  label="Date"
                  name="dateRange"
                  rules={[
                    {
                      required: true,
                      message: "Please select the date range!",
                    },
                  ]}
                  style={{ display: "inline-block", width: "calc(100% - 8px)" }}
                >
                  <RangePicker
                    style={{ width: "100%" }}
                    onChange={(dates) => {
                      if (dates) {
                        form.setFieldsValue({
                          startAt: dates[0],
                          endAt: dates[1],
                        });
                      }
                    }}
                  />
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item
              label="Hour rate"
              name="hourlyConfig"
              initialValue={100000}
              rules={[{ required: true, message: "Please input hour rate!" }]}
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                marginRight: "8px",
              }}
            >
              <InputNumber
                min={1}
                placeholder="Enter hour rate"
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫"
                }
                parser={(value) => value.replace(/\s?₫|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item
              label="Max slot"
              name="allowedSlotConfig"
              initialValue={15}
              rules={[{ required: true, message: "Please input max slot!" }]}
              style={{ display: "inline-block", width: "calc(50% - 8px)" }}
            >
              <Input placeholder="Enter max slot" type="number" />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Semester;
