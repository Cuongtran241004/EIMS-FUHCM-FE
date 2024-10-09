import React, { useState, useEffect } from 'react';
import { Calendar, Dropdown, Modal, message, Button, Space, Collapse, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { getSemester } from '../../components/API/getSemester';
import moment from 'moment';
import { schedules } from '../../components/API/schedules';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import './dashboard.css';

const localizer = momentLocalizer(moment);

function InvigilatorDashboard() {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [events, setEvents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
      const fetchSchedules = async () => {
        try {
          const obj = await schedules(selectedSemester.id);
          const examSlotDetailSet = obj.semesterInvigilatorAssignment[0].examSlotDetailSet; 
           sessionStorage.setItem('examSlotDetailSet', examSlotDetailSet.length);
          const mappedEvents = examSlotDetailSet.map(slot => ({
            examSlotId: slot.examSlotId,
            startAt: new Date(slot.startAt),
            endAt: new Date(slot.endAt),
          }));

          setEvents(mappedEvents);
        } catch (e) {
          console.error('fetchSchedules Error: ', e.message);
        }
      };
      fetchSchedules();
    }
  }, [selectedSemester]);

  const handleMenuClick = (e) => {
    const selected = semesters.find(semester => semester.id === parseInt(e.key));
    setSelectedSemester(selected);
  };

  const menuItems = semesters.map(semester => ({
    key: semester.id,
    label: semester.name
  }));

  const menu = {
    items: menuItems,
    onClick: handleMenuClick
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
      {new Date(event.startAt).toLocaleString()} - {new Date(event.endAt).toLocaleString()}
    </span>
  );

  const latestSemester = semesters.length > 0 ? semesters.reduce((latest, current) => (current.id > latest.id ? current : latest), semesters[0]) : null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          onSelectEvent={handleSelectEvent}
          startAccessor="startAt" 
          endAccessor="endAt" 
          style={{ height: 500, margin: '50px', width: '70%' }}
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
          <Dropdown menu={menu} trigger={['click']}>
            <Button size="large">
              <Space>
                {selectedSemester ? selectedSemester.name : (latestSemester ? latestSemester.name : 'No Semesters Available')}
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
