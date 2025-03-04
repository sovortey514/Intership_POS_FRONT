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
  Menu,
  Dropdown,
  Upload
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
  UploadOutlined

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
  fetchSize,
  fetchFoods,
  uploadFoodImage,
  createFood,
  deleteFoodsById,
  updateFood



} from "../../../api/Food_Category/food_category";

function CategoryFoodManagement() {
  const [foods, setFoods] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [createType, setCreateType] = useState("category");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubcategories] = useState([]);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentView, setCurrentView] = useState("category");
  const [size, setSize] = useState([]);
  const [fileList, setFileList] = useState([]);
  const token = localStorage.getItem("token");

  const showCreateModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const sizeMenu = (
    <Menu>
      {size.map((size) => (
        <Menu.Item key={size.id}>
          {size.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  const showEditModal = (record) => {
    console.log("Editing food item:", record);

    if (!record || (!record.id && !record.foodId)) {
          message.error("Invalid record selected for editing.");
          return;
        }
    
        setEditingData(record);
        setIsViewMode(false);
    
        let type = "category";
        if (record.parentCategory) {
          type = "subcategory";
        } else if (record.foodId || record.categoryName) {
          type = "food";
        }
    setCreateType(type);

    // const matchedCategory = categories.find((cat) => cat.name === record.categoryName);
    // const matchedSubCategory = subCategories.find((sub) => sub.name === record.subCategoryName);
    // const matchedSize = size.find((s) => s.name === record.sizeName);

     const matchedCategory = categories.find((cat) => cat.id === record.categoryId || cat.name === record.categoryName);
    const matchedSubCategory = subCategories.find((sub) => sub.id === record.subCategoryId || sub.name === record.subCategoryName);
    const matchedSize = size.find((s) => s.id === record.sizeId || s.name === record.sizeName);


    form.setFieldsValue({
      name: record.foodName || record.name,
      description: record.description || "",

      categoryId: type === "food" ? matchedCategory?.id || undefined : undefined,
      subCategoryId: type === "food" ? matchedSubCategory?.id || undefined : undefined,
      sizeId: type === "food" ? matchedSize?.id || undefined : undefined,

      parentCategory: type === "subcategory"
        ? String(record.parentCategory?.id || record.parentCategory)
        : undefined,

      price: record.price ? String(record.price) : "",
      date: record.createdAt
        ? moment(record.createdAt)
        : record.create_at
          ? moment(record.create_at)
          : null,
    });

    if (record.files && record.files.length > 0) {
      setFileList([
        {
          uid: "-1",
          name: record.files[0].fileName,
          status: "done",
          url: record.files[0].fileUrl,
        },
      ]);
    } else {
      setFileList([]);
    }

    setIsModalVisible(true);
  };

  const showViewModal = (record) => {
    console.log("📄 Viewing Record:", record);
    setSelectedCategory(record);
    setIsViewMode(true);

    let type = "category";

    if (record.parentCategory) {
      type = "subcategory";
    } else if (record.foodId) {
      type = "food";
    }

    setCreateType(type);

    const parentCategoryName =
      categories.find(
        (cat) => String(cat.name).trim() === String(record.parentCategory).trim()
      )?.name || "N/A";

    const imageUrl =
      record.files && record.files.length > 0 ? record.files[0].fileUrl : null;

    form.setFieldsValue({
      name: record.foodName || record.name,
      description: record.description || "N/A",
      price: record.price ? parseFloat(record.price).toFixed(2) : "N/A",
      parentCategory: parentCategoryName,
      subCategoryId: record.subCategoryName || "N/A",
      sizeId: record.sizeName || "N/A",
    });

    console.log("🔎 Food View Details:", form.getFieldsValue());

    setFileList(imageUrl ? [{ uid: "-1", name: "food_image", status: "done", url: imageUrl }] : []);

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
          `${createType.charAt(0).toUpperCase() + createType.slice(1)
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

      const token = localStorage.getItem("token");
      const result = await fetchcreateFood_Category(token);

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

  const handleCreateFood = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("token");

      console.log("📤 Extracted Form Values:", values);

      const formattedDate = values.date ? values.date.format("YYYY-MM-DD") : null;

      if (fileList.length === 0 || !fileList[0].originFileObj) {
        console.error("🚨 Missing Image File!");
        message.error("Please upload a food image.");
        return;
      }

      if (!values.name || !values.price || !values.categoryId || !values.sizeId || !formattedDate) {
        console.error("🚨 Missing Required Fields:", values);
        message.error("Please fill in all required fields.");
        return;
      }

      const foodPayload = new FormData();
      foodPayload.append("name", values.name);
      foodPayload.append("description", values.description);
      foodPayload.append("price", values.price);
      foodPayload.append("categoryId", values.categoryId);
      foodPayload.append("sizeId", values.sizeId);
      foodPayload.append("date", formattedDate);

      if (values.subCategoryId) {
        foodPayload.append("subCategoryId", values.subCategoryId);
      }

      console.log("📤 Sending Food Data to API:", foodPayload);


      const createdFood = await createFood(foodPayload, token);
      console.log("✅ Food Created Successfully:", createdFood);

      if (!createdFood.id) {
        throw new Error("❌ Food ID is missing from the API response.");
      }


      if (fileList.length > 0) {
        const imageFile = fileList[0].originFileObj;
        console.log("📤 Uploading food image:", imageFile);

        try {
          const uploadResponse = await uploadFoodImage(createdFood.id, imageFile, token);
          if (uploadResponse.error) {
            console.warn("⚠️ Image upload failed:", uploadResponse.error);
          } else {
            console.log("✅ Image uploaded successfully:", uploadResponse);
          }
        } catch (uploadError) {
          console.warn("🚨 Image upload encountered an issue:", uploadError);
        }
      } else {
        console.log("⚠️ No image provided for upload.");
      }

      handlefetchfoods();
      message.success("🎉 Food successfully created!");
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);

    } catch (error) {
      console.error("🚨 Error creating food:", error);
      message.error(error.message || "An error occurred. Please try again.");
    }
  };
  const handledeleteFood = async (food) => {
    try {
      const token = localStorage.getItem("token");


      const response = await deleteFoodsById(food.foodId, token);

    
      await handlefetchfoods();

      notification.success({
        message: "Food Deleted",
        description: "Food has been deleted successfully.",
      });

    } catch (error) {
      console.error("🚨 Error deleting food:", error);

      notification.error({
        message: "Failed to delete Food",
        description: error.message || "An unknown error occurred.",
      });
    }
  };

  const handlefetchSubcategory = async () => {
    try {
     
      const token = localStorage.getItem("token");
      const result = await fetchSubcategory(token);

  
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

  const handleCreateSize = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        description: values.description || "",
      };

      const data = await createSize(payload, token);

      message.success("Size successfully added!");


      await handlefetchSize();

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error creating size:", error);
      message.error(error.message || "An error occurred. Please try again.");
    }
  };

  const handlefetchSize = async () => {
    try {
     
      const token = localStorage.getItem("token");

      if (!token) {
        notification.error({
          message: "Authentication Error",
          description: "Please log in again.",
        });
        return;
      }

      const result = await fetchSize(token);
    
      if (JSON.stringify(size) !== JSON.stringify(result)) {
        setSize(result);
      }
    } catch (error) {
      console.error("🚨 Error fetching size:", error);
      notification.error({
        message: "Error fetching size",
        description: error.message || "An error occurred while fetching size.",
      });
    }
  }

  const handleUpdateFood = async () => {
    try {
      if (!editingData || !editingData.foodId) {
        message.error("Invalid food item ID. Please select a valid food item.");
        return;
      }

      const values = await form.validateFields();
      const token = localStorage.getItem("token");

      console.log("📤 Extracted Form Values for Update:", values);

      const formattedDate = values.date ? values.date.format("YYYY-MM-DD") : null;

      if (!values.name || !values.price || !values.categoryId || !values.sizeId || !formattedDate) {
        console.error("🚨 Missing Required Fields:", values);
        message.error("Please fill in all required fields.");
        return;
      }

      // ✅ Use FormData for updating food (same as create)
      const foodPayload = new FormData();
      foodPayload.append("name", values.name);
      foodPayload.append("description", values.description);
      foodPayload.append("price", values.price);
      foodPayload.append("categoryId", values.categoryId);
      foodPayload.append("sizeId", values.sizeId);
      foodPayload.append("date", formattedDate);

      if (values.subCategoryId) {
        foodPayload.append("subCategoryId", values.subCategoryId);
      }

      console.log("📤 Sending Updated Food Data to API:", foodPayload);

      const updatedFood = await updateFood(editingData.foodId, foodPayload, token);
      console.log("✅ Food Updated Successfully:", updatedFood);

      if (!updatedFood || !updatedFood.id) {
        throw new Error("❌ Food ID is missing from the API response.");
      }

      // ✅ Check if a new image is uploaded and update it
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const imageFile = fileList[0].originFileObj;
        console.log("📤 Uploading new food image:", imageFile);

        try {
          const uploadResponse = await uploadFoodImage(updatedFood.id, imageFile, token);
          if (uploadResponse.error) {
            console.warn("⚠️ Image upload failed:", uploadResponse.error);
          } else {
            console.log("✅ Image uploaded successfully:", uploadResponse);
          }
        } catch (uploadError) {
          console.warn("🚨 Image upload encountered an issue:", uploadError);
        }
      } else {
        console.log("⚠️ No new image provided for update.");
      }

      handlefetchfoods();
      message.success("🎉 Food successfully updated!");
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);

    } catch (error) {
      console.error("🚨 Error updating food:", error);
      message.error(error.message || "An error occurred. Please try again.");
    }
};

  useEffect(() => {
    fetchCategories();
    handlefetchSubcategory();
    handlefetchSize();
    handlefetchfoods();
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

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
                      borderRadius: "8px",
                      border: "1px solid #ff4d94",
                      color: "#ff4d94",
                      backgroundColor: "white",
                      fontWeight: "600",
                      padding: "8px 16px",
                      transition: "all 0.3s ease-in-out",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#ffedf5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    Filter Category
                  </Button>

                  {currentView === "food" && (
                    <Dropdown overlay={sizeMenu} trigger={["click"]}>
                      <Button
                        icon={<FilterOutlined />}
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #ff4d94",
                          color: "#ff4d94",
                          backgroundColor: "white",
                          fontWeight: "600",
                          padding: "8px 16px",
                          transition: "all 0.3s ease-in-out",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#ffedf5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "white")
                        }
                      >
                        Filter Size
                      </Button>
                    </Dropdown>
                  )}
                </div>
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

                ...(currentView === "category"
                  ? [
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
                      title: "Date",
                      dataIndex: "create_at",
                      key: "create_at",
                      render: (create_at) =>
                        create_at
                          ? new Date(create_at).toLocaleDateString()
                          : "N/A",
                    },
                  ]
                  : []),

                ...(currentView === "subcategory"
                  ? [
                    {
                      title: "No.",
                      dataIndex: "no",
                      key: "no",
                      render: (_, __, index) => index + 1,
                    },
                    { title: "Name", dataIndex: "name", key: "name" },
                    {
                      title: "Category",
                      dataIndex: "parentCategory",
                      key: "parentCategory",
                      render: (parentCategory) => parentCategory || "N/A",
                    },
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
                  ]
                  : []),

                ...(currentView === "food"
                  ? [
                    {
                      title: "No.",
                      dataIndex: "no",
                      key: "no",
                      render: (_, __, index) => index + 1,
                    },

                    {
                      title: "Food Name",
                      dataIndex: "foodName",
                      key: "foodName",
                    },
                    // {
                    //   title: "Category",
                    //   dataIndex: "categoryName",
                    //   key: "categoryName",
                    //   render: (categoryName) => categoryName || "N/A",
                    // },
                    {
                      title: "Subcategory",
                      dataIndex: "subCategoryName",
                      key: "subCategoryName",
                      render: (subCategoryName) => subCategoryName || "N/A",
                    },
                    {
                      title: "Size",
                      dataIndex: "sizeName",
                      key: "sizeName",
                      render: (sizeName) => sizeName || "N/A",
                    },
                    {
                      title: "Image",
                      dataIndex: "files",
                      key: "files",
                      render: (files) =>
                        files && files.length > 0 ? (
                          <img
                            src={files[0].fileUrl}
                            alt="Food"
                            width={50}
                            height={50}
                            style={{ borderRadius: "8px" }}
                          />
                        ) : (
                          "N/A"
                        ),
                    },
                    {
                      title: "Price",
                      dataIndex: "price",
                      key: "price",
                      render: (price) =>
                        price ? `$${parseFloat(price).toFixed(2)}` : "N/A",
                    },
                    {
                      title: "Date",
                      dataIndex: "createdAt",
                      key: "createdAt",
                      render: (create_at) =>
                        create_at
                          ? new Date(create_at).toLocaleDateString()
                          : "N/A",
                    },
                  ]
                  : []),


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
                          // console.log("Clicked Edit for record:", record);
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
                        title={`Are you sure you want to delete this ${currentView === "food" ? "food" : currentView === "subcategory" ? "subcategory" : "category"
                          }?`}
                        onConfirm={() =>
                          currentView === "food"
                            ? handledeleteFood(record)
                            : currentView === "subcategory"
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
                currentView === "category"
                  ? categories
                  : currentView === "subcategory"
                    ? subCategories.map((sub) => ({
                      ...sub,
                      parentCategory: sub.category?.name || "N/A",
                    }))
                    : foods
              }
              bordered
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={`${isViewMode ? "View" : editingData ? "Edit" : "Create"
          } ${createType.charAt(0).toUpperCase() + createType.slice(1)}`}
        open={isModalVisible}
        // onOk={
        //   !isViewMode
        //     ? editingData
        //       ? handleUpdate
        //       : createType === "subcategory"
        //         ? handleSaveSubCategory
        //         : createType === "size"
        //           ? handleCreateSize
        //           : createType === "food"
        //             ? handleCreateFood
        //             : handleCreateCategory
        //     : undefined
        // }
        onOk={
          !isViewMode
            ? editingData
              ? createType === "food"
                ? handleUpdateFood
                : handleUpdate
              : createType === "subcategory"
                ? handleSaveSubCategory
                : createType === "size"
                  ? handleCreateSize
                  : createType === "food"
                    ? handleCreateFood
                    : handleCreateCategory
            : undefined
        }

        onCancel={handleCancel}
        footer={isViewMode ? null : undefined}
        okButtonProps={{
          style: {
            minWidth: "120px",
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: 14,
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

          <Row gutter={[16, 16]}>

            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Please enter name" }]}
              >
                <Input placeholder="Enter name" disabled={isViewMode} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="description" label="Description">
                <Input placeholder="Enter description" disabled={isViewMode} />
              </Form.Item>
            </Col>
          </Row>


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
                      <Select.Option key={category.id} value={String(category.id)}>
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </Form.Item>
          )}

          {createType === "food" && (
            <Row gutter={[12, 12]} style={{ padding: "8px" }}>

              <Col span={12}>
                <Form.Item label="Category">
                  {isViewMode ? (

                    <Input
                      value={selectedCategory?.categoryName || "N/A"}
                      disabled
                    />
                  ) : (

                    <Form.Item
                      name="categoryId"
                      rules={[{ required: true, message: "Please select a parent category" }]}
                    >
                      <Select placeholder="Select parent category">
                        {categories.map((category) => (
                          <Select.Option key={category.id} value={String(category.id)}>
                            {category.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Subcategory" name="subCategoryId">
                  {isViewMode ? (

                    <Input
                      value={
                        subCategories.find(sub => sub.id === selectedCategory?.subCategoryId)?.name || "N/A"
                      }
                      disabled
                    />
                  ) : (

                    <Select placeholder="Select a subcategory">
                      {subCategories.map((sub) => (
                        <Select.Option key={sub.id} value={sub.id}>
                          {sub.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>


              <Col span={12}>
                <Form.Item label="Size" name="sizeId">
                  {isViewMode ? (
                    // Show Read-Only Text in View Mode
                    <Input
                      value={size.find(s => s.id === form.getFieldValue("sizeId"))?.name || "N/A"}
                      disabled
                    />
                  ) : (
                    // Show Select Dropdown in Create Mode
                    <Select placeholder="Select size">
                      {size.map((size) => (
                        <Select.Option key={size.id} value={size.id}>
                          {size.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>


              <Col span={12}>
                <Form.Item label="Price" name="price">
                  {isViewMode ? (

                    <Input
                      value={selectedCategory?.price !== undefined ? `$${selectedCategory.price}` : "N/A"}
                      disabled
                    />
                  ) : (

                    <Input type="number" placeholder="Enter price" />
                  )}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Food Image">
                  {isViewMode ? (
                    fileList.length > 0 ? (
                      <div style={{ textAlign: "center" }}>
                        <img
                          src={fileList[0].url}
                          alt="Food Image"
                          style={{
                            width: "100%",
                            maxWidth: "250px",
                            borderRadius: "10px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                      </div>
                    ) : (
                      <p style={{ textAlign: "center", color: "#888" }}>No image available</p>
                    )
                  ) : (
                    <Upload
                      beforeUpload={() => false}
                      listType="picture-card"
                      fileList={fileList}
                      onChange={({ fileList }) => setFileList(fileList)}
                    >
                      {fileList.length < 1 && (
                        <div style={{ textAlign: "center" }}>
                          <UploadOutlined style={{ fontSize: 18, color: "#ff4d94" }} />
                          <p style={{ fontSize: 12, marginTop: 4 }}>Upload Image</p>
                        </div>
                      )}
                    </Upload>
                  )}
                </Form.Item>
              </Col>

            </Row>
          )}


          {isViewMode ? (
            <Form.Item label="Created Date">
              <Input
                value={
                  selectedCategory?.createdAt
                    ? new Date(selectedCategory.createdAt).toLocaleString()
                    : selectedCategory?.create_at
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
