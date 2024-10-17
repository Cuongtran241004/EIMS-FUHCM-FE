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
      <p style={{ margin: 0, fontWeight: 500, fontSize: 13.33333 }}>
        {new Date(event.startAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
        -
        {new Date(event.endAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </span>
  );

  return (
    <div>
      <h2 style={{ marginTop: 10, marginBottom: 0, marginLeft: 50 }}>
        Invigilator Dashboard
      </h2>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <BigCalendar
          views={{ day: true, week: true, month: true }}
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
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedEvent.startAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Start Time:</strong>{" "}
                {new Date(selectedEvent.startAt).toLocaleTimeString()}
              </p>
              <p>
                <strong>End Time:</strong>{" "}
                {new Date(selectedEvent.endAt).toLocaleTimeString()}
              </p>
            </div>
          )}
        </Modal>
        <div style={{ marginLeft: 30, marginTop: 40, display: 'grid', width: '15%' }}>
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
