import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import NavBar_Manager from "../../components/NavBar/NavBar_Manager";
import { useSemester } from "../../components/Context/SemesterContext.jsx";
import { selectButtonStyle } from "../../design-systems/CSS/Button.js";
import { DownOutlined, EyeOutlined } from "@ant-design/icons";
import { Dropdown, Button, Space, Table, Spin, Layout, Modal } from "antd";
import attendanceApi from "../../services/InvigilatorAttendance.js";
import { managerMapperUtil } from "../../utils/Mapper/ManagerMapperUtil.jsx";

const InvigilatorAttendance = () => {
  const { Sider, Content } = Layout;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
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
      console.log(result);
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

  const handleCancel = () => {
    setIsModalVisible(false);
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
      render: (_, __, index) => index + 1,
    },
    {
      title: "Subject Code",
      dataIndex: "subjectCode",
      key: "subjectCode",
      align: "center",
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
    },
  ];
  return (
    <Layout style={{ height: "100vh" }}>
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
          </div>

          <Spin spinning={loading}>
            <Table
              style={{ width: "100%" }}
              columns={columns}
              dataSource={data}
              rowKey="id"
              expandable={{
                expandedRowRender: (record) => {
                  // record.detail is an array of objects, render each object as a single line
                  // <Table
                  //   columns={columnsAttendance}
                  //   dataSource={record.detail}
                  //   pagination={false}
                  // />

                  record.detail.map((item) => {
                    console.log(item);
                    return (
                      <div key={item.key}>
                        <p>{item.subjectCode}</p>
                        <p>{item.examType}</p>
                      </div>
                    );
                  });
                },
              }}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showQuickJumper: false,
              }}
            />
          </Spin>

          <Modal
            title="Attendance List"
            open={isModalVisible}
            onCancel={handleCancel}
            width={650}
            height={500}
            footer={null}
            loading={listLoading}
          >
            <Table
              dataSource={attendanceList} // Add a key property to each request object
              columns={columnsAttendance}
              pagination={{ pageSize: 8 }}
            />
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default InvigilatorAttendance;
