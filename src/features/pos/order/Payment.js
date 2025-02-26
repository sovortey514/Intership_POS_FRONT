
// import React, { useState, useEffect } from "react";
// import { Button, Input, Radio, Select, Alert } from "antd";
// import { CreditCardOutlined, DollarOutlined } from "@ant-design/icons";

// const Payment = ({ onBack }) => {
//   const [paymentMethod, setPaymentMethod] = useState("cash");
//   const [currency, setCurrency] = useState("USD");
//   const [amountDue, setAmountDue] = useState(""); // Total amount to be paid
//   const [amountPaid, setAmountPaid] = useState(""); // Amount given by customer
//   const [cashBack, setCashBack] = useState(null); // Change to give back
//   const [exchangeRate, setExchangeRate] = useState(4000); // Default exchange rate
//   const [showReceipt, setShowReceipt] = useState(false); 
//   const [orderDetails, setOrderDetails] = useState(null);
  
//   // Fetch exchange rate from an external API
//   useEffect(() => {
//     const fetchExchangeRate = async () => {
//       try {
//         const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD"); // Example API
//         const data = await response.json();
//         if (data && data.rates && data.rates.KHR) {
//           setExchangeRate(data.rates.KHR); // Set the real exchange rate
//         }
//       } catch (error) {
//         console.error("Error fetching exchange rate:", error);
//       }
//     };

//     fetchExchangeRate();
//   }, []);

//   const handleConfirmPayment = () => {
//     const due = parseFloat(amountDue);
//     const paid = parseFloat(amountPaid);

//     if (!due || isNaN(due) || due <= 0) {
//       alert("Please enter a valid amount due.");
//       return;
//     }

//     if (paymentMethod === "cash") {
//       if (!paid || isNaN(paid) || paid < due) {
//         alert("Insufficient cash provided. Please enter a valid amount.");
//         return;
//       }
//       const change = paid - due;
//       setCashBack(change);
//       alert(`Payment successful! Change to return: ${currency} ${(change).toFixed(2)}`);
//     } else {
//       alert(`Payment of ${currency} ${due} successful via ${paymentMethod.toUpperCase()}`);
//     }

//     onBack(); // Return to Order Page after Payment
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
//       <h2 className="text-xl font-semibold text-center mb-4">Choose Payment Method</h2>
//       <hr className="border-t border-gray-300 my-3 w-full" />

//       {/* Display Current Exchange Rate */}
//       <Alert
//         message={`Exchange Rate: 1 USD = ${exchangeRate} KHR`}
//         type="info"
//         showIcon
//         className="mb-4"
//       />

//       {/* Payment Methods - Cash or Card */}
//       <div className="mb-5">
//         <h3 className="text-md font-semibold mb-2">Select Payment Method</h3>
//         <Radio.Group
//           onChange={(e) => setPaymentMethod(e.target.value)}
//           value={paymentMethod}
//           className="flex flex-col space-y-3"
//         >
//           <Radio value="cash">
//             <DollarOutlined className="text-green-500 mr-2" /> Cash
//           </Radio>
//           <Radio value="card">
//             <CreditCardOutlined className="text-blue-500 mr-2" /> Credit Card
//           </Radio>
//         </Radio.Group>
//       </div>

//       {/* Currency Selection */}
//       <div className="mb-5">
//         <label className="block text-sm font-medium">Select Currency</label>
//         <Select
//           value={currency}
//           onChange={(value) => setCurrency(value)}
//           className="w-full mt-2"
//         >
//           <Select.Option value="USD">USD ($)</Select.Option>
//           <Select.Option value="KHR">Khmer Riel (៛)</Select.Option>
//         </Select>
//       </div>

//       {/* Amount Due Input */}
//       <div className="mb-5">
//         <label className="block text-sm font-medium">Total Amount Due ({currency})</label>
//         <Input
//           type="number"
//           placeholder={`Enter total amount due in ${currency}...`}
//           value={amountDue}
//           onChange={(e) => setAmountDue(e.target.value)}
//           className="w-full mt-2 p-2 border rounded-md"
//         />
//       </div>

//       {/* Amount Paid Input (only if cash payment is selected) */}
//       {paymentMethod === "cash" && (
//         <div className="mb-5">
//           <label className="block text-sm font-medium">Amount Paid by Customer ({currency})</label>
//           <Input
//             type="number"
//             placeholder={`Enter amount paid in ${currency}...`}
//             value={amountPaid}
//             onChange={(e) => setAmountPaid(e.target.value)}
//             className="w-full mt-2 p-2 border rounded-md"
//           />
//         </div>
//       )}

//       {/* Display Cash Back (Change) */}
//       {cashBack !== null && paymentMethod === "cash" && (
//         <Alert
//           message={`Cash Back: ${currency} ${cashBack.toFixed(2)}`}
//           type="success"
//           showIcon
//           className="mb-4"
//         />
//       )}

//       {/* Confirm & Cancel Buttons */}
//       <div className="flex justify-between">
//         <Button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded-md">
//           Cancel
//         </Button>
//         <Button
//           type="primary"
//           className="bg-pink-500 text-white px-4 py-2 rounded-md"
//           onClick={handleConfirmPayment}
//         >
//           Confirm Payment
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Payment;
import React, { useState, useEffect } from "react";
import { Button, Input, Radio, Select, Alert } from "antd";
import { CreditCardOutlined, DollarOutlined } from "@ant-design/icons";
import OrderReceipt from "./PrintReceipt";

const Payment = ({ onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [currency, setCurrency] = useState("USD");
  const [amountDue, setAmountDue] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [cashBack, setCashBack] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(4000);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Fetch exchange rate dynamically
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await response.json();
        if (data && data.rates && data.rates.KHR) {
          setExchangeRate(data.rates.KHR);
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };
    fetchExchangeRate();
  }, []);

  const handleConfirmPayment = () => {
    const due = parseFloat(amountDue);
    const paid = parseFloat(amountPaid);

    if (!due || isNaN(due) || due <= 0) {
      alert("Please enter a valid amount due.");
      return;
    }

    if (paymentMethod === "cash") {
      if (!paid || isNaN(paid) || paid < due) {
        alert("Insufficient cash provided. Please enter a valid amount.");
        return;
      }
      const change = paid - due;
      setCashBack(change);
    }

    // Store order details for receipt
    setOrderDetails({
      orderItems: [
        { id: 1, name: "Burger", quantity: 2, price: 5.99 },
        { id: 2, name: "Fries", quantity: 1, price: 2.49 },
      ],
      subtotal: due,
      tax: due * 0.05, // Example 5% tax
      totalAmount: due * 1.05, // Including tax
    });

    // Show receipt modal
    setShowReceipt(true);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-center mb-4">Choose Payment Method</h2>
      <hr className="border-t border-gray-300 my-3 w-full" />

      {/* Display Current Exchange Rate */}
      <Alert message={`Exchange Rate: 1 USD = ${exchangeRate} KHR`} type="info" showIcon />

      {/* Payment Methods */}
      <div className="mb-5">
        <h3 className="text-md font-semibold mb-2">Select Payment Method</h3>
        <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
          <Radio value="cash">
            <DollarOutlined className="text-green-500 mr-2" /> Cash
          </Radio>
          <Radio value="card">
            <CreditCardOutlined className="text-blue-500 mr-2" /> Credit Card
          </Radio>
        </Radio.Group>
      </div>

      {/* Currency Selection */}
      <div className="mb-5">
        <label className="block text-sm font-medium">Select Currency</label>
        <Select value={currency} onChange={(value) => setCurrency(value)} className="w-full mt-2">
          <Select.Option value="USD">USD ($)</Select.Option>
          <Select.Option value="KHR">Khmer Riel (៛)</Select.Option>
        </Select>
      </div>

      {/* Amount Due Input */}
      <div className="mb-5">
        <label className="block text-sm font-medium">Total Amount Due ({currency})</label>
        <Input
          type="number"
          placeholder={`Enter total amount due in ${currency}...`}
          value={amountDue}
          onChange={(e) => setAmountDue(e.target.value)}
          className="w-full mt-2 p-2 border rounded-md"
        />
      </div>

      {/* Amount Paid Input (only if cash payment is selected) */}
      {paymentMethod === "cash" && (
        <div className="mb-5">
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

      {/* Confirm & Cancel Buttons */}
      <div className="flex justify-between">
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
          tax={orderDetails.tax}
          totalAmount={orderDetails.totalAmount}
          onClose={() => {
            setShowReceipt(false); // Close receipt modal
            onBack(); // Return to order page after printing
          }}
        />
      )}
    </div>
  );
};

export default Payment;
