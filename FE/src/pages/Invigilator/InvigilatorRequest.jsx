import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useSemester } from "../../components/SemesterContext";
import { postRequest } from "../../components/API/postRequest";
import moment from "moment";
import { ConfigType } from "../../configs/enum";
import { titleStyle } from "../../design-systems/CSS/Title";
import "./InvigilatorRequest.css";
import { getRequestType } from "../../components/API/getRequestType";

const { Option } = Select;

function InvigilatorRequest() {
  const {
    examSlotDetail: examSlots = [],
    loadingSemesters,
    loadingSchedules,
    getConfigValue,
  } = useSemester();

  const [form] = Form.useForm();
  const id = localStorage.getItem("id") || "";
  const [requestType, setRequestType] = useState({ requestTypes: [] }); 

  const onFinish = async (values) => {
    try {
      const { examSlot, reason } = values;
      const requestPayload = {
        fuId: id,
        examSlotId: examSlot,
        reason,
        requestType: values.requestType,
      };
      console.log("Request Payload: ", requestPayload);
      try {
        const success = await postRequest(requestPayload);
        if (success) {
          message.success("Request submitted successfully");
          form.resetFields();
        } else {
          message.error("Error Request.");
        }
      } catch (e) {
        message.error(e.message || "Error Request.");
      }
    } catch (e) {
      console.error("Submit Error:", e.message);
      message.error("Error submitting the request");
    }
  };

  useEffect(() => {
    const fetchRequestType = async () => {
      try {
        const response = await getRequestType();
          setRequestType(response); 
      } catch (e) {
        console.error("requestType Error: ", e.message);
        message.error("Error fetching request type.");
      }
    };
    fetchRequestType();
  }, []);

  return (
    <div>
      <div
        style={{
          paddingLeft: 100,
          paddingRight: 100,
          paddingTop: 10,
        }}
      >
        <h2 style={{ textAlign: "center", ...titleStyle }}>REQUEST</h2>
        {loadingSemesters || loadingSchedules ? (
          <div>Loading...</div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ width: "90%", margin: "auto" }}
          >
            <Form.Item
              label="Request type"
              name="requestType"
              rules={[
                { required: true, message: "Please select a request type" },
              ]}
            >
              <Select placeholder="Select Request Type">
                {
                  requestType.requestTypes.map((type) => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))
                }
              </Select>
            </Form.Item>

            <Form.Item
              label="Exam slot"
              name="examSlot"
              rules={[
                { required: false, message: "Please select an exam slot" },
              ]}
            >
              <Select placeholder="Select Exam Slot">
                {examSlots.map((slot) => {
                  const currentDate = moment();
                  const openAt = moment(slot.startAt).subtract(
                    getConfigValue(ConfigType.TIME_BEFORE_CLOSE_REQUEST),
                    "days"
                  );
                  const closeAt = moment(slot.startAt);
                  if (currentDate.isBetween(openAt, closeAt)) {
                    return (
                      <Option key={slot.examSlotId} value={slot.examSlotId}>
                        {moment(slot.startAt).format("DD/MM/YYYY")} |{" "}
                        {moment(slot.startAt).format("HH:mm")} -{" "}
                        {moment(slot.endAt).format("HH:mm")}
                      </Option>
                    );
                  }
                  return null; 
                })}
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
              <Input.TextArea
                placeholder="Enter reason"
                rows={4}
                maxLength={1000}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit Request
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
}

export default InvigilatorRequest;
