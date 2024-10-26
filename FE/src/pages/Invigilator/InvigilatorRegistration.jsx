import { UserContext } from "../../components/UserContext";
import React, { useState, useEffect, useContext } from "react";
import {
  Dropdown,
  message,
  Button,
  Space,
  Modal,
  Checkbox,
  Skeleton,
  notification,
} from "antd";
import {
  DownOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { postRegisterSlots } from "../../components/API/postRegisterSlots";
import { cancelRegisteredSlot } from "../../components/API/cancelRegisteredSlot";
import { useSemester } from "../../components/SemesterContext";
import { Calendar, momentLocalizer } from "react-big-calendar";
import CustomToolbar from "../../components/CustomCalendar/CustomToolbar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./invigilatorRegistration.css";
import { ConfigType } from "../../configs/enum";
import { titleStyle } from "../../design-systems/CSS/Title";
const { confirm } = Modal;
const localizer = momentLocalizer(moment);

function InvigilatorRegistration() {
  const { user } = useContext(UserContext);
  const {
    semesters = [],
    selectedSemester,
    setSelectedSemester,
    examSlotRegister,
    availableSlotsData,
    reloadAvailableSlots,
    lastestSemester,
    getConfigValue,
    cancellableSlot,
  } = useSemester();
  const [events, setEvents] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [slots, setSlots] = useState({ fuId: user.id, examSlotId: [] });
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedCancelSlots, setSelectedCancelSlots] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);
  const allowedSlots = getConfigValue(ConfigType.ALLOWED_SLOT) || 0;
  const [view, setView] = useState('month');

  if (selectedSemester != lastestSemester) {
    setSelectedSemester(lastestSemester);
  }
  
  const fetchAndSetData = async () => {
    try {
      setLoading(true);
      await semesters;
      await availableSlotsData;
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Error fetching data.");
    }
  };
  useEffect(() => {
    if (lastestSemester && availableSlotsData) {
      setSlots({ ...slots, examSlotId: [] });
      setEvents(availableSlotsData);
      fetchAndSetData();
    }
  }, [lastestSemester, availableSlotsData]);


  const handleSelectEvent = (event) => {
    const { examSlotId, status, startAt } = event;
    const currentDate = moment();
    const openAt = moment(startAt).subtract(
      getConfigValue(ConfigType.TIME_BEFORE_OPEN_REGISTRATION),
      "days"
    );
    const closeAt = moment(startAt).subtract(
      getConfigValue(ConfigType.TIME_BEFORE_CLOSE_REGISTRATION),
      "days"
    );
    if (currentDate.isBefore(openAt) || currentDate.isAfter(closeAt)) {
      notification.warning({
        message: "Slot Not Available",
        description: `Slot is not available for registration.`,
        placement: "topRight",
      });
      return;
    }

    if (status === "REGISTERED" || status === "FULL") {
      return;
    }
    if (selectedSlots.includes(examSlotId)) {
      const updatedSelectedSlots = selectedSlots.filter(
        (slotId) => slotId !== examSlotId
      );
      setSelectedSlots(updatedSelectedSlots);
      setSlots({ ...slots, examSlotId: updatedSelectedSlots });
    } else {
      if (examSlotRegister.length + selectedSlots.length < allowedSlots) {
        const updatedSelectedSlots = [...selectedSlots, examSlotId];
        setSelectedSlots(updatedSelectedSlots);
        setSlots({ ...slots, examSlotId: updatedSelectedSlots });
      } else {
        message.warning(`You can only select up to ${allowedSlots} slots.`);
      }
    }
  };

  const handleRegister = async () => {


    if (selectedSlots.length === 0) {
      message.warning("Please select at least one slot to register.");
      return;
    }
    setRegisterLoading(true);
    try {
      const success = await postRegisterSlots(slots);
      if (success) {
        message.success("Registered for slots successfully");
        setSelectedSlots([]);
        setSlots({ ...slots, examSlotId: [] });
        reloadAvailableSlots();
      } else {
        message.error("Error registering for slots");
      }
    } catch (e) {
      console.error("postRegisterSlots Error:", e.message);
      notification.warning({
        message: "Slot Not Available",
        description: e.message || "Error registering for slots.",
        placement: "topRight",
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  const showCancelModal = () => {
    setCancelModalVisible(true);
  };

  const handleCancelModalClose = () => {
    setSelectedCancelSlots([]);
    setCancelModalVisible(false);
  };

  const handleCancelSlotChange = (examSlotId, checked) => {
    if (checked) {
      setSelectedCancelSlots([...selectedCancelSlots, examSlotId]);
    } else {
      setSelectedCancelSlots(
        selectedCancelSlots.filter((id) => id !== examSlotId)
      );
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allSlotIds = cancellableSlot.map((slot) => slot.examSlotId);
      setSelectedCancelSlots(allSlotIds);
    } else {
      setSelectedCancelSlots([]);
    }
    setIsAllSelected(checked);
  };

  const handleConfirmCancel = async () => {
    confirm({
      title: "Do you want to cancel these slots?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const success = await cancelRegisteredSlot(selectedCancelSlots);
          if (success) {
            message.success("Slot(s) cancelled successfully");
            setSelectedCancelSlots([]);
            setCancelModalVisible(false);
            reloadAvailableSlots();
          }
        } catch (error) {
          message.error("There are no slot(s) to cancel");
          console.error(error);
        }
      },
    });
  };

  const EventComponent = ({ event }) => (
    <div>
      <p style={{ margin: 0, fontWeight: 500, fontSize: 13.33333 }}>
        {moment(event.startAt).format("HH:mm")} -{" "}
        {moment(event.endAt).format("HH:mm")}
        <span style={{ fontSize: "0.625rem"}}>
          {" "}
          (R: {event.numberOfRegistered}/T: {event.requiredInvigilators})
        </span>
      </p>
    </div>
  );

  if (loading) {
    return <Skeleton />;
  } else {
    return (
      <div>
        <h2
          style={{
            marginTop: "10px",
            marginBottom: 0,
            textAlign: "center",
            ...titleStyle,
          }}
        >
          EXAM SLOTS REGISTRATION
        </h2>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <Calendar
            localizer={localizer}
            events={events}
            views={['month', 'agenda', 'day']}
            length={6}
            onView={setView}
            dayLayoutAlgorithm="no-overlap"
            step={30}
            timeslots={1}   
            view={view}
            startAccessor={(event) => {
              return new Date(event.startAt);
            }}
            endAccessor={(event) => {
              return new Date(event.endAt);
            }}
            style={{
              height: 500,
              margin: "50px",
              width: "70%",
              fontWeight: "lighter",
            }}
            components={{
              event: EventComponent,
              toolbar: CustomToolbar,
            }}
            messages={{ event: 'Time' }}
            formats={{
              agendaDateFormat: (date) =>
                moment(date).format('DD/MM/YYYY'),
            }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={(event) => {
              const { startAt } = event;
              const currentDate = moment();
              const openAt = moment(startAt).subtract(
                getConfigValue(ConfigType.TIME_BEFORE_OPEN_REGISTRATION),
                "days"
              );
              const closeAt = moment(startAt).subtract(
                getConfigValue(ConfigType.TIME_BEFORE_CLOSE_REGISTRATION),
                "days"
              );
              const isSelected = selectedSlots.includes(event.examSlotId);
              let backgroundColor;
              let isSelectable = true;
              if (
                currentDate.isBefore(openAt) ||
                currentDate.isAfter(closeAt)
              ) {
                switch (event.status) {
                  case "REGISTERED":
                    backgroundColor = "rgba(82, 196, 26, 0.5)";
                    isSelectable = false;
                    break;
                  case "FULL":
                    backgroundColor = "rgba(217,54,62,0.5)";
                    isSelectable = false;
                    break;
                  default:
                    backgroundColor = isSelected
                      ? "#1890ff"
                      : "rgba(83, 41, 236, 0.5)";
                    isSelectable = false;
                    break;
                }
              } else {
                switch (event.status) {
                  case "REGISTERED":
                    backgroundColor = "#52c41a";
                    isSelectable = false;
                    break;
                  case "FULL":
                    backgroundColor = "#d9363e";
                    isSelectable = false;
                    break;
                  default:
                    backgroundColor = isSelected ? "#1890ff" : "#ddd";
                    isSelectable = true;
                    break;
                }
              }

              return {
                style: {
                  backgroundColor,
                  border: "1px solid #ddd",
                  color: backgroundColor === "#ddd" ? "black" : "white",
                  cursor: isSelectable ? "pointer" : "not-allowed",
                },
              };
            }}
          />
          <div
            style={{
              marginLeft: 30,
              marginTop: 40,
              display: "grid",
              width: "15%",
            }}
          >
            <Button size="large" style={{ width: "100%" }}>
              {lastestSemester.name}
            </Button>

            <p style={{ fontStyle: "italic" }}>
              *Note: Arrive {getConfigValue(ConfigType.TIME_BEFORE_EXAM)}{" "}
              minutes before exam time in room{" "}
              <span style={{ fontWeight: "bolder" }}>
                {getConfigValue(ConfigType.INVIGILATOR_ROOM)}
              </span>
              .
            </p>

            <p style={{margin: 0}}>
              <span style={{ marginRight: 10, fontSize: 13 }}>R: Registered</span>
              <span style={{ marginRight: 10, fontSize: 13 }}>T: Total</span>
            </p>

            <Button
              type="primary"
              loading={registerLoading}
              onClick={handleRegister}
              style={{ marginTop: 30, width: "100%", height: 40 }}
            >
              Register
              <ReloadOutlined />
            </Button>
            <Button
              onClick={showCancelModal}
              style={{ marginTop: 10, width: "100%", height: 40 }}
            >
              Cancel Slots
            </Button>
            <p>
              Registered Slots: {examSlotRegister.length} /{" "}
              <span style={{ color: "red" }}>{allowedSlots}</span>
            </p>
            <p>Selected Slots: {selectedSlots.length}</p>
            <p>
              <span style={{ marginRight: 10, fontSize: 20, color: "#52c41a" }}>
                &#9632;
              </span>Registered<br />
              <span style={{ marginRight: 10, fontSize: 20, color: "#d9363e" }}>
                &#9632;
              </span>Full <br />
              <span style={{marginRight: 10,fontSize: 20,color: "rgb(221, 221, 221)"}}>
                &#9632;
              </span>Not full<br />
              <span style={{marginRight: 10,fontSize: 20,color: "rgba(83, 41, 236, 0.5)",}}>
                &#9632;
              </span>Not open
            </p>
            
            
          </div>
        </div>

        <Modal
          title="Select Slots to Cancel"
          open={cancelModalVisible}
          onOk={handleConfirmCancel}
          onCancel={handleCancelModalClose}
          okText="Confirm"
          cancelText="Close"
        >
          <div
            style={{
              display: "flex",
              marginBottom: 10,
              justifyContent: "space-between",
            }}
          >
            <p>Select All</p>
            <Checkbox
              onChange={(e) => handleSelectAll(e.target.checked)}
              checked={isAllSelected}
            />
          </div>
          {cancellableSlot.length === 0 ? (
            <p>No registered slots available to cancel.</p>
          ) : (
            <div>
              {cancellableSlot.map((slot) => {
                const currentDate = moment();
                const openAt = moment(slot.startAt).subtract(
                  getConfigValue(ConfigType.TIME_BEFORE_OPEN_REGISTRATION),
                  "days"
                );
                const closeAt = moment(slot.startAt).subtract(
                  getConfigValue(ConfigType.TIME_BEFORE_CLOSE_REGISTRATION),
                  "days"
                );
                const isCancelable = currentDate.isBetween(openAt, closeAt);
                return isCancelable ? (
                  <div
                    key={slot.examSlotId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      width: "100%",
                    }}
                  >
                    <span>
                      {moment(slot.startAt).format("HH:mm")} -{" "}
                      {moment(slot.endAt).format("HH:mm")}{" "}|{" "}
                      {moment(slot.startAt).format("DD/MM/YYYY")}
                    </span>

                    <Checkbox
                      checked={selectedCancelSlots.includes(slot.examSlotId)}
                      onChange={(e) =>
                        handleCancelSlotChange(
                          slot.examSlotId,
                          e.target.checked
                        )
                      }
                    />
                  </div>
                ) : null;
              })}
              {cancellableSlot.every((slot) => {
                const currentDate = moment();
                const openAt = moment(slot.startAt).subtract(
                  getConfigValue(ConfigType.TIME_BEFORE_OPEN_REGISTRATION),
                  "days"
                );
                const closeAt = moment(slot.startAt).subtract(
                  getConfigValue(ConfigType.TIME_BEFORE_CLOSE_REGISTRATION),
                  "days"
                );
                const isCancelable = currentDate.isBetween(openAt, closeAt);
                return !isCancelable;
              }) && <p>No registered slots available to cancel.</p>}
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

export default InvigilatorRegistration;
