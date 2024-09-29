import React, { useState, useEffect } from "react";
import { Layout, Form, InputNumber, Button, Spin, message } from "antd";
import configApi from "../../services/Config.js";
import {
  FETCH_CONFIG_FAILED,
  UPDATE_CONFIG_SUCCESS,
  UPDATE_CONFIG_FAILED,
} from "../../configs/messages.jsx";
import Header_Manager from "../../components/Header/Header_Manager.jsx";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager.jsx";

const { Content, Sider } = Layout;

const ConfigSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [configData, setConfigData] = useState({
    hourRate: 0,
    maximumSlot: 0,
  });

  // Fetch the configuration data from the API
  const fetchConfig = async () => {
    setLoading(true);
    try {
      const result = await configApi.getConfig();
      setConfigData(result);
      form.setFieldsValue(result);
    } catch (error) {
      message.error(FETCH_CONFIG_FAILED);
    } finally {
      setLoading(false);
    }
  };

  // Update configuration
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await configApi.updateConfig(values);
      message.success(UPDATE_CONFIG_SUCCESS);
    } catch (error) {
      message.error(UPDATE_CONFIG_FAILED);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <Layout>
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
              minHeight: 150,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin spinning={loading}>
              <div
                style={{
                  width: "400px", // Small form width
                  padding: "20px",
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Light shadow for depth
                  backgroundColor: "#fff",
                }}
              >
                <h2 style={{ textAlign: "center" }}>Configuration Settings</h2>
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                  <Form.Item
                    label="Hour Rate"
                    name="hourRate"
                    rules={[
                      {
                        required: true,
                        message: "Please input the hour rate!",
                      },
                      {
                        type: "number",
                        min: 1,
                        message: "Hour rate must be a positive number!",
                      },
                    ]}
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
                    label="Max Slot"
                    name="maximumSlot"
                    rules={[
                      {
                        required: true,
                        message: "Please input the maximum slot!",
                      },
                      {
                        type: "number",
                        min: 1,
                        message: "Maximum slot must be a positive number!",
                      },
                    ]}
                  >
                    <InputNumber
                      min={1}
                      placeholder="Enter maximum slot"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                  >
                    Save Settings
                  </Button>
                </Form>
              </div>
            </Spin>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ConfigSettings;
