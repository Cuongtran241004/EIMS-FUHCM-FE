import React, { useEffect, useState } from "react";
import { Table, DatePicker, Spin, Dropdown, Button, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { selectButtonStyle } from "../../design-systems/CSS/Button";
import { useSemester } from "../../components/SemesterContext";
import moment from "moment";
import { requestTag } from "../../design-systems/CustomTag.jsx";

const InvigilatorAttend = () => {
    const {
        semesters,
        selectedSemester,
        setSelectedSemester,
        loadingSemesters,
        attendance,
    } = useSemester() || {};

    const [slotData, setSlotData] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (attendance && attendance.length > 0) {
            setSlotData(attendance);
        } else 
            setSlotData([]);
    }, [attendance]);


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

    const handleDateChange = (date, string) => {
        if (string === null || string === "") {
            try {
                setSlotData(attendance); 
            } catch (error) {
                console.error("Error fetching slot data:", error);
            } finally {
                setLoading(false);
            }
        } else {
            const filteredData = slotData.filter((slot) =>
                moment(slot.startAt).format("DD/MM/YYYY") === string
        );
            setSlotData(filteredData); 
        }
    };

    const slotColumns = [
        {
            title: "Date",
            dataIndex: "startAt",
            key: "startAt",
            render: (startAt) => moment(startAt).format("DD/MM/YYYY"),
        },
        {
            title: "Start",
            dataIndex: "startAt",
            key: "start",
            render: (startAt) => moment(startAt).format("HH:mm"),
        },
        {
            title: "End",
            dataIndex: "endAt",
            key: "end",
            render: (endAt) => moment(endAt).format("HH:mm"),
        },
        {
            title: "Check In",
            dataIndex: "checkIn",
            key: "checkIn",
            render: (checkIn) => (checkIn ? moment(checkIn).format("DD/MM/YYYY HH:mm") : "-"),
        },
        {
            title: "Check Out",
            dataIndex: "checkOut",
            key: "checkOut",
            render: (checkOut) => (checkOut ? moment(checkOut).format("DD/MM/YYYY HH:mm") : "-"),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => requestTag(status),
        },

    ];

    return (
        <div>
            <h1 style={{ color: 'red', display: 'flex', justifyContent: 'center', marginTop: 0 }}>INVIGILATOR ATTENDANCE</h1>

            {loadingSemesters ? (
                <Spin />
            ) : (
                <div style={{marginLeft: 80, marginRight: -70}}>
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

                    
                    

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 200 }}>
                        <div style={{ width: '100%' }}>
                            <DatePicker style={{ width: '23%', marginBottom: 20}} format={'DD/MM/YYYY'} onChange={handleDateChange} />
                            <Table
                                columns={slotColumns}
                                dataSource={slotData}
                                loading={loading}
                                rowKey={(record) => record.examSlotId}
                                pagination={{
                                    pageSize: 5,
                                    showSizeChanger: false,
                                    showQuickJumper: false,
                                    position: ["bottomCenter"],
                                  }}
                                  style={{ border: '2px solid #f0f0f0', padding: '16px', borderRadius: '8px'}}
                            />

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default InvigilatorAttend;
