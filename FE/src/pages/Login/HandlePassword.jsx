import React, { useState } from "react";
import { Input, Form, Button, message } from "antd";
import { ENTER_PASSWORD } from "../../configs/messages";
import "./HandlePassword.css";
import { postHandlePassword } from "../../components/API/postHandlePassword";
import Header from "../../components/Header/Header";

function HandlePassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    console.log("Success:", values);
    setLoading(true);
    const data = {
      email: values.email,
      password: values.password,
    };

    const success = postHandlePassword(data);
    if (success) {
      window.location.href = "/login";
    } else {
      message.error("Error setting password.");
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const validatePassword = (_, value) => {
    if (!value || form.getFieldValue("password") === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Passwords do not match!"));
  };

  return (
    <div className="password-container">
      <Header />
      <h2>Set Your Password</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="password-form"
      >
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: ENTER_PASSWORD,
            },
          ]}
          hasFeedback
        >
          <Input.Password size="large" placeholder="Enter your password" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            {
              validator: validatePassword,
            },
          ]}
        >
          <Input.Password size="large" placeholder="Confirm your password" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="password-submit-button"
          >
            Set Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default HandlePassword;
