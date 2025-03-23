
import React, { useEffect, useState } from "react";
import { Table, Card, Statistic, Button, Avatar, notification } from "antd";
import { PrinterOutlined, LogoutOutlined } from "@ant-design/icons";
import { fetchOrder } from "../../../api/order/order";

const Shift = () => {
  const [orderData, setOrderData] = useState([]);
  const [shiftData, setShiftData] = useState({
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
  });

  // Table Columns
  const columns = [
    { title: "Order ID", dataIndex: "orderId", key: "orderId" },
    { title: "Order Details", dataIndex: "details", key: "details" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Order Type", dataIndex: "type", key: "type" },
    { title: "Price", dataIndex: "price", key: "price" },
  ];

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

      const result = await fetchOrder(token);

      if (result && result.length > 0) {
        const formattedOrders = result.map((order, index) => ({
          key: index.toString(),
          orderId: order.customOrderId,
          details: `${order.orderItems[0]?.quantity} ${order.orderItems[0]?.foodName}`,
          date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A",
          time: order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : "N/A",
          type: order.tableType || "Unknown",
          price: `${order.total} USD`,
        }));

        setOrderData(formattedOrders);
      } else {
        notification.error({
          message: "Failed to fetch Order",
          description: "There was an issue fetching Order.",
        });
      }
    } catch (error) {
      console.error("Error fetching Order:", error);
      notification.error({
        message: "Error fetching Order",
        description:
          error.message || "An error occurred while fetching Order.",
      });
    }
  };

  useEffect(() => {
    handleFetchAllOrder();
  }, []);

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
            <p className="text-gray-500">{shiftData.createdAt} | {shiftData.time}</p>
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
