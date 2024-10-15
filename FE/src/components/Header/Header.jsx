import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext.jsx";
import { Link, useLocation } from "react-router-dom";
import headerConfig from "./Header";
import { Button, Space, Dropdown } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../../assets/fpt-university-logo.png";
import Logout from "../Logout";
import "./Header.css";

const items = [
  {
    label: <Link to="/profile">Profile</Link>,
    key: "1",
    icon: <UserOutlined />,
  },
  {
    label: "",
    key: "2",
    icon: <Logout />,
  },
];
const menuProps = {
  items,
};

const Header = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const currentHeader = headerConfig[user.role];

  return (
    <div className="header">
      <div className="header-left">
        <Link className="logo" to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>

      <div className="header-right">
        <Space>
          {currentHeader.map((item, index) => {
            if (item.subMenu) {
              const isActive = item.subMenu.some(
                (subItem) => location.pathname === subItem.path
              );
              const subMenuItems = item.subMenu.map((subItem, subIndex) => ({
                key: subItem.path,
                label: (
                  <Link
                    to={subItem.path}
                    className={
                      location.pathname === subItem.path ? "active" : ""
                    }
                  >
                    {subItem.name}
                  </Link>
                ),
              }));

              return (
                <Dropdown
                  key={index}
                  menu={{ items: subMenuItems }}
                  trigger={["click"]}
                >
                  <Button size="large" type={isActive ? "primary" : "default"}>
                    <Space>
                      {item.name}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              );
            }

            const isActive = location.pathname === item.path;
            return (
              <Button
                key={index}
                size="large"
                style={{ backgroundColor: isActive ? "#4D908E" : "" }}
              >
                <Link
                  to={item.path}
                  className={`header-right-item ${isActive ? "active" : ""}`}
                >
                  <span className={`button-name ${isActive ? "active" : ""}`}>
                    {item.name}
                  </span>
                </Link>
              </Button>
            );
          })}

          <Dropdown menu={menuProps} trigger={["click"]}>
            <Button size="large" style={{ borderRadius: "100%" }}>
              <UserOutlined />
            </Button>
          </Dropdown>
        </Space>
      </div>
    </div>
  );
};

export default Header;
