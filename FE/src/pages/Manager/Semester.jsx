import React, { useState } from "react";
import Header_Manager from "../../components/Header/Header_Manager";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import { Layout, Button, Space } from "antd";

// Ant Design Layout Components
const { Content, Sider } = Layout;
const Semester = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
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
                Add New Semester
              </Button>
            </Space>

            {/* <Spin spinning={loading}>
                  <Table
                    dataSource={data}
                    columns={columns}
                    rowKey={Math.random}
                    pagination={{ pageSize: 8 }}
                  />
                </Spin> */}
          </Content>
        </Layout>
      </Layout>

      {/* Add/Edit Staff Modal */}
      {/* <Modal
            title={isEditing ? "Edit Staff" : "Add New Staff"}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Submit"
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
          </Modal> */}
    </Layout>
  );
};

export default Semester;
