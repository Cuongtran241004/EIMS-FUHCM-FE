import React, { useState } from "react";
import { Calendar, Dropdown, Modal, Button, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import CustomToolbar from "../../components/CustomCalendar/CustomToolbar";
import CustomAgenda from "../../components/CustomCalendar/CustomAgenda";
import { useSemester } from "../../components/SemesterContext";
import "./dashboard.css";
import { selectButtonStyle } from "../../design-systems/CSS/Button";
import { titleStyle } from "../../design-systems/CSS/Title";

const localizer = momentLocalizer(moment);

function InvigilatorDashboard() {
  const { semesters, selectedSemester, setSelectedSemester, examSlotDetail } =
    useSemester();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState('month');

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
        {new moment(event.startAt).format("HH:mm")} -{" "}
        {new moment(event.endAt).format("HH:mm")}
      </p>
    </span>
  );

  const handleDrillDown = () => {
    if (view === 'month') {
      setView('agenda');
    }
  };


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
        OFFICIAL EXAM SCHEDULES
      </h2>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <BigCalendar
          localizer={localizer}
          events={examSlotDetail}
          defaultView='month'
          views={['month', 'agenda']}
          length={6}
          onView={setView}
          view={view}
          onDrillDown={handleDrillDown}
          onSelectEvent={handleSelectEvent}
          startAccessor="startAt"
          endAccessor="endAt"
          style={{ height: 500, margin: "50px", width: "70%" }}
          components={{
            event: EventComponent, toolbar: CustomToolbar
          }}
          messages={{ event: 'Time' }}
          formats={{
            agendaDateFormat: (date) =>
              moment(date).format('DD/MM/YYYY'),
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
                {new moment(selectedEvent.startAt).format("DD/MM/YYYY")}
              </p>
              <p>
                <strong>Start Time:</strong>{" "}
                {new moment(selectedEvent.startAt).format("HH:mm")}
              </p>
              <p>
                <strong>End Time:</strong>{" "}
                {new moment(selectedEvent.endAt).format("HH:mm")}
              </p>
            </div>
          )}
        </Modal>
        <div
          style={{
            marginLeft: 30,
            marginTop: 40,
            display: "grid",
            width: "15%",
          }}
        >
          <Dropdown menu={menu} trigger={["click"]}>
            <Button size="large" style={selectButtonStyle}>
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
