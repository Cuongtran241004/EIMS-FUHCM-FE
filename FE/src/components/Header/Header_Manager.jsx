import React, { useEffect, useState } from "react";
import { Dropdown, Button, Space, message, Spin } from "antd";
import { DownOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/fpt-university-logo.png";
import "./Header_Manager.css";
import { getUserInfo } from "../API/getUserInfo";
import {
  MANAGER_DASHBOARD_URL,
  MANAGER_REQUESTS_URL,
} from "../../configs/urlWeb";

const HeaderManager = ({ isLogin }) => {
  const [user, setUser] = useState({ firstName: "", lastName: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigate("/"); // Redirect to login page if not authenticated
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo);
      } catch (error) {
        message.error("Failed to load user information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [isLogin, navigate]);

  const handleLogout = () => {
    // Implement your logout logic here, e.g., clearing tokens, redirecting
    // For example:
    // logoutUser();
    navigate("/login");
    message.success("Logged out successfully.");
  };

  const menuItems = [
    {
      label: <Link to="/profile">Profile</Link>,
      key: "1",
      icon: <UserOutlined />,
    },
    {
      label: "Logout",
      key: "2",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const menuProps = {
    items: menuItems,
  };

  return (
    <div className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          <img src={logo} alt="FPT University Logo" />
        </Link>
      </div>
      <div className="header-right">
        <Space wrap className="header-right-space">
          <Link to={MANAGER_DASHBOARD_URL}>
            <Button type="primary">Dashboard</Button>
          </Link>

          <Link to={MANAGER_REQUESTS_URL}>
            <Button type="dashed">Request</Button>
          </Link>

          {loading ? (
            <Spin />
          ) : (
            <Dropdown menu={menuProps}>
              <Button>
                <Space>
                  {user.firstName}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          )}
        </Space>
      </div>
    </div>
  );
};

export default HeaderManager;
