import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  EditOutlined,

  PlusOutlined,
  SearchOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  Popconfirm,
} from "antd";
import { Select } from "antd";
import { notification } from "antd";

import {
  createSupplier,
  fetchSuppliers,
  updateSuppliers,
  deleteSuppliersById


} from "../../../api/suppliers/suppliers";


const { Meta } = Card;
const { Title, Text } = Typography;

const coverImages = {
  "Fresh": "/images/fresh produce suppliers.png",
  "Meat": "/images/Meat & Poultry Suppliers.png",
  "Seafood": "/images/seafood.png",
  "Organic": "/images/Organic.png",
  "Dairy": "/images/Dary.png",
  "Beverages": "/images/beverages.png",
  "Bakery": "/images/bakery.png",
};



const Suppliers = () => {
  const [searchText, setSearchText] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentSuppliers, setCurrentSuppliers] = useState(null);
  const [form] = Form.useForm();

  const handleSearch = (event) => {
    setSearchText(event.target.value.toLowerCase());
  };

  const handleCreateSupplier = () => {
    setIsModalVisible(true);
  };

  const handleEditSupplier = (supplier) => {
    setCurrentSuppliers(supplier); // Store the supplier data to be edited
    form.setFieldsValue({
      contactName: supplier.contactName,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      country: supplier.country,
      type: supplier.type,
    });
    setIsUpdateModalVisible(true); // Open the update modal
  };


  const supplierTypes = [
    "Fresh",
    "Meat",
    "Seafood",
    "Dairy",
    "Bakery",
    "Beverages",
    "Organic",
  ];

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsUpdateModalVisible(false);
    form.resetFields();
  };


  const handleFormSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        notification.error({
          message: "Authentication Error",
          description: "Please log in again.",
        });
        return;
      }

      const newSupplierPayload = {
        contactName: values.contactName,
        phone: values.phone,
        email: values.email,
        address: values.address,
        country: values.country,
        type: values.type,
      };

      const response = await createSupplier(newSupplierPayload, token);

      if (response.error) {
        throw new Error(response.error);
      }

      const newSupplierFrontend = {
        ...response,
        avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${suppliers.length + 1}`,
        cover: coverImages[values.type] || coverImages["Default"],
        type: values.type,
      };

      handlefetchSuppliers()
      setIsModalVisible(false);
      form.resetFields();

      notification.success({
        message: "Supplier Created",
        description: "The supplier was created successfully!",
      });

    } catch (error) {
      console.error("Failed to create supplier:", error);
      notification.error({
        message: "Error Creating Supplier",
        description: error.message || "An error occurred while creating the supplier.",
      });
    }
  };

  const handleUpdateFormSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        notification.error({
          message: "Authentication Error",
          description: "Please log in again.",
        });
        return;
      }

      const updatedSupplierPayload = {
        contactName: values.contactName,
        phone: values.phone,
        email: values.email,
        address: values.address,
        country: values.country,
        type: values.type,
      };

      // Create a new cover image based on the updated type
      const newCoverImage = coverImages[values.type] || coverImages["Default"];

      // Update the supplier
      const updatedSupplier = await updateSuppliers(
        currentSuppliers.id,
        updatedSupplierPayload,
        token
      );

      if (updatedSupplier) {
        notification.success({
          message: "Supplier Updated",
          description: "The supplier was updated successfully!",
        });

        // Update the supplier in the list and update the cover image as well
        setSuppliers((prevSuppliers) =>
          prevSuppliers.map((supplier) =>
            supplier.id === currentSuppliers.id
              ? { ...supplier, ...updatedSupplierPayload, cover: newCoverImage } // Update cover image
              : supplier
          )
        );
      } else {
        notification.error({
          message: "Error Updating Supplier",
          description: "Could not update supplier. Please try again.",
        });
      }

      setIsUpdateModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Failed to update supplier:", error);
      notification.error({
        message: "Error Updating Supplier",
        description: error.message || "An error occurred while updating the supplier.",
      });
    }
  };

  const handleDeleteCategory = async (supplier) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        notification.error({
          message: "Authentication Error",
          description: "Please log in again.",
        });
        return;
      }

      const response = await deleteSuppliersById(supplier.id, token);
  
      if (response.ok) {
        // Refresh the suppliers list after deletion
        handlefetchSuppliers();
        notification.success({
          message: "Supplier Deleted",
          description: "Supplier has been deleted successfully.",
        });
      } else {
        throw new Error(response.message || "Failed to delete the supplier.");
      }
    } catch (error) {
      console.error("Failed to delete supplier:", error);
      notification.error({
        message: "Failed to Delete Supplier",
        description: error.message || "An unknown error occurred.",
      });
    }
  };


  const handlefetchSuppliers = async () => {
    try {
    
      const token = localStorage.getItem("token");

      if (!token) {
        notification.error({
          message: "Authentication Error",
          description: "Please log in again.",
        });
        return;
      }

      const result = await fetchSuppliers(token);

      if (JSON.stringify(suppliers) !== JSON.stringify(result)) {
        const newSuppliersFrontend = result.map((supplier, index) => ({
          ...supplier,
          avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${suppliers.length + index + 1}`,
          cover: coverImages[supplier.type] || coverImages["Default"],
          type: supplier.type,
        }));
        setSuppliers(newSuppliersFrontend);
      }
    } catch (error) {
      console.error("🚨 Error fetching size:", error);
      notification.error({
        message: "Error fetching size",
        description: error.message || "An error occurred while fetching suppliers.",
      });
    }
  }
  useEffect(() => {
    handlefetchSuppliers();
  }, [])
  console.log(suppliers)

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(suppliers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSuppliers(items);
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <Title level={2}>Suppliers List</Title>
        <Space>
          <Input
            placeholder="Search suppliers..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            allowClear
            style={{ width: 250 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateSupplier}
            style={{
              backgroundColor: "#ff69b4",
              borderColor: "#ff69b4",
              color: "#fff",
            }}
          >
            Create Supplier
          </Button>
        </Space>
      </div>

      {/* Drag & Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="suppliersList" direction="horizontal">
          {(provided) => (
            <Row
              gutter={[16, 16]}
              justify="center"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {suppliers
                .filter((supplier) =>
                  supplier.type && typeof supplier.type === "string"
                    ? supplier.type.toLowerCase().includes(searchText)
                    : false
                )
                .map((supplier, index) => (
                  <Draggable key={supplier.id} draggableId={String(supplier.id)} index={index}>

                    {(provided) => (
                      <Col
                        xs={24}
                        sm={12}
                        md={6}
                        lg={6}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card

                          style={{
                            width: "100%",
                            minHeight: "400px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            borderRadius: "12px",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                          }}
                          hoverable
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                          }}
                          cover={
                            <div
                              style={{

                                position: "relative",
                                borderRadius: "12px 12px 0 0",
                                overflow: "hidden",
                                height: "150px",
                              }}
                            >
                              <img
                                alt="supplier cover"
                                src={supplier.cover || "/images/default-cover.png"} // Safe fallback
                                style={{
                                  width: "100%",
                                  height: "180px",
                                  objectFit: "cover",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: 0,
                                  width: "100%",
                                  background: "rgba(0, 0, 0, 0.6)",
                                  color: "#fff",
                                  textAlign: "center",
                                  padding: "8px 0",
                                  fontWeight: "bold",
                                  fontSize: "15px",
                                  letterSpacing: "1px",
                                }}
                              >
                                {supplier.type || "Unknown Type"}
                              </div>
                            </div>
                          }
                          actions={[
                            <Button
                              type="default"
                              icon={<EditOutlined />}
                              onClick={() => handleEditSupplier(supplier)}
                              style={{
                                color: "green",
                                borderColor: "gray",
                                backgroundColor: "transparent",
                              }}
                            >
                              Edit
                            </Button>,

                            <Popconfirm title="Are you sure you want to delete this supplier?" okText="Yes" cancelText="No"
                              onConfirm={() => handleDeleteCategory(supplier)}>
                              <Button
                                type="default"
                                icon={<DeleteOutlined />}
                                style={{
                                  color: "red",
                                  borderColor: "red",
                                  backgroundColor: "transparent",
                                  transition: "transform 0.2s ease",
                                }}
                              >
                                Delete
                              </Button>
                            </Popconfirm>,
                          ]}
                        >
                          <Meta
                            avatar={<Avatar src={supplier.avatar || "/images/default-avatar.png"} size={50} />}
                            title={
                              <Space>
                                <Text strong style={{ fontSize: "16px" }}>
                                  {supplier.type || "Unknown Type"}
                                </Text>
                                <Tag color="blue">{supplier.country || "Unknown Country"}</Tag>
                              </Space>
                            }
                            description={
                              <div style={{ fontSize: "14px", lineHeight: "1.5", paddingTop: "8px" }}>
                                <Text strong>{supplier.contactName || "Unknown Contact"}</Text> <br />
                                <Text type="secondary">
                                  <MailOutlined style={{ marginRight: 5 }} /> {supplier.email || "No Email"}
                                </Text>{" "}
                                <br />
                                <Text type="secondary">
                                  <PhoneOutlined style={{ marginRight: 5 }} /> {supplier.phone || "No Phone"}
                                </Text>{" "}
                                <br />
                                <Text type="secondary">
                                  <EnvironmentOutlined style={{ marginRight: 5 }} /> {supplier.address || "No Address"}
                                </Text>
                              </div>
                            }
                          />
                        </Card>
                      </Col>
                    )}
                  </Draggable>
                ))}

              {provided.placeholder}
            </Row>
          )}
        </Droppable>
      </DragDropContext>

      <Modal
        title="Create New Supplier"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item name="type" label="Supplier Type" rules={[{ required: true }]}>
            <Select placeholder="Select Supplier Type">
              {supplierTypes.map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="contactName" label="Contact Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Country" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

        </Form>
      </Modal>

      <Modal
        title="Update Supplier"
        visible={isUpdateModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateFormSubmit}>
          <Form.Item name="type" label="Supplier Type" rules={[{ required: true }]}>
            <Select placeholder="Select Supplier Type">
              {supplierTypes.map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="contactName" label="Contact Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Country" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Suppliers;
