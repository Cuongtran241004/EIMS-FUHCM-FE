import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import NavBar from "../../components/NavBar/NavBar";
import { API_BASE_URL } from "../../configs/urlApi";
import { Spin, Table, Layout, Button, Form, Modal, Input, message } from "antd";
// Ant Design Layout Components
const { Content, Sider } = Layout;
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
];

const Staff = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL + "/staffs");
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.log("error", error);
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
    form.resetFields(); // Reset the form fields when the modal is closed
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // Validate form input
      // Send POST request to add new staff
      const response = await fetch(API_BASE_URL + "/staffs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Staff added successfully!");
        fetchData(); // Fetch updated data
        form.resetFields(); // Reset form after success
        setIsModalVisible(false); // Close modal after success
      } else {
        throw new Error("Failed to add staff");
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      message.error("Failed to add staff. Please try again.");
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        <Sider width={256} style={{ backgroundColor: "#fff" }}>
          <NavBar />
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
            <Button
              type="primary"
              onClick={showModal}
              style={{ marginBottom: "16px" }}
            >
              Add New Satff
            </Button>

            <Spin spinning={loading}>
              <Table dataSource={data} columns={columns} rowKey="id" />
            </Spin>
          </Content>
        </Layout>
      </Layout>

      {/* Add New Staff Modal */}
      <Modal
        title="Add New Staff"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add Staff"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="add_staff_form">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please input the staff name!" },
            ]}
          >
            <Input placeholder="Enter staff name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the staff email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter staff email" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};
export default Staff;
