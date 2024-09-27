import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

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
        key: "g1",
        label: "Configs",
        type: "group",
        children: [
          {
            key: "5",
            label: <Link to="/semester">Semester</Link>,
          },
          {
            key: "6",
            label: <Link to="/subjects">Subjects</Link>,
          },
          {
            key: "7",
            label: <Link to="/exam-slot">Exam Slot</Link>,
          },
        ],
      },
      {
        key: "g2",
        label: "Users",
        type: "group",
        children: [
          {
            key: "8",
            label: <Link to="/staffs">Staffs</Link>,
          },
          {
            key: "9",
            label: <Link to="/invigilators">Invigilators</Link>,
          },
        ],
      },
    ],
  },
  {
    type: "divider",
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
    "/subjects": { key: "6", openKey: "sub3" },
    "/exam-slot": { key: "7", openKey: "sub3" },
    "/staffs": { key: "8", openKey: "sub3" },
    "/invigilators": { key: "9", openKey: "sub3" },
    "/requests": { key: "10", openKey: "grp" },
    "/dashboard": { key: "11", openKey: "grp" },
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
