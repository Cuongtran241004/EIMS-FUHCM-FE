import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import './Form.css';
import { ENTER_EMAIL, ENTER_PASSWORD } from '../../configs/messages';
import HandleEmail from '../../components/Handle/HandleEmail';

const onFinish = (values) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

function LoginForm() {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleEmailChange = (email, isValid) => {
    setEmail(email);
    setIsValid(isValid);
  };

  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
        fontWeight: 600,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <HandleEmail onEmailChange={handleEmailChange} />

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: ENTER_PASSWORD,
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>

     
    </Form>
  );
}

export default LoginForm;
