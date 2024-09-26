import React from "react";
import { Menu } from "antd";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const items = [
  {
    key: "sub1",
    label: "Exam Management",
    icon: <MailOutlined />,
    children: [
      {
        key: "1",
        label: <Link to="/exam-slots">Exam slots</Link>, // Wrapped with Link
      },
      {
        key: "2",
        label: <Link to="/attendance-check">Attendance check</Link>, // Wrapped with Link
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
        label: <Link to="/invigilator-attendance">Invigilator Attendance</Link>, // Wrapped with Link
      },
      {
        key: "6",
        label: <Link to="/invigilation-fees">Invigilation fees</Link>, // Wrapped with Link
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
            label: <Link to="/semester">Semester</Link>, // Wrapped with Link
          },
          {
            key: "10",
            label: <Link to="/subjects">Subjects</Link>, // Wrapped with Link
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
            label: <Link to="/staffs">Staffs</Link>, // Wrapped with Link
          },
          {
            key: "12",
            label: <Link to="/invigilators">Invigilators</Link>, // Wrapped with Link
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
        label: <Link to="/requests">Requests</Link>, // Wrapped with Link
      },
      {
        key: "14",
        label: <Link to="/dashboard">Dashboard</Link>, // Wrapped with Link
      },
    ],
  },
];

const NavBar_Manager = () => {
  return (
    <Menu
      style={{
        width: 256,
      }}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      items={items}
    />
  );
};

export default NavBar_Manager;
