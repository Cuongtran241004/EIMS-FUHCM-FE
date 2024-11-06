import React, { useState, useContext, useCallback, useEffect } from "react";
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
import { useSemester } from "../../components/Context/SemesterContextManager.jsx";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import CustomToolbar from "../../components/CustomCalendar/CustomToolbar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import examSlotApi from "../../services/ExamSlot.js";
import "./ExamSlots.css";
import { selectButtonStyle } from "../../design-systems/CSS/Button.js";
import { requestTag } from "../../design-systems/CustomTag.jsx";
import "./calendar.css";

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
    reloadSlots,
  } = useSemester();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [pendingSlots, setPendingSlots] = useState([]);
  const [checkedSlots, setCheckedSlots] = useState([]);
  const [modalState, setModalState] = useState({ show: false, action: "" });
  const [status, setStatus] = useState("");
  const [view, setView] = useState("month");
  const [count, setCount] = useState(0);

  const handleMenuClick = (e) => {
    const selected = semesters.find(
      (semester) => semester.id === parseInt(e.key)
    );
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

  useEffect(() => {
    const handleConfirmSlots = async () => {
      if (!status) {
        return;
      }
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
            const success =
              await examSlotApi.updateExamSlotByManager(updatedSlots);
            if (success && updatedSlots.length > 0) {
              message.success(`${status} successfully!`);
              reloadSlots();
              setCheckedSlots([]);
              setModalState({ show: false, action: "" });
            } else {
              message.error(`Exam slots must be selected at least one!`);
            }
          } catch (error) {
            message.error(`${status.toLowerCase()} unsuccessfully!`);
            console.error(error);
          }
        },
      });
    };
    handleConfirmSlots();
  }, [count]);

  const openModalForAction = () => {
    const pending = examSlotBySemester.filter(
      (slot) => slot.status === "PENDING"
    );
    setPendingSlots(pending);
    setModalState({ show: true, action: "" });
  };

  const EventComponent = ({ event }) => (
    <span>
      <p style={{ margin: 0, fontWeight: 500, fontSize: 13.33333 }}>
        {moment(event.startAt).format("HH:mm")} -{" "}
        {moment(event.endAt).format("HH:mm")}
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
        <span
          style={{ display: "flex", justifyContent: "center" }}
        >{`${record.requiredInvigilators}`}</span>
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

  return (
    <Layout style={{ height: "100vh", overflowY: "hidden" }}>
      <Header />
      <Layout>
        <Sider width={256} style={{ backgroundColor: "#4D908E" }}>
          <NavBar_Manager />
        </Sider>
        <Layout>
          <Content style={{ padding: "24px", minHeight: "100vh" }}>
            <h1
              style={{
                color: "red",
                display: "flex",
                justifyContent: "center",
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              {" "}
              EXAM SLOTS{" "}
            </h1>
            {loading ? (
              <Spin tip="Loading..." size="large" />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginTop: -20,
                }}
              >
                <BigCalendar
                  views={["month", "agenda", "day"]}
                  localizer={localizer}
                  events={examSlotBySemester.filter(
                    (slot) => slot.status !== "NEEDS_ROOM_ASSIGNMENT"
                  )}
                  length={6}
                  onView={setView}
                  view={view}
                  dayLayoutAlgorithm="no-overlap"
                  step={30}
                  timeslots={1}
                  onSelectEvent={handleSelectEvent}
                  startAccessor={(event) => new Date(event.startAt)}
                  endAccessor={(event) => new Date(event.endAt)}
                  style={{ height: 500, margin: "50px", width: "100%" }}
                  components={{ event: EventComponent, toolbar: CustomToolbar }}
                  messages={{ event: "Time" }}
                  formats={{
                    agendaDateFormat: (date) =>
                      moment(date).format("DD/MM/YYYY"),
                    timeGutterFormat: (date) => moment(date).format("HH:mm"),
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
                      default:
                        backgroundColor = "rgb(249, 199, 79)";
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
                  title="Details of exam slot"
                  open={isModalVisible}
                  onCancel={handleCloseEventModal}
                  footer={[
                    <Button key="close" onClick={handleCloseEventModal}>
                      Close
                    </Button>,
                  ]}
                >
                  {selectedEvent && (
                    <div>
                      <table>
                        <tbody>
                          <tr>
                            <th className="table-head">
                              <strong>Date:</strong>
                            </th>
                            <td>
                              {moment(selectedEvent.startAt).format(
                                "DD/MM/YYYY"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th className="table-head">
                              <strong>Time:</strong>
                            </th>
                            <td>
                              {moment(selectedEvent.startAt).format("HH:MM")} -{" "}
                              {moment(selectedEvent.endAt).format("HH:MM")}
                            </td>
                          </tr>
                          <tr>
                            <th className="table-head">
                              <strong>Subject:</strong>
                            </th>
                            <td>
                              {selectedEvent.subjectExamDTO.subjectName} (
                              {selectedEvent.subjectExamDTO.subjectCode})
                            </td>
                          </tr>
                          <tr>
                            <th className="table-head">
                              <strong>Required Invigilators:</strong>
                            </th>
                            <td>{selectedEvent.requiredInvigilators}</td>
                          </tr>
                          <tr>
                            <th className="table-head">
                              <strong>Status:</strong>
                            </th>
                            <td>{requestTag(selectedEvent.status)}</td>
                          </tr>
                          <tr>
                            <th className="table-head">
                              <strong>Exam Type:</strong>
                            </th>
                            <td>{selectedEvent.subjectExamDTO.examType}</td>
                          </tr>
                          <tr>
                            <th className="table-head">
                              <strong>Duration:</strong>
                            </th>
                            <td>
                              {selectedEvent.subjectExamDTO.duration} minutes
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </Modal>
                <div
                  style={{
                    display: "grid",
                    paddingTop: 50,
                    paddingLeft: 40,
                    paddingRight: 60,
                    width: "30%",
                  }}
                >
                  <Dropdown menu={menu}>
                    <Button style={selectButtonStyle}>
                      {selectedSemester
                        ? selectedSemester.name
                        : "Select a Semester"}{" "}
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
                    <span style={{ color: "#52c41a" }}>&#9632; </span>{" "}
                    <span style={{ marginLeft: 10 }}>Approved</span>
                    <br />
                    <span style={{ color: "#d9363e" }}>&#9632; </span>{" "}
                    <span style={{ marginLeft: 10 }}>Rejected</span> <br />
                    <span style={{ color: "rgb(249, 199, 79)" }}>
                      &#9632;{" "}
                    </span>{" "}
                    <span style={{ marginLeft: 10 }}>Pending</span>
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
            <Button
              key="back"
              onClick={() => setModalState({ show: false, action: "" })}
            >
              Cancel
            </Button>,
            <Button
              key="approve"
              type="primary"
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              onClick={() => {
                setStatus("APPROVED");
                setCount(count + 1);
              }}
            >
              Approve
            </Button>,
            <Button
              key="reject"
              type="primary"
              style={{ backgroundColor: "#d9363e", borderColor: "#d9363e" }}
              onClick={() => {
                setStatus("REJECTED");
                setCount(count + 1);
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
