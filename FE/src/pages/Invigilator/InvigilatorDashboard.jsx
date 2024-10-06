// src/pages/Invigilator/InvigilatorDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Calendar, Modal, message } from 'antd';
import moment from 'moment';
import Header from '../../components/Header/Header';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import './dashboard.css';



const localizer = momentLocalizer(moment);

function InvigilatorDashboard() {
  // Mock data
  const mockSchedules = [
    {
      id: 1,
      start: new Date('2024-10-20T09:00:00'),
      end: new Date('2024-10-20T12:00:00'),
      title: 'Văn học with MAS291 - Phòng 101',
    },
    {
      id: 2,
      start: new Date('2024-10-21T13:00:00'),
      end: new Date('2024-10-21T16:00:00'),
      title: 'Vật Lộn with SWP391 - Hội trường A',
    },
    {
      id: 3,
      start: new Date('2024-10-22T09:00:00'),
      end: new Date('2024-10-22T12:00:00'),
      title: 'Hóa Thành BA with SWR302 - Phòng 102',
    },
    {
      id: 4,
      start: new Date('2024-10-23T13:00:00'),
      end: new Date('2024-10-23T16:00:00'),
      title: 'Sinh ra SWT301 chi? - Phòng 103',
    },
    {
      id: 5,
      start: new Date('2024-10-24T09:00:00'),
      end: new Date('2024-10-24T12:00:00'),
      title: 'Chill with not pass - Hội trường B',
    },
    {
      id: 6,
      start: new Date('2024-10-24T13:00:00'),
      end: new Date('2024-10-24T16:00:00'),
      title: 'Tiếng Meo - Phòng 104',
    },
    {
      id: 7,
      start: new Date('2024-10-24T07:00:00'),
      end: new Date('2024-10-24T10:00:00'),
      title: 'Tiếng Mán - Phòng 104',
    },
  ];

  const [events, setEvents] = useState(mockSchedules);

  const handleSelectEvent = (event) => {
    message.info(`Selected: ${event.title}`);
  };

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt('New Event name');
    if (title) {
      const newEvent = {
        start,
        end,
        title,
      };
      setEvents([...events, newEvent]);
      message.success('Event added!');
    }
  };

  return (
    <div>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px', width: '90%' }}

      />
    </div>
  );
}

export default InvigilatorDashboard;
