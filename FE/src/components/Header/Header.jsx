import React, { useContext } from 'react';
import { UserContext } from '../../components/UserContext';
import { Link, useLocation } from 'react-router-dom';
import headerConfig from '../../configs/headerConfig';
import { Button, Space, Dropdown } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import logo from '../../assets/fpt-university-logo.png';
import Logout from '../Logout';
import './Header.css';

const items = [
  {
    label: 'Profile',
    key: '1',
    icon: <UserOutlined />,
  },
  {
    label: '',
    key: '2',
    icon: <Logout />,
  },
];

const Header = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const currentHeader = headerConfig[user.role] || headerConfig['Invigilator'];

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
                  {item.name}
                </Link>
              </Button>
            );
          })}
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button size="large">
              <Space>
                <span>
                  {user.lastName} {user.firstName}
                </span>
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
