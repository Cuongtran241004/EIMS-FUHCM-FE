import React, { useState, useContext } from "react";
import { Dropdown, Modal, Button, Space, Layout, Spin, Table, Checkbox, message } from "antd";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import examSlotApi from "../../services/ExamSlot.js";
import './ExamSlots.css';

const localizer = momentLocalizer(moment);
const { Content, Sider } = Layout;
const { confirm } = Modal;

const ExamSlots = () => {
  const { semesters, selectedSemester, setSelectedSemester, loading, examSlotBySemester } = useSemester();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [pendingSlots, setPendingSlots] = useState([]);
  const [showPending, setShowPending] = useState(false);
  const [checkedSlots, setCheckedSlots] = useState([]);

  const handleMenuClick = (e) => {
    const selected = semesters.find((semester) => semester.id === parseInt(e.key));
    setSelectedSemester(selected);
  };

  const menuItems = semesters.map((semester) => ({
    key: semester.id,
    label: semester.name,
  }));

  const menu = {
    items: menuItems,
    onClick: handleMenuClick,
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleApprove = () => {
    const pending = examSlotBySemester.filter(slot => slot.status === "PENDING");
    setPendingSlots(pending);
    setShowPending(true);
  };

  const handleCheckboxChange = (slotId) => {
    setCheckedSlots((prev) =>
      prev.includes(slotId) ? prev.filter(id => id !== slotId) : [...prev, slotId]
    );
  };

  const handleConfirm = async () => {
    confirm({
      title: 'Do you want to approve these slots?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        
        const updatedSlots = checkedSlots.map((slot) => ({
          subjectExamId: slot.id,
          startAt: slot.startAt,
          endAt: slot.endAt, 
          requiredInvigilators: slot.requiredInvigilators,
          status: "APPROVED" 
        }));
        
        // console.log(updatedSlots);
        try {
          const success = await examSlotApi.updateExamSlot(updatedSlots);
          // const success = true;
          if (success) {
            message.success('Approved successfully!');
            setCheckedSlots([]);
            setShowPending(false);
          }
        } catch (error) {
          message.error('There was an error approving the slots!');
          console.error(error);
        }
      },
    });
  };

  const EventComponent = ({ event }) => (
    <span>
      <p style={{ margin: 0, fontWeight: 500, fontSize: 13.33333 }}>
        {new Date(event.startAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} -
        {new Date(event.endAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </span>
  );

  const columns = [
    {
      title: 'Select',
      dataIndex: 'select',
      key: 'select',
      render: (_, record) => (
        <Checkbox
          checked={checkedSlots.includes(record)}
          onChange={() => handleCheckboxChange(record)}
        />
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subjectName',
      key: 'subjectName',
      render: (text, record) => `${record.subjectExamDTO.subjectName} (${record.subjectExamDTO.subjectCode})`,
    },
    {
      title: 'Start Time',
      dataIndex: 'startAt',
      key: 'startAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'End Time',
      dataIndex: 'endAt',
      key: 'endAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      <Header />
      <Layout>
        <Sider width={256} style={{ backgroundColor: "#4D908E" }}>
          <NavBar_Manager />
        </Sider>
        <Layout>
          <Content style={{ padding: "24px", minHeight: "100vh" }}>
            {loading ? (
              <Spin tip="Loading..." size="large" />
            ) : (
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <BigCalendar
                  views={{ day: true, week: true, month: true }}
                  localizer={localizer}
                  events={examSlotBySemester}
                  onSelectEvent={handleSelectEvent}
                  startAccessor={(event) => { return new Date(event.startAt) }}
                  endAccessor={(event) => { return new Date(event.endAt) }}
                  style={{ height: 500, margin: "50px", width: "70%" }}
                  components={{
                    event: EventComponent,
                  }}
                />
                <Modal
                  title="Details"
                  open={isModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                >
                  {selectedEvent && (
                    <div>
                      <p><strong>Date:</strong> {new Date(selectedEvent.startAt).toLocaleDateString()}</p>
                      <p><strong>Start Time:</strong> {new Date(selectedEvent.startAt).toLocaleTimeString()}</p>
                      <p><strong>End Time:</strong> {new Date(selectedEvent.endAt).toLocaleTimeString()}</p>
                      <p><strong>Created At:</strong> {new Date(selectedEvent.createdAt).toLocaleString()}</p>
                      <p><strong>Created By:</strong> {selectedEvent.createdBy}</p>
                      <p><strong>Required Invigilators:</strong> {selectedEvent.requiredInvigilators}</p>
                      <p><strong>Status:</strong> {selectedEvent.status}</p>
                      <p><strong>Subject:</strong> {selectedEvent.subjectExamDTO.subjectName} ({selectedEvent.subjectExamDTO.subjectCode})</p>
                      <p><strong>Exam Type:</strong> {selectedEvent.subjectExamDTO.examType}</p>
                      <p><strong>Duration:</strong> {selectedEvent.subjectExamDTO.duration} minutes</p>
                    </div>
                  )}
                </Modal>
                <div style={{ marginLeft: 30, marginTop: 40, display: 'grid', width: '15%' }}>
                  <Dropdown menu={menu} trigger={["click"]}>
                    <Button size="large">
                      <Space>
                        {selectedSemester ? selectedSemester.name : "No Semesters Available"}
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                  <div>
                    <Button onClick={handleApprove}>Approve</Button>
                    <Button>Reject</Button>
                  </div>
                </div>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>

      {showPending && (
        <Modal
          title="Pending Slots"
          open={showPending}
          onOk={handleConfirm}
          onCancel={() => setShowPending(false)}
          footer={[
            <Button key="back" onClick={() => setShowPending(false)}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleConfirm}>
              Approve
            </Button>
          ]}
        >
          <Table
            columns={columns}
            dataSource={pendingSlots}
            rowKey="id"
            pagination={{
              pageSize: 4,
              showSizeChanger: false,
              showQuickJumper: false,
              position: ["bottomCenter"],
            }}
          />
        </Modal>
      )}
    </Layout>
  );
};

export default ExamSlots;
