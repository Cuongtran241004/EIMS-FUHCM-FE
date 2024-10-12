import React, { useContext } from 'react';
import { UserContext } from '../../components/UserContext';
import { Link, useLocation } from 'react-router-dom';
import headerConfig from '../../configs/headerConfig';
import { Button, Space, Dropdown, Menu } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import logo from '../../assets/fpt-university-logo.png';
import Logout from '../Logout';
import './Header.css';

const Header = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const currentHeader = headerConfig[user.role] || headerConfig['Invigilator'];

  // Tạo menu cho Profile
  const profileMenuItems = [
    {
      key: 'profile',
      label: (
        <div>
          <strong>{user.lastName} {user.firstName}</strong>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: <Logout />,
    },
  ];

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
              const isActive = item.subMenu.some((subItem) => location.pathname === subItem.path);
              const subMenuItems = item.subMenu.map((subItem, subIndex) => ({
                key: subItem.path,
                label: (
                  <Link to={subItem.path} className={location.pathname === subItem.path ? 'active' : ''}>
                    {subItem.name}
                  </Link>
                ),
              }));

              return (
                <Dropdown key={index} menu={{ items: subMenuItems }} trigger={['click']}>
                  <Button size="large" type={isActive ? 'primary' : 'default'}>
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
                type={isActive ? 'primary' : 'default'}
              >
                <Link
                  to={item.path}
                  className={`header-right-item ${isActive ? 'active' : ''}`}
                >
                  <span className={`button-name ${isActive ? 'active' : ''}`}>{item.name}</span>
                </Link>
              </Button>
            );
          })}

          <Dropdown menu={{ items: profileMenuItems }} trigger={['click']}>
            <Button size="large">
              <Space>
                <UserOutlined />
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
