import React, { useEffect, useState } from "react";
import { Table, Select, DatePicker, Spin, Flex } from "antd";
import { useSemester } from "../../components/SemesterContext";
import moment from "moment";

const InvigilatorReport = () => {
    const {
        semesters,
        selectedSemester,
        setSelectedSemester,
        loadingSemesters,
    } = useSemester() || {};

    const [slotData, setSlotData] = useState([]);
    const [feeData, setFeeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (loadingSemesters) return;

        if (semesters && semesters.length > 0) {
            fetchSlotData(selectedSemester, selectedDate);
            fetchFeeData(selectedSemester);
        }
    }, [semesters, selectedSemester, selectedDate, loadingSemesters]);

    const fetchSlotData = async (semester, date) => {
        setLoading(true);
        try {
            // Replace this URL with your actual API endpoint
            const response = await fetch(`/api/slots?semesterId=${semester?.id}&date=${date ? moment(date).format("YYYY-MM-DD") : ''}`);
            const data = await response.json();
            setSlotData(data);
        } catch (error) {
            console.error("Error fetching slot data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFeeData = async (semester) => {
        setLoading(true);
        try {
            // Replace this URL with your actual API endpoint
            const response = await fetch(`/api/fees?semesterId=${semester?.id}`);
            const data = await response.json();
            setFeeData(data);
        } catch (error) {
            console.error("Error fetching fee data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        fetchSlotData(selectedSemester, date); // Fetch new data when date changes
    };

    const slotColumns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date) => moment(date).format("YYYY-MM-DD"),
        },
        {
            title: "Start",
            dataIndex: "start",
            key: "start",
        },
        {
            title: "End",
            dataIndex: "end",
            key: "end",
        },
        {
            title: "Check In",
            dataIndex: "checkIn",
            key: "checkIn",
        },
        {
            title: "Check Out",
            dataIndex: "checkOut",
            key: "checkOut",
        },
    ];


    return (
        <div>
            <h1 style={{ color: 'red', display: 'flex', justifyContent: 'center' }}>Invigilator Report</h1>

            {loadingSemesters ? (
                <Spin />
            ) : (
                <>
                    <Select
                        value={selectedSemester?.id}
                        onChange={(value) => {
                            const semester = semesters.find((sem) => sem.id === value);
                            setSelectedSemester(semester);
                            fetchSlotData(semester, selectedDate);
                            fetchFeeData(semester);
                        }}
                        placeholder="Select Semester"
                        style={{ width: 200, marginBottom: 20, marginLeft: 30 }}
                    >
                        {semesters.map((semester) => (
                            <Select.Option key={semester.id} value={semester.id}>
                                {semester.name}
                            </Select.Option>
                        ))}
                    </Select>


                    <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 30, paddingRight: 200 }}>
                        <div style={{width: '60%'}}>
                            <h3 style={{ display: 'flex', justifyContent: 'center'}}>Slot Report</h3>
                            <Table 
                                columns={slotColumns}
                                dataSource={slotData}
                                loading={loading}
                                rowKey="id"
                            />
                        </div>

                        <div style={{width: '20%'}}>
                            <h3 style={{ display: 'flex', justifyContent: 'center' }}>Fee Summary</h3>
                            <div style={{ border: '2px solid #f0f0f0', padding: '16px', borderRadius: '8px' }}>
                                <div>
                                    <strong>Estimated Fee:</strong> {feeData.estimatedFee || 0}
                                </div>
                                <br />
                                <div>
                                    <strong>Actual Fee:</strong> {feeData.actualFee || 0}
                                </div>
                                <br />
                                <div>
                                    <strong>Amount Received:</strong> {feeData.amountReceived || 0}
                                </div>
                                <br />
                                <div>
                                    <strong>Rate:</strong> {feeData.rate || 0} / hour
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default InvigilatorReport;
