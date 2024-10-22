import React, { useState, useEffect } from "react";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import moment from "moment";
import {
  Layout,
  Form,
  Table,
  Input,
  message,
  Button,
  Spin,
  Typography,
  InputNumber,
} from "antd";
import configApi from "../../services/Config.js";

import Header from "../../components/Header/Header.jsx";
import { titleStyle } from "../../design-systems/CSS/Title.js";

const { Content, Sider } = Layout;
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: "Required",
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Configs = ({ isLogin }) => {
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState([]);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const [
        hourly_rate,
        allowed_slot,
        time_before_exam,
        time_before_open_registration,
        invigilator_room,
        time_before_close_registration,
        time_before_close_request,
      ] = await Promise.all([
        configApi.getHourlyRate(),
        configApi.getAllowedSlot(),
        configApi.getTimeBeforeExam(),
        configApi.getTimeBeforeOpenRegistration(),
        configApi.getInvigilatorRoom(),
        configApi.getTimeBeforeCloseRegistration(),
        configApi.getTimeBeforeCloseRequest(),
      ]);
      const result = [
        {
          id: hourly_rate.id,
          key: "hourly_rate",
          configType: "Hourly Rate",
          value: new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(hourly_rate.value),
          unit: "VND/hour",
        },
        {
          id: allowed_slot.id,
          key: "allowed_slot",
          configType: "Allowed Slot",
          value: allowed_slot.value,
          unit: "slot(s)",
        },
        {
          id: invigilator_room.id,
          key: "invigilator_room",
          configType: "Invigilator Room",
          value: invigilator_room.value,
          unit: "room",
        },
        {
          id: time_before_exam.id,
          key: "time_before_exam",
          configType: "Time Before Exam",
          value: time_before_exam.value,
          unit: "day(s)",
        },
        {
          id: time_before_open_registration.id,
          key: "time_before_open_registration",
          configType: "Time Before Open Registration",
          value: time_before_open_registration.value,
          unit: "day(s)",
        },
        {
          id: time_before_close_registration.id,
          key: "time_before_close_registration",
          configType: "Time Before Close Registration",
          value: time_before_close_registration.value,
          unit: "day(s)",
        },
        {
          id: time_before_close_request.id,
          key: "time_before_close_request",
          configType: "Time Before Close Request",
          value: time_before_close_request.value,
          unit: "day(s)",
        },
      ];
      console.log(result);
      setConfigs(result);
    } catch (error) {
      message.error("Failed to fetch configs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleEdit = (record) => {
    console.log(record);
    form.setFieldsValue({ value: "", ...record });
    setEditingKey(record.key);
  };

  const handleCancel = () => {
    setEditingKey("");
  };

  const handleSave = async (key) => {
    try {
      console.log(key);
      const row = await form.validateFields();
      console.log(row);
      switch (key) {
        case "hourly_rate":
          await configApi.addHourlyRate(row.value);
          break;
        case "allowed_slot":
          await configApi.addAllowedSlot(row.value);
          break;
        case "time_before_exam":
          await configApi.addTimeBeforeExam(row.value);
          break;
        case "time_before_open_registration":
          await configApi.addTimeBeforeOpenRegistration(row.value);
          break;
        case "invigilator_room":
          await configApi.addInvigilatorRoom(row.value);
          break;
        case "time_before_close_registration":
          await configApi.addTimeBeforeCloseRegistration(row.value);
          break;
        case "time_before_close_request":
          await configApi.addTimeBeforeCloseRequest(row.value);
          break;
        default:
          break;
      }
    } catch (errInfo) {
      message.error("Save failed:", errInfo);
    }
  };

  const columns = [
    {
      title: <strong>Config Type</strong>,
      dataIndex: "configType",
      width: "30%",
    },
    {
      title: <strong>Value</strong>,
      dataIndex: "value",
      width: "20%",
      align: "center",
      editable: true,
    },
    {
      title: <strong>Unit</strong>,
      dataIndex: "unit",
      align: "center",
      width: "15%",
      render: (text, record, index) => {
        // Merge the "days" unit for the last four rows
        if (index === 3) {
          onCell: (record) => ({ colSpan: 4 });
        }
        if (index > 3) {
          onCell: (record) => ({ colSpan: 0 });
        }
        return text; // Regular display for other rows
      },
    },
    {
      title: <strong>Lastest Update</strong>,
      dataIndex: "update",
      width: "15%",
      align: "center",
    },
    {
      title: <strong>Action</strong>,
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => handleSave(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>

            <a onClick={handleCancel}>Cancel</a>
          </span>
        ) : (
          <Button
            disabled={editingKey !== ""}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "value" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        <Sider width={256} style={{ backgroundColor: "#4D908E" }}>
          <NavBar_Manager />
        </Sider>
        <Layout style={{ padding: "16px" }}>
          <Content
            style={{
              padding: 12,
              margin: 0,
              background: "#fff",
              minHeight: 280,
            }}
          >
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <h2 style={titleStyle}>Configs System</h2>
            </div>
            <Spin spinning={loading}>
              <div style={{ width: "100%", margin: "0 auto" }}>
                <Form form={form} component={false}>
                  <Table
                    bordered
                    components={{
                      body: {
                        cell: EditableCell,
                      },
                    }}
                    dataSource={configs}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={false}
                  />
                </Form>
              </div>
            </Spin>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Configs;
