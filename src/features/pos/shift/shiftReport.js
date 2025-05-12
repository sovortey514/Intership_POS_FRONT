import React, { useEffect, useState, useRef } from "react";
import { Table, Card, Statistic, Button, Avatar, notification } from "antd";
import { PrinterOutlined, LogoutOutlined } from "@ant-design/icons";
import { fetchOrder } from "../../../api/order/order";
import { fetchPayment } from "../../../api/payment/payment";

const ShiftReport = ({ setChildPrintMethod }) => {
  const [orderData, setOrderData] = useState([]);
  const user = localStorage.getItem("username");
  const [shiftData, setShiftData] = useState({
    name: user || "Default User",
    // avatar: "/Myprofile.png",
    date: "Mon, 8 May",
    time: "08:56 AM - 06:00 PM",
    totalOrders: "100",
    cashSales: "5678 $",
    creditSales: "667$",
    MembershipList: "667$",
    totalSales: 89,
    currentTime: "03:34:12",
  });

  const printRef = useRef();

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

  const handlePrintData = () => {
    const printWindow = window.open('', '', 'height=800,width=800');
    const content = printRef.current.innerHTML;
    printWindow.document.write(content);
    printWindow.print();
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

      const result = await fetchOrder(token);

      if (result) {
        let totalCashSales = 0;
        let totalMembershipSales = 0;
        let totalOrderToday = 0;
        let totalOrdersCount = 0;

        result.forEach(payment => {
          if (payment.paymentMethod === "cash") {
            totalCashSales += payment.total;
          }

          else if (payment.paymentMethod === "membership") {
            totalMembershipSales += payment.total;
          }

          if (payment.paymentStatus === "PAID") {
            totalOrdersCount += 1;
          }

          totalOrderToday += payment.total;

        });

        const updatedShiftData = {
          ...shiftData,
          cashSales: `${totalCashSales} $`,
          creditSales: "0 $",
          MembershipList: `${totalMembershipSales} $`,
          totalSales: totalOrderToday,
          totalOrders: totalOrdersCount,
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
        creditSales: "0 $",
        MembershipList: "0 $",
        totalSales: 0,
      }));
    }
  };

  useEffect(() => {
    updateDateTime();

    const intervalId = setInterval(updateDateTime, 1000);

    if (setChildPrintMethod) {
      setChildPrintMethod(() => handlePrintData);
    }
    return () => clearInterval(intervalId);
  }, [setChildPrintMethod]);

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
        description: error.message || "An error occurred while fetching Order.",
      });
    }
  };

  useEffect(() => {
    handleFetchAllOrder();
    resetShiftIfNewDay();
    handleFetchAllPayment();
  }, []);
  return (
  <div className="p-6 bg-[#f9fafb] min-h-screen print-area" ref={printRef}>
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Shift Summary Report</h2>
        <p className="text-sm text-gray-500">Live Time: {shiftData.currentTime}</p>
      </div>
      <Button
        icon={<PrinterOutlined />}
        type="primary"
        onClick={handlePrintData}
        className="bg-blue-600"
      >
        Print Report
      </Button>
    </div>

    {/* Shift Card */}
    <Card className="mb-6 shadow-sm rounded-xl">
      <div className="flex items-center space-x-6">
        <Avatar size={64} src={shiftData.avatar || "/default-avatar.png"} />
        <div>
          <h3 className="text-lg font-bold text-gray-800">{shiftData.name}</h3>
          <p className="text-sm text-gray-500">{shiftData.date} | {shiftData.time}</p>
        </div>
      </div>

      {/* Shift Timeline */}
      <div className="mt-4">
        <h4 className="text-md font-semibold text-gray-700 mb-2">Shift Timeline</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li><strong>Start:</strong> {shiftData.date} at {shiftData.time}</li>
          <li><strong>End:</strong> {shiftData.date} at 06:00 PM</li>
        </ul>
      </div>

      {/* Shift Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
        <Statistic title="Total Orders" value={shiftData.totalOrders} />
        <Statistic title="Cash Sales" value={shiftData.cashSales} />
        <Statistic title="Credit Sales" value={shiftData.creditSales} />
        <Statistic title="Membership Sales" value={shiftData.MembershipList} />
        <Statistic title="Total Sales" value={`${shiftData.totalSales} $`} />
      </div>
    </Card>

    {/* Orders Table */}
    <Card title="Order Details" className="shadow-sm rounded-xl">
      <Table
        columns={columns}
        dataSource={orderData}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </Card>
  </div>
);

};

export default ShiftReport;
