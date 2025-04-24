import React, { useState, useRef, useEffect } from "react";
import { Button, Dropdown, Menu, Input, notification, Select } from "antd";
import { FaHamburger, FaPizzaSlice, FaGlassMartiniAlt, FaCookie, FaPepperHot } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
import { ArrowRightOutlined, ArrowLeftOutlined, CloseOutlined } from "@ant-design/icons";

import { fetchPaymentById } from "../../../api/payment/payment";



import { placetoOrder, FetchOrderById, fetchOrder, CancelOrder } from "../../../api/order/order";


import { MinusOutlined, PlusOutlined, DeleteOutlined, EditOutlined, MenuOutlined, SearchOutlined, SaveOutlined } from "@ant-design/icons";
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

const handlePrint = () => {
  window.print();
};

const Order = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(8);
  const [orderItems, setOrderItems] = useState([]); 
  const [orderDetails, setOrderDetails] = useState(null); 
  const [isDineIn, setIsDineIn] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [foods, setFoods] = useState([]);
  const [tables, setTables] = useState([]);
  const [order, setorder] = useState([]);
  const printRef = useRef(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showEditOrder, setShowEditOrder] = useState(false);
  const [showAllFoods, setShowAllFoods] = useState(false);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [showorderdetail, setShowOrderDetail] = useState(true);
  const [editingOrder, setEditingOrder] = useState(false);
  const [paymentbyselectTable, setPaymentBySelectTable] = useState(null)
  const [paymentDataById, setPaymentDataById] = useState({});
  

  const clearItem = () => {
    setorder([]);
    setOrderItems([]);
    setOrderDetails(null);
    setSelectedCategory("all");
    setVisibleCount(8);
    setIsDineIn(true);
    setShowReceipt(false);
    setShowPayment(false);
    setSelectedTable(null);
    setShowEditOrder(false);
    setShowAllFoods(true);
    setIsEditingOrder(false);
    setShowOrderDetail(true);
    setEditingOrder(false);
    setPaymentDataById(null);
  };

  const showMoreProducts = () => {
    setVisibleCount((prev) => prev + 8);
  };
  const handleTableSelection = (value) => {
    setSelectedTable(value);
  };

  const handleEditOrder = () => {
    setShowEditOrder(true);
    setShowPayment(false);
    setEditingOrder(true);
    setIsEditingOrder(true);
  };
  const handleCancelOrder = async (id) => {
    try {

      const token = localStorage.getItem("token");
      const result = await CancelOrder(id, token);
 
      clearItem();
      handleFetchAllOrder();
      handleFetchAllOrder();
      setEditingOrder(false);
      setShowPayment(false);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };
  const handleBack = () => {
    setShowEditOrder(false);
    setShowPayment(true);
    setIsEditingOrder(true);
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
  const handleFetchOrderById = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        notification.error({
          message: "Authorization Error",
          description: "No token found. Please log in.",
        });
        return;
      }

      const orderDetails = await FetchOrderById(orderId, token);

      if (orderDetails && Array.isArray(orderDetails) && orderDetails.length > 0) {
        const order = orderDetails[0];
        setOrderDetails(order);
        localStorage.setItem("orderDetails", JSON.stringify(order));
        setShowPayment(true);

      } else {
        notification.error({
          message: "Failed to fetch Order",
          description: "There was an issue fetching the order details.",
        });
      }
    } catch (error) {
      console.error("Error fetching Order:", error);
      notification.error({
        message: "Error fetching Order",
        description: error.message || "An error occurred while fetching the order.",
      });
    }
  };
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

      const token = localStorage.getItem("token");
      const result = await fetchFoods(token);

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
    </Menu>
  );

  const removeItem = (data) => {

    const updatedItems = orderItems.filter((item) => item.id !== data.id || data.foodId);

    if (updatedItems.length === orderItems.length) {
      console.warn("Item not found in the list.");
    }

    setOrderItems(updatedItems);

    if (showEditOrder || showPayment) {
      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        orderItems: updatedItems,
      }));
    }
  };

  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const addFoodToOrder = (food) => {
    const existingItem = orderItems.find(item => item.id === food.foodId);

    if (existingItem) {
      const updatedItems = orderItems.map((item) =>
        item.id === food.foodId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      setOrderItems(updatedItems);
      if (showEditOrder) {
        setOrderDetails(prevDetails => ({
          ...prevDetails,
          orderItems: updatedItems,
        }));
      }

    } else {
      const newItem = {
        id: food.foodId,
        name: food.foodName,
        price: food.price,
        quantity: 1,
        extra: "",
        note: "",
        image: food.files?.[0]?.fileUrl || "/default-image.png",
      };

      const updatedItems = [...orderItems, newItem];

      setOrderItems(updatedItems);
      if (showEditOrder) {
        setOrderDetails(prevDetails => ({
          ...prevDetails,
          orderItems: updatedItems,
        }));

      }

    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedTable) {
      notification.error({
        message: "Please select a table.",
      });
      return;
    }

    let userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("⚠️ User ID is missing in localStorage. Fetching again...");

      const storedUsername = localStorage.getItem("username");
      const token = localStorage.getItem("token");

      if (storedUsername && token) {
        try {
          const userResponse = await fetch(`http://localhost:6060/auth/user/${storedUsername}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            localStorage.setItem("userId", userData.id);
            userId = userData.id;
          } else {
            console.error("❌ Failed to fetch user ID");
          }
        } catch (error) {
          console.error("❌ Error fetching user ID:", error);
        }
      }
    }

    if (!userId) {
      notification.error({
        message: "Authentication Error",
        description: "User ID not found. Please log in again.",
      });
      return;
    }

    const values = {
      userId: Number(userId),
      tableId: selectedTable,
      items: orderItems.map(item => ({
        foodId: item.id,
        quantity: item.quantity,
      })),
    };

    const token = localStorage.getItem("token");

    if (!token) {
      notification.error({
        message: "Authentication Error",
        description: "Please log in again.",
      });
      return;
    }
    const response = await placetoOrder(values, token);

    if (response.error) {
      notification.error({
        message: "Order Failed",
        description: response.error,
      });
    } else {
      notification.success({
        message: "Order Placed",
        description: "Your order has been placed successfully.",
      });
 
      if (response.id) {
        handleFetchOrderById(response.id);
      } else {
        console.error("⚠️ Order ID is missing from the response!");
      }
      setShowPayment(true);

    }
  };

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

      if (result) {
        setorder(result);
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

  const tax = subtotal * 0.05;
  const totalAmount = subtotal + tax;

  useEffect(() => {
    handlefetchTables();
    handleFetchAllOrder();
    handlefetchfoods();
  }, []);

  return (
    <div className="flex p-6 gap-12">

      {!showEditOrder && (
        <>
          {showReceipt ? (
            <Payment onBack={() => setShowPayment(false)} className="pl-10" />
          ) : showPayment ? (
            <Payment
              orderDetails={orderDetails}
              onBack={() => setShowPayment(false)}
              onPaymentComplete={() => {
                setShowReceipt(true);
                setShowPayment(false);
              }}
            />
          ) : (
            <div className="w-3/5 pr-10 ml-[-25px] mt-[-25px]">
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
                    <div className="w-full h-28 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={food.files?.[0]?.fileUrl || "/default-image.png"}
                        alt={food.foodName}
                        className="w-28 h-28 object-contain rounded-md"
                      />
                    </div>

                    <h3 className="text-xs font-semibold mt-2 text-gray-900 text-center">
                      {food.foodName}
                    </h3>
                    <p className="text-gray-600 text-[10px] text-center">
                      {food.categoryName} - {food.subCategoryName}
                    </p>
                    <p className="text-base font-bold mt-1 text-gray-800 text-center">
                      ${food.price.toFixed(2)}
                    </p>
                    <p className="text-xs font-medium text-gray-700 mt-1 text-center">
                      Size: {food.sizeName}
                    </p>

                    <Button
                      type="default"
                      className="w-full mt-3 border border-pink-500 text-white bg-gradient-to-r from-pink-500 to-red-400 hover:from-red-500 hover:to-pink-500 py-1 text-xs rounded-full shadow-sm transition"
                      onClick={() => addFoodToOrder(food)}
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
        </>
      )}

      {/* Show food when edit */}
      {showEditOrder && (
        <div className="w-3/5 pr-10 ml-[-25px] mt-[-25px]">
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
                <div className="w-full h-28 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={food.files?.[0]?.fileUrl || "/default-image.png"}
                    alt={food.foodName}
                    className="w-28 h-28 object-contain rounded-md"
                  />
                </div>

                <h3 className="text-xs font-semibold mt-2 text-gray-900 text-center">
                  {food.foodName}
                </h3>
                <p className="text-gray-600 text-[10px] text-center">
                  {food.categoryName} - {food.subCategoryName}
                </p>
                <p className="text-base font-bold mt-1 text-gray-800 text-center">
                  ${food.price.toFixed(2)}
                </p>
                <p className="text-xs font-medium text-gray-700 mt-1 text-center">
                  Size: {food.sizeName}
                </p>

                <Button
                  type="default"
                  className="w-full mt-3 border border-pink-500 text-white bg-gradient-to-r from-pink-500 to-red-400 hover:from-red-500 hover:to-pink-500 py-1 text-xs rounded-full shadow-sm transition"
                  onClick={() => addFoodToOrder(food)}
                >
                  Add to Order
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="w-4/5 bg-white p-4 rounded-lg shadow-md border mr-[-20px] mt-[-30px] ml-6">
        <div >

          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Order details</h2>

            <div>

              <Dropdown overlay={menu} trigger={["click"]}>
                <Button type="text" shape="circle" icon={<MenuOutlined style={{ fontSize: "18px" }} />} className="text-gray-500 hover:bg-gray-200 mt-2" />
              </Dropdown>
            </div>
          </div>

          {/* Divider Line */}
          <hr className="border-t border-gray-300 my-3 w-full pb-4" />
        {!showReceipt && !showPayment && (
            <div className="mb-4 mt-[-15px]">
              <h3 className="text-sm font-semibold mb-2">Select Table</h3>
              <Select
                value={selectedTable}
                onChange={handleTableSelection}
                placeholder="Select a Table"
                className="w-full"
              >

                {tables
                  .filter((table) => table.status === "available")
                  .map((table) => (
                    <Select.Option key={table.id} value={table.id}>
                      {`${table.name} - ${table.type}, ${table.location}`}
                    </Select.Option>
                  ))}
              </Select>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="h-[340px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 p-2">
            {/* Order Info */}

            {(showPayment || showEditOrder) && orderDetails && (
              <div className="border p-2 rounded-md mb-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span className="text-xs">Order ID</span>
                  <span className="font-semibold text-xs">{orderDetails?.customOrderId || "N/A"}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span className="text-xs">Date</span>
                  <span className="font-semibold text-xs">{orderDetails?.createdAt || "N/A"}</span>
                </div>
                <div className="flex justify-between text-gray-500 mt-1">
                  <span className="text-xs">Table</span>
                  <span className="font-semibold text-xs">{orderDetails.tableName}</span>
                </div>
                <div className="flex justify-between text-gray-500 mt-1">
                  <span className="text-xs">Order By</span>
                  <span className="font-semibold text-xs">{orderDetails.userName}</span>
                </div>
              </div>
            )}


            {/* Items List */}
            <h3 className="text-sm font-semibold mb-1 flex items-center">
              Items
              <span className="bg-gray-300 text-xs px-2 py-1 rounded-full ml-2">
                {(orderDetails?.orderItems?.length || orderItems.length)}
              </span>
            </h3>


            {!showPayment && !showReceipt && !showEditOrder && orderItems.length > 0 && (
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
                        onClick={() => removeItem(item)}
                        className="shadow-sm"
                      />

                    </div>
                    <span className="font-semibold text-xs text-gray-700 mt-10">{item.price * item.quantity} $</span>
                  </div>

                ))}

              </div>
            )}

            {/* AFTER ORDER: Show fetched order details */}
            {(showPayment || showEditOrder) && orderDetails?.orderItems?.length > 0 && (
              <div className="space-y-3 w-full h-auto">
                {orderDetails?.orderItems.map((item) => (
                  <div
                    key={item.foodId}
                    className="relative flex items-center justify-between p-4 rounded-md shadow-md border border-gray-200 bg-white"
                  >
                    <div className="flex flex-col items-center space-y-2 w-20">
                      <img
                        src={item.files?.[0]?.filePath || item.image}
                        alt={item.foodName || item.name}
                        className="w-20 h-20 rounded-md shadow-sm object-cover border border-gray-300"
                      />

                      <div className="flex items-center space-x-2">
                        <Button
                          size="small"
                          shape="circle"
                          icon={<MinusOutlined style={{ fontSize: "12px" }} />}
                          onClick={() => decreaseQuantity(item.foodId)}
                          className="w-7 h-7 flex items-center justify-center border border-gray-300"
                        />
                        <span className="font-semibold text-xs px-2">{item.quantity}</span>
                        <Button
                          size="small"
                          shape="circle"
                          icon={<PlusOutlined style={{ fontSize: "12px" }} />}
                          onClick={() => increaseQuantity(item.foodId)}
                          className="w-7 h-7 flex items-center justify-center border border-gray-300"
                        />
                      </div>
                    </div>


                    <div className="flex-1 ml-4">
                      <h4 className="font-medium text-base text-gray-800">{item.foodName || item.name}</h4>
                      <p className="text-gray-500 text-xs">{item.foodDescription}</p>
                    </div>

                    <span className="font-semibold text-sm text-gray-700 mt-2">
                      {item.totalPrice || item.price} $
                    </span>
                    <div className="absolute top-4 right-2 space-x-1">
                      <Button
                        size="small"
                        shape="circle"
                        icon={<EditOutlined style={{ fontSize: "12px" }} />}
                        className="text-blue-500 bg-gray-100 shadow-sm"
                      // onClick={() => handleEditItem(item.foodId)}
                      />
                      <Button
                        size="small"
                        shape="circle"
                        icon={<DeleteOutlined style={{ fontSize: "12px" }} />}
                        danger
                        onClick={() => removeItem(item)}
                        className="shadow-sm"
                      />
                    </div>
                  </div>
                ))}

                <div className="flex justify-end mt-4 space-x-3">
                  {!isEditingOrder && (
                    <>
                      <Button
                        type="primary"
                        shape="round"
                        icon={<EditOutlined />}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 text-sm w-auto min-w-[140px] flex items-center justify-center"
                        onClick={handleEditOrder}
                      >
                        Edit Order
                      </Button>
                      <Button
                        type="default"
                        shape="round"
                        icon={<CloseOutlined />}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 text-sm w-auto min-w-[140px] flex items-center justify-center ml-4"
                        onClick={() => handleCancelOrder(orderDetails.id)}

                      >
                        Cancel
                      </Button>
                    </>
                  )}


                  <div className="flex justify-end mt-4 space-x-3">
                  </div>
                  {isEditingOrder && (
                    <div className="flex justify-end mt-4 space-x-3">
                      {/* Back Button */}
                      <Button
                        type="primary"
                        shape="round"
                        icon={<ArrowLeftOutlined />}
                        className="bg-gray-500 hover:bg-green-600 text-white px-6 py-2 text-sm w-auto min-w-[140px] flex items-center justify-center"
                        onClick={handleBack}
                      >
                        Back
                      </Button>
                    </div>

                  )}
                  {showEditOrder && (
                    <div className="flex justify-end mt-4 space-x-3">
                      <Button
                        type="primary"
                        shape="round"
                        icon={<SaveOutlined />}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 text-sm w-auto min-w-[140px] flex items-center justify-center"
                      >
                        Update Order
                      </Button>
                    </div>
                  )}

                </div>

              </div>

            )}

            {orderItems.length === 0 && !orderDetails?.orderItems?.length && (
              <p className="text-gray-500 text-center">No items in order.</p>
            )}
          </div>

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

          {!showPayment && !showReceipt && !showEditOrder && (
            <Button
              type="primary"
              block
              className="mt-1 text-sm py-2 bg-pink-500"
              onClick={() => {
                handlePlaceOrder();
                setShowPayment(true);
              }}
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
