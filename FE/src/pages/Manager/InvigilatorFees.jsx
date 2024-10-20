import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import { selectButtonStyle } from "../../design-systems/CSS/Button.js";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Button, Space, Table, Spin, Layout } from "antd";

export default function InvigilatorFees() {

    const { Sider, Content } = Layout;
    const [loading, setLoading] = useState(false);
    const { selectedSemester, setSelectedSemester, semesters } = useSemester();

    const fetchData = async (semesterId) => {
        setLoading(true);
        try {
            // Fetch attendance data
        } catch (error) {
            // Handle error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedSemester.id) {
            fetchData(selectedSemester.id);
        }
    }, [selectedSemester.id]);
    const items = semesters.map((semester) => ({
        key: semester.id,
        label: semester.name,
    }));

    const handleMenuClick = (e) => {
        const selected = items.find((item) => item.key == e.key);
        if (selected) {
            setSelectedSemester({
                id: selected.key,
                name: selected.label,
            });
        }
    };

    const columns = [
        {
            title: "FuID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Full name",
            dataIndex: "fullName",
            key: "fullName",
        },
        {
            title: "Registered slots",
            dataIndex: "registeredSlots",
            key: "registeredSlots",
        },
       {
        title: "Provisional fee",
        dataIndex: "provisionalFee",
        key: "provisionalFee",
        },
        {
            title: "Actual fee",
            dataIndex: "actualFee",
            key: "actualFee",
        },
        {
            title: "Total fees",
            dataIndex: "totalFees",
            key: "totalFees",
        },
        
    ];

    return (
        <Layout style={{ height: "100vh", overflowY: 'hidden' }}>
        <Header />
        <Layout>
            <Sider width={256} style={{ backgroundColor: "#4D908E" }}>
                <NavBar_Manager />
            </Sider>
            <Content style={{ padding: 12, margin: 0, background: "#fff" }}>
            <div style={{ margin: 20, height: 20}}>
                <Dropdown
                    menu={{
                        items,
                        onClick: handleMenuClick,
                    }}
                >
                    <Button style={{ width: "150px", ...selectButtonStyle }}>
                        <Space>
                            {selectedSemester.name}
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
                </div>
           
            <Spin spinning={loading}>
                <Table style={{  width: "100%" }}
                    columns={columns}
                    dataSource={[]}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: false,
                        showQuickJumper: false,
                        position: ["bottomCenter"],
                    }}
                />
            </Spin>
            </Content>
        </Layout>
    </Layout>
    );
};