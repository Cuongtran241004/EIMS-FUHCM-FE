import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import roomApi from "../../services/Room";
import examSlotApi from "../../services/ExamSlot";
import {
  Button,
  Row,
  Col,
  Layout,
  Spin,
  message,
  Empty,
  Tag,
  Divider,
  Slider,
  Table,
  InputNumber,
} from "antd";
import moment from "moment";
import examSlotHallApi from "../../services/ExamSlotHall";
import {
  BackwardFilled,
  CloseOutlined,
  CompressOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { titleRoomStyle } from "../../design-systems/CSS/Title";
import examSlotRoomApi from "../../services/ExamSlotRoom";

const { Content } = Layout;

const RoomSelectionPage = () => {
  const { examSlotId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [examSlot, setExamSlot] = useState(null);
  const [groupedRooms, setGroupedRooms] = useState([]);
  const [unavailableRooms, setUnavailableRooms] = useState([]);
  const [usingRoom, setUsingRoom] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [maxStudents, setMaxStudents] = useState(25); // Default max students per room
  const [numberOfStudents, setNumberOfStudents] = useState(0); // Total number of students
  const [choosenRooms, setChoosenRooms] = useState(0); // Total number of students
  const [totalCapacity, setTotalCapacity] = useState(0); // Total number of students
  // Calculate number of rooms dynamically based on the total number of students and max students per room
  const calculateNumberOfRooms = (students, max) => {
    return Math.ceil(students / max); // Round up to ensure enough rooms
  };

  const numberOfRooms = calculateNumberOfRooms(numberOfStudents, maxStudents);

  // Fetch exam slot data
  const fetchExamSlot = async () => {
    try {
      const response = await examSlotApi.getExamSlotById(examSlotId);
      setExamSlot(response);
      setNumberOfStudents(response?.numberOfStudents || 0);
    } catch (error) {
      message.error("Failed to fetch exam slot");
    }
  };

  // Fetch all rooms
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await roomApi.getAllRooms();
      setRooms(response || []);
    } catch (error) {
      message.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  // Fetch rooms being used for the current exam slot
  const fetchUsingRoom = async () => {
    try {
      const response = await examSlotApi.getUsingRoom(examSlotId);
      setUsingRoom(response || []);

      if (response.length > 0) {
        setSelectedRooms(response.flat()); // Flatten the response array
        setGroupedRooms(response); // Directly set grouped rooms
      }
      setChoosenRooms(response.flat().length);
      setTotalCapacity(
        response.flat().reduce((acc, room) => acc + room.capacity, 0)
      );
    } catch (error) {
      message.error("Failed to fetch using room");
    }
  };

  // Fetch unavailable rooms excluding rooms already in use by the exam slot
  const fetchUnavailableRooms = async () => {
    // Ensure startAt and endAt are available in the exam slot data
    if (!examSlot?.startAt || !examSlot?.endAt) return;

    try {
      const resUnRooms = await examSlotRoomApi.getUnavailableRooms(
        examSlot.startAt,
        examSlot.endAt
      );

      // Get the IDs of rooms being used
      if (usingRoom.length > 0) {
        const usingRoomIds = usingRoom.flat().map((room) => String(room.id));

        // Filter unavailable rooms to exclude rooms that are already being used
        const result = resUnRooms.filter(
          (unRoom) => !usingRoomIds.includes(String(unRoom)) // Convert unRoom to string
        );

        setUnavailableRooms(result || []);
      } else {
        setUnavailableRooms(resUnRooms || []);
      }
    } catch (error) {
      message.error("Failed to fetch unavailable rooms");
    }
  };

  // Sequentially fetch exam slot, rooms, using rooms, and unavailable rooms
  useEffect(() => {
    try {
      fetchExamSlot();
      fetchRooms();
      fetchUsingRoom();
    } catch (error) {}
  }, [examSlotId]);

  useEffect(() => {
    fetchUnavailableRooms();
  }, [usingRoom, examSlot]);

  // Additional logic for visualizing the groups

  const handleRoomSelect = (room) => {
    if (selectedRooms.find((selectedRoom) => selectedRoom.id === room.id)) {
      setSelectedRooms(
        selectedRooms.filter((selectedRoom) => selectedRoom.id !== room.id)
      );
      setChoosenRooms(choosenRooms - 1);
      setTotalCapacity(totalCapacity - room.capacity);
    } else {
      const updatedRooms = [...selectedRooms, room].sort((a, b) => a.id - b.id);
      setSelectedRooms(updatedRooms);
      setChoosenRooms(choosenRooms + 1);
      setTotalCapacity(totalCapacity + room.capacity);
    }
  };

  const groupRooms = () => {
    //eliminate duplicated roomName in all selectedRooms
    const selectedRoomIds = selectedRooms.map((room) => room.id);
    //eliminate duplicated roomName in all selectedRooms
    const filteredSelectedRooms = selectedRooms.filter(
      (room, index) => selectedRoomIds.indexOf(room.id) === index
    );
    setSelectedRooms(filteredSelectedRooms);

    const groupedByFloor = selectedRooms.reduce((acc, room) => {
      if (!acc[room.floor]) {
        acc[room.floor] = [];
      }
      acc[room.floor].push(room);
      return acc;
    }, {});

    const newGroups = [];

    Object.values(groupedByFloor).forEach((roomsOnFloor) => {
      const sortedRooms = roomsOnFloor.sort((a, b) => a.id - b.id);
      let currentGroup = [];

      for (let i = 0; i < sortedRooms.length; i++) {
        currentGroup.push(sortedRooms[i]);

        // Check if we have enough rooms for a valid group
        if (currentGroup.length >= 2) {
          const roomIds = currentGroup.map((room) => room.id);
          const minId = Math.min(...roomIds);
          const maxId = Math.max(...roomIds);

          // Validate group: max length must not exceed 5
          if (maxId - minId <= 5) {
            if (currentGroup.length >= 4 || i === sortedRooms.length - 1) {
              newGroups.push(currentGroup);
              currentGroup = [];
            }
          } else {
            // Reset group if the max length is exceeded
            newGroups.push(currentGroup.slice(0, currentGroup.length - 1));
            currentGroup = [sortedRooms[i]]; // Start new group with the current room
          }
        }
      }

      // Push any remaining rooms as a group if valid
      if (currentGroup.length > 0) {
        const roomIds = currentGroup.map((room) => room.id);
        const minId = Math.min(...roomIds);
        const maxId = Math.max(...roomIds);
        if (maxId - minId <= 5) {
          newGroups.push(currentGroup);
        }
      }
    });

    setGroupedRooms(newGroups);
  };

  const handleSave = async () => {
    setLoadingSubmit(true);
    try {
      // eliminate groupedRooms with length = 0
      const filteredGroupedRooms = groupedRooms.filter(
        (group) => group.length > 0
      );

      // only return roomName and
      const roomIds = filteredGroupedRooms.map((group) =>
        group.map((room) => room.roomName)
      );

      const data = {
        examSlotId: examSlotId,
        roomIds: roomIds,
      };

      if (usingRoom.length > 0) {
        // Update using room
        await examSlotHallApi.updateExamSlotHall(data);
      } else {
        // Add using room
        await examSlotHallApi.addExamSlotHall(data);
      }

      message.success("Rooms grouped successfully");
      // return history to previous page
      window.history.back();

      // You can also implement additional save logic here if needed
    } catch (error) {
      message.error("Failed to group rooms");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const addGroup = () => {
    setGroupedRooms([...groupedRooms, []]); // Add an empty group
  };

  const removeEmptyGroups = () => {
    setGroupedRooms(groupedRooms.filter((group) => group.length > 0));
  };

  // Handle drag and drop (manually managing groups since react-beautiful-dnd is removed)
  const handleDrop = (event, groupIndex) => {
    const roomData = JSON.parse(event.dataTransfer.getData("text/plain"));
    const fromGroupIndex = roomData.groupIndex;
    const roomIndex = roomData.roomIndex;

    if (fromGroupIndex !== groupIndex) {
      const items = Array.from(groupedRooms);
      const [movedItem] = items[fromGroupIndex].splice(roomIndex, 1);
      items[groupIndex].push(movedItem);

      setGroupedRooms(items);
      removeEmptyGroups(); // Remove empty groups after dropping
    }
    event.preventDefault();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleCancel = () => {
    setSelectedRooms(usingRoom.flat());
    setGroupedRooms(usingRoom);
    setChoosenRooms(usingRoom.flat().length);
    setTotalCapacity(
      usingRoom.flat().reduce((acc, room) => acc + room.capacity, 0)
    );
  };

  const isAvailable = () => {
    return examSlot?.status == "APPROVED" || examSlot?.status == "REJECTED";
  };
  // Define groupedRoomsByFloor to use in the render
  const groupedRoomsByFloor = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {});

  return (
    <Layout style={{ height: "100vh" }}>
      <Content>
        <Row style={{ height: "100%" }}>
          <Col
            span={12}
            style={{
              borderRight: "1px solid #f0f0f0",
              padding: "12px",
              background:
                "radial-gradient(circle, rgba(208,246,218,0.6139705882352942) 0%, rgba(67,170,139,0.5775560224089635) 82%)",
            }}
          >
            <h1 style={titleRoomStyle}>
              {examSlot?.subjectExamDTO?.subjectCode}-
              {examSlot?.subjectExamDTO?.examType}
            </h1>

            <h2 style={{ textAlign: "center", margin: "0", padding: "0" }}>
              <Tag color="#F9C74F" style={{ fontSize: "14px" }}>
                {" "}
                {moment(examSlot?.startAt).format("DD-MM-YYYY")} (
                {moment(examSlot?.startAt).format("HH:mm")} -{" "}
                {moment(examSlot?.endAt).format("HH:mm")})
              </Tag>
            </h2>
            <Spin spinning={loading}>
              {Object.keys(groupedRoomsByFloor).map((floor) => (
                <div key={floor}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      margin: "5px",
                    }}
                  >
                    <Divider
                      variant="dashed"
                      style={{
                        borderColor: "#F9844A",
                        margin: "10px",
                      }}
                    ></Divider>
                    {groupedRoomsByFloor[floor].map((room) => (
                      <Button
                        key={room.id}
                        size="small"
                        onClick={() => handleRoomSelect(room)}
                        disabled={unavailableRooms.some(
                          // Disable if room is unavailable
                          (unavailableRoom) => unavailableRoom == room.id
                        )}
                        style={{
                          width: "calc(10% - 8px)",
                          backgroundColor: selectedRooms.some(
                            (selectedRoom) => selectedRoom.id === room.id
                          )
                            ? "#4D908E"
                            : "",
                          color: selectedRooms.some(
                            (selectedRoom) => selectedRoom.id === room.id
                          )
                            ? "white"
                            : "",
                        }}
                      >
                        <strong style={{ color: "#F9C74F" }}>
                          {room.roomName}
                        </strong>{" "}
                        | {room.capacity}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </Spin>
          </Col>

          <Col
            span={12}
            style={{
              padding: "12px",
              backgroundColor: "",
            }}
          >
            <Row>
              <Col span={12}>
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <h4>Max students in a room</h4>
                  <Slider
                    min={15}
                    max={35}
                    value={maxStudents}
                    onChange={(value) => setMaxStudents(value)} // Update max students when slider changes
                    style={{
                      width: "50%",
                      margin: "0 auto",
                    }}
                  />
                  <p>{maxStudents} (students)</p>
                </div>
              </Col>
              <Col span={12}>
                <div
                  style={{ textAlign: "center", borderLeft: "1px solid black" }}
                >
                  <table
                    style={{ textAlign: "left", fontSize: 13, marginLeft: 30 }}
                  >
                    <tbody>
                      <tr>
                        <th style={{ padding: "5px" }}>Number of students:</th>
                        <td style={{ padding: "0" }}> {numberOfStudents}</td>
                      </tr>
                      <tr>
                        <th style={{ padding: "5px" }}>Number of rooms:</th>
                        <td style={{ padding: "0" }}> {numberOfRooms}</td>{" "}
                      </tr>
                      <tr>
                        <th style={{ padding: "5px" }}>Choosen Rooms: </th>
                        <td style={{ padding: "0" }}>{choosenRooms}</td>
                      </tr>
                      <tr>
                        <th style={{ padding: "5px" }}>Total Capacity: </th>
                        <td style={{ padding: "0" }}>{totalCapacity}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
            <Divider>
              <h3 style={{ color: "#F94144" }}>Selected Rooms</h3>
            </Divider>
            {selectedRooms.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  marginTop: "5px",
                  flexWrap: "wrap",
                }}
              >
                {groupedRooms.map((group, groupIndex) => (
                  <div
                    key={groupIndex}
                    style={{
                      display: "flex",
                      gap: "8px",
                      border: "1px dashed #ccc",
                      padding: "3px",

                      width: "calc(50% - 10px)",
                      overflow: "auto",
                    }}
                    onDragOver={handleDragOver}
                    onDrop={(event) => handleDrop(event, groupIndex)}
                  >
                    {group.map((room, roomIndex) => (
                      <Button
                        key={room.id}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData(
                            "text/plain",
                            JSON.stringify({ groupIndex, roomIndex })
                          );
                        }}
                        style={{
                          backgroundColor: "#4D908E",
                          color: "white",
                        }}
                      >
                        {room.roomName}
                      </Button>
                    ))}
                  </div>
                ))}
                <Button type="link" onClick={addGroup}>
                  <PlusOutlined />
                  Add group
                </Button>
              </div>
            )}

            <Button
              danger
              type="dashed"
              onClick={handleCancel}
              style={{ marginTop: "20px" }}
            >
              <CloseOutlined />
              Cancel
            </Button>
            <Button
              onClick={groupRooms}
              style={{ marginTop: "20px", marginLeft: "10px" }}
              type="default"
            >
              Group Rooms
              <CompressOutlined />
            </Button>

            <Button
              type="default"
              onClick={handleSave}
              style={{
                marginTop: "20px",
                marginLeft: "10px",

                float: "right",
              }}
              loading={loadingSubmit}
              disabled={isAvailable() || groupedRooms.length == 0}
            >
              Save
              <ReloadOutlined />
            </Button>
            <Button
              danger
              type="dashed"
              onClick={() => window.history.back()}
              style={{
                marginTop: "20px",
                marginLeft: "10px",
                float: "right",
              }}
            >
              <BackwardFilled />
              Return
            </Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default RoomSelectionPage;
