import React, { useState } from 'react';
import { Card, Col, Row, Statistic, Tag, Input, Select, Button } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';


// Sample sales data for the pie chart
const salesData = [
  { name: 'Hot Coffee', value: 16.7, color: '#FF69B4' }, // Pink (Hot Pink)
  { name: 'Latte', value: 33.3, color: '#D3D3D3' }, // Gray (Light Gray)
  { name: 'Pizza', value: 50.0, color: '#FFC0CB' }, // Lighter Pink (Optional)
];

const lineChartData = [
  { day: 'Mon', sales: 5 },
  { day: 'Tue', sales: 10 },
  { day: 'Wed', sales: 7 },
  { day: 'Thu', sales: 12 },
  { day: 'Fri', sales: 9 },
  { day: 'Sat', sales: 15 },
  { day: 'Sun', sales: 18 },
];

// Sample statistics data
const stats = [
  { title: 'Users', value: 4, image: '/user.png' },
  { title: 'Menus', value: 18, image: '/menu.png' },
  { title: 'Orders', value: 5, image: '/order.png' },
  { title: 'Weekly Revenue', value: '15.50', image: '/revenue.png' },
];

// Sample ordered menus data
const topMenus = [
  { name: 'Caffe Latte', items: 4 },
  { name: 'Hawaiian Pizza', items: 2 },
  { name: 'Pumpkin Latte', items: 1 },
  { name: 'Hot Americano', items: 1 },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('Today');

  return (
    <div className="mb-5 p-6 bg-gray-100 min-h-screen">
      {/* 📌 Header Section */}
      <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ marginBottom: 20 }}>
        <Col span={12}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Welcome Back! 👋</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>{new Date().toDateString()}</p>
        </Col>
        <Col span={6}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', borderRadius: 8 }}
          />
        </Col>
        <Col span={4}>
          <Select
            value={timeFilter}
            onChange={setTimeFilter}
            options={[
              { label: 'Today', value: 'Today' },
              { label: 'This Week', value: 'This Week' },
              { label: 'This Month', value: 'This Month' },
            ]}
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={2}>
          <Button type="primary" icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </Col>
      </Row>

      {/* 📊 Statistics Cards */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card
              style={{
                borderRadius: 10,
                textAlign: 'center',
                height: 150,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div>
                <img
                  src={stat.image}
                  alt={stat.title}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: 'contain',
                    marginBottom: 8,
                  }}
                />
              </div>
              <Statistic title={stat.title} value={stat.value} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 📌 Top Ordered Menus & Sales Chart */}
      <Row gutter={[16, 16]} className="mt-6">
        {/* 🍕 Top Ordered Menus */}
        <Col span={12}>
          <Card
            title="Top 4 Most Ordered Menus"
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center',
              background: '#fff',
              padding: '20px',
            }}
          >
            <Row gutter={[16, 16]}>
              {topMenus.map((menu, index) => (
                <Col span={12} key={index}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: 12,
                      textAlign: 'center',
                      border: 'none',
                      background: 'linear-gradient(135deg, #F9F9F9, #FFF)',
                      boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <Tag
                      color="pink" // Ant Design's predefined pink color
                      style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        padding: '6px 14px',
                        borderRadius: '8px',
                      }}
                    >
                      {menu.items} Item{menu.items > 1 ? 's' : ''}
                    </Tag>
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        marginTop: 10,
                        color: '#333',
                      }}
                    >
                      {menu.name}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 📈 Sales Chart */}
        <Col span={12}>
          <Card
            title="Current Sales"
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <PieChart width={295} height={295} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pie
                data={salesData}
                cx="50%"
                cy="50%"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                outerRadius={120}
                innerRadius={60}
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
              >
                {salesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{ transition: 'all 0.3s ease-in-out' }}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  color: '#fff',
                  borderRadius: 8,
                  padding: 10,
                }}
              />

              <Legend align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
            </PieChart>
          </Card>
        </Col>
        <Col span={24}>
          <Card
            title="Weekly Sales Trends"
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px',
            }}
          >
            <LineChart width={800} height={300} data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#FF69B4" strokeWidth={2} />
            </LineChart>
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default Dashboard;
