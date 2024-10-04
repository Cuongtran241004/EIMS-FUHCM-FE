import React from "react";
import { Dropdown } from "antd";
import { Button, Space, message, Menu } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../../assets/fpt-university-logo.png";
import Logout from "../Logout";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserInfo } from "../API/getUserInfo";
import "./Header_Staff.css";

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

const Header_Staff = ({ isLogin }) => {
  // const [data, setData] = useState({
  //   firstName: "",
  //   lastName: "",
  // });

  // useEffect(() => {
  //   if (!isLogin) Navigate("/");
  //   const initUserInfo = async () => {
  //     const newInfo = await getUserInfo();
  //     setData(newInfo);
  //   };
  //   initUserInfo();
  // }, [isLogin]);

  return (
    <div className="header">
      <div className="header-left">
        <Link className="logo" to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>

      <div className="header-right">
        <Space>
          <Button size="large">
            <Link to="/subject" className="header-right-item">
              Subject
            </Link>
          </Button>
          <Button size="large">
            <Link to="/exam" className="header-right-item">
              Exam
            </Link>
          </Button>

          <Button size="large">
            <Link to="/exam-schedule" className="header-right-item">
              Exam Schedule
            </Link>
          </Button>

          <Button size="large">
            <Link to="/attendance" className="header-right-item">
              Attendance
            </Link>
          </Button>

          <Dropdown menu={menuProps}>
            <Button size="large">
              <Space>
                Cường
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </Space>
      </div>
    </div>
  );
};
export default Header_Staff;
