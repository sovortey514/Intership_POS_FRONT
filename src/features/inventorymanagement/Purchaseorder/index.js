import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Dropdown,
  Menu,
  Space,
  Table,
  notification,
  Upload,
  Col,
  Row,
} from "antd";

import {
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import { DatePicker } from "antd";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import {
  updateCategory,
  createCategory,
  createMaterail,
  fetchMaterials,
  fetchCategories,
  deleteFixedAssetById,
  updateMaterial,
} from "../../../api/materail/materail";
const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const TotalAsset = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // 'Material' or 'category'
  const [editCategory, setEditCategory] = useState(null);
  const [editKey, setEditKey] = useState(null);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const [assetDetails, setViewAsset] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const [a, setA] = useState(0);
  const [assetById, setAssetById] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const columns = (handleEdit, handleDelete) => [
    {
      title: "No",
      dataIndex: "key",
      render: (_, r, index) => index + 1,
      key: "key",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text || "N/A"}</a>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => category?.name || "N/A",
    },

    {
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (price ? `$${price.toFixed(2)}` : "N/A"),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => quantity || 0,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (text) => <a>{text || "N/A"}</a>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, assetDetails) => (
        <Space size="middle">
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEdit(assetDetails)}
            style={{
              borderColor: "green",
              color: "green",
              backgroundColor: "white",
            }}
          >
            Edit
          </Button>
          <Button
            type="default"
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirmation(assetDetails)}
            style={{
              borderColor: "red",
              color: "red",
              backgroundColor: "white",
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    console.log("Data state updated: ", data);
  }, [data]);

  useEffect(() => {
    fetchCategories();
    fetchMaterail();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) => {
      const searchLower = searchTerm.toLowerCase();

      const nameMatch = item.name.toLowerCase().includes(searchLower);
      const categoryMatch = item.category.name
        .toLowerCase()
        .includes(searchLower);
      const dateMatch =
        item.purchaseDate &&
        moment(item.purchaseDate)
          .format("YYYY-MM-DD")
          .toLowerCase()
          .includes(searchLower);

      return nameMatch || categoryMatch || dateMatch;
    });

    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleExport = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    fetch("http://localhost:6060/admin/fixed-assets", { headers })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "fixed_assets.xlsx");
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Export failed:", error);
      });
  };

  const fetchCategorie = async () => {
    try {
      console.log("Sending request to fetch fixed assets...");

      const result = await fetchCategories(token);

      console.log("Response received:", result);
      // const result = await response.json();
      if (result.statusCode === 200) {
        setCategories(result.categories || []);
      } else {
        notification.error({
          message: "Failed to fetch categories",
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchMaterail = async () => {
    try {
      console.log("Sending request to fetch fixed assets...");

      const result = await fetchMaterials(token);

      console.log("Response received:", result);

      if (result && result.statusCode === 200) {
        setData(result.fixedAssets || []);
      } else {
        console.error("Failed to fetch fixed assets:", result.error);
        notification.error({
          message: "Failed to fetch categories",
          description: result.error || "Unknown error",
        });
      }
    } catch (error) {
      console.error("Error fetching fixed assets:", error);
      notification.error({
        message: "Error fetching fixed assets",
        description: error.message || "An unknown error occurred.",
      });
    }
  };
  useEffect(() => {
    fetchCategorie();
    fetchMaterail();
  }, []);

  const showModal = (type) => {
    setModalType(type);
    setEditCategory(null);
    setEditKey(null);
    setIsModalVisible(true);
    setViewAsset(null);
    setCurrentRecord(null);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values);
      let message, description, success;

      if (modalType === "category") {
        if (editCategory) {
          await updateCategory(editCategory.id, values, token);
          setCategories((prevCategories) =>
            prevCategories.map((cat) =>
              cat.id === editCategory.id ? { ...cat, ...values } : cat
            )
          );
          success = true;
          message = "Category Updated";
          description = `Category "${values.name}" has been updated successfully.`;
        } else {
          const response = await createCategory(values, token);
          if (response.ok) {
            success = true;
            message = "Category Created";
            description = `Category "${values.name}" has been created successfully.`;
            fetchCategories();
          } else {
            const errorMessage = await response.text();
            success = false;
            message = "Failed to Create Category";
            description =
              errorMessage || "Category with this name already exists.";
          }
        }
      } else if (modalType === "Material") {
        if (editKey !== null) {
          await updateMaterial(editKey.fixedAssetId, values, token);
          success = true;
          message = "Asset Updated";
          description = "Fixed asset has been updated successfully.";
          fetchMaterail();
        } else {
          const response = await createMaterail(values, token);
          if (response.ok) {
            success = true;
            message = "Fixed Asset Created";
            description = `Fixed Asset "${values.name}" has been created successfully.`;
            fetchMaterail();
            setViewAsset();
          } else {
            const errorMessage = await response.text();
            throw new Error(errorMessage || "Failed to create fixed asset.");
          }
        }
      }

      if (success) {
        notification.success({ message, description, duration: 5 });
      } else {
        notification.error({ message, description, duration: 5 });
      }

      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      notification.error({
        message: "Operation Failed",
        description: error.message,
        duration: 5,
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    form.resetFields();
    setIsModalVisible(false);
    setEditCategory(false);
    setEditKey(false);
    setIsViewModalVisible(false);
    setViewAsset(null);
    setIsModalVisible(false);
    setIsViewModalVisible(false);
  };

  const handleEdit = (assetDetails) => {
    console.log(assetDetails);
    console.log("Asset Details:", assetDetails);
    console.log(assetDetails.category.name);
    setModalType("Material");
    setEditKey(assetDetails);
    form.setFieldsValue({
      name: assetDetails.name,
      categoryId: assetDetails.category.name,
      model: assetDetails.model || null,
      year: assetDetails.year || null,
      serialNumber: assetDetails.serialNumber || null,
      purchaseDate: assetDetails.purchaseDate
        ? moment(assetDetails.purchaseDate)
        : null,
      price: assetDetails.price,
      unit: assetDetails.unit || null,
      quantity: assetDetails.quantity,
      remark: assetDetails.remarks || "",
    });

    setIsModalVisible(true);
  };

  const handleDelete = async (assetDetails) => {
    console.log("Deleting asset with id:", assetDetails.id);

    try {
      const token = localStorage.getItem("token"); 
      if (!token) {
        notification.error({
          message: "Authentication Error",
          description: "Please log in again.",
        });
        return;
      }

      // Call the API function to delete the asset by ID
      const response = await deleteFixedAssetById(assetDetails.id, token);

      // Check if the response indicates a success
      if (response.statusCode === 200) {
        setData((prevData) =>
          prevData.filter((item) => item.id !== assetDetails.id)
        );
        notification.success({
          message: "Asset Deleted",
          description: "Fixed asset has been deleted successfully.",
        });
      } else {
        // Handle any error response from the server
        notification.error({
          message: "Failed to delete asset",
          description: response.message || "An unknown error occurred.",
        });
      }
    } catch (error) {
      console.error("Error deleting fixed asset:", error);
      notification.error({
        message: "Failed to delete asset",
        description: error.message || "An unknown error occurred.",
      });
    }
  };

  const showDeleteConfirmation = (assetDetails) => {
    Modal.confirm({
      title: "Are you sure you want to delete?",
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk(){
        handleDelete(assetDetails);
      },
      onCancel(){
        console.log("Delete action canceled");
      }
    })
  }

  const handleCategoryEdit = (category) => {
    setModalType("category");
    setEditCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
    });
    setIsModalVisible(true);
  };

  const handleCategoryDelete = async (category) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      await fetch(`http://localhost:6060/admin/categories/${category.id}`, {
        method: "DELETE",
        headers,
      });

      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat.id !== category.id)
      );

      notification.success({
        message: "Category Deleted",
        description: "Category has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      notification.error({
        message: "Failed to delete category",
        description: error.message,
      });
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Button type="link" onClick={() => showModal("Material")}>
          Create Material
        </Button>
      </Menu.Item>
      <Menu.Item key="2">
        <Button type="link" onClick={() => showModal("category")}>
          Create Category
        </Button>
      </Menu.Item>
    </Menu>
  );
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const categoryMenu = (
    <Menu>
      {categories.map((category) => (
        <Menu.Item
          key={category.id}
          onClick={() => handleCategorySelect(category.name)}
        >
          <div className="flex justify-between items-center w-full">
            <span>{category.name}</span>
            <div className="flex gap-2">
              <Button
                type="link"
                onClick={() => handleCategoryEdit(category)}
                icon={<EditOutlined />}
              />
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleCategoryDelete(category)}
              />
            </div>
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleRefresh = async () => {
    setLoading(true);
    try {
      setSelectedStatus(null);
      setSelectedCategory(null);
      await fetchMaterail();
    } catch (error) {
      console.error("Failed to refresh data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen ">
        {/* Button Groups */}
        <div className="flex justify-between items-center ">
          <div className="flex">
            <Dropdown overlay={menu} placement="bottomLeft">
              <Button
                size="middle"
                className="bg-pink-500 hover:bg-white text-white"
                style={{ marginRight: 8 }}
              >
                Create <DownOutlined />
              </Button>
            </Dropdown>
            <Dropdown overlay={categoryMenu} placement="bottomLeft">
              <Button size="middle" style={{ marginLeft: 8 }}>
                Categories <DownOutlined />
              </Button>
            </Dropdown>
            <Input
              placeholder="Search..."
              size="middle"
              value={searchTerm}
              onChange={handleSearch}
              suffix={<SearchOutlined />}
              style={{ width: 200, marginLeft: 8 }}
            />
          </div>

          <div className="flex">
            <Button
              size="middle"
              style={{ marginLeft: 8 }}
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              Download
            </Button>
            <Button
              size="middle"
              style={{ marginLeft: 8 }}
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <Table
            columns={columns(handleEdit, handleDelete)}
            dataSource={filteredData}
            rowKey="id"
            className="mt-5"
          />
        </div>
      </div>

      <Modal
        title={
          modalType === "category"
            ? editCategory
              ? "Edit Category"
              : "Create Category"
            : modalType === "Material"
            ? editKey
              ? "Edit Material"
              : "Create Material"
            : "Assign Fixed Asset"
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ remember: true }}
          style={{
            padding: "24px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {modalType === "Material" && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Material Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input the asset name!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter asset name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="categoryId"
                    label="Category"
                    rules={[
                      { required: true, message: "Please select a category!" },
                    ]}
                  >
                    <Select placeholder="Select a category">
                      {categories.map((category) => (
                        <Option key={category.id} value={category.id}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="purchaseDate"
                    label="Purchase Date"
                    rules={[
                      {
                        required: true,
                        message: "Please select the purchase date!",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="Select purchase date"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label="Total Price"
                    rules={[
                      { required: true, message: "Please input the price!" },
                    ]}
                  >
                    <Input placeholder="Enter price" prefix="$" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[
                      { required: true, message: "Please input the quantity!" },
                    ]}
                  >
                    <Input placeholder="Enter quantity" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="remark"
                    label="Remark"
                    rules={[
                      {
                        required: true,
                        message: "Please input remark",
                      },
                    ]}
                  >
                    <Input placeholder="Fill remark" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <div id="imagePreview" className="flex"></div>
                </Col>
              </Row>
            </>
          )}
          {modalType === "category" && (
            <Form.Item
              name="name"
              label="Category Name"
              rules={[
                { required: true, message: "Please input the category name!" },
              ]}
            >
              <Input />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default TotalAsset;
