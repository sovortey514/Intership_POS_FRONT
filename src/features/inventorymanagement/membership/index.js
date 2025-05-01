import React, { useEffect, useState } from "react";
import { Table, Button, Space, Card, Input, Popconfirm, Tag, Modal, Form, notification } from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, DollarCircleOutlined } from "@ant-design/icons";
import { Select ,message } from "antd";

import {
  createmembership,
  fetchMembership,
  updateMembership,
  deleteMembershipById


} from "../../../api/membership/memberships";
function MembershipList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [membershipData, setMembershipData] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [amountToAdd, setAmountToAdd] = useState("");


  const token = localStorage.getItem("token");


  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newMember, setNewMember] = useState({
    membershipId: "",
    name: "",
    gender: "",
    membershipType: "",
    balance: 0,
  });

  const [viewMember, setViewMember] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  const showViewModal = (member) => {
    setViewMember(member);
    setIsViewModalVisible(true);
  };

  const [editMember, setEditMember] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);


  const showEditModal = (member) => {
    setEditMember(member);
    setIsEditModalVisible(true);
  };

  const handleUpdateMember = async () => {
    if (!editMember.membershipId || !editMember.name || !editMember.gender || !editMember.membershipType) {
      alert("⚠️ All fields are required!");
      return;
    }

    try {
      const response = await updateMembership(editMember.id, editMember, token);

      if (!response) {
        alert("❌ Error: Failed to update membership");
      } else {

        setMembershipData(membershipData.map((m) => (m.id === editMember.id ? response : m)));
        // setIsEditModalVisible(false);
      }
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("❌ Error updating membership:", error);
      alert("❌ Failed to update membership. Please try again.");
    }
  };


  const handleAddMoney = () => {
    if (!amountToAdd || isNaN(amountToAdd) || parseFloat(amountToAdd) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setMembershipData((prevData) =>
      prevData.map((member) =>
        member.membershipId === selectedMember.membershipId
          ? { ...member, balance: member.balance + parseFloat(amountToAdd) }
          : member
      )
    );

    setIsModalVisible(false);
    setAmountToAdd("");
  };

  const showAddMoneyModal = (member) => {
    setSelectedMember(member);
    setIsModalVisible(true);
  };

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleDeleteMembership = async (record, token) => {
    try {
      const token = localStorage.getItem("token");
      await deleteMembershipById(record.id, token);
      message.success("Membership deleted successfully.");
      
      // Remove deleted membership from state
      setMembershipData((prevData) =>
        prevData.filter((m) => m.id !== record.id)
      );
    } catch (error) {
      message.error("Failed to delete membership. Please try again.");
      console.error("Delete error:", error);
    }
  };

  const handleCreateMember = async () => {

    if (!newMember.membershipId || !newMember.name || !newMember.gender || !newMember.membershipType) {
      alert("⚠️ All fields are required!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Unauthorized: No authentication token found!");
      return;
    }

    try {
      const response = await createmembership(newMember, token);

      if (!response || response.error) {
        alert(`❌ Error: ${response.error || "Failed to create membership"}`);
      } else {
        alert("✅ Membership created successfully!");

        setMembershipData([...membershipData, { ...response, key: String(membershipData.length + 1) }]);
        // setIsCreateModalVisible(false);


        setNewMember({
          membershipId: "",
          name: "",
          gender: "",
          membershipType: "",
          balance: 0,
        });
      } setIsCreateModalVisible(false);

    } catch (error) {
      console.error("❌ Error creating membership:", error);
      alert("❌ Failed to create membership. Please try again.");
    }
  };

  const handlefetchMemberships = async () => {
    try {

      const token = localStorage.getItem("token");
      const result = await fetchMembership(token);
    
      if (result) {
        setMembershipData(result);
      } else {
        notification.error({
          message: "Failed to fetch Memberships",
          description: "There was an issue fetching Memberships.",
        });
      }
    } catch (error) {
      console.error("Error fetching Memberships:", error);
      notification.error({
        message: "Error fetching Memberships",
        description:
          error.message || "An error occurred while fetching Memberships.",
      });
    }
  };

  useEffect(() => {
    handlefetchMemberships();
  }, [])




  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      width: 60,
      render: (_, __, index) => index + 1, // Display row number dynamically
    },
    { title: "Membership ID", dataIndex: "membershipId", key: "membershipId", width: 120 },
    { title: "Name", dataIndex: "name", key: "name", width: 150 },
    { title: "Gender", dataIndex: "gender", key: "gender", width: 100 },
    { title: "Membership Type", dataIndex: "membershipType", key: "membershipType", width: 120 },
    {
      title: "Balance ($)",
      dataIndex: "balance",
      key: "balance",
      width: 120,
      render: (balance) => <Tag color="blue">${balance.toFixed(2)}</Tag>,
    },
    {
      title: "Actions",
      key: "action",
      width: 250,
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} style={{ color: "blue" }} onClick={() => showViewModal(record)}>View</Button>
          <Button icon={<EditOutlined />} style={{ color: "green" }} onClick={() => showEditModal(record)}>Edit</Button>
          {/* <Button icon={<DollarCircleOutlined />} onClick={() => showAddMoneyModal(record)} style={{ color: "orange" }}>Add Money</Button> */}
          <Popconfirm
            title="Are you sure you want to delete this membership?"
            onConfirm={() => handleDeleteMembership(record, token)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} style={{ color: "red" }}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <Space>
              <span style={{ fontWeight: "bold", fontSize: "16px" }}>Membership Management</span>
            </Space>
            <Space>
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined />}
                allowClear
                style={{ width: 250 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal} style={{ backgroundColor: "#ff1493", borderColor: "#ff1493", color: "white" }}
              >
                Create
              </Button>
            </Space>
          </div>
        }
        bordered={false}
        style={{ borderRadius: "10px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", padding: "16px" }}
      >

        <Table columns={columns} dataSource={membershipData} bordered pagination={{ pageSize: 5 }} />

      </Card>

      <Modal
        title="Create New Membership"
        open={isCreateModalVisible}
        onOk={handleCreateMember}
        onCancel={() => setIsCreateModalVisible(false)}
        okButtonProps={{ style: { backgroundColor: "#ff1493", borderColor: "#ff1493", color: "white" } }}
      >
        <Form layout="vertical">
          <Form.Item label="Membership ID" required>
            <Input
              value={newMember.membershipId}
              onChange={(e) => setNewMember({ ...newMember, membershipId: e.target.value })}
              placeholder="Enter Membership ID"
            />
          </Form.Item>

          <Form.Item label="Name" required>
            <Input
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              placeholder="Enter Name"
            />
          </Form.Item>

          <Form.Item label="Gender" required>
            <Select
              value={newMember.gender}
              onChange={(value) => setNewMember({ ...newMember, gender: value })}
              placeholder="Select Gender"
            >
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Membership Type" required>
            <Select
              value={newMember.membershipType}
              onChange={(value) => {
                let balance = 0;
                if (value === "Standard") balance = 100;
                else if (value === "Premium") balance = 200;
                else if (value === "VIP") balance = 300;

                setNewMember({ ...newMember, membershipType: value, balance: balance });
              }}
              placeholder="Select Membership Type"
            >
              <Select.Option value="Standard">Standard</Select.Option>
              <Select.Option value="Premium">Premium</Select.Option>
              <Select.Option value="VIP">VIP</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Balance ($)" required>
            <Input
              type="number"
              value={newMember.balance}
              disabled
              placeholder="Balance will be set automatically"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Membership Details"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
      >
        {viewMember && (
          <Form layout="vertical">
            <Form.Item label="Membership ID">
              <Input value={viewMember.membershipId} disabled />
            </Form.Item>

            <Form.Item label="Name">
              <Input value={viewMember.name} disabled />
            </Form.Item>

            <Form.Item label="Gender">
              <Select value={viewMember.gender} disabled>
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Membership Type">
              <Select value={viewMember.membershipType} disabled>
                <Select.Option value="Standard">Standard</Select.Option>
                <Select.Option value="Premium">Premium</Select.Option>
                <Select.Option value="VIP">VIP</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Balance ($)">
              <Input type="number" value={viewMember.balance.toFixed(2)} disabled />
            </Form.Item>
          </Form>
        )}
      </Modal>

      <Modal
        title="Edit Membership"
        open={isEditModalVisible}
        onOk={handleUpdateMember}
        onCancel={() => setIsEditModalVisible(false)}
        okButtonProps={{ style: {  backgroundColor: "#ec4899", borderColor: "#ec4899", color: "white" } }}
      >
        {editMember && (
          <Form layout="vertical">
            <Form.Item label="Membership ID">
              <Input value={editMember.membershipId} onChange={(e) => setEditMember({ ...editMember, membershipId: e.target.value })} />
            </Form.Item>

            <Form.Item label="Name">
              <Input value={editMember.name} onChange={(e) => setEditMember({ ...editMember, name: e.target.value })} />
            </Form.Item>

            <Form.Item label="Gender">
              <Select value={editMember.gender} onChange={(value) => setEditMember({ ...editMember, gender: value })}>
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Membership Type">
              <Select
                value={editMember.membershipType}
                onChange={(value) => {
                  let balance = 0;
                  if (value === "Standard") balance = 100;
                  else if (value === "Premium") balance = 200;
                  else if (value === "VIP") balance = 300;

                  setEditMember({ ...editMember, membershipType: value, balance: balance });
                }}
              >
                <Select.Option value="Standard">Standard</Select.Option>
                <Select.Option value="Premium">Premium</Select.Option>
                <Select.Option value="VIP">VIP</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Balance ($)">
              <Input type="number" value={editMember.balance.toFixed(2)} onChange={(e) => setEditMember({ ...editMember, balance: parseFloat(e.target.value) || 0 })} />
            </Form.Item>
          </Form>
        )}
      </Modal>

    </div>
  );
}

export default MembershipList;
