import React, { useState, useEffect } from "react";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import {
  Layout,
  Form,
  Table,
  Input,
  message,
  Button,
  Spin,
  InputNumber,
} from "antd";
import configApi from "../../services/Config.js";

import Header from "../../components/Header/Header.jsx";
import { titleStyle } from "../../design-systems/CSS/Title.js";
import { managerMapperUtil } from "../../utils/Mapper/ManagerMapperUtil.jsx";
import "./Configs.css";
import { EditOutlined } from "@ant-design/icons";

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
  const getValidationRules = (configType) => {
    switch (configType) {
      case "hourly_rate":
        return [
          { required: true, message: "Required" },
          {
            type: "number",
            min: 0,
            max: 1000000,
            message: "Must be a positive number",
          },
        ];
      case "allowed_slot":
        return [
          { required: true, message: "Required" },
          {
            type: "number",
            min: 1,
            max: 30,
            message: "Invalid number of slots",
          },
        ];
      case "time_before_exam":
      case "time_before_open_registration":
      case "time_before_close_registration":
        return [
          { required: true, message: "Required" },
          {
            type: "number",
            min: 1,
            max: 30,
            message: "Invalid number of days",
          },
        ];
      case "time_before_close_request":
        return [
          { required: true, message: "Required" },
          {
            type: "number",
            min: 1,
            max: 30,
            message: "Invalid number of days",
          },
        ];
      case "invigilator_room":
        return [{ required: true, message: "Required" }];
      case "check_in_time_before_exam_slot":
      case "check_out_time_after_exam_slot":
        return [
          { required: true, message: "Required" },
          {
            type: "number",
            min: 1,
            max: 60,
            message: "Invalid number of minutes",
          },
        ];
      case "extra_invigilator":
        return [
          { required: true, message: "Required" },
          {
            type: "number",
            min: 0,
            max: 10,
            message: "Invalid number of people",
          },
        ];
      default:
        return [{ required: true, message: "Required" }];
    }
  };
  const inputNode =
    record?.configType === "invigilator_room" ? (
      <Input maxLength={10} /> // Text input for invigilator_room
    ) : inputType === "number" ? (
      <InputNumber />
    ) : (
      <Input />
    );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={getValidationRules(record.configType)} // Use dynamic validation rules
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
  const [saveLoading, setSaveLoading] = useState(false);
  const isEditing = (record) => record.key === editingKey;

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const response = await configApi.getAllConfigsLatestSemester();
      const result = managerMapperUtil.mapConfigs(response);
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

  const handleSave = async (record) => {
    setSaveLoading(true);
    try {
      await form.validateFields().then(async () => {
        const value = form.getFieldValue();
        const configData = {
          id: record.id,
          value: value.value,
        };
        await configApi.updateConfig(configData);
        setEditingKey("");
        fetchConfigs();
        message.success("Save successfully");
      });
    } catch (error) {
      message.error("Failed to save");
    } finally {
      setSaveLoading(false);
    }
  };

  const columns = [
    {
      title: <strong>No</strong>,
      dataIndex: "no",
      key: "no",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: <strong>Config Type</strong>,
      dataIndex: "displayType",
      width: "30%",
    },
    {
      title: <strong>Value</strong>,
      dataIndex: "value",
      width: "20%",
      align: "center",
      editable: true,
      render: (text) => {
        return new Intl.NumberFormat("vi-VN", {
          maximumFractionDigits: 0, // No decimal places
        }).format(text);
      },
    },
    {
      title: <strong>Unit</strong>,
      dataIndex: "unit",
      align: "center",
      width: "15%",
    },

    {
      title: <strong>Action</strong>,
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type="link"
              onClick={() => handleSave(record)}
              style={{
                marginRight: 8,
                color: "#F3722C",
              }}
              loading={saveLoading}
            >
              Save
            </Button>

            <a onClick={handleCancel} style={{ color: "#F3722C" }}>
              Cancel
            </a>
          </span>
        ) : (
          <Button
            disabled={editingKey !== ""}
            type="link"
            onClick={() => handleEdit(record)}
          >
            <EditOutlined style={{ color: "#4D908E" }} />
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
              <h2 style={titleStyle}>Configs System</h2>
            </div>
            <Spin spinning={loading}>
              <div style={{ width: "100%", margin: "0 auto" }}>
                <Form form={form} component={false}>
                  <Table
                    className="custom-table-config"
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
