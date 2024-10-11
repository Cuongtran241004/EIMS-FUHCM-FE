import React, { useState } from "react";
import { Calendar, Dropdown, Modal, Button, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import { useSemester } from "../../components/SemesterContext";
import "./dashboard.css";

const localizer = momentLocalizer(moment);

function InvigilatorDashboard() {
  const { semesters, selectedSemester, setSelectedSemester, examSlotDetail } =
    useSemester();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const EventComponent = ({ event }) => (
    <span>
      {new Date(event.startAt).toLocaleString()} -{" "}
      {new Date(event.endAt).toLocaleString()}
    </span>
  );
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <BigCalendar
          localizer={localizer}
          events={examSlotDetail}
          onSelectEvent={handleSelectEvent}
          startAccessor="startAt"
          endAccessor="endAt"
          style={{ height: 500, margin: "50px", width: "70%" }}
          components={{
            event: EventComponent,
          }}
        />
        <Modal
          title="Details"
          open={isModalVisible}
          onOk={handleOk}
          onClose={handleCancel}
          onCancel={handleCancel}
        >
          {selectedEvent && (
            <div>
              <p>Exam Slot ID: {selectedEvent.examSlotId}</p>
              <p>Start: {selectedEvent.startAt.toLocaleString()}</p>
              <p>End: {selectedEvent.endAt.toLocaleString()}</p>
            </div>
          )}
        </Modal>
        <div style={{ marginTop: 50 }}>
          <Dropdown menu={menu} trigger={["click"]}>
            <Button size="large">
              <Space>
                {selectedSemester
                  ? selectedSemester.name
                  : "No Semesters Available"}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default InvigilatorDashboard;
