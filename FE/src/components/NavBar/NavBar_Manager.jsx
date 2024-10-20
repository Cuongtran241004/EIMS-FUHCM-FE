import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  SettingOutlined,
  ReadOutlined,
  MonitorOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import {
  MANAGER_ATTENDENCE_CHECK_URL,
  MANAGER_CONFIGS_URL,
  MANAGER_EXAM_SCHEDULE_URL,
  MANAGER_SEMESTER_URL,
  MANAGER_USERS_URL,
} from "../../configs/urlWeb";
import "./NavBar_Manager.css";
const items = [
  {
    key: "sub1",
    label: <h3 style={{ color: "#fff" }}>Exam Management</h3>,
    icon: <ReadOutlined style={{ color: "#fff" }} />,
    children: [
      {
        key: "1",
        label: (
          <Link to={MANAGER_EXAM_SCHEDULE_URL} style={{ color: "#fff" }}>
            Exam Schedule
          </Link>
        ),
      },
      {
        key: "2",
        label: (
          <Link to={MANAGER_ATTENDENCE_CHECK_URL} style={{ color: "#fff" }}>
            Attendance Check
          </Link>
        ),
      },
    ],
  },
  {
    key: "sub2",
    label: <h3 style={{ color: "#fff" }}>Invigilation</h3>,
    icon: <MonitorOutlined style={{ color: "#fff" }} />,
    children: [
      {
        key: "3",
        label: (
          <Link to="/invigilator-attendance" style={{ color: "#fff" }}>
            Invigilator Attendance
          </Link>
        ),
      },
      {
        key: "4",
        label: (
          <Link to="/invigilation-fees" style={{ color: "#fff" }}>
            Invigilation Fees
          </Link>
        ),
      },
    ],
  },
  {
    key: "sub3",
    label: <h3 style={{ color: "#fff" }}>Settings</h3>,
    icon: <SettingOutlined style={{ color: "#fff" }} />,
    children: [
      {
        key: "5",
        label: (
          <Link to={MANAGER_SEMESTER_URL} style={{ color: "#fff" }}>
            Semester
          </Link>
        ),
      },

      {
        key: "7",
        label: (
          <Link to={MANAGER_USERS_URL} style={{ color: "#fff" }}>
            Users
          </Link>
        ),
      },
      {
        key: "8",
        label: (
          <Link to={MANAGER_CONFIGS_URL} style={{ color: "#fff" }}>
            Configs
          </Link>
        ),
      },
    ],
  },
];

const NavBar_Manager = () => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState(["sub1", "sub2", "sub3"]); // Initially open one submenu

  // Mapping of routes to submenu keys
  const pathToKeyMap = {
    "/exam-schedule": { key: "1", openKey: "sub1" },
    "/attendance-check": { key: "2", openKey: "sub1" },
    "/invigilator-attendance": { key: "3", openKey: "sub2" },
    "/invigilation-fees": { key: "4", openKey: "sub2" },
    "/semester": { key: "5", openKey: "sub3" },
    "/exam-slot": { key: "6", openKey: "sub3" },
    "/users": { key: "7", openKey: "sub3" },
    "/configs": { key: "8", openKey: "sub3" },
  };

  // Set selected key and open key when location changes
  useEffect(() => {
    const currentPath = location.pathname;
    const pathInfo = pathToKeyMap[currentPath];

    if (pathInfo) {
      setSelectedKeys([pathInfo.key]);
      setOpenKeys([...openKeys, pathInfo.openKey]);
    }
  }, [location.pathname]);

  const handleClick = (e) => {
    setSelectedKeys([e.key]);
  };

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const handleOnSelect = ({ key }) => {
    setSelectedKeys([key]);
  };
  return (
    <Menu
      style={{ width: 256, backgroundColor: "#4D908E" }}
      mode="inline"
      selectedKeys={selectedKeys}
      openKeys={openKeys} // Control open keys
      onClick={handleClick}
      onOpenChange={handleOpenChange} // Manually handle open/close
      onSelect={handleOnSelect}
      items={items}
    />
  );
};

export default NavBar_Manager;
