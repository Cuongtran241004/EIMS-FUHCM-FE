import React, { useEffect, useState } from 'react';
import { Button, Space, message, Menu } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import Header from '../../components/Header/Header.jsx';


function InvigilatorRequest({isLogin}) {


    return (
        <div>
           <Header isLogin={isLogin} />
        </div>
    );
    
}

export default InvigilatorRequest;