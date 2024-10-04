// src/pages/Invigilator/InvigilatorRegistration.jsx

import React, { useState } from 'react';
import { message, Typography, Button } from 'antd';
import Header from '../../components/Header/Header';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const { Title } = Typography;

// Mock data for available slots
const availableSlots = [
  {
    id: 1,
    start: new Date('2024-10-20T09:00:00'),
    end: new Date('2024-10-20T12:00:00'),
    title: 'Toán - Phòng 101',
  },
  {
    id: 2,
    start: new Date('2024-10-21T13:00:00'),
    end: new Date('2024-10-21T16:00:00'),
    title: 'Vật Lý - Hội trường A',
  },
  {
    id: 3,
    start: new Date('2024-10-22T09:00:00'),
    end: new Date('2024-10-22T12:00:00'),
    title: 'Hóa Học - Phòng 102',
  },
  {
    id: 4,
    start: new Date('2024-10-23T13:00:00'),
    end: new Date('2024-10-23T16:00:00'),
    title: 'Sinh Học - Phòng 103',
  },
  {
    id: 5,
    start: new Date('2024-10-24T09:00:00'),
    end: new Date('2024-10-24T12:00:00'),
    title: 'Lịch Sử - Hội trường B',
  },
  {
    id: 6,
    start: new Date('2024-10-21T13:00:00'),
    end: new Date('2024-10-21T16:00:00'),
    title: 'Địa Lý - Hội trường B',
  },
  {
    id: 7,
    start: new Date('2024-10-22T09:00:00'),
    end: new Date('2024-10-22T12:00:00'),
    title: 'Tin Học - Phòng 104',
  },
  {
    id: 8,
    start: new Date('2024-10-22T10:30:00'),
    end: new Date('2024-10-22T13:30:00'),
    title: 'Sinh Học - Phòng 105',
  },
  {
    id: 9,
    start: new Date('2024-10-22T14:00:00'),
    end: new Date('2024-10-22T17:00:00'),
    title: 'Vật Lý - Hội trường C',
  },
  {
    id: 10,
    start: new Date('2024-10-23T09:00:00'),
    end: new Date('2024-10-23T12:00:00'),
    title: 'Hóa Học - Phòng 106',
  },
  {
    id: 11,
    start: new Date('2024-10-23T12:30:00'),
    end: new Date('2024-10-23T15:30:00'),
    title: 'Toán - Phòng 107',
  },
  {
    id: 12,
    start: new Date('2024-10-23T14:00:00'),
    end: new Date('2024-10-23T17:00:00'),
    title: 'Tiếng Anh - Hội trường D',
  },
  {
    id: 13,
    start: new Date('2024-10-24T09:00:00'),
    end: new Date('2024-10-24T12:00:00'),
    title: 'Lịch Sử - Phòng 108',
  },
  {
    id: 14,
    start: new Date('2024-10-24T10:00:00'),
    end: new Date('2024-10-24T13:00:00'),
    title: 'Địa Lý - Phòng 109',
  },
  {
    id: 15,
    start: new Date('2024-10-24T12:00:00'),
    end: new Date('2024-10-24T15:00:00'),
    title: 'Tin Học - Hội trường E',
  },
  {
    id: 16,
    start: new Date('2024-10-28T12:00:00'),
    end: new Date('2024-10-28T15:00:00'),
    title: 'Tiếng Thái - Hội trường E',
  },

];

function InvigilatorRegistration({ isLogin }) {
  const [selectedSlots, setSelectedSlots] = useState([]);

  const handleSelectEvent = (event) => {
    const { id, title } = event;
    if (selectedSlots.includes(id)) {
      setSelectedSlots(selectedSlots.filter(slotId => slotId !== id));
      message.info(`Deselected: ${title}`);
    } else {
      if (selectedSlots.length < 15) {
        setSelectedSlots([...selectedSlots, id]);
      } else {
        message.warning('You can only select up to 15 slots.');
      }
    }
  };

  const handleRegister = () => {
    if (selectedSlots.length === 0) {
      message.warning('Please select at least one slot to register.');
      return;
    }
    const registeredSlots = availableSlots.filter(slot => selectedSlots.includes(slot.id));
    message.success(`Registered for slots: ${registeredSlots.map(slot => slot.title).join(', ')}`);

    setSelectedSlots([]);
  };

  return (
    <div>
      <Header isLogin={isLogin} />
      <div style={{ display: 'flex', alignItems: 'flex-start', margin: '20px' }}>
        <Calendar
          localizer={localizer}
          events={availableSlots}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 450, margin: '50px', width: '70%' }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={(event) => {
            const isSelected = selectedSlots.includes(event.id);
            return {
              style: {
                backgroundColor: isSelected ? '#1890ff' : '#f0f0f0',
                border: '1px solid #ddd',
              },
            };
          }}
        />
        <Button
          type="primary"
          onClick={handleRegister}
          style={{ marginTop: 50, width: '15%' }}
        >
          Register
        </Button>
      </div>
    </div>
  );
}

export default InvigilatorRegistration;
