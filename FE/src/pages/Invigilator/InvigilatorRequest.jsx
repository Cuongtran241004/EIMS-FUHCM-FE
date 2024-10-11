import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useSemester } from '../../components/SemesterContext';
import { postRequest } from '../../components/API/postRequest';

const { Option } = Select;

function InvigilatorRequest() {
  const {
    selectedSemester,
    examSlotDetail: examSlots = [],
    loadingSemesters,
    loadingSchedules,
  } = useSemester();

  const [form] = Form.useForm();
  const id = localStorage.getItem('id') || '';

  const onFinish = async (values) => {
    try {
      const { examSlot, reason } = values;
      const requestPayload = {
        fuId: id,
        examSlotId: examSlot,
        reason,
      };
      console.log('Request Payload:', requestPayload);
      try {
        const success = await postRequest(requestPayload);
        if (success) {
          message.success('Request submitted successfully');
          form.resetFields();
        } else {
          message.error('Error Request.');
        }
      } catch (e) {
        message.error(e.message || 'Error Request.');
      }

      
    } catch (e) {
      console.error('Submit Error:', e.message);
      message.error('Error submitting the request');
    }
  };
 



  return (
    <div style={{ paddingLeft: 100, paddingRight: 100, paddingTop: 10 }}>
      {loadingSemesters || loadingSchedules ? (
        <div>Loading...</div>
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>

          <Form.Item
            label="Exam slot"
            name="examSlot"
            rules={[{ required: true, message: 'Please select an exam slot' }]}
          >
            <Select placeholder="Select Exam Slot">
              {examSlots.map((slot) => (
                <Option key={slot.examSlotId} value={slot.examSlotId}>
                  {new Date(slot.startAt).toLocaleString()} - {new Date(slot.endAt).toLocaleString()}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: 'Please provide a reason for the request' }]}
          >
            <Input.TextArea placeholder="Enter reason" rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Request
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}

export default InvigilatorRequest;
