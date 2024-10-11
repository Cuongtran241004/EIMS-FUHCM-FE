import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import headerConfig from "./Header";
import { Button, Space, Dropdown } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../../assets/fpt-university-logo.png";
import Logout from "../Logout";
import "./Header.css";

const items = [
  {
    label: "Profile",
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
          {currentHeader.map((item, index) => (
            <Button key={index} size="large" style={{ width: "150px" }}>
              <Link to={item.path} className="header-right-item">
                {item.name}
              </Link>
            </Button>
          ))}
          <Dropdown menu={menuProps} trigger={["click"]}>
            <Button size="large">
              <Space>
                <span>{user.firstName}</span>
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </Space>
      </div>
    </div>
  );
};

export default Header;
