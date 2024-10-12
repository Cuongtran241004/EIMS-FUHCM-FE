import { UserContext } from '../../components/UserContext';
import React, { useState, useEffect, useContext } from 'react';
import { Dropdown, message, Button, Space, Modal, Checkbox } from 'antd';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { postRegisterSlots } from '../../components/API/postRegisterSlots';
import { cancelRegisteredSlot } from '../../components/API/cancelRegisteredSlot';
import { useSemester } from '../../components/SemesterContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './invigilatorRegistration.css'

const { confirm } = Modal;
const localizer = momentLocalizer(moment);

function InvigilatorRegistration() {
  const { user } = useContext(UserContext);
  const { semesters = [], selectedSemester, setSelectedSemester, examSlotDetail, availableSlotsData } = useSemester();
  const [events, setEvents] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedCancelSlots, setSelectedCancelSlots] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const allowedSlots = selectedSemester?.allowedSlotConfig;

  useEffect(() => {
    if (selectedSemester) {
      setEvents(availableSlotsData);
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
    const { examSlotId } = event;

    if (!selectedSemester) {
      message.warning('Please select a semester first.');
      return;
    }

    if (selectedSlots.includes(examSlotId)) {
      setSelectedSlots(selectedSlots.filter((slotId) => slotId !== examSlotId));
    } else {
      if ((examSlotDetail.length + selectedSlots.length) < allowedSlots) {
        setSelectedSlots([...selectedSlots, examSlotId]);
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

    const flatEvents = events.flatMap((subArray) => subArray);

    const registeredSlots = flatEvents.filter((slot) =>
      selectedSlots.includes(slot.examSlotId)
    );

    const slotIds = registeredSlots.map((slot) => slot.examSlotId);
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
      setSelectedCancelSlots(selectedCancelSlots.filter(id => id !== examSlotId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allSlotIds = examSlotDetail.map(slot => slot.examSlotId);
      setSelectedCancelSlots(allSlotIds);
    } else {
      setSelectedCancelSlots([]);
    }
    setIsAllSelected(checked);
  };


  const handleConfirmCancel = async () => {
    confirm({
      title: 'Do you want to cancel these slots?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          const promises = selectedCancelSlots.map((slotId) => cancelRegisteredSlot(slotId));
          await Promise.all(promises);
          message.success('Slot(s) cancelled successfully');
          setSelectedCancelSlots([]);
          setCancelModalVisible(false);
        } catch (error) {
          message.error('Error cancelling slot(s)');
          console.error(error);
        }
      },

    });
  };

  const EventComponent = ({ event }) => (
    <div>
      <p style={{ margin: 0, fontWeight: 500, fontSize: 13.33333 }}>
        {new Date(event.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}-
        {new Date(event.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );

  return (
    <div>
      <h2 style={{ marginTop: 10, marginBottom: 0, marginLeft: 50 }}>Invigilator Register</h2>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <Calendar
          localizer={localizer}
          events={availableSlotsData}
          startAccessor={(event) => new Date(event.startAt)}
          endAccessor={(event) => new Date(event.endAt)}
          style={{ height: 500, margin: '50px', width: '70%', fontWeight: 'lighter' }}
          components={{ event: EventComponent }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={(event) => {
            const isSelected = selectedSlots.includes(event.examSlotId);
            let backgroundColor;
            let isSelectable = true;
            switch (event.status) {
              case 'REGISTERED':
                backgroundColor = '#52c41a';
                isSelectable = false;
                break;
              case 'FULL':
                backgroundColor = '#d9363e';
                isSelectable = false;
                break;
              default:
                backgroundColor = isSelected ? '#1890ff' : '#ddd';
                isSelectable = true;
                break;
            }

            return {
              style: {
                backgroundColor,
                border: '1px solid #ddd',
                color: backgroundColor === '#ddd' ? 'black' : 'white',
                cursor: isSelectable ? 'pointer' : 'not-allowed',
              },
            };
          }}
        />
        <div style={{ marginTop: 40 }}>
          <Dropdown menu={menu} trigger={['click']}>
            <Button size="large" style={{ width: '100%' }}>
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
          <Button onClick={showCancelModal} style={{ marginTop: 10, width: '100%', height: 40 }}>
            Cancel Slots
          </Button>
          <p>Registered Slots: {examSlotDetail.length} / {allowedSlots}</p>
          <p>Selected Slots: {selectedSlots.length}</p>
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
        <div style={{display: 'flex', marginBottom: 10, justifyContent: 'space-between' }}>
          <p>Select All</p>
          <Checkbox
            onChange={(e) => handleSelectAll(e.target.checked)}
            checked={isAllSelected}
          >
          </Checkbox>
        </div>
        {examSlotDetail.length === 0 ? (
          <p>No registered slots available to cancel.</p>
        ) : (
          <div>
            {examSlotDetail.map(slot => (
              <div
                key={slot.examSlotId}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', width: '100%' }}
              >
                <span >
                  {new Date(slot.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},
                  {new Date(slot.startAt).toLocaleDateString()}
                </span>

                <Checkbox
                  checked={selectedCancelSlots.includes(slot.examSlotId)}
                  onChange={(e) => handleCancelSlotChange(slot.examSlotId, e.target.checked)}
                />
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default InvigilatorRegistration;
