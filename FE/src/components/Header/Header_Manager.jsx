import React from "react";
import { Dropdown } from "antd";
import { Button, Space, Tooltip, message } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../../assets/fpt-university-logo.png";
import "./Header_Manager.css";
import Logout from "../Logout";

const handleMenuClick = (e) => {
  message.info("Click on menu item.");
  console.log("click", e);
};
const items = [
  {
    label: "1st menu item",
    key: "1",
    icon: <UserOutlined />,
  },
  {
    label: "2nd menu item",
    key: "2",
    icon: <UserOutlined />,
  },
  {
    label: "3rd menu item",
    key: "3",
    icon: <UserOutlined />,
    danger: true,
  },
];
const menuProps = {
  items,
  onClick: handleMenuClick,
};

const Header_Manager = () => {
  return (
    <div className="header">
      <a className="logo">
        <img src={logo} alt="logo" />
      </a>
      <div className="header-right">
        <Space wrap>
          <Dropdown.Button
            menu={menuProps}
            placement="bottom"
            icon={<UserOutlined />}
          >
            Dropdown
          </Dropdown.Button>

          <Dropdown menu={menuProps}>
            <Button>
              <Space>
                Button
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>

          <Logout />
        </Space>
      </div>
    </div>
  );
};
export default Header_Manager;
