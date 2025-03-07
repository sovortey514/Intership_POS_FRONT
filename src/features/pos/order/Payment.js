
import React, { useState } from "react";
import { Button, Input, Radio, Select, Alert } from "antd";
import { CreditCardOutlined, DollarOutlined, IdcardOutlined } from "@ant-design/icons";
import OrderReceipt from "./PrintReceipt";

const Payment = ({ onBack, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [currency, setCurrency] = useState("USD");
  const [amountDue, setAmountDue] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [membershipCard, setMembershipCard] = useState("");
  const [cashBack, setCashBack] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(4000);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [discount, setDiscount] = useState(0); // New Discount State

  const handleConfirmPayment = () => {
    const due = parseFloat(amountDue);
    const paid = parseFloat(amountPaid);
    const discountAmount = (due * discount) / 100;
    const finalTotal = due - discountAmount;

    if (!due || isNaN(due) || due <= 0) {
      alert("Please enter a valid amount due.");
      return;
    }

    if (paymentMethod === "cash") {
      if (!paid || isNaN(paid) || paid < finalTotal) {
        alert("Insufficient cash provided. Please enter a valid amount.");
        return;
      }
      const change = paid - finalTotal;
      setCashBack(change);
    }

    setOrderDetails({
      orderItems: [
        { id: 1, name: "Burger", quantity: 2, price: 5.99 },
        { id: 2, name: "Fries", quantity: 1, price: 2.49 },
      ],
      subtotal: due,
      discountAmount: discountAmount,
      totalAfterDiscount: finalTotal,
      tax: finalTotal * 0.05, // Example 5% tax
      totalAmount: finalTotal * 1.05, // Including tax
    });

    setShowReceipt(true);
    if (onPaymentComplete) {
      onPaymentComplete();
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] h-[550px] flex flex-col justify-between mt-[-22px]">
        <div className="mb-2">
          <h2 className="text-xl font-semibold text-center mb-4 flex items-center justify-center gap-3">
            <img src="/payment.png" alt="Payment" className="w-6 h-6" />
            Choose Payment Method
          </h2>
          <hr className="border-t border-gray-300  w-full " />


          {/* Payment Methods */}
          <div className="mt-3 ">
            <h3 className="text-md font-semibold">Select Payment Method</h3>
            <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
              <Radio value="cash">
                <DollarOutlined className="text-green-500 mr-2" /> Cash
              </Radio>
              <Radio value="card">
                <CreditCardOutlined className="text-blue-500 mr-2" /> Credit Card
              </Radio>
              <Radio value="membership">
                <IdcardOutlined className="text-purple-500 mr-2" /> Membership Card
              </Radio>
            </Radio.Group>
          </div>

          {/* Currency Selection */}
          <div className="mt-3">
            <label className="block text-sm font-medium">Select Currency</label>
            <Select value={currency} onChange={(value) => setCurrency(value)} className="w-full mt-2">
              <Select.Option value="USD">USD ($)</Select.Option>
              <Select.Option value="KHR">Khmer Riel (៛)</Select.Option>
            </Select>
          </div>

          {/* Amount Due Input */}
          <div className="mt-3">
            <label className="block text-sm font-medium">Total Amount Due ({currency})</label>
            <Input
              type="number"
              placeholder={`Enter total amount due in ${currency}...`}
              value={amountDue}
              onChange={(e) => setAmountDue(e.target.value)}
              className="w-full mt-2 p-2 border rounded-md"
            />
          </div>

          {/* Discount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Apply Discount (%)</label>
            <Input
              type="number"
              placeholder="Enter discount percentage..."
              value={discount}
              onChange={(e) => {
                let value = parseFloat(e.target.value);
                if (value < 0) value = 0;
                if (value > 100) value = 100;
                setDiscount(value);
              }}
              className="w-full mt-2 p-2 border rounded-md"
            />
          </div>

          {/* Amount Paid Input (only if cash payment is selected) */}
          {paymentMethod === "cash" && (
            <div className="mb-4">
              <label className="block text-sm font-medium">Amount Paid by Customer ({currency})</label>
              <Input
                type="number"
                placeholder={`Enter amount paid in ${currency}...`}
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="w-full mt-2 p-2 border rounded-md"
              />
            </div>
            
          )}

          {paymentMethod === "membership" && (
            <div className="mt-3">
              <label className="block text-sm font-medium">Membership Card Number</label>
              <Input
                type="text"
                placeholder="Enter Membership Card Number..."
                value={membershipCard}
                onChange={(e) => setMembershipCard(e.target.value)}
                className="w-full mt-2 p-2 border rounded-md"
              />
            </div>
          )}

          {/* Confirm & Cancel Buttons */}
          <div className="flex justify-between mt-5">
            <Button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded-md">
              Cancel
            </Button>
            <Button type="primary" className="bg-pink-500 text-white px-4 py-2 rounded-md" onClick={handleConfirmPayment}>
              Confirm Payment
            </Button>
          </div>

          {/* Show Receipt Modal When Payment is Confirmed */}
          {showReceipt && orderDetails && (
            <OrderReceipt
              orderItems={orderDetails.orderItems}
              subtotal={orderDetails.subtotal}
              discountAmount={orderDetails.discountAmount}
              totalAfterDiscount={orderDetails.totalAfterDiscount}
              tax={orderDetails.tax}
              totalAmount={orderDetails.totalAmount}
              onClose={() => {
                setShowReceipt(false);
                onBack();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
