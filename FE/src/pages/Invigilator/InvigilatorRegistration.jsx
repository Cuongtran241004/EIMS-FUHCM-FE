import { UserContext } from '../../components/UserContext';
import React, { useState, useEffect, useContext } from 'react';
import { Dropdown, message, Button, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { postRegisterSlots } from '../../components/API/postRegisterSlots';
import { getSemester } from '../../components/API/getSemester';
import { availableSlots } from '../../components/API/availableSlots';
import { schedules } from '../../components/API/schedules';
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
  const [examSlotDetail, setExamSlotDetail] = useState(0)
  const allowedSlots = selectedSemester?.allowedSlotConfig ;

  useEffect(() => {
    const fetchSemester = async () => {
      try {
        const response = await getSemester();
        setSemesters(response);

        // Set selectedSemester to the latest semester
        if (response.length > 0) {
          const latest = response.reduce(
            (latest, current) => (current.id > latest.id ? current : latest),
            response[0]
          );
          setSelectedSemester(latest);
        }
      } catch (e) {
        console.error('getSemester Error: ', e.message);
        message.error(e.message || 'Error fetching semesters.');
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
          message.error(e.message || 'Error fetching available slots.');
        }
      };
      fetchSchedules();
    }
  }, [selectedSemester]);

  useEffect(() => {
    if (selectedSemester) {
      const fetchSchedules = async () => {
        try {
          const obj = await schedules(selectedSemester.id);
          const examSlotDetailSet = obj.semesterInvigilatorAssignment[0].examSlotDetailSet; 
          setExamSlotDetail(examSlotDetailSet.length);
          
        } catch (e) {
          console.error('fetchSchedules Error: ', e.message);
        }
      };
      fetchSchedules();
    }
  }, [selectedSemester]);


  const handleMenuClick = (e) => {
    const selected = semesters.find((semester) => semester.id === parseInt(e.key));
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
    const { id } = event;

    if (!selectedSemester) {
      message.warning('Please select a semester first.');
      return;
    }

    

    if (selectedSlots.includes(id)) {
      setSelectedSlots(selectedSlots.filter((slotId) => slotId !== id));
    } else {
      if ((examSlotDetail + selectedSlots.length) < allowedSlots) {
        setSelectedSlots([...selectedSlots, id]);
      } else {
        message.warning(`You can only select up to ${allowedSlots} slots.`);
      }
    }
  };

  const handleRegister = async () => {
    if (!selectedSemester) {
      message.warning('Please select a semester first.');
      return;
    }

    if (selectedSlots.length === 0) {
      message.warning('Please select at least one slot to register.');
      return;
    }

    const registeredSlots = events.filter((slot) => selectedSlots.includes(slot.id));
    const slotIds = registeredSlots.map((slot) => slot.id);
    const slots = {
      fuId: user.id,
      examSlotId: slotIds,
    };

    try {
      const success = await postRegisterSlots(slots);
      if (success) {
        message.success('Registered for slots successfully');
        setSelectedSlots([]);
      } else {
        message.error('Error registering for slots');
      }
    } catch (e) {
      console.error('postRegisterSlots Error:', e.message);
      message.error(e.message || 'Error registering for slots.');
    }
  };

  const EventComponent = ({ event }) => (
    <span>
      {new Date(event.startAt).toLocaleTimeString()} - {new Date(event.endAt).toLocaleTimeString()}
    </span>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor={(event) => new Date(event.startAt)}
          endAccessor={(event) => new Date(event.endAt)}
          style={{ height: 500, margin: '50px', width: '70%' }}
          components={{ event: EventComponent }}
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
        <div style={{ marginTop: 40 }}>
          <Dropdown menu={menu} trigger={['click'] } >
            <Button size="large" style={{width: '100%'}}>
              <Space>
                {selectedSemester ? selectedSemester.name : 'No Semesters Available'}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>

          <Button
            type="primary"
            onClick={handleRegister}
            style={{ marginTop: 60, width: '100%', height: 40 }}
          >
            Register
          </Button>
          <p>Registered Slots: {examSlotDetail} / {allowedSlots}</p>
          <p>Selected Slots: {selectedSlots.length}</p>
        </div>
      </div>
    </div>
  );
}

export default InvigilatorRegistration;