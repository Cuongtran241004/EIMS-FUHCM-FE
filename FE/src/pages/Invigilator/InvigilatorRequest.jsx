import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useSemester } from "../../components/SemesterContext";

const { Option } = Select;

function InvigilatorRequest() {
  const {
    semesters = [],
    selectedSemester,
    setSelectedSemester,
    examSlotDetail: examSlots = [],
    loadingSemesters,
    loadingSchedules,
  } = useSemester();

  const [form] = Form.useForm();
  const id = localStorage.getItem("id") || "";

  const onFinish = async (values) => {
    try {
      const { examSlot, reason } = values;
      const requestPayload = {
        fuId: id,
        semesterInvigilatorAssignment: [
          {
            semesterId: selectedSemester,
            examSlotDetailSet: [{ examSlotId: examSlot }],
          },
        ],
        reason,
      };
      console.log("Request Payload:", requestPayload);

      message.success("Request submitted successfully");
    } catch (e) {
      console.error("Submit Error:", e.message);
      message.error("Error submitting the request");
    }
  };

  const handleSemesterChange = (value) => {
    const selected = semesters.find(
      (semester) => semester.id === parseInt(value)
    );
    setSelectedSemester(selected);
  };

  return (
    <div style={{ paddingLeft: 100, paddingRight: 100, paddingTop: 10 }}>
      {loadingSemesters || loadingSchedules ? (
        <div>Loading...</div>
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Semester"
            name="semester"
            rules={[{ required: true, message: "Please select a semester" }]}
          >
            <Select
              placeholder="Select Semester"
              onChange={handleSemesterChange}
              value={selectedSemester?.id}
            >
              {semesters.map((semester) => (
                <Option key={semester.id} value={semester.id}>
                  {semester.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Exam slot"
            name="examSlot"
            rules={[{ required: true, message: "Please select an exam slot" }]}
          >
            <Select placeholder="Select Exam Slot">
              {examSlots.map((slot) => (
                <Option key={slot.examSlotId} value={slot.examSlotId}>
                  {new Date(slot.startAt).toLocaleString()} -{" "}
                  {new Date(slot.endAt).toLocaleString()}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Reason"
            name="reason"
            rules={[
              {
                required: true,
                message: "Please provide a reason for the request",
              },
            ]}
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
