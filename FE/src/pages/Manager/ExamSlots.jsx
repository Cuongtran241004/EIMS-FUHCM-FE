import React, { useState, useContext } from "react";
import {
  Dropdown,
  Modal,
  Button,
  Space,
  Layout,
  Spin,
  Table,
  Checkbox,
  message,
  Radio,
} from "antd";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import Header from "../../components/Header/Header.jsx";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import CustomToolbar from "../../components/CustomCalendar/CustomToolbar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import examSlotApi from "../../services/ExamSlot.js";
import "./ExamSlots.css";
import { selectButtonStyle } from "../../design-systems/CSS/Button.js";

const localizer = momentLocalizer(moment);
const { Content, Sider } = Layout;
const { confirm } = Modal;

const ExamSlots = () => {
  const {
    semesters,
    selectedSemester,
    setSelectedSemester,
    loading,
    examSlotBySemester,
  } = useSemester();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [pendingSlots, setPendingSlots] = useState([]);
  const [checkedSlots, setCheckedSlots] = useState([]);
  const [modalState, setModalState] = useState({ show: false, action: "" });
  const [selectedAction, setSelectedAction] = useState("");
  const [view, setView] = useState('month');


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

  const handleCloseEventModal = () => {
    setIsModalVisible(false);
  };


  const handleCheckboxChange = (slotId) => {
    setCheckedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };

  const handleConfirmSlots = async () => {
    if (!selectedAction) {
      message.error("Please select an action (Approve or Reject)");
      return;
    }

    const status = selectedAction === "approve" ? "APPROVED" : "REJECTED";
    confirm({
      title: `Do you want to ${status.toLowerCase()} these slots?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const updatedSlots = checkedSlots.map((slot) => ({
          subjectExamId: slot.id,
          startAt: slot.startAt,
          endAt: slot.endAt,
          requiredInvigilators: slot.requiredInvigilators,
          status,
        }));

        try {
          const success = await examSlotApi.updateExamSlotByManager(updatedSlots);
          if (success) {
            message.success(`${status} successfully!`);
            setCheckedSlots([]);
            setModalState({ show: false, action: "" });
          }
        } catch (error) {
          message.error(`There was an error ${status.toLowerCase()} the slots!`);
          console.error(error);
        }
      },
    });
  };

  const openModalForAction = () => {
    const pending = examSlotBySemester.filter((slot) => slot.status === "PENDING");
    setPendingSlots(pending);
    setModalState({ show: true, action: "" });
  };

  const EventComponent = ({ event }) => (
    <span>
      <p style={{ margin: 0, fontWeight: 500, fontSize: 13.33333 }}>
        {moment(event.startAt).format("HH:mm")} - {moment(event.endAt).format("HH:mm")}
      </p>
    </span>
  );

  const columns = [
    {
      title: "Select",
      dataIndex: "select",
      key: "select",
      render: (_, record) => (
        <Checkbox
          style={{ display: "flex", justifyContent: "left", width: "100%" }}
          checked={checkedSlots.includes(record)}
          onChange={() => handleCheckboxChange(record)}
        />
      ),
    },
    {
      title: "Subject",
      dataIndex: "subjectName",
      key: "subjectName",
      render: (text, record) =>
        `${record.subjectExamDTO.subjectName} (${record.subjectExamDTO.subjectCode})`,
    },
    {
      title: "Invigilators",
      dataIndex: "requiredInvigilators",
      key: "requiredInvigilators",
      render: (text, record) => (
        <span style={{ display: 'flex', justifyContent: 'center' }}>{`${record.requiredInvigilators}`}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "startAt",
      key: "startAt",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "Start Time",
      dataIndex: "startAt",
      key: "startAt",
      render: (text) => moment(text).format("HH:mm"),
    },
    {
      title: "End Time",
      dataIndex: "endAt",
      key: "endAt",
      render: (text) => moment(text).format("HH:mm"),
    },
  ];

  const handleDrillDown = () => {
    if (view === 'month') {
      setView('agenda');
    }
  };

  return (
    <Layout style={{ height: "100vh", overflowY: "hidden" }}>
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
                  views={['month', 'agenda']}
                  localizer={localizer}
                  events={examSlotBySemester.filter((slot) => slot.status !== "NEEDS_ROOM_ASSIGNMENT")}
                  length={6}
                  onView={setView}
                  view={view}
                  onDrillDown={handleDrillDown}
                  onSelectEvent={handleSelectEvent}
                  startAccessor={(event) => new Date(event.startAt)}
                  endAccessor={(event) => new Date(event.endAt)}
                  style={{ height: 500, margin: "50px", width: "70%" }}
                  components={{ event: EventComponent, toolbar: CustomToolbar }}
                  messages={{ event: "Time" }}
                  formats={{
                    agendaDateFormat: (date) => moment(date).format("DD/MM/YYYY")
                  }}
                  eventPropGetter={(event) => {
                    let backgroundColor;
                    switch (event.status) {
                      case "APPROVED":
                        backgroundColor = "#52c41a";
                        break;
                      case "REJECTED":
                        backgroundColor = "#d9363e";
                        break;
                      case "PENDING":
                        backgroundColor = "rgb(249, 199, 79)";
                        break;
                      default:
                        backgroundColor = "#1890ff";
                        break;
                    }
                    return {
                      style: {
                        backgroundColor,
                        border: "1px solid #ddd",
                        color: backgroundColor === "#ddd" ? "black" : "white",
                      },
                    };
                  }}
                />
                <Modal
                  title="Details"
                  open={isModalVisible}
                  onOk={handleCloseEventModal}
                  onCancel={handleCloseEventModal}
                >
                  {selectedEvent && (
                    <div>
                      <p>
                        <strong>Date:</strong>{" "}
                        {moment(selectedEvent.startAt).format("DD/MM/YYYY")}
                      </p>
                      <p>
                        <strong>Start Time:</strong>{" "}
                        {moment(selectedEvent.startAt).format("HH:MM")}
                      </p>
                      <p>
                        <strong>End Time:</strong>{" "}
                        {moment(selectedEvent.endAt).format("HH:MM")}
                      </p>
                      <p>
                        <strong>Required Invigilators:</strong>{" "}
                        {selectedEvent.requiredInvigilators}
                      </p>
                      <p>
                        <strong>Status:</strong> {selectedEvent.status}
                      </p>
                      <p>
                        <strong>Subject:</strong>{" "}
                        {selectedEvent.subjectExamDTO.subjectName} (
                        {selectedEvent.subjectExamDTO.subjectCode})
                      </p>
                      <p>
                        <strong>Exam Type:</strong>{" "}
                        {selectedEvent.subjectExamDTO.examType}
                      </p>
                      <p>
                        <strong>Duration:</strong>{" "}
                        {selectedEvent.subjectExamDTO.duration} minutes
                      </p>
                    </div>
                  )}
                </Modal>
                <div style={{ display: 'grid', paddingTop: 50, paddingLeft: 40, paddingRight: 60, width: "30%" }}>
                  <Dropdown menu={menu} >
                    <Button style={selectButtonStyle}>
                      {selectedSemester ? selectedSemester.name : "Select a Semester"}{" "}
                      <DownOutlined />
                    </Button>
                  </Dropdown>
                  <Button
                    style={{
                      backgroundColor: "#1890ff",
                      color: "white",
                      width: "100%",
                    }}
                    onClick={openModalForAction}
                  >
                    Update
                  </Button>
                  <p>
                    <span style={{ color: "#52c41a" }}><strong>Approved</strong></span> <br />
                    <span style={{ color: "#d9363e" }}><strong>Rejected</strong></span> <br />
                    <span style={{ color: "rgb(249, 199, 79)" }}><strong>Pending</strong></span>
                  </p>
                </div>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>

      {modalState.show && (
        <Modal
          title="Handle Pending Slots"
          open={modalState.show}
          onCancel={() => setModalState({ show: false, action: "" })}
          footer={[
            <Button key="back" onClick={() => setModalState({ show: false, action: "" })}>
              Cancel
            </Button>,
            <Button
              key="approve"
              type="primary"
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              onClick={() => {
                setSelectedAction("approve");
                handleConfirmSlots();
              }}
            >
              Approve
            </Button>,
            <Button
              key="reject"
              type="primary"
              style={{ backgroundColor: "#d9363e", borderColor: "#d9363e" }}
              onClick={() => {
                setSelectedAction("reject");
                handleConfirmSlots();
              }}
            >
              Reject
            </Button>,
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
