import React, { useState } from "react";
import { Calendar, Dropdown, Modal, Button, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import CustomToolbar from "../../components/CustomCalendar/CustomToolbar";
import { ConfigType } from "../../configs/enum";
import { useSemester } from "../../components/SemesterContext";
import "./dashboard.css";
import { selectButtonStyle } from "../../design-systems/CSS/Button";
import { titleStyle } from "../../design-systems/CSS/Title";

const localizer = momentLocalizer(moment);

function InvigilatorDashboard() {
  const { semesters, selectedSemester, setSelectedSemester, examSlotDetail, getConfigValue, assignedSlotDetail } =
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
          views={['month', 'agenda', 'day']}
          length={6}
          onView={setView}
          view={view}
          onSelectEvent={handleSelectEvent}
          dayLayoutAlgorithm='no-overlap'
          step={30}
          timeslots={1}
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
          title="Details of Exam Slot"
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

          <p style={{ fontStyle: "italic" }}>
            *Note: Arrive {getConfigValue(ConfigType.TIME_BEFORE_EXAM)}{" "}
            minutes before exam time in room{" "}
            <span style={{ fontWeight: "bolder" }}>
              {getConfigValue(ConfigType.INVIGILATOR_ROOM)}
            </span>
            .
          </p>
        <div>
          <p>
            <table className="table-assign" style={{textAlign: 'left', fontSize: 13}}>
              <tr style={{color: 'green'}}><th>Hours of invigilation completed:</th><td>{assignedSlotDetail.totalInvigilatedHours}</td></tr>
              <tr style={{color: 'orange'}}><th>Hours of invigilation remaining:</th><td>{assignedSlotDetail.totalRequiredInvigilationHours}</td></tr>
              <tr><th>Total hours of invigilation:</th><td>{assignedSlotDetail.totalAssignedHours}</td></tr> <br/><br/>
              <tr style={{color: 'green'}}><th>Invigilation slots completed:</th><td>{assignedSlotDetail.totalInvigilatedSlots}</td></tr>
              <tr style={{color: 'orange'}}><th>Invigilation slots remaining:</th><td>{assignedSlotDetail.totalRequiredInvigilationSlots}</td></tr>
              <tr style={{color: 'red'}}><th>Slots not attended:</th><td>{assignedSlotDetail.totalNonInvigilatedSlots}</td></tr>
              <tr><th><span style={{marginRight: 10,fontSize: 20,color: "#1890ff",}}>&#9632;</span>Assigned slots:</th><td>{assignedSlotDetail.totalAssigned}</td></tr>
            </table>
          </p>
        </div>
        </div>

      </div>
    </div>
  );
}

export default InvigilatorDashboard;
