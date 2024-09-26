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
        label: <Link to="/exam-slots">Exam slots</Link>,
      },
      {
        key: "2",
        label: <Link to="/attendance-check">Attendance check</Link>,
      },
    ],
  },
  {
    key: "sub2",
    label: "Invigilation Management",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "5",
        label: <Link to="/invigilator-attendance">Invigilator Attendance</Link>,
      },
      {
        key: "6",
        label: <Link to="/invigilation-fees">Invigilation fees</Link>,
      },
    ],
  },
  {
    type: "divider",
  },
  {
    key: "sub4",
    label: "Settings",
    icon: <SettingOutlined />,
    children: [
      {
        key: "g1",
        label: "Configs",
        type: "group",
        children: [
          {
            key: "9",
            label: <Link to="/semester">Semester</Link>,
          },
          {
            key: "10",
            label: <Link to="/subjects">Subjects</Link>,
          },
        ],
      },
      {
        key: "g2",
        label: "Users",
        type: "group",
        children: [
          {
            key: "11",
            label: <Link to="/staffs">Staffs</Link>,
          },
          {
            key: "12",
            label: <Link to="/invigilators">Invigilators</Link>,
          },
        ],
      },
    ],
  },
  {
    key: "grp",
    label: "",
    type: "group",
    children: [
      {
        key: "13",
        label: <Link to="/requests">Requests</Link>,
      },
      {
        key: "14",
        label: <Link to="/dashboard">Dashboard</Link>,
      },
    ],
  },
];

const NavBar_Manager = () => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState(["1"]);
  const [openKeys, setOpenKeys] = useState(["sub1"]);

  // Update selected keys based on path
  useEffect(() => {
    const pathKeyMap = {
      "/exam-slots": "1",
      "/attendance-check": "2",
      "/invigilator-attendance": "5",
      "/invigilation-fees": "6",
      "/semester": "9",
      "/subjects": "10",
      "/staffs": "11",
      "/invigilators": "12",
      "/requests": "13",
      "/dashboard": "14",
    };

    const newSelectedKey = pathKeyMap[location.pathname];

    // Only update state if the key changes
    if (newSelectedKey && newSelectedKey !== selectedKeys[0]) {
      setSelectedKeys([newSelectedKey]);
    }
  }, [location.pathname, selectedKeys]);

  const handleClick = (e) => {
    setSelectedKeys([e.key]);
  };

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <Menu
      style={{ width: 256 }}
      mode="inline"
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onClick={handleClick}
      onOpenChange={handleOpenChange}
      items={items}
    />
  );
};

export default NavBar_Manager;
