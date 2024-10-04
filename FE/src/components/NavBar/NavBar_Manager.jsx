import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { MANAGER_SEMESTER_URL, MANAGER_USERS_URL } from "../../configs/urlWeb";

const items = [
  {
    key: "sub1",
    label: "Exam Management",
    icon: <MailOutlined />,
    children: [
      {
        key: "1",
        label: <Link to="/exam-schedule">Exam Schedule</Link>,
      },
      {
        key: "2",
        label: <Link to="/attendance-check">Attendance Check</Link>,
      },
    ],
  },
  {
    key: "sub2",
    label: "Invigilation Management",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "3",
        label: <Link to="/invigilator-attendance">Invigilator Attendance</Link>,
      },
      {
        key: "4",
        label: <Link to="/invigilation-fees">Invigilation Fees</Link>,
      },
    ],
  },
  {
    key: "sub3",
    label: "Settings",
    icon: <SettingOutlined />,
    children: [
      {
        key: "5",
        label: <Link to={MANAGER_SEMESTER_URL}>Semester</Link>,
      },

      {
        key: "6",
        label: <Link to="/exam-slot">Exam Slot</Link>,
      },
      {
        key: "7",
        label: <Link to={MANAGER_USERS_URL}>Users</Link>,
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
    "/staffs": { key: "7", openKey: "sub3" },
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
      style={{ width: 256 }}
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
