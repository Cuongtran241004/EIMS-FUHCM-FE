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
import {
  CloseCircleFilled,
  CloseOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { selectButtonStyle } from "../../design-systems/CSS/Button.js";
import { titleStyle } from "../../design-systems/CSS/Title.js";
import configApi from "../../services/Config.js";
import { managerMapperUtil } from "../../utils/Mapper/ManagerMapperUtil.jsx";

const { Content, Sider } = Layout;
const { RangePicker } = DatePicker;

const Semester = ({ isLogin }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false); // View Detail Modal state
  const [selectedSemester, setSelectedSemester] = useState(null); // Selected semester for view detail
  const [configData, setConfigData] = useState([]);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await semesterApi.getAllSemesters();
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
    await form.validateFields().then(async () => {
      try {
        setLoadingSubmit(true);
        const values = form.getFieldsValue();
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
      } finally {
        setLoadingSubmit(false);
      }
    });
  };

  // Handle View Detail
  const handleViewDetail = async (semesterId) => {
    setSelectedSemester(semesterId);
    setLoading(true);
    try {
      const response = await configApi.getAllConfigsBySemesterId(semesterId);
      const result = managerMapperUtil.mapConfigs(response);
      setConfigData(result);
      setViewModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch semester details");
    } finally {
      setLoading(false);
    }
  };

  // Close the view detail modal
  const handleCloseViewDetail = () => {
    setViewModalVisible(false);
    setSelectedSemester(null);
  };

  const handleEdit = (semester) => {
    setIsEditing(true);
    setEditingSemester(semester);
    form.setFieldsValue({
      name: semester.name,
      dateRange: [moment(semester.startAt), moment(semester.endAt)],
    });
    setIsModalVisible(true);
  };
  const columnConfig = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Config Type",
      dataIndex: "configType",
      key: "configType",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      align: "center",
      render: (text) => {
        return new Intl.NumberFormat("vi-VN", {
          maximumFractionDigits: 0, // No decimal places
        }).format(text);
      },
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      align: "center",
    },
  ];
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Start Date",
      dataIndex: "startAt",
      key: "startAt",
      align: "center",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "endAt",
      key: "endAt",
      align: "center",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => handleEdit(record)}
            style={{ color: "blue", cursor: "pointer" }}
          />
          <Button type="link" onClick={() => handleViewDetail(record.id)}>
            <EyeOutlined />
          </Button>
        </Space>
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
        <Layout>
          <Content
            style={{
              padding: 12,
              margin: 0,
              background: "#fff",
              minHeight: 280,
            }}
          >
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <h2 style={titleStyle}>Semester Management</h2>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                type="primary"
                onClick={showModal}
                icon={<PlusOutlined />}
                style={selectButtonStyle}
              >
                Add New Semester
              </Button>
            </div>

            <Spin spinning={loading}>
              <Table
                dataSource={data}
                columns={columns}
                rowKey="id"
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
        loading={loadingSubmit}
        closeIcon={<CloseCircleFilled />}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
            <CloseOutlined />
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={loadingSubmit}
          >
            Submit
            <SendOutlined />
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="add_semester_form">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Semester name" maxLength={15} />
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
                    {
                      validator: (_, value) => {
                        if (!value || value.length !== 2) {
                          return Promise.reject();
                        }
                        const [startDate, endDate] = value;
                        // Check if the end date is within 4 months of the start date
                        if (endDate.diff(startDate, "months") > 4) {
                          return Promise.reject(
                            new Error("The date range cannot exceed 4 months")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  style={{ display: "inline-block", width: "calc(100% - 8px)" }}
                >
                  <RangePicker
                    style={{ width: "100%" }}
                    disabledDate={(current) =>
                      current && current < moment().startOf("day")
                    }
                    format="DD/MM/YYYY"
                    onChange={(dates) => {
                      if (dates && dates.length === 2) {
                        form.validateFields(["dateRange"]);
                      }
                    }}
                  />
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* View Detail Modal */}
      {selectedSemester && (
        <Modal
          title="Semester Configuration"
          open={viewModalVisible}
          onOk={handleCloseViewDetail}
          onCancel={handleCloseViewDetail}
          footer={[
            <Button key="close" onClick={handleCloseViewDetail}>
              Close
            </Button>,
          ]}
        >
          <Table
            className="custom-table-config"
            columns={columnConfig}
            dataSource={configData}
            rowKey={(record) => record.id}
            pagination={false}
          />
        </Modal>
      )}
    </Layout>
  );
};

export default Semester;
