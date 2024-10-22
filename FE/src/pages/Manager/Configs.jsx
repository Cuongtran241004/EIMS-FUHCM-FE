import React, { useState, useEffect } from "react";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import moment from "moment";
import {
  Layout,
  Form,
  Table,
  Input,
  message,
  Popconfirm,
  InputNumber,
  Typography,
  Spin,
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
      const hourly_rate = await configApi.getHourlyRate();
      console.log(hourly_rate);
      const allowed_slot = await configApi.getAllowedSlot();
      const time_before_exam = await configApi.getTimeBeforeExam();
      const time_before_open_registration =
        await configApi.getTimeBeforeOpenRegistration();
      const invigilator_room = await configApi.getInvigilatorRoom();
      const time_before_close_registration =
        await configApi.getTimeBeforeCloseRegistration();
      const time_before_close_request =
        await configApi.getTimeBeforeCloseRequest();

      const result = [
        {
          key: "hourly_rate",
          configType: "Hourly Rate",
          value: new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(hourly_rate.value), // Format as Vietnamese currency
          unit: "VND/hour",
        },
        {
          key: "allowed_slot",
          configType: "Allowed Slot",
          value: allowed_slot.value,
          unit: "slot(s)",
        },
        {
          key: "invigilator_room",
          configType: "Invigilator Room",
          value: invigilator_room.value,
          unit: "room",
        },
        {
          key: "time_before_exam",
          configType: "Time Before Exam",
          value: time_before_exam.value,
          unit: "day(s)",
        },
        {
          key: "time_before_open_registration",
          configType: "Time Before Open Registration",
          value: time_before_open_registration.value,
          unit: "day(s)",
        },

        {
          key: "time_before_close_registration",
          configType: "Time Before Close Registration",
          value: time_before_close_registration.value,
          unit: "day(s)",
        },
        {
          key: "time_before_close_request",
          configType: "Time Before Close Request",
          value: time_before_close_request.value,
          unit: "day(s)",
        },
      ];

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

  const edit = (record) => {
    form.setFieldsValue({ value: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...configs];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setConfigs(newData);
        setEditingKey("");
        // Here, you would also call the API to update the config in the backend
      } else {
        newData.push(row);
        setConfigs(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      message.error("Save failed:", errInfo);
    }
  };

  const columns = [
    {
      title: <strong>Config Type</strong>,
      dataIndex: "configType",
      width: "40%",
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
      width: "20%",
      render: (text, record, index) => {
        // Merge the "days" unit for the last four rows
        if (index === 3) {
          return {
            children: text,
            props: { rowSpan: 4 }, // Merge 4 rows starting from index 3
          };
        }
        if (index > 3) {
          return {
            props: { colSpan: 0 }, // Hide unit for merged rows
          };
        }
        return text; // Regular display for other rows
      },
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
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
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
                <Form form={form} component={false} >
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
