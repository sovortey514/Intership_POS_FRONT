import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Tag, Input, Select, Button, notification } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { fetchFoods } from "../../api/Food_Category/food_category"

import { fetchOrder, fetchOrders } from "../../api/order/order"

import { fetchuser } from "../../api/user/user"
import staticMethods from 'antd/es/message';
import { fetchMaterials } from "../../api/materail/materail"


const lineChartData = [
  { day: 'Mon', sales: 5 },
  { day: 'Tue', sales: 10 },
  { day: 'Wed', sales: 7 },
  { day: 'Thu', sales: 12 },
  { day: 'Fri', sales: 9 },
  { day: 'Sat', sales: 15 },
  { day: 'Sun', sales: 18 },
];


const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('Today');

  const [topMenus, setTopMenus] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [data1, setData1] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [stats, setStats] = useState([]);

  const handlefetchfoods = async () => {
    try {
      const token = localStorage.getItem("token");
      const result = await fetchFoods(token);


      const totalFoodsCount = result.length;

      const user = { title: 'Menus', value: totalFoodsCount, image: '/menu.png' };
      setStats((prevStats) => [...prevStats, user]);

      return result;
    } catch (error) {
      console.error("🚨 Error fetching foods:", error);
      notification.error({
        message: "Error fetching foods",
        description: error.message || "An error occurred while fetching foods.",
      });
    }
  };

  const handlefetchusers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        notification.error({
          message: "Authorization Error",
          description: "No token found. Please log in.",
        });
        return;
      }
      const result = await fetchuser(token);
      if (result && result.length > 0) {

        const user = { title: 'Users', value: result.length, image: '/user.png' };

        setStats((prevStats) => [...prevStats, user]);

      } else {
        notification.error({
          message: "Failed to fetch Users",
          description: result?.error || "No users found.",
        });
      }

      return result;
    } catch (error) {
      console.error("🚨 Error fetching users:", error);
      notification.error({
        message: "Error fetching Users",
        description: error.message || "An error occurred while fetching users.",
      });
    }
  };

  const handleFetchAllOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        notification.error({
          message: "Authorization Error",
          description: "No token found. Please log in.",
        });
        return;
      }

      const result = await fetchOrders(token);
      console.log("fetched Orders:", result);


      const totalSales = result.reduce((total, order) => {
        return total + order.orderItems.reduce((itemTotal, item) => {
          return itemTotal + item.totalPrice;
        }, 0);
      }, 0);

      const totalWithTax = parseFloat((totalSales + (totalSales * 0.05)).toFixed(2));

      console.log('Total sales with 5% tax:', totalWithTax);

      const income = { title: 'Incomes', value: totalWithTax, image: '/revenue.png' };
      setStats((prevStats) => [...prevStats, income]);


      const foodOrdersCount = result.reduce((acc, order) => {
        // Iterate over each food item in the order
        order.orderItems.forEach(food => {
          if (acc[food.food.name]) {
            // If food exists, accumulate the quantity
            acc[food.food.name].count += food.quantity;
          } else {
            // If food doesn't exist, create a new entry
            acc[food.food.name] = { name: food.food.name, count: food.quantity };
          }
        });
        return acc;
      }, {});

      // Sort the food by count and take the top 4
      const topOrderedFoods = Object.values(foodOrdersCount)
        .sort((a, b) => b.count - a.count) // Sort by count in descending order
        .slice(0, 4); // Take the top 4

      // Create top menu data
      const topMenus = topOrderedFoods.map(food => ({
        name: food.name,
        items: food.count
      }));


      const newSalesData = topOrderedFoods.map(food => ({
        name: food.name,
        value: food.count * 2,
        color: getRandomPinkColor(),
      }));


      setSalesData(newSalesData);
      setTopMenus(topMenus);

    } catch (error) {
      console.error("Error fetching Order:", error);
      notification.error({
        message: "Error fetching Order",
        description:
          error.message || "An error occurred while fetching Order.",
      });
    }
  };

  const getRandomPinkColor = () => {
    const pinkShades = [

      '#E69DB8',
      '#FFD0C7',
      '#EC7FA9',
    ];


    const randomIndex = Math.floor(Math.random() * pinkShades.length);
    return pinkShades[randomIndex];
  };

  const handlefetchtotalprice = async () => {
    try {
      const token = localStorage.getItem("token");

      const result = await fetchMaterials(token);

      if (result && result.statusCode === 200) {
        const assets = result.fixedAssets || [];

        setData1(assets);

        const totalPrice = assets.reduce((sum, item) => {
          return sum + (Number(item.price) || 0);
        }, 0);

        console.log("💰 Total Price:", totalPrice);

        setTotalExpense(totalPrice);

        // Create the expense stat object and add to stats
        const expenseStat = {
          title: 'Expense',
          value: totalPrice,
          image: '/revenue.png',
        };

        setStats((prevStats) => [...prevStats, expenseStat]);

      } else {
        console.error("Failed to fetch Materials:", result.error);
        notification.error({
          message: "Failed to fetch Materials",
          description: result.error || "Unknown error",
        });
      }
    } catch (error) {
      console.error("Error fetching Materials:", error);
      notification.error({
        message: "Error fetching Materials",
        description: error.message || "An unknown error occurred.",
      });
    }
  };

  useEffect(() => {
    handlefetchfoods();
    handleFetchAllOrder();
    handlefetchusers();
    handlefetchtotalprice();
  }, []);


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
          <Button
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}
            className="bg-pink-500 border-pink-500 text-white hover:bg-pink-600 hover:border-pink-600"
            type="default"
          >
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
                      color="pink"
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
                // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
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
