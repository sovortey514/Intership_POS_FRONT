
import React, { useState, useEffect } from "react";
import { Button, Input, Radio, Select, Alert, notification } from "antd";
import { CreditCardOutlined, DollarOutlined, IdcardOutlined } from "@ant-design/icons";
import OrderReceipt from "./PrintReceipt";
import { processPaymentcash, PaymentcashByMembershipCard, completeOrder } from "../../../api/order/order"

import { fetchMembershipById, fetchMembership } from "../../../api/membership/memberships"

const { Option } = Select;
const Payment = ({ orderDetails, onBack, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [currency, setCurrency] = useState("USD");
  const [amountDue, setAmountDue] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [membershipCard, setMembershipCard] = useState("");
  const [cashBack, setCashBack] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(4000);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [discount, setDiscount] = useState(0); // New Discount State
  const [membershipData, setMembershipData] = useState([]);
  const [completepayment, setPaymentData] = useState([]);
  const [membershipDataById, setMembershipDataById] = useState([]);

  useEffect(() => {
    if (orderDetails) {

      if (orderDetails.orderItems && Array.isArray(orderDetails.orderItems)) {
        orderDetails.orderItems.forEach((item, index) => {
        });
      }

      setAmountDue(orderDetails.total.toString());
    }
  }, [orderDetails]);



  const handleConfirmPaymentCahe = async () => {
    const due = parseFloat(amountDue);
    const paid = parseFloat(amountPaid);
    const discountAmount = (due * discount) / 100;
    const finalTotal = due - discountAmount;

    // Validate if the entered data is valid
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

    const paymentData = {
      orderId: orderDetails.id,
      amountPaid: paid,
      paymentMethod: paymentMethod,
    };


    console.log("Payment Request Data:", paymentData);

    try {
      const token = localStorage.getItem("token");

      const response = await processPaymentcash(paymentData, token);


      if (response && !response.error) {
        console.log("Payment Successful:", response);


        setShowReceipt(true);

        if (onPaymentComplete) {
          onPaymentComplete();
        }
      } else {

        alert("Payment failed. Please try again.");
      }
    } catch (error) {

      console.error("Payment Error:", error);
      alert("An error occurred during payment. Please try again.");
    }
  };

  const handleConfirmPaymentWithMemberCard = async () => {
    const due = parseFloat(amountDue);
    const paid = parseFloat(amountPaid);
    const discountAmount = (due * discount) / 100;
    const finalTotal = due - discountAmount;

    // Validate if the entered data is valid
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

    const paymentData = {
      orderId: orderDetails.id,
      amountPaid: membershipDataById.balance,
      paymentMethod: paymentMethod,
      membershipId: membershipDataById ? membershipDataById.membershipId : null,
      totalAmount: finalTotal,
      discountAmount: discountAmount,
      tax: finalTotal * 0.05,
    };

    console.log("Payment Request Data:", paymentData);

    try {
      const token = localStorage.getItem("token");

      const response = await PaymentcashByMembershipCard(paymentData, token);

      if (response && !response.error) {
        console.log("Payment Successful:", response);

        setShowReceipt(true);

        if (onPaymentComplete) {
          onPaymentComplete();
        }
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("An error occurred during payment. Please try again.");
    }
  };

 
  const handleConfirmPayment = async () => {
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

    const paymentData = {
      orderId: orderDetails.id,
      amountPaid: paid,
      paymentMethod: paymentMethod,
      membershipId: paymentMethod === "membership" ? membershipDataById.membershipId : null,
      totalAmount: finalTotal,
      discountAmount: discountAmount,
      tax: finalTotal * 0.05,
    };

    console.log("Payment Request Data:", paymentData);

    try {
      const token = localStorage.getItem("token");
      let response;

      if (paymentMethod === "membership") {
        // Handle payment via membership
        response = await handleConfirmPaymentWithMemberCard(paymentData, token);
        await handleCompletePayment(orderDetails.id);
      } else {
        // Handle payment via cash
        response = await handleConfirmPaymentCahe(paymentData, token);
        await handleCompletePayment(orderDetails.id);
      }

      if (response && !response.error) {
        console.log("Payment Successful:", response);
        setShowReceipt(true);

        if (onPaymentComplete) {
          onPaymentComplete();
        }
      }

    } catch (error) {
      console.error("Payment Error:", error);
      alert("An error occurred during payment. Please try again.");
    }
  };


  const handleMembershipById = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        notification.error({
          message: "Authorization Error",
          description: "No token found. Please log in.",
          duration: 1,
        });
        return;
      }

      const membership = await fetchMembershipById(id, token);
      console.log("Fetched Membership Data:", membership);

      if (membership) {
        setMembershipDataById(membership);

      } else {
        notification.error({
          message: "Failed to fetch Membership",
          description: "HIIIIIIIIIIIIIIIIIIIIIIIII",
          duration: 15,
        });
      }
    } catch (error) {
      console.error("Error fetching Membership:", error);
      notification.error({
        message: "Error fetching Membership",
        description: error.message || "An error occurred while fetching the Membership.",
        duration: 1,
      });
    }
  };

  const handleCompletePayment = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        notification.error({
          message: "Authorization Error",
          description: "No token found. Please log in.",
          duration: 1,
        });
        return;
      }
      // Safely access the first element of the array
      const paymentData = {
        status: "COMPLETED",
        table: {
          id: orderDetails.tableId,  // Access the tableId from the first element
          status: "available",
        },
      };

      const response = await completeOrder(id, token, paymentData);
      console.log("Payment completed successfully:", response);

      if (response) {
        setPaymentData(response);
      } else {
        notification.error({
          message: "Failed to Complete Payment",
          description: "There was an error completing the payment.",
          duration: 15,
        });
      }
    } catch (error) {
      console.error("Error completing payment:", error);
      notification.error({
        message: "Error completing Payment",
        description: error.message || "An error occurred while completing the payment.",
        duration: 15,
      });
    }
  };


  const handlefetchMemberships = async () => {
    try {

      const token = localStorage.getItem("token");
      const result = await fetchMembership(token);

      if (result) {
        setMembershipData(result);
      } else {
        notification.error({
          message: "Failed to fetch Memberships",
          description: "There was an issue fetching Memberships.",
        });
      }
    } catch (error) {
      console.error("Error fetching Memberships:", error);
      notification.error({
        message: "Error fetching Memberships",
        description:
          error.message || "An error occurred while fetching Memberships.",
      });
    }
  };

  useEffect(() => {
    handlefetchMemberships();
  }, [])


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
            <Radio.Group
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                // If the membership radio is selected, fetch the membership details
                if (e.target.value === "membership") {
                  // Pass the appropriate `membershipId`
                }
              }}
              value={paymentMethod}
            >
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
          {paymentMethod === "membership" && (
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

          )}
          {paymentMethod === "membership" && membershipDataById && membershipDataById.balance !== undefined && (
            <div className="mt-3">
              <label className="block text-sm font-medium">Total Amount Due ({currency})</label>
              <Input
                type="number"
                placeholder={`Amount due in ${currency}`}
                value={membershipDataById.balance} // Display the balance from membershipDataById
                onChange={(e) => setAmountDue(e.target.value)} // Set amount due on change
                className="w-full mt-2 p-2 border rounded-md"
                disabled
              />
            </div>
          )}

          {paymentMethod === "cash" && (
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

          )}



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
            <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Membership Card Number
              </label>

              <Select
                showSearch
                placeholder="Select Membership Card Number"
                value={membershipCard}
                onChange={(membershipData) => {
                  setMembershipCard(membershipData);
                  handleMembershipById(membershipData);
                  // handlefetchMemberships();

                }}
                className="w-full mt-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                bordered={false}
              >
                {/* Map through the membershipList to populate the dropdown options */}
                {membershipData.map((membership) => (
                  <Option key={membership.id} value={membership.id}>
                    {membership.membershipId} - {membership.name}
                  </Option>
                ))}
              </Select>
              {/*  */}
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
          {showReceipt && orderDetail && (
            <OrderReceipt
              orderItems={orderDetail.orderItems}
              subtotal={orderDetail.subtotal}
              discountAmount={orderDetail.discountAmount}
              totalAfterDiscount={orderDetail.totalAfterDiscount}
              tax={orderDetail.tax}
              totalAmount={orderDetail.totalAmount}
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
