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

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const TotalAsset = () => {
  const [size, setSize] = useState("large");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // 'fixedasset' or 'category'
  const [editCategory, setEditCategory] = useState(null);
  const [editKey, setEditKey] = useState(null);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const [visibleAssets, setVisibleAssets] = useState([]);
  const [assetDetails, setViewAsset] = useState(null);
  const [item, setItem] = useState([]);
  const [assignasset, setAssignasset] = useState([]);
  const [assetHolders, setAssetHolder] = useState([]);
  const [assetId, setAssetId] = useState(0);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(null);

  const [a, setA] = useState(0);
  const [assetById, setAssetById] = useState([]);
  const [file, setFile] = useState(null);
  const [filteredData, setFilteredData] = useState(data);

  const [searchTerm, setSearchTerm] = useState("");
  const columns = (handleEdit, handleDelete, handleViewHide) => [
    {
      title: "No",
      dataIndex: "key",
      render: (_, r, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "fixedAssetName",
      key: "fixedAssetName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Images",
      dataIndex: "files", 
      key: "files",
      render: (files) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          {files?.map((file, index) => (
            <img
              key={index}
              src={file.fileUrl}
              alt={file.fileName}
              style={{ width: 50, height: 50, objectFit: "cover", borderRadius: "4px" }}
              className="border border-gray-300 shadow-md"
              onError={(e) => { e.target.src = '/default-image.png'; }} // Fallback image
            />
          ))}
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "fixedAssetCategory",
      key: "fixedAssetCategory",
      // render: (_, categoryId) => {
      //   return categoryId.category.name;
      // },
    },
    {
      title: "Model",
      dataIndex: "fixedAssetModel",
      key: "fixedAssetModel",
    },
    {
      title: "Year",
      dataIndex: "fixedAssetYear",
      key: "fixedAssetYear",
    },
    {
      title: "Serial Number",
      dataIndex: "fixedAssetSerialNumber",
      key: "fixedAssetSerialNumber",
    },
    {
      title: "Purchase Date",
      dataIndex: "fixedAssetPurchaseDate",
      key: "fixedAssetPurchaseDate",
      render: (date) => (date ? date : "N/A"),
    },
    {
      title: "Price",
      dataIndex: "fixedAssetPrice",
      key: "fixedAssetPrice",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Unit",
      dataIndex: "fixedAssetUnit",
      key: "fixedAssetUnit",
    },
    {
      title: "Quantity",
      dataIndex: "fixedAssetQuantity",
      key: "fixedAssetQuantity",
    },
    {
      title: "Status",
      dataIndex: "fixedAssetStatusText",
      key: "fixedAssetStatusText",
      render: (statustext) => {
        const status = statustext || "Available";

        return (
          <span
            className={`px-2 py-1 rounded ${
              statustext === "Avaliable"
                ? "bg-green-200 text-green-800"
                : statustext === "In Use"
                ? "bg-red-200 text-red-800"
                : ""
            }`}
          >
            {statustext}
          </span>
        );
      },
    },

    {
      title: "Action",
      key: "action",
      render: (_, assetDetails) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => (handleEdit(assetDetails), setItem(assetDetails))}
            className="bg-green-600 hover:bg-green-700 text-white border-none rounded-md p-2 shadow-md"
          />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="view">
                  <Button
                    type="link"
                    onClick={() => handleViewHide(assetDetails, "view")}
                  >
                    View
                  </Button>
                </Menu.Item>
                <Menu.Item key="hide">
                  <Button
                    type="link"
                    onClick={() => (
                      handleViewHide(assetDetails, "hide"),
                      setItem(assetDetails)
                    )}
                  >
                    Remove
                  </Button>
                </Menu.Item>
              </Menu>
            }
          >
            <Button
              icon={<EyeOutlined />}
              className="bg-white hover:bg-yellow-500 text-yellow-500 border-none rounded-full p-2 shadow-md"
            />
          </Dropdown>
          {assetDetails.fixedAssetStatusText === "In Use" && (
            <Button
              onClick={() => {
                setIsModalVisible(true);
                setModalType("return");
                setAssetId(assetDetails.fixedAssetId);
                setA(assetDetails.fixedAssetId);
              }}
              className="bg-white hover:bg-yellow-500 text-yellow-500 border-none rounded-full p-1 text-xs shadow-sm"
            >
              Return
            </Button>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const data = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await fetch(
          `http://localhost:6060/admin/getFixedAssetById/${a}`,
          {
            method: "GET",
            headers,
          }
        );
        if (response.ok) {
          const assetDetails = await response.json();
          setAssetById(assetDetails.fixedAsset);
        } else {
          const errorData = await response.json();
          notification.error({
            message: "Failed to Fetch Asset Details",
            description:
              errorData.message ||
              "There was an error fetching the asset details.",
          });
        }
      } catch (error) {
        notification.error({
          message: "Failed to Update Asset",
          description: "There was an error updating the asset.",
        });
        console.error("Error updating visibility:", error);
      }
    };
    data();
  }, [a]);

  useEffect(() => {
    fetchCategories();
    fetchFixedAssets();
    fetchAssetHolder();
    fetchFixedAssetswithimage();
  }, []);

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

  const fetchCategories = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch("http://localhost:6060/admin/categories", {
        headers,
      });
      const result = await response.json();
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

  const fetchAssetHolder = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(
        "http://localhost:6060/admin/getallassetholders",
        { headers }
      );
      const result = await response.json();

      console.log(result.assetHolders); // Logs the asset holders to the console

      if (result.statusCode === 200) {
        setAssetHolder(result.assetHolders || []);
      } else {
        notification.error({
          message: "Failed to fetch asset holders",
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Error fetching asset holders:", error);
    }
  };

  const fetchFixedAssets = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(
        "http://localhost:6060/admin/get_all_assets_with_images",
        { headers }
      );
      const result = await response.json();
      if (result) {
        const list = result.filter((i) => i.fixedAssetStatus === "1");
        setData(list);
      } else {
        notification.error({
          message: "Failed to fetch fixed assets",
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Error fetching fixed assets:", error);
    }
  };

  const fetchFixedAssetswithimage = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(
        "http://localhost:6060/admin/get_all_assets_with_images",
        { headers }
      );
      const result = await response.json();
      if (result.ok) {
        console.log(result.fixedAssets);
        setData(result.data || []);
      } else {
        // notification.error({
        //   message: "Failed to fetch fixed assets",
        //   description: result.error,
        // });
      }
    } catch (error) {
      console.error("Error fetching fixed assets:", error);
    }
  };

  const showModal = (type) => {
    setModalType(type);
    setEditCategory(null);
    setEditKey(null);
    setIsModalVisible(true);
    setViewAsset(null);
    setAssignasset(null);
    setCurrentRecord(null);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      if (modalType === "category") {
        if (editCategory) {
          // Edit existing category
          await fetch(
            `http://localhost:6060/admin/categories/${editCategory.id}`,
            {
              method: "PUT",
              headers,
              body: JSON.stringify(values),
            }
          );

          setCategories((prevCategories) =>
            prevCategories.map((cat) =>
              cat.id === editCategory.id ? { ...cat, ...values } : cat
            )
          );

          notification.success({
            message: "Category Updated",
            description: `Category "${values.name}" has been updated successfully.`,
            duration: 1,
          });
        } else {
          // Create new category
          const response = await fetch(
            "http://localhost:6060/admin/createCategory",
            {
              method: "POST",
              headers,
              body: JSON.stringify(values),
            }
          );

          const result = await response.json();

          if (response.ok) {
            if (result.statusCode === 400) {
              notification.error({
                message: "Failed",
                description: `Category "${values.name}" already exists.`,
                duration: 1,
              });

              return;
            }
            notification.success({
              message: "Category Created",
              description: `Category "${values.name}" has been created successfully.`,
              duration: 1,
            });

            fetchCategories();
          } else {
            notification.error({
              message: "Can not create with the same name category",
              description:
                result.message || "Category with this name already exists.",
              duration: 1,
            });
          }
        }
      } else if (modalType === "fixedasset") {
        try {
          if (editKey !== null) {
            console.log("editKey", editKey);
            // Edit existing asset
            const updateResponse = await fetch(
              `http://localhost:6060/admin/updateFixedAsset/${editKey.fixedAssetId}`,
              {
                method: "PUT",
                headers,
                body: JSON.stringify({
                  ...values,
                  status: "1",
                  statustext: "Avaliable",
                }),
              }
            );
            console.log(values);
            if (updateResponse.ok) {
              notification.success({
                message: "Asset Updated",
                description: "Fixed asset has been updated successfully.",
                duration: 1,
              });
              fetchFixedAssets();
            } else {
              const updateResult = await updateResponse.json();
              throw new Error(
                updateResult.message || "Failed to update fixed asset."
              );
            }
          } else {
            // Create new asset
            delete values.image;
            const createResponse = await fetch(
              "http://localhost:6060/admin/createFixedAsset",
              {
                method: "POST",
                headers,
                body: JSON.stringify({
                  ...values,
                  status: "1",
                  statustext: "Avaliable",
                }),
              }
            );

            const createResult = await createResponse.json();
            if (createResponse.ok) {
              fetchFixedAssets();
              if (images) {
                let uploadResult;
                let uploadResponse;
                for (let i = 0; i < images.length; i++) {
                  console.log(images[i]);
                  const formData = new FormData();
                  formData.append("file", images[i]);
                  formData.append("fixedAssetId", createResult.fixedAsset.id);
                  uploadResponse = await fetch(
                    "http://localhost:6060/admin/upload_image",
                    {
                      method: "POST",
                      body: formData,
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                }
                console.log(uploadResponse);
                console.log(uploadResult);
                if (uploadResponse.ok) {
                  fetchFixedAssets();
                } else {
                  throw new Error(
                    uploadResponse.message || "Failed to upload image."
                  );
                }
              }

              notification.success({
                message: "Fixed Asset Created",
                description: `Fixed Asset "${values.name}" has been created successfully.`,
                duration: 1,
              });

              fetchFixedAssets();
              setViewAsset();
            } else {
              // Handle error response from server
              throw new Error(
                createResult.message || "Failed to create fixed asset."
              );
            }
          }
        } catch (error) {
          notification.error({
            message: "Operation Failed",
            description: error.message,
            duration: 1,
          });
        }
      } else if (modalType === "assign") {
        console.log(values);

        if (values && values.id) {
          const requestBody = {
            ...values,
            status: "1",
            statustext: "In Use",
            id: a,
            categoryId: assetById.category.id,
            model: assetById.model,
            name: assetById.name,
            price: assetById.price,
            purchaseDate: assetById.purchaseDate,
            quantity: assetById.quantity,
            serialNumber: assetById.serialNumber,
            unit: assetById.unit,
            year: assetById.year,
          };

          if (values.fixedAsset) {
            requestBody.fixedAsset = { id: values.fixedAsset };
          }
          console.log("editKey:", editKey);
          console.log("editKey.id:", editKey ? editKey.id : "No editKey.id");
          try {
            const response = await fetch(
              `http://localhost:6060/admin/updateFixedAsset/${values.id}`,
              {
                method: "PUT",
                headers,
                body: JSON.stringify(requestBody),
              }
            );

            if (response.ok) {
              fetchFixedAssets();
              notification.success({
                message: "Asset Updated",
                description: "Fixed asset has been updated successfully.",
                duration: 1,
              });
            } else {
              const result = await response.json();
              notification.error({
                message: "Update Failed",
                description:
                  result.message ||
                  "An error occurred while updating the fixed asset.",
                duration: 1,
              });
            }
          } catch (error) {
            console.error("Fetch error:", error);
            notification.error({
              message: "Update Failed",
              description: "An unexpected error occurred.",
              duration: 1,
            });
          }
        } else {
          notification.error({
            message: "Update Failed",
            description: "The asset ID is missing or invalid.",
            duration: 1,
          });
        }
      } else if (modalType === "return") {
        console.log(assetId);

        if (assetId) {
          const requestBody = {
            ...values,
            status: "1",
            statustext: "Avaliable",
            id: a,
            categoryId: assetById.category.id,
            model: assetById.model,
            name: assetById.name,
            price: assetById.price,
            purchaseDate: assetById.purchaseDate,
            quantity: assetById.quantity,
            serialNumber: assetById.serialNumber,
            unit: assetById.unit,
            year: assetById.year,
          };

          if (values.fixedAsset) {
            requestBody.fixedAsset = { id: values.fixedAsset };
          }

          try {
            const response = await fetch(
              `http://localhost:6060/admin/updateFixedAsset/${assetId}`,
              {
                method: "PUT",
                headers,
                body: JSON.stringify(requestBody),
              }
            );

            if (response.ok) {
              fetchFixedAssets();
              notification.success({
                message: "Asset Updated",
                description: "Fixed asset has been updated successfully.",
                duration: 1,
              });
            } else {
              const result = await response.json();
              notification.error({
                message: "Update Failed",
                description:
                  result.message ||
                  "An error occurred while updating the fixed asset.",
                duration: 1,
              });
            }
          } catch (error) {
            console.error("Fetch error:", error);
            notification.error({
              message: "Update Failed",
              description: "An unexpected error occurred.",
              duration: 1,
            });
          }
        } else {
          notification.error({
            message: "Update Failed",
            description: "The asset ID is missing or invalid.",
            duration: 1,
          });
        }
      }

      form.resetFields();
      setIsModalVisible(false);
    } catch (info) {
      console.log("Validate Failed:", info);
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
    // console.log(assetDetails.category.name);
    console.log(assetDetails);
    setModalType("fixedasset");
    setEditKey(assetDetails);

    form.setFieldsValue({
      name: assetDetails.fixedAssetName,
      categoryId: assetDetails.fixedAssetCategory,
      model: assetDetails.fixedAssetModel,
      year: assetDetails.fixedAssetYear,
      serialNumber: assetDetails.fixedAssetSerialNumber,
      purchaseDate: assetDetails.fixedAssetPurchaseDate
        ? moment(assetDetails.purchaseDate)
        : null,
      price: assetDetails.fixedAssetPrice,
      unit: assetDetails.fixedAssetUnit,
      quantity: assetDetails.fixedAssetQuantity,
      // files: assetDetails.files
    });

    if (Array.isArray(assetDetails.files)) {
      setImages(assetDetails.files.map((file) => file.fileUrl));
    } else {
      setImages([]);
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (assetDetails) => {
    console.log("Deleting asset with key:", assetDetails.fixedAssetId);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      await fetch(
        `http://localhost:6060/admin/deleteFixeAsset/${assetDetails.fixedAssetId}`,
        {
          method: "DELETE",
          headers,
        }
      );
      console.log("Deleting asset with key:", assetDetails.key);
      setData((prevData) =>
        prevData.filter((item) => item.id !== assetDetails.fixedAssetId)
      );
      notification.success({
        message: "Asset Deleted",
        description: "Fixed asset has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting fixed asset:", error);
      notification.error({
        message: "Failed to delete asset",
        description: error.message,
      });
    }
  };

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
        <Button type="link" onClick={() => showModal("fixedasset")}>
          Create Fixed Asset
        </Button>
      </Menu.Item>
      <Menu.Item key="2">
        <Button type="link" onClick={() => showModal("category")}>
          Create Category
        </Button>
      </Menu.Item>
    </Menu>
  );

  const handleMenuClick = (e) => {
    setSelectedStatus(e.key);
    console.log(e.key);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  useEffect(() => {
    console.log(
      "item",
      data.filter((item) => item)
    );
    const filtered = data.filter((item) => {
      const statusMatch = selectedStatus
        ? item.fixedAssetStatusText === selectedStatus
        : true;
      const categoryMatch = selectedCategory
        ? item.fixedAssetCategory === selectedCategory
        : true;

      const searchLower = searchTerm.toLowerCase();

      const searchMatch =
        item.fixedAssetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fixedAssetCategory
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.fixedAssetSerialNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      item.fixedAssetPurchaseDate &&
        new Date(item.fixedAssetPurchaseDate)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchLower);

      return statusMatch && categoryMatch && searchMatch;
    });

    setFilteredData(filtered);
  }, [selectedStatus, selectedCategory, searchTerm, data]);

  const statusMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="In Use">In Use</Menu.Item>
      <Menu.Item key="Avaliable">Avaliable</Menu.Item>
    </Menu>
  );

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
  const handleViewHide = async (assetDetails, type) => {
    if (type === "view") {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        console.log(assetDetails);
        const response = await fetch(
          // `http://localhost:6060/admin/getFixedAssetById/${assetDetails.id}`,
          `http://localhost:6060/admin/get_images_by_asset/${assetDetails.fixedAssetId}`,
          {
            method: "GET",
            headers,
          }
        );
        if (response.ok) {
          const assetDetails = await response.json();

          console.log(assetDetails);
          setViewAsset(assetDetails);
          setIsViewModalVisible(true);
        } else {
          const errorData = await response.json();
          notification.error({
            message: "Failed to Fetch Asset Details",
            description:
              errorData.message ||
              "There was an error fetching the asset details.",
          });
        }
      } catch (error) {
        notification.error({
          message: "Failed to Update Asset",
          description: "There was an error updating the asset.",
        });
        console.error("Error updating visibility:", error);
      }
    }
    // useEffect(() => {
    //   if (assetDetails && token) {
    //     handleViewHide(assetDetails, 'view', token); // Assuming you want to view asset details when assetDetails or token changes
    //   }
    // }, [assetDetails, token]);
    else if (type === "hide") {
      confirm({
        title: "Are you sure you want to hide this asset?",
        content: `Asset: ${assetDetails.fixedAssetName}`,
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          try {
            const headers = {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            };
            const response = await fetch(
              `http://localhost:6060/admin/updateFixedAsset/${assetDetails.fixedAssetId}`,
              {
                method: "PUT",
                headers,
                body: JSON.stringify({
                  // ...assetDetails,
                  status: "0",
                  statustext: "Avaliable",
                  id: assetDetails.fixedAssetId,
                  categoryId: 1,
                  model: assetDetails.fixedAssetModel,
                  name: assetDetails.fixedAssetName,
                  price: assetDetails.fixedAssetPrice,
                  purchaseDate: assetDetails.fixedAssetPurchaseDate,
                  quantity: assetDetails.fixedAssetQuantity,
                  serialNumber: assetDetails.fixedAssetSerialNumber,
                  unit: assetDetails.fixedAssetUnit,
                  year: assetDetails.fixedAssetYear, // Hiding the asset by updating its status
                }),
              }
            );

            if (response.ok) {
              const updatedRecord = await response.json();
              await fetchFixedAssets(); // Refresh the asset list after hiding

              notification.success({
                message: "Asset Updated",
                description: `Asset "${updatedRecord.fixedAsset.name}" has been updated.`,
              });
            } else {
              const errorData = await response.json();
              notification.error({
                message: "Failed to Update Asset",
                description:
                  errorData.message || "There was an error updating the asset.",
              });
            }
          } catch (error) {
            notification.error({
              message: "Failed to Update Asset",
              description: "There was an error updating the asset.",
            });
            console.error("Error updating asset:", error);
          }
        },
        onCancel() {
          console.log("Hide operation cancelled");
        },
      });
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      setSelectedStatus(null);
      setSelectedCategory(null);
      await fetchFixedAssets();
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
                className="bg-yellow-500 hover:bg-white text-white"
                style={{ marginRight: 8 }} // Ensure margin consistency
              >
                Create <DownOutlined />
              </Button>
            </Dropdown>

            <Button
              size="middle"
              onClick={() => {
                setIsModalVisible(true);
                setModalType("assign");
              }}
              className="bg-yellow-500 hover:bg-white text-white"
            >
              Assign <PlusOutlined />
            </Button>

            <Dropdown overlay={categoryMenu} placement="bottomLeft">
              <Button size="middle" style={{ marginLeft: 8 }}>
                Categories <DownOutlined />
              </Button>
            </Dropdown>

            <Dropdown overlay={statusMenu} placement="bottomLeft">
              <Button
                size="middle"
                style={{ marginLeft: 8 }}
                className="hover:bg-yellow-50 text-gray"
              >
                Status <DownOutlined />
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
            columns={columns(handleEdit, handleDelete, handleViewHide)}
            dataSource={filteredData}
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
            : modalType === "fixedasset"
            ? editKey
              ? "Edit Fixed Asset"
              : "Create Fixed Asset"
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
          {modalType === "fixedasset" && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Asset Name"
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
                    name="model"
                    label="Model"
                    rules={[
                      { required: true, message: "Please input the model!" },
                    ]}
                  >
                    <Input placeholder="Enter model" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="year"
                    label="Year"
                    rules={[
                      { required: true, message: "Please input the year!" },
                    ]}
                  >
                    <Input placeholder="Enter year" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="serialNumber"
                    label="Serial Number"
                    rules={[
                      {
                        required: true,
                        message: "Please input the serial number!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter serial number" />
                  </Form.Item>
                </Col>
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
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label="Price"
                    rules={[
                      { required: true, message: "Please input the price!" },
                    ]}
                  >
                    <Input placeholder="Enter price" prefix="$" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="unit"
                    label="Unit"
                    rules={[
                      { required: true, message: "Please input the unit!" },
                    ]}
                  >
                    <Input placeholder="Enter unit" />
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
                <Form.Item label="Upload Image">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setImages([...e.target.files])}
                  />
                </Form.Item>
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
          {modalType === "assign" && (
            <>
              <Form.Item
                name="id"
                label="Select Fixed Asset"
                rules={[
                  { required: true, message: "Please select a fixed asset!" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select a fixed asset"
                  onChange={(e) => setA(e)}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children.toLowerCase().includes(input.toLowerCase())
                  }
                  suffixIcon={<SearchOutlined />}
                >
                  {data.map((fixedAsset) => (
                    <Option
                      key={fixedAsset.fixedAssetId}
                      value={fixedAsset.fixedAssetId}
                    >
                      {fixedAsset.fixedAssetName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="assetHolder"
                label="Select Asset Holder"
                rules={[
                  { required: true, message: "Please select an asset holder!" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select an asset holder"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children.toLowerCase().includes(input.toLowerCase())
                  }
                  suffixIcon={<SearchOutlined />}
                >
                  {assetHolders.map((holder) => (
                    <Option key={holder.id} value={holder.id}>
                      {holder.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

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
                <DatePicker />
              </Form.Item>
            </>
          )}

          {modalType === "return" && (
            <p>Are you sure you want to return this asset?</p>
          )}
        </Form>
      </Modal>
      <Modal
        visible={isViewModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={null}
        cancelText="Cancel"
        width={800}
      >
        <div className="p-8 border rounded-lg bg-gradient-to-r from-blue-50 to-white shadow-xl">
          <h2 className="text-3xl font-semibold text-yellow-500 mb-8 text-center">
            Asset Details
          </h2>
          <div className="mb-8 text-center">
            {assetDetails?.files?.map((file, index) => (
              <img
                key={index}
                src={file.fileUrl}
                alt={file.fileName}
                className="w-100 h-100 mx-auto rounded-lg border border-gray-300 shadow-md object-cover"
                style={{ width: "100px", height: "100px" }}
              />
            ))}
          </div>
          {/* Grid Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Grid Item */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center">
              <div className="text-gray-700 font-semibold w-1/3 pr-4">No:</div>
              <div className="text-gray-800 w-2/3">
                {assetDetails?.fixedAssetId}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center">
              <div className="text-gray-700 font-semibold mr-4">Name:</div>
              <div className="text-gray-800">
                {assetDetails?.fixedAssetName}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center">
              <div className="text-gray-700 font-semibold mr-4">Category:</div>
              <div className="text-gray-800">
                {assetDetails?.fixedAssetCategory}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center">
              <div className="text-gray-700 font-semibold mr-4">Model:</div>
              <div className="text-gray-800">
                {assetDetails?.fixedAssetModel}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center">
              <div className="text-gray-700 font-semibold mr-4">Year:</div>
              <div className="text-gray-800">
                {assetDetails?.fixedAssetYear}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center">
              <div className="text-gray-700 font-semibold mr-4">
                Serial Number:
              </div>
              <div className="text-gray-800">
                {assetDetails?.fixedAssetSerialNumber}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center">
              <div className="text-gray-700 font-semibold mr-4">
                Purchase Date:
              </div>
              <div className="text-gray-800">
                {assetDetails?.fixedAssetPurchaseDate}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center">
              <div className="text-gray-700 font-semibold mr-4">Price ($):</div>
              <div className="text-gray-800">
                {assetDetails?.fixedAssetPrice}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center">
              <div className="text-gray-700 font-semibold mr-4">Unit:</div>
              <div className="text-gray-800">
                {assetDetails?.fixedAssetUnit}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center">
              <div className="text-gray-700 font-semibold mr-4">Quantity:</div>
              <div className="text-gray-800">
                {assetDetails?.fixedAssetQuantity}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center">
              <div className="text-gray-700 font-semibold mr-4">Status:</div>
              <div
                className={`text-gray-800 ${
                  assetDetails?.fixedAssetStatusText === "Available"
                    ? "text-green-600"
                    : assetDetails?.fixedAssetStatusText === "In Use"
                    ? "text-red-600"
                    : ""
                }`}
              >
                {assetDetails?.fixedAssetStatusText}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center">
              <div className="text-gray-700 font-semibold mr-4">
                Asset Holder:
              </div>
              <div className="text-gray-800">
                {assetDetails?.fixedAssetAssetHolder}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TotalAsset;
