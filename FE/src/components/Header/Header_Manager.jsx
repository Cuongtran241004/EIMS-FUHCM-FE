import React, { useEffect, useState } from "react";
import { Dropdown, Button, Space, message } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../../assets/fpt-university-logo.png";
import "./Header_Manager.css";
import Logout from "../Logout";
import { Link, useNavigate } from "react-router-dom";
import { getUserInfo } from "../API/getUserInfo";

const items = [
  {
    label: "Profile",
    key: "1",
    icon: <UserOutlined />,
  },
  {
    label: "Logout",
    key: "2",
    icon: <Logout />,
  },
];
const menuProps = {
  items,
};

const Header_Manager = ({ isLogin }) => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
  });

  const navigate = useNavigate(); // Use the hook for navigation

  useEffect(() => {
    if (!isLogin) {
      navigate("/"); // Navigate to login page if not logged in
    }

    const initUserInfo = async () => {
      const newInfo = await getUserInfo();
      setData(newInfo);
    };
    initUserInfo();
  }, [isLogin, navigate]); // Include navigate in dependency array

  return (
    <div className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          <img src={logo} alt="logo" />
        </Link>
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
                {data.lastName} {data.firstName}
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
