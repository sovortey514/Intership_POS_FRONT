import { Button, Card, Table, Statistic, Avatar } from "antd";
import { PrinterOutlined, LogoutOutlined, ClockCircleOutlined } from "@ant-design/icons";
import React from "react";
import MembershipList from "../../inventorymanagement/foodlist";

const Shift = () => {
  // Dummy shift and order data
  const shiftData = {
    name: "Vortey168$",
    avatar: "/Myprofile.png",
    date: "Mon, 8 May",
    time: "08:56 AM - 06:00 PM",
    workingHours: "6h45m",
    cashSales: "5678 $",
    creditSales: "667$",
    MembershipList: "667$",
    totalOrders: 89,
    currentTime: "03:34:12",
  };

  // Table order data
  const orderData = [
    {
      key: "1",
      orderId: "3456872",
      details: "x1 Vegetables pizza...",
      date: "8/5/2024",
      time: "03:37",
      type: "Dine in",
      price: "1.00 USD",
    },
    {
      key: "2",
      orderId: "3456872",
      details: "x2 Chicken BBQ pizza...",
      date: "8/5/2024",
      time: "03:36",
      type: "Takeaway",
      price: "64.19 USD",
    },
    {
      key: "3",
      orderId: "3456872",
      details: "x3 Cheese burger",
      date: "8/5/2024",
      time: "03:30",
      type: "Takeaway",
      price: "11.42 USD",
    },
    {
      key: "4",
      orderId: "3456872",
      details: "x1 Vegetables pizza...",
      date: "8/5/2024",
      time: "03:20",
      type: "Dine in",
      price: "11.06 USD",
    },
    {
      key: "5",
      orderId: "3456872",
      details: "x1 Vegetables pizza...",
      date: "8/5/2024",
      time: "03:19",
      type: "Takeaway",
      price: "11.42 USD",
    },
  ];


  // Table Columns
  const columns = [
    { title: "Order ID", dataIndex: "orderId", key: "orderId" },
    { title: "Order Details", dataIndex: "details", key: "details" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Order Type", dataIndex: "type", key: "type" },
    { title: "Price", dataIndex: "price", key: "price" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Shift Summary Card */}
      <Card className="shadow-md p-5 rounded-lg bg-white">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Shift Summary</h2>
          <div className="flex space-x-2">
            <Button icon={<PrinterOutlined />} className="bg-gray-200 text-gray-600">
              Print report
            </Button>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              className="bg-pink-500 text-gray-200"
            >
              Exit Shift
            </Button>
          </div>
        </div>

        {/* Profile and Shift Details */}
        <div className="flex items-center space-x-4 mt-4">
          <Avatar src={shiftData.avatar} size={50} />
          <div>
            <h3 className="text-lg font-medium">{shiftData.name}</h3>
            <p className="text-gray-500">{shiftData.date} | {shiftData.time}</p>
          </div>
          <span className="ml-auto text-blue-500 text-lg font-semibold">
            {shiftData.currentTime}
          </span>
        </div>

        {/* Shift Statistics */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <Statistic title="Working Hours" value={shiftData.workingHours} />
          <Statistic title="Cash Sales" value={shiftData.cashSales} />
          <Statistic title="Credit Sales" value={shiftData.creditSales} />
          <Statistic title="Membership Card Sales" value={shiftData.MembershipList} />
          <Statistic title="Total Orders" value={shiftData.totalOrders} />
        </div>
      </Card>

      {/* Order Table */}
      <Card className="shadow-md mt-6 p-4 bg-white">
        <Table dataSource={orderData} columns={columns} pagination={{ pageSize: 5 }} />
      </Card>
    </div>
  );
};

export default Shift;
