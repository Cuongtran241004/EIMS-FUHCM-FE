import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import { useSemester } from "../../components/Context/SemesterContextManager.jsx";
import { selectButtonStyle } from "../../design-systems/CSS/Button.js";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Dropdown,
  Button,
  Space,
  Table,
  Spin,
  Layout,
  Input,
  message,
} from "antd";
import attendanceApi from "../../services/InvigilatorAttendance.js";
import { managerMapperUtil } from "../../utils/Mapper/ManagerMapperUtil.jsx";
import "./InvigilatorAttendance.css";
import ReportExportButton from "../../utils/Import-Excel/Attendance_Report.jsx";
const InvigilatorAttendance = () => {
  const { Sider, Content } = Layout;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { selectedSemester, setSelectedSemester, semesters } = useSemester();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const fetchData = async (semesterId) => {
    setLoading(true);
    try {
      const response =
        await attendanceApi.getAttendanceReportBySemesterIdManager(semesterId);
      const result = managerMapperUtil.mapAttendanceReport(response);

      setData(result || []);
      setFilteredData(result || []);
    } catch (error) {
      message.error("Failed to fetch data");
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
    const filtered = data.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        `${user.fuId}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered); // Update the filtered data displayed in the table
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
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
    {
      title: "Total Slots",
      dataIndex: "totalSlots",
      key: "totalSlots",
      align: "center",
    },
  ];

  const columnsAttendance = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
      width: "10%",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Subject Code",
      dataIndex: "subjectCode",
      key: "subjectCode",
      align: "center",
      width: "15%",
    },
    {
      title: "Exam Type",
      dataIndex: "examType",
      key: "examType",
      align: "center",
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      align: "center",
      render: (text, record) => {
        return `${record.startAt} - ${record.endAt}`;
      },
    },
    {
      title: "Staff ID",
      dataIndex: "staffId",
      key: "staffId",
      align: "center",
    },
    {
      title: "Staff Name",
      dataIndex: "staffName",
      key: "staffName",
      align: "center",
      render: (text, record) => {
        return `${record.staffLastName} ${record.staffFirstName}`;
      },
    },
  ];
  return (
    <Layout style={{ height: "100vh" }}>
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
              placeholder="Search by ID or Name"
              onChange={handleSearch}
              allowClear
              suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
              style={{
                width: 250,
                marginLeft: "20px",
              }}
            />

            <ReportExportButton data={data} />
          </div>

          <Spin spinning={loading}>
            <Table
              className="custom-table-invigilator-attendance"
              rowClassName={(record, index) =>
                index % 2 === 0 ? "even-row" : "odd-row"
              }
              style={{ width: "100%" }}
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              rowHoverable={false}
              expandable={{
                expandedRowRender: (record) => (
                  <Table
                    className="custom-table-invigilator-attendance-detail"
                    columns={columnsAttendance}
                    dataSource={record.detail}
                    pagination={false}
                    rowKey="id"
                  />
                ),
              }}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showQuickJumper: false,
                position: ["bottomRight"],
              }}
            />
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default InvigilatorAttendance;
