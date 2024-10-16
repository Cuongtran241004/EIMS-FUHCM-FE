import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import roomApi from "../../services/Room";
import examSlotApi from "../../services/ExamSlot";
import { Button, Row, Col, Layout, Spin, message } from "antd";
import moment from "moment";
import examSlotHallApi from "../../services/ExamSlotHall";
import {
  BackwardFilled,
  BackwardOutlined,
  CloseOutlined,
  CloudOutlined,
  CompressOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { titleRoomStyle } from "../../design-systems/CSS/Title";

const { Content } = Layout;

const RoomSelectionPage = () => {
  const { examSlotId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examSlot, setExamSlot] = useState(null);
  const [groupedRooms, setGroupedRooms] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomApi.getAllRooms();
        setRooms(response);
      } catch (error) {
        // Handle error (optional)
      } finally {
        setLoading(false);
      }
    };

    const fetchExamSlot = async () => {
      try {
        const response = await examSlotApi.getExamSlotById(examSlotId);
        setExamSlot(response);
      } catch (error) {
        // Handle error (optional)
      }
    };

    fetchRooms();
    fetchExamSlot();
  }, [examSlotId]);

  const handleRoomSelect = (room) => {
    if (selectedRooms.find((selectedRoom) => selectedRoom.id === room.id)) {
      setSelectedRooms(
        selectedRooms.filter((selectedRoom) => selectedRoom.id !== room.id)
      );
    } else {
      const updatedRooms = [...selectedRooms, room].sort((a, b) => a.id - b.id);
      setSelectedRooms(updatedRooms);
    }
  };

  const groupRooms = () => {
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
      // only return roomName
      const roomIds = groupedRooms.map((group) =>
        group.map((room) => room.roomName)
      );

      const data = {
        examSlotId: examSlotId,
        roomIds: roomIds,
      };
      await examSlotHallApi.addExamSlotHall(data);

      message.success("Rooms grouped successfully");
      // return history to previous page
      window.history.back();
      console.log("Grouped Rooms:", data);
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
    setSelectedRooms([]);
    setGroupedRooms([]);
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
            style={{ borderRight: "1px solid #f0f0f0", padding: "12px" }}
          >
            <h1 style={titleRoomStyle}>
              {examSlot?.subjectExamDTO?.subjectCode}-
              {examSlot?.subjectExamDTO?.examType}
            </h1>
            <h2 style={{ textAlign: "center" }}>
              {moment(examSlot?.startAt).format("DD-MM-YYYY")} (
              {moment(examSlot?.startAt).format("HH:mm")} -{" "}
              {moment(examSlot?.endAt).format("HH:mm")})
            </h2>
            <Spin spinning={loading}>
              {Object.keys(groupedRoomsByFloor).length === 0 ? (
                <p>No rooms available</p>
              ) : (
                Object.keys(groupedRoomsByFloor).map((floor) => (
                  <div key={floor}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        margin: "20px",
                      }}
                    >
                      {groupedRoomsByFloor[floor].map((room) => (
                        <Button
                          key={room.id}
                          size="small"
                          onClick={() => handleRoomSelect(room)}
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
                          {room.roomName}
                        </Button>
                      ))}
                    </div>
                    <hr />
                  </div>
                ))
              )}
            </Spin>
          </Col>

          <Col span={12} style={{ padding: "12px" }}>
            <h1 style={titleRoomStyle}>SELECTED ROOMS</h1>
            {selectedRooms.length === 0 ? (
              <p>No rooms selected</p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {groupedRooms.map((group, groupIndex) => (
                  <div
                    key={groupIndex}
                    style={{
                      display: "flex",
                      gap: "8px",
                      border: "1px dashed #ccc",
                      padding: "5px",
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
