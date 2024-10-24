import React, { useEffect, useState } from "react";
import { Table, DatePicker, Spin, Dropdown, Button, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { selectButtonStyle } from "../../design-systems/CSS/Button";
import { useSemester } from "../../components/SemesterContext";
import moment from "moment";

const InvigilatorReport = () => {
    const {
        semesters,
        selectedSemester,
        setSelectedSemester,
        loadingSemesters,
        examSlotApproved,
        inviFee,
    } = useSemester() || {};

    const [slotData, setSlotData] = useState([]);
    const [feeData, setFeeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const formatNumber  = new Intl.NumberFormat('en-US');


    useEffect(() => {
        if (examSlotApproved) {
            setSlotData(examSlotApproved);
        }
    }, [examSlotApproved]);

    useEffect(() => {
        if (inviFee) {
            setFeeData(inviFee);
        }
    }, [inviFee]);

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
                setSlotData(examSlotApproved); 
            } catch (error) {
                console.error("Error fetching slot data:", error);
            } finally {
                setLoading(false);
            }
        } else {
            const filteredData = examSlotApproved.filter((slot) =>
                moment(slot.startAt).format("DD-MM-YYYY") === string
        );
            setSlotData(filteredData); 
        }
    };

    const slotColumns = [
        {
            title: "Date",
            dataIndex: "startAt",
            key: "startAt",
            render: (startAt) => moment(startAt).format("DD-MM-YYYY"),
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
            render: (checkIn) => (checkIn ? moment(checkIn).format("DD-MM-YYYY HH:mm") : "-"),
        },
        {
            title: "Check Out",
            dataIndex: "checkOut",
            key: "checkOut",
            render: (checkOut) => (checkOut ? moment(checkOut).format("DD-MM-YYYY HH:mm") : "-"),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                return <span style={{ color: status === "APPROVED" ? "green" : "" }}><strong>{status}</strong></span>;
            },
        },

    ];

    return (
        <div>
            <h1 style={{ color: 'red', display: 'flex', justifyContent: 'center', marginTop: 0 }}>INVIGILATOR REPORT</h1>

            {loadingSemesters ? (
                <Spin />
            ) : (
                <div style={{marginLeft: 30}}>
                    <div style={{marginLeft: 30}}>
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

                    
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 30, paddingRight: 200 }}>
                        <div style={{ width: '60%' }}>
                            <h3 style={{ display: 'flex', justifyContent: 'center' }}>Slot Report</h3>
                            <DatePicker style={{ width: '40%', marginBottom: 20}} format={'DD-MM-YYYY'} onChange={handleDateChange} />
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

                        <div style={{ width: '30%' }}>
                            <h3 style={{ display: 'flex', justifyContent: 'center', marginBottom: 70 }}>Fee Summary</h3>
                            <div style={{ border: '2px solid #f0f0f0', padding: '30px', borderRadius: '8px' }}>
                                <div>
                                    <strong>Total hours:</strong> {feeData.totalHours || 0} hours
                                </div>
                                <br />
                                <div>
                                    <strong>Hour rate:</strong> {formatNumber.format(feeData.hourlyRate) || 0} / hour
                                </div>
                                <br />
                                <div>
                                    <strong>Estimated fee:</strong> {formatNumber.format(feeData.preCalculatedInvigilatorFree) || 0} VND
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvigilatorReport;
