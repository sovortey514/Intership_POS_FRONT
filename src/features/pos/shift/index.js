import React, { useEffect, useState, useRef } from "react";
import { Table, Card, Statistic, Button, Avatar, notification } from "antd";
import { PrinterOutlined, LogoutOutlined } from "@ant-design/icons";
import { fetchOrders } from "../../../api/order/order";
import { fetchPayment } from "../../../api/payment/payment";
import ShiftReport from "./shiftReport";
import { fetchTable } from "../../../api/table/table";
import {sendPdfToTelegram} from "../../../api/payway/BakongPay"

const Shift = () => {
  const [orderData, setOrderData] = useState([]);
  const user = localStorage.getItem("username");
  const [shiftData, setShiftData] = useState({
    name: user || "Default User",
    avatar: "/Myprofile.png",
    date: "Mon, 8 May",
    time: "08:56 AM - 06:00 PM",
    totalOrders: "100",
    cashSales: "5678 $",
    bakongSales: "667$",
    MembershipList: "667$",
    totalSales: 89,
    currentTime: "03:34:12",
  });

  const [handlePrintData, setChildPrintMethod] = useState(null);

  // const handlePrint = () => {
  //   if (handlePrintData) {
  //     handlePrintData();
  //   }
  // };

 const handlePrint = () => {
    if (handlePrintData) {
      handlePrintData(); 
    } else {
      notification.error({
        message: "Error",
        description: "Report is not ready yet.",
      });
    }
  };


  const updateDateTime = () => {
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

    const currentTime = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setShiftData(prevState => ({
      ...prevState,
      date: currentDate,
      currentTime: currentTime,
    }));
  };

  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleExitShift = () => {
    // Reset shift data
    setShiftData((prevState) => ({
      ...prevState,
      totalOrders: 0,
      cashSales: "0 $",
      bakongSales: "0 $",
      MembershipList: "0 $",
      totalSales: 0,
    }));

    setOrderData([]);

    const today = new Date().toDateString();
    localStorage.setItem("shiftDate", today);

    notification.success({
      message: "Shift Ended",
      description: "Your shift has been completed and data has been cleared.",
    });
  };

  const resetShiftIfNewDay = () => {
    const storedDate = localStorage.getItem("shiftDate");
    const today = new Date().toDateString();

    if (storedDate !== today) {
      localStorage.setItem("shiftDate", today);

      setOrderData([]);
      setShiftData(prev => ({
        ...prev,
        totalOrders: 0,
        cashSales: "0 $",
        bakongSales: "0 $",
        MembershipList: "0 $",
        totalSales: 0,
      }));
    }
  };

  useEffect(() => {

    updateDateTime();

    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);

  }, []);

  const columns = [
    { title: "Order ID", dataIndex: "orderId", key: "orderId" },
    { title: "Order Details", dataIndex: "details", key: "details" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Order Type", dataIndex: "type", key: "type" },
    { title: "Price", dataIndex: "price", key: "price" },
  ];

  const handleFetchAlltable = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        notification.error({
          message: "Authorization Error",
          description: "No token found. Please log in.",
        });
        return;
      }

      const result = await fetchTable(token);

      if (result && result.length > 0) {
  
        const formattedOrders = result.flatMap((table, index) => {
          if (!table.orders || table.orders.length === 0) return [];

          return table.orders
            .filter(order => isToday(order.createdAt))
            .map((order, orderIndex) => {
              const tax = order.total * 0.05;
              const totalWithTax = order.total + tax;
              return {
                key: `${index}-${orderIndex}`,
                orderId: order.customOrderId || "N/A",
                details: `${order.orderItems[0]?.quantity || 0} ${order.orderItems[0]?.food?.name || "N/A"}`,
                date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A",
                time: order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : "N/A",
                type: table.name || "Unknown",
                price: `${totalWithTax.toFixed(2)} USD`,
              };
            });
        });


        setOrderData(formattedOrders);

      } else {
        notification.error({
          message: "Failed to fetch Order",
          description: "There was an issue fetching Order.",
        });
      }

    }

    catch (error) {
      console.error("Error fetching Order:", error);
      notification.error({
        message: "Error fetching Order",
        description: error.message || "An error occurred while fetching Order.",
      });
    }
  };

  const handleFetchAllPayment = async () => {
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

      if (result) {
        let totalCashSales = 0;
        let totalMembershipSales = 0;
        let totalBakongSales = 0;
        let totalOrderToday = 0;
        let orderCount = 0;

        result.forEach(order => {
          if (!isToday(order.createdAt)) return;

          const payment = order.payment;
          const tax = order.total * 0.05;
          let totalWithTax = order.total + tax;
          totalWithTax = parseFloat(totalWithTax.toFixed(2));

          if (order.customOrderId) {
            orderCount += 1;
          }

          if (payment) {
            if (payment.paymentMethod === "cash") {
              totalCashSales += totalWithTax;
            } else if (payment.paymentMethod === "membership") {
              totalMembershipSales += payment.amountPaid;
            } else if (payment.paymentMethod === "bakong") {
              totalBakongSales += totalWithTax;
            }
          }
        });

        const updatedShiftData = {
          ...shiftData,
          cashSales: `${totalCashSales.toFixed(2)} $`,
          bakongSales: `${totalBakongSales.toFixed(2)} $`,
          MembershipList: `${totalMembershipSales.toFixed(2)} $`,
          totalSales: (totalCashSales + totalBakongSales + totalMembershipSales).toFixed(2),
          totalOrders: orderCount,
        };

        setShiftData(updatedShiftData);
      } else {
        notification.error({
          message: "Failed to fetch Payment",
          description: "There was an issue fetching Payment.",
        });
      }
    } catch (error) {
      console.error("Error fetching Payment:", error);
      notification.error({
        message: "Error fetching Payment",
        description: error.message || "An error occurred while fetching Payment.",
      });
    }
  };


  useEffect(() => {
    //handleFetchAllOrder();
    handleFetchAllPayment();
    resetShiftIfNewDay();
    handleFetchAlltable();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Shift Summary Card */}
      <Card className="shadow-md p-5 rounded-lg bg-white ">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Shift Summary</h2>
          <div className="flex space-x-2">
            <Button icon={<PrinterOutlined />} className="bg-gray-200 text-gray-600" onClick={handlePrint}>
              Print report
            </Button>
            <div style={{ display: "none" }}>
              <ShiftReport
  shiftData={shiftData}
  orderData={orderData}
  setChildPrintMethod={setChildPrintMethod}
/>

            </div>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              className="bg-pink-500 text-gray-200"
              onClick={handleExitShift}
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
          <Statistic title="Total Orders" value={shiftData.totalOrders} />
          <Statistic title="Cash Sales" value={shiftData.cashSales} />
          <Statistic title="Bakong Sales" value={shiftData.bakongSales} />
          <Statistic title="Membership Sales" value={shiftData.MembershipList} />
          <Statistic title="Total Sale" value={shiftData.totalSales} />
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
