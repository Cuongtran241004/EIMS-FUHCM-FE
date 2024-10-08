
import { UserContext } from '../../components/UserContext';
import React, { useState, useEffect, useContext } from 'react';
import { Dropdown, Modal, message, Button, Space, Collapse, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { postRegisterSlots } from '../../components/API/postRegisterSlots';
import { getSemester } from '../../components/API/getSemester';
import { availableSlots } from '../../components/API/availableSlots';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);



function InvigilatorRegistration() {
  const { user } = useContext(UserContext);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);

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
          const obj = await availableSlots(selectedSemester.id);
          const arrayFromObject = [];
          const objectPro = Object.entries(obj || {});
          for (const [key, value] of objectPro) {
            arrayFromObject.push(value);
          }
          setEvents(arrayFromObject);
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
    const { id } = event;
    if (selectedSlots.includes(id)) {
      setSelectedSlots(selectedSlots.filter(slotId => slotId !== id));
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
    const registeredSlots = events.filter(slot => selectedSlots.includes(slot.id));
    const slotIds = registeredSlots.map(slot => slot.id);
    message.success(`Registered for slots successfully`);
    const slots =
    {
      "fuId": user.id,
      "examSlotId": slotIds,
    }

    postRegisterSlots(slots);
    console.log(slots);
    setSelectedSlots([]);
  };

  const EventComponent = ({ event }) => (
    <span>
      {new Date(event.startAt).toLocaleTimeString()} - {new Date(event.endAt).toLocaleTimeString()}
    </span>
  );

  const latestSemester = semesters.length > 0 ? semesters.reduce((latest, current) => (current.id > latest.id ? current : latest), semesters[0]) : null;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor={(event) => { return new Date(event.startAt) }}
          endAccessor={(event) => { return new Date(event.endAt) }}
          style={{ height: 500, margin: '50px', width: '70%' }}
          components={{
            event: EventComponent,
          }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={(event) => {
            const isSelected = selectedSlots.includes(event.id);
            return {
              style: {
                backgroundColor: isSelected ? '#1890ff' : '#ddd',
                border: '1px solid #ddd',
                color: isSelected ? 'white' : 'black',
              },
            };
          }}
        />
        <div style={{ marginTop: 50 }}>
          <Dropdown menu={menu} trigger={['click']} >
            <Button size="large">
              <Space>
                {selectedSemester ? selectedSemester.name : (latestSemester ? latestSemester.name : 'No Semesters Available')}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>

      <Button
        type="primary"
        onClick={handleRegister}
        style={{ marginTop: 50, marginLeft: 10, width: '10%', height: 40, }}  
        >
        Register
      </Button>
        </div>

    </div>
  );
}

export default InvigilatorRegistration;
