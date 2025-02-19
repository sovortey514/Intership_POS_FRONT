import React, { useState } from "react";
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
  const [form] = Form.useForm();

  // Handle search input
  const handleSearch = (event) => {
    setSearchText(event.target.value.toLowerCase());
  };

  // Handle Create Supplier Button Click
  const handleCreateSupplier = () => {
    setIsModalVisible(true);
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
    form.resetFields();
  };

  const handleFormSubmit = (values) => {
    const matchedCover = coverImages[values.type] || coverImages["Default"];
    const newSupplier = {
      id: (suppliers.length + 1).toString(),
      ...values,
      avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${suppliers.length + 1}`,
      cover: matchedCover,
    };
    setSuppliers([...suppliers, newSupplier]);
    setIsModalVisible(false);
    form.resetFields();
  };



  // Handle drag & drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(suppliers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSuppliers(items);
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      {/* Header Section with Button & Search */}
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
                  supplier.type.toLowerCase().includes(searchText)
                )
                .map((supplier, index) => (
                  <Draggable key={supplier.id} draggableId={supplier.id} index={index}>
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
                            cursor: "pointer",
                            borderRadius: "12px",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                          }}
                          hoverable // Enables hover effect
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)"; // Pop-up effect
                            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)"; // Enhanced shadow
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)"; // Reset size
                            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"; // Reset shadow
                          }} // Enables hover effect
                          cover={
                            <div
                              style={{
                                position: "relative",
                                borderRadius: "12px 12px 0 0",
                                overflow: "hidden",
                              }}
                            >
                              <img
                                alt="supplier cover"
                                src={supplier.cover}
                                style={{
                                  width: "100%",
                                  height: "180px",
                                  objectFit: "cover",
                                  transition: "transform 0.3s ease", // Only scale, no blur
                                }}
                              />
                              {/* Overlay effect with no opacity changes on hover */}
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
                                {supplier.type}
                              </div>
                            </div>
                          }
                          actions={[
                            <Button
                              type="default"
                              icon={<EditOutlined />}
                              style={{
                                color: "green",
                                borderColor: "gray",
                                backgroundColor: "transparent",
                                transition: "transform 0.2s ease",
                              }}
                            >
                              Edit
                            </Button>,
                            <Popconfirm title="Are you sure you want to delete this supplier?" okText="Yes" cancelText="No">
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
                            avatar={<Avatar src={supplier.avatar} size={50} />}
                            title={
                              <Space>
                                <Text strong style={{ fontSize: "16px" }}>{supplier.type}</Text>
                                <Tag color="blue">{supplier.country}</Tag>
                              </Space>
                            }
                            description={
                              <div style={{ fontSize: "14px", lineHeight: "1.5", paddingTop: "8px" }}>
                                <Text strong>{supplier.contact_name}</Text> <br />
                                <Text type="secondary">
                                  <MailOutlined style={{ marginRight: 5 }} /> {supplier.email}
                                </Text>{" "}
                                <br />
                                <Text type="secondary">
                                  <PhoneOutlined style={{ marginRight: 5 }} /> {supplier.phone}
                                </Text>{" "}
                                <br />
                                <Text type="secondary">
                                  <EnvironmentOutlined style={{ marginRight: 5 }} /> {supplier.address}
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

      {/* Create Supplier Modal */}
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

          <Form.Item name="contact_name" label="Contact Name" rules={[{ required: true }]}>
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
