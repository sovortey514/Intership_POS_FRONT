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
  Popconfirm,
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
import moment from "moment";
import {
  createFood_Category,
  fetchcreateFood_Category,
  deleteCagoryFoodDrinkById,
  updateCategory,
  createSubCategory,
  fetchSubcategory,
  deleteSubCagoryFoodDrinkById,
  updateSubCategory,
  createSize,
} from "../../../api/Food_Category/food_category";

function CategoryFoodManagement() {
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
  const [subCategories, setSubcategories] = useState([]);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [size, setSize] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentView, setCurrentView] = useState("category");
  const token = localStorage.getItem("token");

  const showCreateModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

 

  const showEditModal = (record) => {
    console.log("Editing category/subcategory:", record);

    if (!record || !record.id) {
      message.error("Invalid record selected for editing.");
      return;
    }

    setEditingData(record);
    setIsViewMode(false);

    let type = "category";
    if (record.parentCategory) {
      type = "subcategory";
    } else if (record.category) {
      type = "food";
    }
    setCreateType(type);

    form.setFieldsValue({
      name: record.name,
      description: record.description,
      parentCategory: record.parentCategory
        ? String(record.parentCategory.id || record.parentCategory)
        : undefined,
      date: record.create_at ? moment(record.create_at) : null,
    });

    setIsModalVisible(true);
  };

  const showViewModal = (record) => {
    setSelectedCategory(record);
    setIsViewMode(true);

    let type = "category";

    if (record.parentCategory) {
      type = "subcategory";
    } else if (record.category) {
      type = "food";
    }

    setCreateType(type);

    const parentCategoryName =
      categories.find(
        (cat) =>
          String(cat.name).trim() === String(record.parentCategory).trim()
      )?.name || "N/A";

    form.setFieldsValue({
      ...record,
      parentCategoryName: parentCategoryName,
      parentCategory: parentCategoryName,
    });

    console.log("Categories:", categories);
    console.log("Parent Category ID:", record.parentCategory);
    console.log("Parent Category Found:", parentCategoryName);

    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCreateCategory = async () => {
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
      fetchCategories();
      if (createType === "food") {
        setFoods([...foods, newItem]);
      } else if (createType === "subcategory") {
        setSubcategories([...subCategories, newItem]);
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

  const handleCreateSize = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        description: values.description || "",
      };

      const data = await createSize(payload, token);

      console.log("✅ Size Created Successfully:", data);

      const newItem = {
        key: data.id.toString(),
        name: data.name,
        description: data.description,
      };

      fetchSize();

      setSize((prevSizes) => [...prevSizes, newItem]);

      message.success("Size successfully added!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error creating size:", error);
      message.error(error.message || "An error occurred. Please try again.");
    }
  };

  const handleSaveSubCategory = async () => {
    try {
      const values = await form.validateFields();

      if (!values.parentCategory) {
        message.error("Please select a parent category for the subcategory.");
        return;
      }

      const parentCategoryId = Number(values.parentCategory);

      if (isNaN(parentCategoryId)) {
        message.error("Invalid category ID.");
        return;
      }

      const payload = {
        name: values.name,
        description: values.description,
      };

      // Call the API function for creating subcategories
      const data = await createSubCategory(
        values.parentCategory,
        [payload],
        token
      );

      if (data.error) {
        throw new Error(data.error);
      }

      const newItem = {
        key: data.id?.toString(),
        name: data.name,
        description: data.description,
        parentCategory: values.parentCategory,
      };

      setSubcategories([...subCategories, newItem]);
      handlefetchSubcategory();

      message.success("Subcategory successfully added!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error creating subcategory:", error);
      message.error(error.message || "An error occurred. Please try again.");
    }
  };

  const handleUpdate = async () => {
    try {
      console.log("Editing Data before update:", editingData);

      if (!editingData || !editingData.id) {
        message.error(
          "Invalid item ID. Please select a valid category or subcategory."
        );
        return;
      }

      console.log("Updating item with ID:", editingData.id);

      const values = await form.validateFields();

      let payload = {
        name: values.name,
        description: values.description,
        date: values.date ? values.date.format("YYYY-MM-DD") : null,
      };

      let updateFunction;

      if (createType === "subcategory") {
        payload.parentCategory = values.parentCategory;
        updateFunction = updateSubCategory;
      } else {
        payload.parentCategory = null;
        updateFunction = updateCategory;
      }

      const response = await updateFunction(editingData.id, payload, token);

      if (response.ok) {
        message.success(
          `${
            createType.charAt(0).toUpperCase() + createType.slice(1)
          } updated successfully!`
        );
        await fetchCategories();
        await handlefetchSubcategory();
      } else {
        message.error(`Failed to update ${createType}.`);
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error(`Error updating ${createType}:`, error);
      message.error(error.message || "An error occurred. Please try again.");
    }
  };

  const handledeleteCategory = async (categories) => {
    const response = await deleteCagoryFoodDrinkById(categories.id, token);
    console.log(response);
    if (response.ok) {
      fetchCategories();
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

  const handledeleteSubCategory = async (subcategory) => {
    const response = await deleteSubCagoryFoodDrinkById(subcategory.id, token);
    console.log(response);
    if (response.ok) {
      handlefetchSubcategory();
      notification.success({
        message: "SubCagoryFoodDrinkDrink Deleted",
        description: "SubCagoryFoodDrink has been deleted successfully.",
      });
    } else {
      notification.error({
        message: "Failed to delete SubCagoryFoodDrinkFoodDrink",
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

  const fetchSize = async () => {
    try {
      console.log("Sending request to fetch Size...");
      const token = localStorage.getItem("token");
      const result = await fetchSize(token);

      console.log("Response received:", result);

      if (result) {
        setSize(result);
      } else {
        notification.error({
          message: "Failed to fetch size",
          description: "There was an issue fetching size.",
        });
      }
    } catch (error) {
      console.error("Error fetching size:", error);
      notification.error({
        message: "Error fetching size",
        description:
          error.message || "An error occurred while fetching size.",
      });
    }
  };

  const handlefetchSubcategory = async () => {
    try {
      console.log("Sending request to fetch subcategories...");
      const token = localStorage.getItem("token");
      const result = await fetchSubcategory(token);

      console.log("Response received:", result);

      if (result) {
        setSubcategories(result);
      } else {
        notification.error({
          message: "Failed to fetch categories",
          description: "There was an issue fetching subcategories.",
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
    handlefetchSubcategory();
    fetchSize();
  }, []);

  const toggleView = (view) => {
    setCurrentView(view);
    setSelectedCategory(null);
  };

  return (
    <div className="container" style={{ padding: "30px", marginTop: "-20px" }}>
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
                        : "/Food.png"
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
                    border: "1px solid #ff4d94",
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
                ...(currentView === "food"
                  ? [
                      { title: "Name", dataIndex: "name", key: "name" },
                      {
                        title: "Image",
                        dataIndex: "imageUrl",
                        key: "imageUrl",
                        render: (imageUrl) =>
                          imageUrl ? (
                            <img
                              src={imageUrl}
                              alt="Food"
                              width={50}
                              height={50}
                            />
                          ) : (
                            "N/A"
                          ),
                      },
                      {
                        title: "Category",
                        dataIndex: "category",
                        key: "category",
                        render: (category) => category?.name || "N/A",
                      },
                      {
                        title: "Subcategory",
                        dataIndex: "subcategory",
                        key: "subcategory",
                        render: (subcategory) => subcategory?.name || "N/A",
                      },
                      {
                        title: "Size",
                        dataIndex: "size",
                        key: "size",
                        render: (size) => size?.name || "N/A",
                      },
                      {
                        title: "Price",
                        dataIndex: "price",
                        key: "price",
                        render: (price) =>
                          price ? `$${price.toFixed(2)}` : "N/A",
                      },
                    ]
                  : [
                      { title: "Name", dataIndex: "name", key: "name" },
                      {
                        title: "Description",
                        dataIndex: "description",
                        key: "description",
                      },
                      {
                        title: "Date",
                        dataIndex: "create_at",
                        key: "create_at",
                        render: (create_at) =>
                          create_at
                            ? new Date(create_at).toLocaleDateString()
                            : "N/A",
                      },
                    ]),
                {
                  title: "Action",
                  key: "action",
                  render: (_, record) => (
                    <Space size="middle">
                      <Button
                        icon={<EyeOutlined />}
                        onClick={() => showViewModal(record)}
                        style={{
                          color: "blue",
                          backgroundColor: "transparent",
                        }}
                      >
                        View
                      </Button>

                      <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                          console.log("Clicked Edit for record:", record);
                          showEditModal(record);
                        }}
                        style={{
                          color: "green",
                          backgroundColor: "transparent",
                        }}
                      >
                        Edit
                      </Button>

                      <Popconfirm
                        title={`Are you sure you want to delete this ${
                          currentView === "subcategory"
                            ? "subcategory"
                            : "category"
                        }?`}
                        onConfirm={() =>
                          currentView === "subcategory"
                            ? handledeleteSubCategory(record)
                            : handledeleteCategory(record)
                        }
                        okText="Yes"
                        cancelText="No"
                        placement="topRight"
                      >
                        <Button
                          icon={<DeleteOutlined />}
                          style={{
                            color: "red",
                            backgroundColor: "transparent",
                          }}
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    </Space>
                  ),
                },
              ]}
              dataSource={
                currentView === "food"
                  ? foods.map((food) => ({
                      ...food,
                      imageUrl: food.imageUrl || null,
                      category: food.category || null,
                      subcategory: food.subCategory || null,
                      size: food.size || null,
                      price: food.price || null,
                    }))
                  : currentView === "category"
                  ? categories
                  : subCategories.map((sub) => ({
                      ...sub,
                      parentCategory: sub.category?.name || "N/A",
                    }))
              }
              bordered
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={`${isViewMode ? "View" : editingData ? "Edit" : "Create"} ${
          createType.charAt(0).toUpperCase() + createType.slice(1)
        }`}
        open={isModalVisible}
        onOk={
          !isViewMode
            ? editingData
              ? handleUpdate
              : createType === "subcategory"
              ? handleSaveSubCategory
              : createType === "size"
              ? handleCreateSize
              : // : createType === "ingredient"
                // ? handleCreateIngredient
                // : createType === "tag"
                // ? handleCreateTag
                handleCreateCategory
            : undefined
        }
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
                <Radio value="size">Size</Radio>
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
            <Form.Item label="Category">
              {isViewMode ? (
                <Input
                  value={form.getFieldValue("parentCategory") || "N/A"}
                  disabled
                />
              ) : (
                <Form.Item
                  name="parentCategory"
                  rules={[
                    {
                      required: true,
                      message: "Please select a parent category",
                    },
                  ]}
                >
                  <Select placeholder="Select parent category">
                    {categories.map((category) => (
                      <Select.Option
                        key={category.id}
                        value={String(category.id)}
                      >
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
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

          {isViewMode ? (
            <Form.Item label="Created Date">
              <Input
                value={
                  selectedCategory?.create_at
                    ? new Date(selectedCategory.create_at).toLocaleString()
                    : "N/A"
                }
                disabled
              />
            </Form.Item>
          ) : (
            <Form.Item
              name="date"
              label="Select Date"
              rules={[{ required: true, message: "Please select a date" }]}
            >
              <DatePicker style={{ width: "100%" }} disabled={isViewMode} />
            </Form.Item>
          )}
        </Form>
      </Modal>

    </div>
  );
}

export default CategoryFoodManagement;
