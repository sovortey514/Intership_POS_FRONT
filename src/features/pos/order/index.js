import React, { useState, useRef, useEffect } from "react";
import { Button, Dropdown, Menu, Input, notification, Select } from "antd";
import { FaHamburger, FaPizzaSlice, FaGlassMartiniAlt, FaCookie, FaPepperHot } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
import { ArrowRightOutlined } from "@ant-design/icons";

import { MinusOutlined, PlusOutlined, DeleteOutlined, EditOutlined, MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { EllipsisOutlined } from "@ant-design/icons";
import OrderReceipt from "./PrintReceipt";
import Payment from "./Payment";
import { fetchFoods } from "../../../api/Food_Category/food_category";
import { fetchTable } from "../../../api/table/table";

const categories = [
  { label: "All", value: "all", icon: <IoFastFoodOutline /> },
  { label: "Burger", value: "burger", icon: <FaHamburger /> },
  { label: "Pizza", value: "pizza", icon: <FaPizzaSlice /> },
  { label: "Drink", value: "drink", icon: <FaGlassMartiniAlt /> },
  { label: "Desert", value: "desert", icon: <FaCookie /> },
  { label: "Rice", value: "Rice", icon: <FaPepperHot /> },
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

const handlePrint = () => {
  window.print();
};

const Order = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(8);
  const [orderItems, setOrderItems] = useState(initialOrderItems);
  const [isDineIn, setIsDineIn] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [foods, setFoods] = useState([]);
  const [tables, setTables] = useState([]);
  const printRef = useRef(null);
  const [selectedTable, setSelectedTable] = useState(null);

  const showMoreProducts = () => {
    setVisibleCount((prev) => prev + 8);
  };
  const handleTableSelection = (value) => {
    setSelectedTable(value);
  };

  const filteredFoods = selectedCategory === "all"
    ? foods
    : foods.filter(food => food.categoryName.toLowerCase() === selectedCategory.toLowerCase());

  const increaseQuantity = (id) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handlefetchTables = async () => {
    try {

      const token = localStorage.getItem("token");

      if (!token) {
        notification.error({
          message: "Authentication Error",
          description: "Please log in again.",
        });
        return;
      }

      const result = await fetchTable(token);

      if (JSON.stringify(tables) !== JSON.stringify(result)) {
        setTables(result);
      }
    } catch (error) {
      console.error("🚨 Error fetching table:", error);
      notification.error({
        message: "Error fetching size",
        description: error.message || "An error occurred while fetching table.",
      });
    }
  }

  useEffect(() => {
    handlefetchTables();
  }, []);


  // const filteredProducts = selectedCategory === "all"
  //   ? products
  //   : products.filter(product => product.category === selectedCategory);

  const decreaseQuantity = (id) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handlefetchfoods = async () => {
    try {
      console.log("📡 Sending request to fetch foods...");
      const token = localStorage.getItem("token");


      const result = await fetchFoods(token);
      console.log("🔄 Updated Food List:", result);

      setFoods(result);

      return result;
    } catch (error) {
      console.error("🚨 Error fetching foods:", error);
      notification.error({
        message: "Error fetching foods",
        description: error.message || "An error occurred while fetching foods.",
      });
    }
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

  useEffect(() => {
    handlefetchfoods();
  }, [])


  return (
    <div className="flex p-6 gap-12">

      {showReceipt ? (
        <Payment onBack={() => setShowPayment(false)} className=" pl-10 " />
      ) : showPayment ? (
        <Payment onBack={() => setShowPayment(false)} onPaymentComplete={() => { setShowReceipt(true); setShowPayment(false); }} />
      ) : (
        <div className="w-3/5 pr-10 ml-[-25px] mt-[-25px]">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-24 py-6 gap-y-3 justify-items-center">
            {filteredFoods.slice(0, visibleCount).map((food) => (
              <div
                key={food.foodId}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 cursor-pointer w-36 min-h-[220px] mx-auto"
              >
                {/* Image Container */}
                <div className="w-full h-28 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={food.files?.[0]?.fileUrl || "/default-image.png"}
                    alt={food.foodName}
                    className="w-28 h-28 object-contain rounded-md"
                  />
                </div>

                {/* Food Name */}
                <h3 className="text-xs font-semibold mt-2 text-gray-900 text-center">
                  {food.foodName}
                </h3>

                {/* Category & Subcategory */}
                <p className="text-gray-600 text-[10px] text-center">
                  {food.categoryName} - {food.subCategoryName}
                </p>

                {/* Price */}
                <p className="text-base font-bold mt-1 text-gray-800 text-center">
                  ${food.price.toFixed(2)}
                </p>

                {/* Size */}
                <p className="text-xs font-medium text-gray-700 mt-1 text-center">
                  Size: {food.sizeName}
                </p>

                {/* Add to Order Button */}
                <Button
                  type="default"
                  className="w-full mt-3 border border-pink-500 text-white bg-gradient-to-r from-pink-500 to-red-400 hover:from-red-500 hover:to-pink-500 py-1 text-xs rounded-full shadow-sm transition"
                >
                  Add to Order
                </Button>
              </div>
            ))}
          </div>
          {visibleCount < foods.length && (
            <div className="flex justify-center mt-4">
              <Button
                type="primary"
                onClick={showMoreProducts}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-pink-700 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-blue-800 transform transition-all duration-300 hover:scale-105 flex items-center gap-2 border-pink-500"
              >
                See More
                <ArrowRightOutlined className="text-lg" />
              </Button>
            </div>
          )}

        </div>
      )}
      <div className="w-4/5 bg-white p-4 rounded-lg shadow-md border mr-[-20px] mt-[-30px] ml-6">
        <div >
          {/* Order Header & Toggle - Flex Row */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Order details</h2>

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
          <hr className="border-t border-gray-300 my-3 w-full pb-4" />

          <div className="mb-4   mt-[-15px]">
            <h3 className="text-sm font-semibold mb-2">Select Table</h3>
            <Select
              value={selectedTable}
              onChange={handleTableSelection}
              placeholder="Select a Table"
              className="w-full"
            >
              {tables.map((table) => (
                <Select.Option key={table.id} value={table.name}>
                  {`${table.name} - ${table.type}, ${table.location}`}
                </Select.Option>
              ))}
            </Select>
          </div>



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
              <div className="flex justify-between text-gray-500 mt-1">
                <span className="text-xs">Order By</span>
                <span className="font-semibold text-xs">Admin</span>
              </div>
            </div>

            {/* Items List */}
            <h3 className="text-sm font-semibold mb-1 flex items-center">
              Items
              <span className="bg-gray-300 text-xs px-2 py-1 rounded-full ml-2">
                {orderItems.length}
              </span>
            </h3>
            {
              !showPayment && !showReceipt &&(
                <div className="mb-4   mt-[-15px]">
            <h3 className="text-sm font-semibold mb-2">Select Table</h3>
            <Select
              value={selectedTable}
              onChange={handleTableSelection}
              placeholder="Select a Table"
              className="w-full"
            >
              {tables.map((table) => (
                <Select.Option key={table.id} value={table.name}>
                  {`${table.name} - ${table.type}, ${table.location}`}
                </Select.Option>
              ))}
            </Select>
          </div>
              )
            }


            {!showPayment && !showReceipt && (
              <div className="space-y-2 w-full h-60">
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
            )}


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
          {!showPayment && !showReceipt && (
            <Button
              type="primary"
              block
              className="mt-1 text-sm py-2 bg-pink-500"
              onClick={() => setShowPayment(true)} // Hide everything and show Payment
            >
              Continue
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Order;
