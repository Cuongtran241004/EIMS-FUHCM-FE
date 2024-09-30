import React from "react";
import { Dropdown } from "antd";
import { Button, Space, message } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../../assets/fpt-university-logo.png";
import "./Header_Manager.css";
import Logout from "../Logout";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserInfo } from "../API/getUserInfo";

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

const Header_Manager = ({isLogin}) => {

  const [data, setData] = useState({
    name: '',
  });

  useEffect(() => {
    if (!isLogin) Navigate('/');

    const initUserInfo = async () => {
      const newInfo = await getUserInfo();
      setData(newInfo);
    };
    initUserInfo();

   
  }, [isLogin]);

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

          <Dropdown  menu={menuProps}>
            <Button>
              <Space>
                {data.name}
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
