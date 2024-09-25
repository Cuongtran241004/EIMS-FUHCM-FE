import React from "react";
import { Menu } from "antd";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";

const items = [
  {
    key: "sub1",
    label: "Exam Management",
    icon: <MailOutlined />,

    children: [
      {
        key: "1",
        label: "Exam slots",
      },
      {
        key: "2",
        label: "Attendance check",
      },
    ],
  },
  {
    key: "sub2",
    label: "Invigilation Manangement",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "5",
        label: "Invigilator Attendance",
      },
      {
        key: "6",
        label: "Invigilation fees",
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
            label: "Semester",
          },
          {
            key: "10",
            label: "Subjects",
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
            label: "Staffs",
          },
          {
            key: "12",
            label: "Invigilators",
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
        label: "Requests",
      },
      {
        key: "14",
        label: "Dashboard",
      },
    ],
  },
];
const NavBar = () => {
  //   const onClick = (e) => {
  //     console.log("click ", e);
  //   };
  //   return (
  //     <Menu
  //       onClick={onClick}
  //       style={{
  //         width: 256,
  //       }}
  //       defaultSelectedKeys={["1"]}
  //       defaultOpenKeys={["sub1"]}
  //       mode="inline"
  //       items={items}
  //     />
  //   );

  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div
      style={{
        width: 256,
      }}
    >
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          marginBottom: 16,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};

export default NavBar;
