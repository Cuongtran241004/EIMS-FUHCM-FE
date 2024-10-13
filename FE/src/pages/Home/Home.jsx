import React, { useState } from "react";
import { Avatar, Button, Upload, Typography, Form, Input } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ProfilePage = ({ user }) => {
  const [avatar, setAvatar] = useState(null); // Store the avatar locally
  const [form] = Form.useForm();

  // Handle avatar change
  const handleAvatarChange = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target.result); // Set avatar to the file preview (not stored in database)
    };
    reader.readAsDataURL(file);
    return false; // Prevent file upload to server
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <Title level={2}>User Profile</Title>

      {/* Avatar */}
      <Avatar
        size={100}
        src={avatar || user.photoURL}
        icon={<UserOutlined />}
        style={{ marginBottom: "20px" }}
      />

      {/* Upload new avatar */}
      <Upload
        beforeUpload={handleAvatarChange}
        showUploadList={false}
        accept="image/*"
      >
        <Button icon={<UploadOutlined />}>Change Avatar</Button>
      </Upload>

      {/* User Info */}
      <Form
        form={form}
        layout="vertical"
        initialValues={user}
        style={{ marginTop: "20px" }}
      >
        <Form.Item label="Name" name="name">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input readOnly />
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfilePage;
