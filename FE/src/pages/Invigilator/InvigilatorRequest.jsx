import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { getSemester } from '../../components/API/getSemester';
import { schedules } from '../../components/API/schedules';

const { Option } = Select;

function InvigilatorRequest() {
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [examSlots, setExamSlots] = useState([]);
    const [form] = Form.useForm();

    const id = localStorage.getItem('id') || '';

    useEffect(() => {
        const fetchSemester = async () => {
          try {
            const response = await getSemester();
            setSemesters(response);
          } catch (e) {
            console.error('getSemester Error: ', e.message);
          }
        };
        fetchSemester();
      }, []);
    
      useEffect(() => {
        if (selectedSemester) {
            console.log('Selected Semester:', selectedSemester);
            const fetchSchedules = async () => {
                try {
                    const obj = await schedules(selectedSemester);
                    const examSlotDetailSet = obj.semesterInvigilatorAssignment[0].examSlotDetailSet; 
                    const mappedEvents = examSlotDetailSet.map(slot => ({
                        examSlotId: slot.examSlotId,
                        startAt: new Date(slot.startAt),
                        endAt: new Date(slot.endAt),
                    }));
                    setExamSlots(mappedEvents);
                } catch (e) {
                    console.error('fetchSchedules Error: ', e.message);
                }
            };
            fetchSchedules();
        }
    }, [selectedSemester]);

    const onFinish = async (values) => {
        try {
            const { examSlot, reason } = values;
            const requestPayload = {
                fuId: id, 
                semesterInvigilatorAssignment: [
                    {
                        semesterId: selectedSemester,
                        examSlotDetailSet: [{ examSlotId: examSlot }]
                    }
                ],
                reason
            };
            console.log('Request Payload:', requestPayload);

            message.success('Request submitted successfully');
        } catch (e) {
            console.error('Submit Error:', e.message);
            message.error('Error submitting the request');
        }
    };

    return (
        <div style={{ paddingLeft: 100, paddingRight: 100, paddingTop: 10 }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>

                <Form.Item label="Semester" name="semester" rules={[{ required: true, message: 'Please select a semester' }]}>
                    <Select
                        placeholder="Select Semester"
                        onChange={(value) => setSelectedSemester(value)}
                    >
                        {semesters.map((semester) => (
                            <Option key={semester.id} value={semester.id}>
                                {semester.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Exam slot" name="examSlot" rules={[{ required: true, message: 'Please select an exam slot' }]}>
                    <Select placeholder="Select Exam Slot">
                        {examSlots.map((slot) => (
                            <Option key={slot.examSlotId} value={slot.examSlotId}>
                                {new Date(slot.startAt).toLocaleString()} - {new Date(slot.endAt).toLocaleString()}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Reason" name="reason" rules={[{ required: true, message: 'Please provide a reason for the request' }]}>
                    <Input.TextArea placeholder="Enter reason" rows={4} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit Request
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default InvigilatorRequest;
