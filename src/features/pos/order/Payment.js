
import React, { useState, useEffect } from "react";
import { Button, Input, Radio, Select, Alert, notification } from "antd";
import { CreditCardOutlined, DollarOutlined, IdcardOutlined } from "@ant-design/icons";
import OrderReceipt from "./PrintReceipt";
import { processPaymentcash, PaymentcashByMembershipCard, completeOrder } from "../../../api/order/order"

import { fetchMembershipById, fetchMembership } from "../../../api/membership/memberships"

import { fetchPaymentById, fetchPayment } from "../../../api/payment/payment";

const { Option } = Select;
const Payment = ({ orderDetails, onBack, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  // const [currency, setCurrency] = useState("USD");
  const [amountDue, setAmountDue] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [membershipCard, setMembershipCard] = useState("");
  const [cashBack, setCashBack] = useState(null);
  // const [exchangeRate, setExchangeRate] = useState(4000);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [membershipData, setMembershipData] = useState([]);
  const [completepayment, setPaymentData] = useState([]);
  const [membershipDataById, setMembershipDataById] = useState([]);
  const [paymentDataById, setPaymentDataById] = useState({});
  const [payments, setpayment] = useState([]);
  const [paymentDatas, setPaymentDatas] = useState({})
  const [currency, setCurrency] = useState("USD");

  const [finalTotal, setFinalTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [loadingReceipt, setLoadingReceipt] = useState(false);

  const USD_TO_KHR = 4100;
  const [exchangeRate, setExchangeRate] = useState(USD_TO_KHR);

  useEffect(() => {
    if (orderDetails) {

      setOrderDetail(orderDetails);

      const due = parseFloat(orderDetails.total);

      const discountAmount = (due * discount) / 100;
      const taxAmount = due * 0.05;
      const finalTotal = due + taxAmount - discountAmount;

      setAmountDue(due.toString());
      setFinalTotal(finalTotal);
      setTaxAmount(taxAmount);
    }
  }, [orderDetails, discount]);


  const handlePaymentCash = async () => {
    const due = parseFloat(amountDue);
    const paid = parseFloat(amountPaid);

    const discountAmount = (due * discount) / 100;
    const taxAmount = due * 0.05;
    const finalTotal = due + taxAmount - discountAmount;

    if (!due || isNaN(due) || due <= 0) {
      alert("Please enter a valid amount due.");
      return;
    }

    let finalAmount = finalTotal;

    if (currency === "KHR") {
      finalAmount = Math.round((finalTotal * exchangeRate) / 100) * 100;  
    } else if (currency === "USD" || currency === "USDT") {
    
      finalAmount = finalTotal / exchangeRate;
      paid = paid / exchangeRate;  
    }

    if (paymentMethod === "cash") {
      if (!paid || isNaN(paid) || paid < finalAmount) {
        alert("Insufficient cash provided. Please enter a valid amount.");
        return;
      }

      const change = paid - finalAmount;
      setCashBack(change);
    }

    const paymentData = {
      orderId: orderDetail.id,
      amountPaid: paid,
      paymentMethod: paymentMethod,
      currency: currency,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await processPaymentcash(paymentData, token);

      await handlePaymentById(response.id);

      if (response && !response.error) {
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

  const handlePaymentWithMemberCard = async () => {
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
      orderId: orderDetail.id,
      amountPaid: finalTotal,
      paymentMethod: paymentMethod,
      membershipId: membershipDataById ? membershipDataById.membershipId : null,
      totalAmount: finalTotal,
      discountAmount: discountAmount,
      tax: finalTotal * 0.05,
    };
    setPaymentDatas(paymentData)
    try {
      const token = localStorage.getItem("token");
      const response = await PaymentcashByMembershipCard(paymentData, token);

      if (response && !response.error) {
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
      orderId: orderDetail.id,
      amountPaid: paid,
      paymentMethod: paymentMethod,
      membershipId: paymentMethod === "membership" ? membershipDataById.membershipId : null,
      totalAmount: finalTotal,
      discountAmount: discountAmount,
      tax: finalTotal * 0.05,
    };
    setPaymentDatas(paymentData)

    try {
      const token = localStorage.getItem("token");
      let response;

      if (paymentMethod === "membership") {

        response = await handlePaymentWithMemberCard(paymentData, token);
      } else {
        response = await handlePaymentCash(paymentData, token);
      }
      await handleCompletePayment(orderDetails.id);
      if (response && !response.error) {
        setShowReceipt(true);
        if (onPaymentComplete) {
          onPaymentComplete();
        }
      }
      await handlefetcPayment();

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
      if (membership) {
        setMembershipDataById(membership);
      } else {
        notification.error({
          message: "Failed to fetch Membership",
          description: "HII",
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

  const handlePaymentById = async (id) => {
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
      const payment = await fetchPaymentById(id, token);
      if (payment) {
        setPaymentDataById(payment);
        setShowReceipt(true);
      } else {
        notification.error({
          message: "Failed to fetch Payment",
          description: "HII",
          duration: 15,
        });
      }
    } catch (error) {
      console.error("Error fetching Payment:", error);
      notification.error({
        message: "Error fetching Payment",
        description: error.message || "An error occurred while fetching the Payment.",
        duration: 1,
      });
    } finally {
      setLoadingReceipt(false);
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

      const paymentData = {
        status: "COMPLETED",
        table: {
          id: orderDetails.tableId,
          status: "available",
        },
      };

      const response = await completeOrder(id, token, paymentData);

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

  const handlefetcPayment = async () => {
    try {
      const token = localStorage.getItem("token");
      const result = await fetchPayment(token);
      if (result) {
        setpayment(result);
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
        description:
          error.message || "An error occurred while fetching Payment.",
      });
    }
  };

  useEffect(() => {
    handlefetchMemberships();
    handlefetcPayment();
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

                if (e.target.value === "membership") {

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

          <div className="mt-3">
            <label className="block text-sm font-medium">Select Currency</label>
            <Select onChange={(value) => {
              setCurrency(value);
              setExchangeRate(value === "KHR" ? USD_TO_KHR : 1);
            }}
              className="w-full mt-2">
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
                value={(currency === "KHR" ? finalTotal * exchangeRate : finalTotal).toFixed(2)}
                onChange={(e) => setAmountDue(e.target.value)}
                className="w-full mt-2 p-2 border rounded-md"
              />
            </div>

          )}
          {paymentMethod === "membership" && membershipDataById && membershipDataById.balance !== undefined && (
            <div className="mt-3">
              <label className="block text-sm font-medium">Total balace ({currency})</label>
              <Input
                type="number"
                placeholder={`Amount due in ${currency}`}
                value={membershipDataById.balance}
                onChange={(e) => setAmountDue(e.target.value)}
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
                value={currency === "KHR"
                  ? Math.round((finalTotal * exchangeRate) / 100) * 100 
                  : finalTotal  
                }
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
                }}
                className="w-full mt-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                bordered={false}
              >

                {membershipData.map((membership) => (
                  <Option key={membership.id} value={membership.id}>
                    {membership.membershipId} - {membership.name}
                  </Option>
                ))}
              </Select>
              {/*  */}
            </div>

          )}

          <div className="flex justify-between mt-5">
            <Button onClose={() => {
              setShowReceipt(false);
              onBack();
            }} className="bg-gray-500 text-white px-4 py-2 rounded-md">
              Cancel
            </Button>
            <Button
              type="primary"
              className="bg-pink-500 text-white px-4 py-2 rounded-md"
              onClick={() => {
                handleConfirmPayment();
              }}
            >
              Confirm Payment
            </Button>

          </div>


          {showReceipt && (
            <>
              {loadingReceipt ? (
                <div className="flex justify-center items-center py-10">
                  <span className="text-gray-600 text-lg">Loading receipt...</span>
                </div>
              ) : (
                <OrderReceipt
                  orderItems={orderDetail.orderItems}
                  subtotal={paymentDatas.totalAmount}
                  tax={paymentDatas.tax}
                  orderDetails={orderDetail}
                  totalAmount={paymentDatas.totalAmount + paymentDatas.tax}
                  paymentDatas={paymentDatas}
                  membershipDatas={membershipData}
                  paymentDataById={paymentDataById}
                  onClose={() => {
                    setShowReceipt(false);
                    onBack();
                  }}
                />
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Payment;
