
import React, { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "antd";


const OrderReceipt = ({ orderItems,
  subtotal,
  tax,
  totalAmount,
  orderDetails,
  paymentDataById,
  paymentDatas,
  membershipData,
  onClose, }) => {

  // console.log("Received Payment Data in orderDetailst:", paymentDatas);
  // console.log("Received Payment Data in OrderReceipt:", paymentDataById);

  const receiptRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current ? receiptRef.current : null,
    documentTitle: "Order Receipt",
    onAfterPrint: () => console.log("Receipt printed successfully!"),
  });

  const { payment } = orderDetails || {};
  const paymentMethod = paymentDataById?.paymentMethod || orderDetails?.paymentMethod;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[350px]" ref={receiptRef}>

        {/* 🏢 Business Information */}
        <div className="text-center mb-4">
          <img src="/favicon.ico" alt="Company Logo" className="mx-auto w-16 h-16 mb-2" />
          <h2 className="font-bold text-lg">FastFood POS</h2>
          <p className="text-xs text-gray-500">123 Main Street, City, Country</p>
          <p className="text-xs text-gray-500">Phone: +123 456 7890</p>
          <hr className="my-2" />
        </div>


        {/* 🧾 Receipt Details */}
        <div className="text-xs mb-2">
          <p><strong>Order ID:</strong> {orderDetails?.customOrderId || "N/A"}</p>
          <p><strong>Date:</strong> {orderDetails?.createdAt ? new Date(orderDetails.createdAt).toLocaleDateString() : "N/A"}</p>
          <p><strong>Order By:</strong> {orderDetails?.userName || "N/A"}</p>
        </div>

        {/* 🛒 Order Items */}
        <div className="text-sm">
          <hr className="my-2" />
          {orderItems && orderItems.length > 0 ? (
            orderItems.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-1 mb-1">
                <span>{item.foodName} x {item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)} $</span>
              </div>
            ))
          ) : (
            <p>No items to display</p>
          )}
          <hr className="my-2" />
        </div>

        {/* 💰 Payment Summary */}
        <div className="text-sm">
          <div className="flex justify-between font-semibold">
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(2)} $</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (5%):</span>
            <span>{tax.toFixed(2)} $</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>{totalAmount.toFixed(2)} $</span>
          </div>
        </div>

        <div>CashBack: {paymentDataById?.cashBack || "N/A"}</div>
        <div>Payment Method: {paymentDataById?.paymentMethod || "N/A"}</div>
        <div>Amount Paid: {paymentDatas?.amountPaid || "N/A"}</div>
        <div>Payment Date: {paymentDataById?.paymentDate ? new Date(paymentDataById.paymentDate).toLocaleDateString() : "N/A"}</div>
        {paymentMethod === "membership" && (
          <>
            <div>CashBack: {paymentDataById?.cashBack || "N/A"}</div>
            <div>Payment Method: {paymentDataById?.paymentMethod || "N/A"}</div>
            <div>Amount Paid: {paymentDatas?.amountPaid || "N/A"}</div>
            <div>Payment Date: {paymentDataById?.paymentDate ? new Date(paymentDataById.paymentDate).toLocaleDateString() : "N/A"}</div>
          </>
        )}
        {/* 📌 Thank You Message */}
        <div className="text-center mt-4 text-xs text-gray-500">
          <p>Thank you for your order!</p>
          <p>Visit us again soon.</p>
        </div>

        {/* Print & Close Buttons */}
        <div className="flex justify-between mt-4">
          <Button onClick={onClose} className="bg-gray-400 text-white">Close</Button>
          <Button type="primary" onClick={handlePrint} className="bg-pink-500 text-white">Print as PDF</Button>
        </div>

      </div>
    </div>
  );
};

export default OrderReceipt;
