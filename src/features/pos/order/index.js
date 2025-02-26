import React, { useState, useRef } from "react";
import { Button, Dropdown, Menu, Input } from "antd";
import { FaHamburger, FaPizzaSlice, FaGlassMartiniAlt, FaCookie, FaPepperHot } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5"; // ✅ Correct import
import { MinusOutlined, PlusOutlined, DeleteOutlined, EditOutlined, MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { EllipsisOutlined } from "@ant-design/icons";
import OrderReceipt from "./PrintReceipt";
import Payment from "./Payment";
const categories = [
  { label: "All", value: "all", icon: <IoFastFoodOutline /> },
  { label: "Burger", value: "burger", icon: <FaHamburger /> },
  { label: "Pizza", value: "pizza", icon: <FaPizzaSlice /> },
  { label: "Drink", value: "drink", icon: <FaGlassMartiniAlt /> },
  { label: "Desert", value: "desert", icon: <FaCookie /> },
  { label: "Appetizer", value: "appetizer", icon: <FaPepperHot /> },
];

const initialOrderItems = [
  {
    id: 1,
    name: "Beef Burger",
    price: 250,
    quantity: 2,
    extra: "Mustard",
    note: "No cheese",
    image: "https://via.placeholder.com/50", // Replace with actual burger image
  },
  {
    id: 2,
    name: "Cheese Burger",
    price: 200,
    quantity: 1,
    extra: "Lettuce",
    note: "Extra sauce",
    image: "https://via.placeholder.com/50", // Replace with actual cheese burger image
  },
];

const products = [
  { id: 1, name: "Pepperoni Pizza", price: "120 $", category: "pizza", image: "pepperoni.png" },
  { id: 2, name: "Cheese Burger", price: "120 $", category: "burger", image: "cheeseburger.png" },
  { id: 3, name: "Chicken BBQ", price: "120 $", category: "pizza", image: "chickenbbq.png" },
  { id: 4, name: "Veggie Burger", price: "120 $", category: "burger", image: "veggieburger.png" },
  { id: 5, name: "Coca Cola", price: "30 $", category: "drink", image: "cocacola.png" },
  { id: 6, name: "Orange Juice", price: "35 $", category: "drink", image: "orangejuice.png" },
  { id: 7, name: "Chocolate Cake", price: "80 $", category: "dessert", image: "chocolatecake.png" },
  { id: 8, name: "Ice Cream Sundae", price: "60 $", category: "dessert", image: "icecream.png" },

];

const handlePrint = () => {
  window.print();
};

const Order = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [orderItems, setOrderItems] = useState(initialOrderItems);
  const [isDineIn, setIsDineIn] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const printRef = useRef(null);
  const increaseQuantity = (id) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(product => product.category === selectedCategory);

  const decreaseQuantity = (id) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const menu = (
    <Menu>
      <Menu.Item key="print" onClick={() => setShowReceipt(true)}>Print order check</Menu.Item>
      <Menu.Item key="hold">Hold order</Menu.Item>
      <Menu.Item key="split">Split order</Menu.Item>
      <Menu.Item key="cancel" style={{ color: "red" }}>
        Cancel order
      </Menu.Item>
    </Menu>
  );

  const removeItem = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.05;
  const totalAmount = subtotal + tax;


  return (
    <div className="flex p-6 gap-12">
      {/* Left Side - Categories */}
      <div className="w-3/5 pr-10 ml-[-25px] mt-[-25px]">
        {!showPayment ? (
          <>
            {/* Categories and Search Bar */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Categories</h2>
              <Input
                placeholder="Search products..."
                prefix={<SearchOutlined className="text-gray-400" />}
                className="w-full max-w-xs border-gray-300 rounded-md"
              />
            </div>

            <hr className="border-t border-gray-300 my-3 w-full" />
            <div className="flex gap-3">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all 
                  ${selectedCategory === category.value
                      ? "bg-pink-500 text-white shadow-md"
                      : "bg-gray-200 text-gray-600"
                    } 
                  hover:bg-pink-500 hover:text-white`}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.icon}
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-3 gap-x-20 gap-y-4 mt-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 cursor-pointer w-full md:w-48"
                >
                  <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-md">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </div>
                  <h3 className="text-sm font-semibold mt-3 text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 text-xs">{product.price}</p>

                  <Button
                    type="default"
                    className="w-full mt-3 border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white py-1 text-xs rounded-md transition"
                  >
                    Add to Order
                  </Button>
                </div>
              ))}
            </div>

          </>
        ) : (
          <Payment onBack={() => setShowPayment(false)} /> // Show Payment Component
        )}
      </div>

      {/* Right Side - Order Details */}
      
      {
        showPayment ? (
          <Payment onBack={() => setShowPayment(false)} />
        ):(
          <div className="w-4/5 bg-white p-4 rounded-lg shadow-md border mr-[-20px] mt-[-30px]">
        {/* Order Header & Toggle - Flex Row */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Order details</h2>

          {/* Dine In / Takeaway Toggle */}
          <div className="flex bg-gray-100 p-0.5 rounded-[15px] text-xs w-auto">
            <button
              className={`px-3 py-1 text-center transition-all  ${isDineIn ? "bg-pink-500 text-white" : "text-pink-500"} rounded-[15px] text-xs`}
              onClick={() => setIsDineIn(true)}
            >
              Dine in
            </button>

            <button
              className={`px-3 py-1 text-center transition-all  ${!isDineIn ? "bg-pink-500 text-white" : "text-pink-500"}  rounded-[15px] text-xs`}
              onClick={() => setIsDineIn(false)}
            >
              Takeaway
            </button>
          </div>
          <div>
            {/* Dropdown for Print & Order Actions */}
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button type="text" shape="circle" icon={<MenuOutlined style={{ fontSize: "18px" }} />} className="text-gray-500 hover:bg-gray-200 mt-2" />
            </Dropdown>

            {/* Show Receipt Page When Clicked */}
            {showReceipt && (
              <OrderReceipt
                orderItems={orderItems}
                subtotal={subtotal}
                tax={tax}
                totalAmount={totalAmount}
                onClose={() => setShowReceipt(false)} // Close the receipt
              />
            )}
          </div>
        </div>

        {/* Divider Line */}
        <hr className="border-t border-gray-300 my-3 w-full" />


        {/* Scrollable Content */}
        <div className="h-[340px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 p-2">
          {/* Order Info */}
          <div className="border p-2 rounded-md mb-3 text-sm">
            <div className="flex justify-between text-gray-500">
              <span className="text-xs">Order ID</span>
              <span className="font-semibold text-xs">#345672</span>
            </div>
            <div className="flex justify-between text-gray-500 mt-1">
              <span className="text-xs">Date</span>
              <span className="font-semibold text-xs">April 28, 2024</span>
            </div>
          </div>

          {/* Items List */}
          <h3 className="text-sm font-semibold mb-1 flex items-center">
            Items
            <span className="bg-gray-300 text-xs px-2 py-1 rounded-full ml-2">
              {orderItems.length}
            </span>
          </h3>

          <div className="space-y-2 w-full h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="relative flex items-center justify-between p-3 rounded-md shadow-sm border text-sm bg-white"
              >
                {/* Image */}
                <div className="flex flex-col items-center">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md" />
                  <div className="flex items-center space-x-1 mr-5">
                    <Button
                      size="small"
                      shape="circle"
                      icon={<MinusOutlined style={{ fontSize: "10px" }} />}
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-6 h-6 flex items-center justify-center"
                    />
                    <span className="font-semibold text-xs px-1">{item.quantity}</span>
                    <Button
                      size="small"
                      shape="circle"
                      icon={<PlusOutlined style={{ fontSize: "10px" }} />}
                      onClick={() => increaseQuantity(item.id)}
                      className="w-6 h-6 flex items-center justify-center"
                    />
                  </div>


                </div>

                {/* Item Details */}
                <div className="flex-1 ml-3 mb-6">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-gray-500 text-xs">Extra: {item.extra}</p>
                  <p className="text-gray-500 text-xs">Note: {item.note}</p>
                </div>

                {/* Delete & Edit Icons - Positioned at Top Right */}
                <div className="absolute top-4 right-2 space-x-1">
                  <Button
                    size="small"
                    shape="circle"
                    icon={<EditOutlined style={{ fontSize: "12px" }} />}
                    className="text-blue-500 bg-gray-100 shadow-sm"
                  />
                  <Button
                    size="small"
                    shape="circle"
                    icon={<DeleteOutlined style={{ fontSize: "12px" }} />}
                    danger
                    onClick={() => removeItem(item.id)}
                    className="shadow-sm"
                  />
                </div>
                <span className="font-semibold text-xs text-gray-700 mt-10">{item.price * item.quantity} $</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Footer - Order Summary */}
        <div className="mt-2 bg-gray-50 p-3 rounded-md border shadow-sm text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold">{subtotal} $</span>
          </div>
          <div className="flex justify-between">
            <span>Tax 5%</span>
            <span className="font-semibold">{tax.toFixed(2)} $</span>
          </div>
          <div className="flex justify-between text-sm font-bold border-t mt-1 pt-1">
            <span>Total</span>
            <span>{totalAmount.toFixed(2)} $</span>
          </div>
        </div>
        <Button
          type="primary"
          block
          className="mt-1 text-sm py-2 bg-pink-500"
          onClick={() => setShowPayment(true)} // Hide product selection and show payment
        >
          Continue
        </Button>


      </div>



        )
      }

    </div>
  );
};

export default Order;
