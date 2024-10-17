import { UserContext } from '../../components/UserContext';
import React, { useState, useEffect, useContext } from 'react';
import { Dropdown, message, Button, Space, Modal, Checkbox, Skeleton } from 'antd';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { postRegisterSlots } from '../../components/API/postRegisterSlots';
import { cancelRegisteredSlot } from '../../components/API/cancelRegisteredSlot';
import { useSemester } from '../../components/SemesterContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './invigilatorRegistration.css';

const { confirm } = Modal;
const localizer = momentLocalizer(moment);

function InvigilatorRegistration() {
  const { user } = useContext(UserContext);
  const { semesters = [], selectedSemester, setSelectedSemester, examSlotDetail, availableSlotsData, reloadAvailableSlots, lastestSemester } = useSemester();
  const [events, setEvents] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [slots, setSlots] = useState({ fuId: user.id, examSlotId: [] });
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedCancelSlots, setSelectedCancelSlots] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [loading, setLoading] = useState(true);

  const allowedSlots = lastestSemester?.allowedSlotConfig;

  const fetchAndSetData = async () => {
    try {
      setLoading(true);
      await semesters;
      await availableSlotsData;
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('Error fetching data.');
    }
  };

  useEffect(() => {
    if (lastestSemester && availableSlotsData) {
      setSlots({ ...slots, examSlotId: [] });
      setEvents(availableSlotsData);
      fetchAndSetData();
    }
  }, [lastestSemester, availableSlotsData]);

  // const handleMenuClick = (e) => {
  //   const selected = semesters.find((semester) => semester.id === parseInt(e.key));
  //   setSelectedSemester(selected);
  //   fetchAndSetData();
  // };

  // const menuItems = semesters.map((semester) => ({
  //   key: semester.id,
  //   label: semester.name,
  // }));

  // const menu = {
  //   items: menuItems,
  //   onClick: handleMenuClick,
  // };

  const handleSelectEvent = (event) => {
    const { examSlotId, status, startAt } = event;
    const currentDate = moment();
    const openAt = moment(startAt).subtract(7, 'days');
    const closeAt = moment(startAt).subtract(3, 'days');
    if(currentDate.isBefore(openAt) || currentDate.isAfter(closeAt)) {
      message.warning('Not open for registration');
      return;
    }
//=======================================================================================================
    // if (!selectedSemester) {
    //   message.warning('Please select a semester first.');
    //   return;
    // }
//=======================================================================================================
    if (status === 'REGISTERED' || status === 'FULL') {
      return;
    }
    if (selectedSlots.includes(examSlotId)) {
      const updatedSelectedSlots = selectedSlots.filter((slotId) => slotId !== examSlotId);
      setSelectedSlots(updatedSelectedSlots);
      setSlots({ ...slots, examSlotId: updatedSelectedSlots });
    } else {
      if ((examSlotDetail.length + selectedSlots.length) < allowedSlots) {
        const updatedSelectedSlots = [...selectedSlots, examSlotId];
        setSelectedSlots(updatedSelectedSlots);
        setSlots({ ...slots, examSlotId: updatedSelectedSlots });
      } else {
        message.warning(`You can only select up to ${allowedSlots} slots.`);
      }
    }
  };


  const handleRegister = async () => {

    // if (!selectedSemester) {
    //   message.warning('Please select a semester first.');
    //   return;
    // }

    if (selectedSlots.length === 0) {
      message.warning('Please select at least one slot to register.');
      return;
    }

    try {
      const success = await postRegisterSlots(slots);
      if (success) {
        message.success('Registered for slots successfully');
        setSelectedSlots([]);
        setSlots({ ...slots, examSlotId: [] });
        reloadAvailableSlots();
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
      onOk: async () => {
        try {
          const success = await cancelRegisteredSlot(selectedCancelSlots);
          if (success) {
            message.success('Slot(s) cancelled successfully');
            setSelectedCancelSlots([]);
            setCancelModalVisible(false);
            reloadAvailableSlots();
          }
        } catch (error) {
          message.error('There are no slot(s) to cancel');
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
        <br/><span style={{fontSize: '0.625rem'}}>(Registed: 10/Total: 15)</span>
      </p>
    </div>
  );

  if (loading) {
    return <Skeleton />;
  } else {
    return (
      <div>
        <h2 style={{ marginTop: 10, marginBottom: 0, marginLeft: 50 }}>Invigilator Register</h2>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Calendar
            views={{ day: true, week: true, month: true }}
            localizer={localizer}
            events={events}
            startAccessor={(event) => new Date(event.startAt)}
            endAccessor={(event) => new Date(event.endAt)}
            style={{ height: 500, margin: '50px', width: '70%', fontWeight: 'lighter' }}
            components={{ event: EventComponent }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={(event) => {
              const { startAt } = event;
              const currentDate = moment();
              const openAt = moment(startAt).subtract(7, 'days');
              const closeAt = moment(startAt).subtract(3, 'days');
              const isSelected = selectedSlots.includes(event.examSlotId);
              let backgroundColor;
              let isSelectable = true;
              if(currentDate.isBefore(openAt) || currentDate.isAfter(closeAt)) {
                backgroundColor = '#f0f0f0';
                isSelectable = false;
              }
              else {
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
          <div style={{ marginLeft: 30, marginTop: 40, display: 'grid', width: '15%' }}>
            {/* <Dropdown menu={menu} trigger={['click']}>
              <Button size="large" style={{ width: '100%' }}>
                <Space>
                  {selectedSemester ? selectedSemester.name : 'No Semesters Available'}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown> */}
            <Button size="large" style={{ width: '100%' }}>{lastestSemester.name}</Button>

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
            <p>Registered Slots: {examSlotDetail.length} / <span style={{ color: 'red' }}>{allowedSlots}</span></p>
            <p>Selected Slots: {selectedSlots.length}</p>
            <p style={{ fontWeight: 'bold' }}>
              <span style={{ marginRight: 20, color: '#52c41a' }}>Registered</span>
              <span style={{ marginRight: 20, color: '#d9363e' }}>Full</span>
              <span style={{ marginRight: 20, color: 'rgb(221, 221, 221)' }}>Not full</span>
            </p>
            <p style={{ fontStyle: 'italic' }}>*Note: Gather 30 minutes before exam time in the room <span style={{ fontWeight: 'bolder' }}>301.</span></p>

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
          <div style={{ display: 'flex', marginBottom: 10, justifyContent: 'space-between' }}>
            <p>Select All</p>
            <Checkbox
              onChange={(e) => handleSelectAll(e.target.checked)}
              checked={isAllSelected}
            />
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
                  <span>
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
}

export default InvigilatorRegistration;