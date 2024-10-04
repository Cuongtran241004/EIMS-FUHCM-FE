import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { Link, useNavigate } from 'react-router-dom';
import headerConfig from '../../configs/headerConfig';
import { Button, Space, Dropdown } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import logo from '../../assets/fpt-university-logo.png';
import { getUserInfo } from "../API/getUserInfo";
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
const menuProps = {
    items,
};

const Header = ({ isLogin }) => {
    const role = useContext(UserContext);
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogin) {
            navigate("/");
        }

        const initUserInfo = async () => {
            const newInfo = await getUserInfo();
            setData(newInfo);
        };
        initUserInfo();
    }, [isLogin, navigate]);

    const currentHeader = headerConfig[role] || headerConfig['invigilator'];
    console.log('currentHeader:', currentHeader);
    useEffect(() => {
        console.log('Role in header:', role);
    }, [role]);

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
                        <Button key={index} size="large">
                            <Link to={item.path} className="header-right-item">
                                {item.name}
                            </Link>
                        </Button>
                    ))}
                    <Dropdown menu={menuProps} trigger={["click"]}>
                        <Button size="large">
                            <Space>
                                <span> {data.lastName} {data.firstName}</span>
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