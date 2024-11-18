import React, { useState } from "react";
import {
  Avatar,
  Button,
  Upload,
  Typography,
  Form,
  Input,
  Row,
  Col,
  message,
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  BackwardOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // For navigation
import { MANAGER_DASHBOARD_URL } from "../../configs/urlWeb";

const { Title } = Typography;

// Validate the file type and size
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must be smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const ProfilePage = ({ user }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // For navigation to dashboard
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  // Handle form submission to update password and phone number
  const onFinish = (values) => {
    console.log("Updated values:", values); // Send the updated values to the server or API
    // Implement the update logic here
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        marginTop: "10px",
        padding: "20px",
        backgroundColor: "#f7f9fc",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Title level={2} style={{ textAlign: "center", color: "#4D908E" }}>
        User Profile
      </Title>

      {/* User Info */}
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          fullName: `${user.lastName} ${user.firstName}`,
          email: user.email,
          department: user.department,
          fuId: user.fuId,
          phoneNumber: user.phoneNumber,
          password: "user123@",
        }}
        onFinish={onFinish}
      >
        {/* Avatar Section */}
        <Row gutter={16} style={{ marginBottom: "20px", textAlign: "center" }}>
          <Col span={24}>
            <Upload
              beforeUpload={beforeUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Avatar
                size={100}
                src={user.photoURL}
                icon={<UserOutlined />}
                style={{
                  cursor: "pointer",
                  margin: "0 auto",
                  border: "2px solid #4D908E",
                }}
              />
            </Upload>
            <div style={{ marginTop: 10, color: "#4D908E" }}>
              <Button
                icon={<PlusOutlined />}
                style={{ borderRadius: "4px" }}
                onClick={() => message.info("This feature is developing!")}
              >
                Change Avatar
              </Button>
            </div>
          </Col>
        </Row>

        {/* FU ID */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="FUID" name="fuId">
              <Input readOnly style={{ borderRadius: "4px" }} />
            </Form.Item>
          </Col>
          <Col span={16}>
            {/* Full Name */}
            <Form.Item label="Full Name" name="fullName">
              <Input readOnly style={{ borderRadius: "4px" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            {/* Department */}
            <Form.Item label="Department" name="department">
              <Input readOnly style={{ borderRadius: "4px" }} />
            </Form.Item>
          </Col>
          <Col span={16}>
            {/* Email */}
            <Form.Item label="Email" name="email">
              <Input readOnly style={{ borderRadius: "4px" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Password */}
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter a new password!" }]}
        >
          <Input
            placeholder="Enter new password"
            type={showPassword ? "text" : "password"} // Toggle between text and password
            style={{ borderRadius: "4px" }}
            suffix={
              showPassword ? (
                <EyeOutlined
                  onClick={() => setShowPassword(false)}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <EyeInvisibleOutlined
                  onClick={() => setShowPassword(true)}
                  style={{ cursor: "pointer" }}
                />
              )
            }
          />
        </Form.Item>

        {/* Phone Number */}
        <Form.Item
          label="Phone"
          name="phoneNumber"
          rules={[
            { required: true, message: "Please enter your phone number!" },
          ]}
        >
          <Input
            placeholder="Enter phone number"
            style={{ borderRadius: "4px" }}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            danger
            onClick={() => navigate("/")}
            style={{ marginRight: 10, borderRadius: "4px" }}
          >
            <BackwardOutlined />
            Return to Dashboard
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              float: "right",
              borderRadius: "4px",
              backgroundColor: "#4D908E",
              borderColor: "#4D908E",
            }}
          >
            Update
            <ReloadOutlined />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfilePage;
