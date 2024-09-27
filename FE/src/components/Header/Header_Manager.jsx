import React from "react";
import { Dropdown } from "antd";
import { Button, Space, message } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../../assets/fpt-university-logo.png";
import "./Header_Manager.css";
import Logout from "../Logout";
import { Link } from "react-router-dom";

const handleMenuClick = (e) => {
  message.info("Click on menu item.");
  console.log("click", e);
};
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
  onClick: handleMenuClick,
};

const Header_Manager = () => {
  return (
    <div className="header">
      <div className="header-left">
        <a className="logo">
          <img src={logo} alt="logo" />
        </a>
      </div>
      <div className="header-right">
        <Space wrap className="header-right-space">
          <Button>
            <Link to="/dashboard">Dashboard</Link>
          </Button>

          <Button variant="dashed">
            <Link to="/requests">Request</Link>
          </Button>

          <Dropdown menu={menuProps}>
            <Button>
              <Space>
                Quốc Cường
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </Space>
      </div>
    </div>
  );
};
export default Header_Manager;
