import React from 'react';
import { Layout, Calendar, Card, Row, Col, Table } from 'antd';
import Header_Manager from '../../components/Header/Header_Manager';
import NavBar_Manager from '../../components/NavBar/NavBar_Manager';

const { Content, Sider } = Layout;



const columns = [
    {
        title: 'Slot',
        dataIndex: 'slot',
        key: 'slot',
       
      },
    {
      title: 'Monday',
      dataIndex: 'monday',
      key: 'monday',
    },
    {
      title: 'Tuesday',
      dataIndex: 'tuesday',
      key: 'tuesday',
    },
    {
      title: 'Wednesday',
      dataIndex: 'wednesday',
      key: 'wednesday',
    },
    {
      title: 'Thursday',
      dataIndex: 'thursday',
      key: 'thursday',
    },
    {
      title: 'Friday',
      dataIndex: 'friday',
      key: 'friday',
    },
    {
      title: 'Saturday',
      dataIndex: 'saturday',
      key: 'saturday',
    },
    {
      title: 'Sunday',
      dataIndex: 'sunday',
      key: 'sunday',
    },
  ];


  const data = [
    {
      key: '1',
      slot: '1',
      monday: 'Room: 201',
      tuesday: 'Room: ',
      wednesday: 'Room: ',
      thursday: 'Room: 444',
      friday: 'Room: ',
      saturday: 'Room: ',
      sunday: 'Room: ',
    },
    {
      key: '2',
      slot: '2',
      monday: 'Room: ',
      tuesday: 'Room: 456',
      wednesday: 'Room: 524',
      thursday: 'Room: ',
      friday: 'Room: ',
      saturday: 'Room: ',
      sunday: 'Room: ',
    },
    {
      key: '3',
      slot: '3',
      monday: 'Room: 102',
      tuesday: 'Room: 112',
      wednesday: 'Room: ',
      thursday: 'Room: ',
      friday: 'Room: 456',
      saturday: 'Room: 111',
      sunday: 'Room: ',
    },
    {
      key: '4',
      slot: '4',
      monday: 'Room: ',
      tuesday: 'Room: ',
      wednesday: 'Room: 622',
      thursday: 'Room: ',
      friday: 'Room: 411',
      saturday: 'Room: ',
      sunday: 'Room: ',
    },
    {
      key: '5',
      slot: '5',
      monday: 'Room: ',
      tuesday: 'Room: 511',
      wednesday: 'Room: ',
      thursday: 'Room: ',
      friday: 'Room: ',
      saturday: 'Room: ',
      sunday: 'Room: ',
    },
  ];
  

function ExamSlots({isLogin}) {
    return (
        <Layout style={{ height: "120vh" }}>
            <Header_Manager isLogin={isLogin}/>
            <Layout>
                <Sider width={256} style={{ backgroundColor: "#fff" }}>
                    <NavBar_Manager />
                </Sider>
                <Layout>
                    <Content style={{ padding: '24px', minHeight: '100vh' }}>
                        <Row gutter={16}>
                            <Col span={15}>
                                <Card title="Week Schedule" bordered={false}>
                                    <div style={{ height: '80vh', overflow: 'auto' }}>
                                    <Table columns={columns} dataSource={data}/>
                                      
                                    </div>
                                </Card>
                            </Col>
                            <Col span={9}>
                                <Card title="Mini Calendar" bordered={false}>
                                    <Calendar fullscreen={false} />
                                </Card>
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default ExamSlots;