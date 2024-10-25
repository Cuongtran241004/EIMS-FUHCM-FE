import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import { selectButtonStyle } from "../../design-systems/CSS/Button.js";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Button, Space, Table, Spin, Layout, Input } from "antd";
import attendanceApi from "../../services/InvigilatorAttendance.js";
import { managerMapperUtil } from "../../utils/Mapper/ManagerMapperUtil.jsx";

const { Sider, Content } = Layout;
const InvigilatorFees = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedSemester, setSelectedSemester, semesters } = useSemester();
  const [filteredData, setFilteredData] = useState([]);
  const fetchData = async (semesterId) => {
    setLoading(true);
    try {
      const response =
        await attendanceApi.getAttendanceReportBySemesterIdManager(semesterId);
      console.log(response);
      const result = managerMapperUtil.mapAttendanceReport(response);

      setData(result || []);
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
  const handleSearch = (event) => {
    const { value } = event.target;
    const filtered = data.filter((user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredData(filtered); // Update the filtered data displayed in the table
  };
  const columns = [
    {
      title: "FuID",
      dataIndex: "fuId",
      key: "fuId",
      align: "center",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => {
        return `${record.lastName} ${record.firstName}`;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    // {
    //   title: "Total Slots",
    //   dataIndex: "totalSlots",
    //   key: "totalSlots",
    //   align: "center",
    // },
    {
      title: "Total Hours",
      dataIndex: "totalHours",
      key: "totalHours",
      align: "center",
    },
    {
      title: "Hourly Rate",
      dataIndex: "hourlyRate",
      key: "hourlyRate",
      align: "center",
      // vietnameseDongFormat
      render: (text, record) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(record.hourlyRate);
      },
    },
    {
      title: "Amounts",
      dataIndex: "fee",
      key: "fee",
      align: "center",
      render: (text, record) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(record.fee);
      },
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => {
        return <Button type="link">Send email</Button>;
      },
    },
  ];

  return (
    <Layout style={{ height: "100vh", overflowY: "hidden" }}>
      <Header />
      <Layout>
        <Sider width={256} style={{ backgroundColor: "#4D908E" }}>
          <NavBar_Manager />
        </Sider>
        <Content style={{ padding: 12, margin: 0, background: "#fff" }}>
          <div style={{ margin: 20, height: 20 }}>
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
            <Input
              placeholder="Search by name"
              onChange={handleSearch}
              allowClear
              style={{
                width: 200,
                marginLeft: "20px",
              }}
            />
          </div>

          <Spin spinning={loading}>
            <Table
              style={{ width: "100%" }}
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showQuickJumper: false,
              }}
            />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default InvigilatorFees;
