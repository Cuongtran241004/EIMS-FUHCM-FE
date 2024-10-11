import React, { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import { getRequests } from '../../components/API/getRequests';

function InvigilatorRequestsList() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const response = await getRequests(); // Gọi API mà không cần truyền gì cả
                setRequests(response);
            } catch (error) {
                console.error('fetchRequests Error:', error.message);
                message.error(error.message || 'Error fetching requests');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const columns = [
        {
            title: 'Request Type',
            dataIndex: 'requestType',
            key: 'requestType',
        },
        {
            title: 'Semester',
            dataIndex: 'semesterName',
            key: 'semesterName',
        },
        {
            title: 'Slot Details',
            key: 'slotDetails',
            render: (record) => {
                const startTime = new Date(record.startAt).toLocaleString();
                const endTime = new Date(record.endAt).toLocaleString();
                return (
                    <div>
                        <div><strong>Start:</strong> {startTime}</div>
                        <div><strong>End:</strong> {endTime}</div>
                    </div>
                );
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => new Date(text).toLocaleString(),
            sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color;
                switch (status) {
                  case 'PENDING':
                    color = '#faad14';
                    break;
                  case 'APPROVED':
                    color = '#52c41a';
                    break;
                  case 'REJECTED':
                    color = '#ff4d4f';
                    break;
                  default:
                    color = '#000';
                }
          
                return <span style={{ color, fontWeight: 'bold' }}>{status}</span>;
              },
        },
    ];


    return (
        <div style={{ padding: 20 }}>
            <h2>Submitted Requests</h2>
            <Table
                columns={columns}
                dataSource={requests}
                loading={loading}
                rowKey="requestId"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}

export default InvigilatorRequestsList;
