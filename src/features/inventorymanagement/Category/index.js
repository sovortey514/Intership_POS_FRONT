import {
  Button,
  Space,
  Tag,
  Table,
  Modal,
  Input,
  Form,
  Card,
  Row,
  Col,
  Radio,
  Select,
  DatePicker,
  Image,
  message,
  notification,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  SwapOutlined,
  EyeOutlined,
  DownloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";

import {
  createFood_Category,
  fetchcreateFood_Category,
  deleteCagoryFoodDrinkById
} from "../../../api/Food_Category/food_category";

function CategoryFoodManagement() {
  const [subcategories, setSubcategories] = useState([
    {
      key: "1",
      name: "Cold Drinks",
      description: "Chilled beverages",
      parentCategory: "Beverages",
    },
    {
      key: "2",
      name: "Hot Drinks",
      description: "Warm beverages",
      parentCategory: "Beverages",
    },
  ]);

  const [foods, setFoods] = useState([
    {
      key: "1",
      name: "Pizza",
      category: "Fast Food",
      description: "Cheesy and delicious",
      tags: ["cheese", "baked"],
    },
    {
      key: "2",
      name: "Green Salad",
      category: "Beverages",
      description: "Refreshing and healthy",
      tags: ["vegan", "fresh"],
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [createType, setCreateType] = useState("category");
  const [categories, setCategories] = useState([]);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentView, setCurrentView] = useState("category");
  const token = localStorage.getItem("token");

  const showCreateModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingData(record);
    setIsViewMode(false);
    setCreateType(
      record.category
        ? "food"
        : record.parentCategory
        ? "subcategory"
        : "category"
    );
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const showViewModal = (record) => {
    setSelectedCategory(record); 
    setIsViewMode(true);
    setCreateType(
      record.category
        ? "food"
        : record.parentCategory
        ? "subcategory"
        : "category"
    );
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        description: values.description,
        parentCategory:
          createType === "subcategory" ? values.parentCategory : null,
        category: createType === "food" ? values.category : null,
        date: values.date ? values.date.format("YYYY-MM-DD") : null,
      };
      const data = await createFood_Category(payload, token);
      const newItem = {
        key: data.id.toString(),
        name: data.name,
        description: data.description,
        category: createType === "food" ? values.category : null,
        parentCategory:
          createType === "subcategory" ? values.parentCategory : null,
      };

      if (createType === "food") {
        setFoods([...foods, newItem]);
      } else if (createType === "subcategory") {
        setSubcategories([...subcategories, newItem]);
      } else {
        setCategories([...categories, newItem]);
      }

      message.success("Successfully added!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error:", error);
      message.error(error.message || "An error occurred. Please try again.");
    }
  };

  const handledeleteCategory = async (categories) => {
      console.log("Deleting CagoryFoodDrink with id:", categories.id);
      const response = await deleteCagoryFoodDrinkById(categories.id, token);
  
      if (response.ok) {
        setCategories((prevData) =>
          prevData.filter((item) => item.id !== categories.id)
        );
        // fetchCategories();
        notification.success({
          message: "CagoryFoodDrink Deleted",
          description: "CagoryFoodDrink has been deleted successfully.",
        });
      } else {
        notification.error({
          message: "Failed to delete CagoryFoodDrink",
          description: response.message || "An unknown error occurred.",
        });
      }
    };
  
  

  const fetchCategories = async () => {
    try {
      console.log("Sending request to fetch categories...");
      const token = localStorage.getItem("token");
      const result = await fetchcreateFood_Category(token);

      console.log("Response received:", result);

      if (result) {
        setCategories(result);
      } else {
        notification.error({
          message: "Failed to fetch categories",
          description: "There was an issue fetching categories.",
        });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      notification.error({
        message: "Error fetching categories",
        description:
          error.message || "An error occurred while fetching categories.",
      });
    }
  };
  useEffect(() => {
    fetchCategories(); 
  }, []);

  // const handleDelete = (key, type) => {
  //   if (type === "category") {
  //     setCategories(categories.filter((category) => category.key !== key));
  //   } else if (type === "subcategory") {
  //     setSubcategories(
  //       subcategories.filter((subcategory) => subcategory.key !== key)
  //     );
  //   } else {
  //     setFoods(foods.filter((food) => food.key !== key));
  //   }
  // };

  const toggleView = (view) => {
    setCurrentView(view);
    setSelectedCategory(null);
  };

  return (
    <div className="container" style={{ padding: "30px", marginTop: "-20px"}}>
      <div className="flex justify-between items-center mb-6">
        <Space>
          <Button
            onClick={() => toggleView("category")} 
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded"
          >
            Category List
          </Button>
          <Button
            onClick={() => toggleView("subcategory")}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded"
          >
            Subcategory List
          </Button>
          <Button
            onClick={() => toggleView("food")}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded"
          >
            Food List
          </Button>
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
            style={{
              border: "1px solid #ff4d94",
              color: "#ff4d94",
              backgroundColor: "transparent",
            }}
          />
        </Space>

        <Button
          type="default"
          icon={<DownloadOutlined />}
          style={{
            border: "1px solid gray",
            color: "gray",
            backgroundColor: "transparent",
          }}
        >
          Download
        </Button>
      </div>

      <Row gutter={[16, 16]} align="top">
        <Col span={24}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Space>
                  <Image
                    width={30}
                    height={30}
                    preview={false}
                    src={
                      currentView === "category"
                        ? "/Category.png"
                        : currentView === "subcategory"
                        ? "/SubCategory.png"
                        : "/Food.png" // Default to Food image
                    }
                    alt="Category or Food Icon"
                  />
                  <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    {currentView === "category"
                      ? "Category Management"
                      : currentView === "subcategory"
                      ? "Subcategory Management"
                      : "Food Management"}
                  </span>
                </Space>

                <Input
                  placeholder="Search..."
                  prefix={<SearchOutlined />}
                  allowClear
                  style={{ width: 250 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  icon={<FilterOutlined />}
                  style={{
                    border: "1px solid #ff4d94", // Pink outline
                    color: "#ff4d94",
                    backgroundColor: "transparent",
                  }}
                >
                  Filter Category
                </Button>
              </div>
            }
            bordered={false}
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              padding: "16px",
            }}
          >
            <Table
              columns={[
                {
                  title: "No.",
                  dataIndex: "no",
                  key: "no",
                  render: (_, __, index) => index + 1,
                },
                { title: "Name", dataIndex: "name", key: "name" },
                {
                  title: "Description",
                  dataIndex: "description",
                  key: "description",
                },
                {
                  title: "Action",
                  key: "action",
                  render: (_, record) => (
                    <Space size="middle">
                      <Button
                        icon={<EyeOutlined />}
                        onClick={() => showViewModal(record)}
                        style={{
                          color: "blue", // Icon and text color
                          backgroundColor: "transparent", // Background color
                        }}
                      >
                        View
                      </Button>

                      <Button
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                        style={{
                          color: "green", 
                          backgroundColor: "transparent", 
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handledeleteCategory(record)}
                        style={{
                          color: "red", 
                          backgroundColor: "transparent", 
                        }}
                      >
                        Delete
                      </Button>
                    </Space>
                  ),
                },
              ]}
              dataSource={
                currentView === "category"
                  ? categories
                  : currentView === "subcategory"
                  ? selectedCategory
                    ? subcategories.filter(
                        (sub) => sub.parentCategory === selectedCategory?.name
                      )
                    : subcategories
                  : foods
              }
              bordered
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          isViewMode
            ? `View ${
                createType === "food"
                  ? "Food"
                  : createType === "subcategory"
                  ? "Subcategory"
                  : "Category"
              }`
            : editingData
            ? `Edit ${
                createType === "food"
                  ? "Food"
                  : createType === "subcategory"
                  ? "Subcategory"
                  : "Category"
              }`
            : `Create ${
                createType === "food"
                  ? "Food"
                  : createType === "subcategory"
                  ? "Subcategory"
                  : "Category"
              }`
        }
        open={isModalVisible}
        onOk={!isViewMode ? handleSave : undefined}
        onCancel={handleCancel}
        footer={isViewMode ? null : undefined}
        okButtonProps={{
          style: {
            backgroundColor: "#ff4d94",
            borderColor: "#ff4d94",
            color: "#fff",
          },
        }}
      >
        <Form form={form} layout="vertical">
          {!editingData && !isViewMode && (
            <Form.Item label="Create Type">
              <Radio.Group
                value={createType}
                onChange={(e) => setCreateType(e.target.value)}
              >
                <Radio value="category">Category</Radio>
                <Radio value="subcategory">Subcategory</Radio>
                <Radio value="food">Food</Radio>
              </Radio.Group>
            </Form.Item>
          )}

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter name" disabled={isViewMode} />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input placeholder="Enter description" disabled={isViewMode} />
          </Form.Item>

          {createType === "subcategory" && (
            <Form.Item
              name="parentCategory"
              label="Parent Category"
              rules={[
                { required: true, message: "Please select a parent category" },
              ]}
            >
              <Select
                placeholder="Select parent category"
                disabled={isViewMode}
              >
                {categories.map((category) => (
                  <Select.Option key={category.key} value={category.name}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {createType === "food" && (
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select a category" disabled={isViewMode}>
                {categories.map((category) => (
                  <Select.Option key={category.key} value={category.name}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="date"
            label="Select Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker style={{ width: "100%" }} disabled={isViewMode} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CategoryFoodManagement;
