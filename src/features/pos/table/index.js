import React, { useState } from "react";
import { Button, Space, notification, Select, Modal, Input } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { SearchOutlined } from '@ant-design/icons';

const TableManagement = () => {
  const [tables, setTables] = useState([
    { id: 1, name: "T-01", status: "occupied", type: "dine-in", location: "indoor" },
    { id: 2, name: "T-02", status: "reserved", type: "dine-in", location: "outdoor" },
    { id: 3, name: "T-03", status: "available", type: "take-away", location: "outdoor" },
    { id: 4, name: "T-04", status: "occupied", type: "dine-in", location: "indoor" },
    { id: 5, name: "T-05", status: "available", type: "card-membership", location: "indoor" },
    { id: 6, name: "T-06", status: "reserved", type: "dine-in", location: "outdoor" },
    { id: 7, name: "T-07", status: "available", type: "take-away", location: "outdoor" },
  ]);

  const [filter, setFilter] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTableType, setNewTableType] = useState("");
  const [newTableLocation, setNewTableLocation] = useState("indoor");
  const [searchText, setSearchText] = useState("");
  const [editingTable, setEditingTable] = useState(null);

  // Handle adding a new table
  const handleAddTable = () => {
    setIsModalVisible(true);
    setEditingTable(null);
  };

  const handleCreateTable = () => {
    if (!newTableType) {
      notification.error({
        message: "Please select a table type",
        description: "You must select either Take Away, Card Membership, or Dine-In.",
      });
      return;
    }

    const newTable = {
      id: tables.length + 1,
      name: `T-0${tables.length + 1}`,
      status: "available",
      type: newTableType,
      location: newTableLocation,
    };
    setTables([...tables, newTable]);
    notification.success({
      message: "Table Added",
      description: `New table "${newTable.name}" for ${newTableType} has been added successfully.`,
    });

    setIsModalVisible(false);
    setNewTableType("");
    setNewTableLocation("indoor");
  };

  // Handle changing table status
  const handleChangeStatus = (id) => {
    setTables(tables.map((table) =>
      table.id === id ? {
        ...table,
        status: table.status === "available" ? "occupied" : table.status === "occupied" ? "reserved" : "available"
      } : table
    ));
    notification.success({
      message: `Table ${id} Status Changed`,
      description: `Table ${id} is now ${tables.find(table => table.id === id).status}.`,
    });
  };

  // Handle editing a table
  const handleEditTable = (table) => {
    setEditingTable(table);
    setNewTableType(table.type);
    setNewTableLocation(table.location);
    setIsModalVisible(true);
  };

  // Handle deleting a table
  const handleDeleteTable = (id) => {
    setTables(tables.filter(table => table.id !== id));
    notification.success({
      message: "Table Deleted",
      description: `Table ${id} has been deleted successfully.`,
    });
  };

  const tableColors = {
    available: "border-t-8 border-[#34D399]",   // Teal/Green for available
    occupied: "border-t-8 border-[#F87171]",    // Red/Orange for occupied
    reserved: "border-t-8 border-[#FBBF24]",    // Yellow/Gold for reserved
  };

  // Filter tables based on the selected status and search text
  const filteredTables = tables
    .filter(table => table.status === filter || filter === "all")
    .filter(table => table.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Restaurant Table Management</h2>
        <div className="flex items-center space-x-4">
          {/* Search bar */}
          <Input
            placeholder="Search tables..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-48 border-2 border-gray-300 rounded-lg focus:outline-none"
            prefix={<SearchOutlined />}
          />

          {/* Filter Dropdown for status */}
          <Select
            defaultValue="all"
            onChange={(value) => setFilter(value)}
            className="w-48"
            dropdownClassName="rounded-lg"
          >
            <Select.Option value="all">All Tables</Select.Option>
            <Select.Option value="available">Available</Select.Option>
            <Select.Option value="occupied">Occupied</Select.Option>
            <Select.Option value="reserved">Reserved</Select.Option>
            <Select.Option value="take-away">Take Away</Select.Option>
            <Select.Option value="card-membership">Card Membership</Select.Option>
            <Select.Option value="dine-in">Dine-In</Select.Option>
          </Select>

          {/* Button to add new table */}
          <Button
            type="default"
            icon={<PlusOutlined />}
            onClick={handleAddTable}
            className="bg-pink-500 text-white hover:bg-pink-600 transition-all duration-300 rounded-lg"
          >
            Add New Table
          </Button>
        </div>
      </div>

      {/* Table grid layout */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {filteredTables.map((table) => (
          <div
            key={table.id}
            className={`relative bg-white ${tableColors[table.status]} text-white flex flex-col justify-center items-center rounded-lg p-6 cursor-pointer hover:scale-105 hover:bg-gray-100 hover:shadow-lg transition-all`}
            onClick={() => handleChangeStatus(table.id)}
          >
            <div className="flex flex-col items-center">
              <div className="bg-white text-gray-700 rounded-full w-16 h-16 flex justify-center items-center mb-2 border-2 border-gray-300">
                <span className="font-semibold text-xl tracking-wider">{table.name}</span>
              </div>
              <span className="text-sm mt-2 uppercase font-semibold text-gray-700">{table.type.replace("-", " ")}</span>
              <span className="text-xs mt-1 text-gray-600 uppercase">{table.location}</span> {/* Show location */}
            </div>

            {/* Table Icons (Edit and Delete) */}
            <div className="absolute top-2 right-2 flex space-x-1">
              {/* Edit Icon */}
              <div className="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-200 transition-colors">
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTable(table);
                  }}
                  className="text-green-500 cursor-pointer text-lg hover:text-green-600 transition-colors"
                />
              </div>

              {/* Delete Icon */}
              <div className="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-200 transition-colors">
                <DeleteOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTable(table.id);
                  }}
                  className="text-red-500 cursor-pointer text-lg hover:text-red-600 transition-colors"
                />
              </div>
            </div>


          </div>
        ))}
      </div>

      {/* Modal for selecting the table type and location */}
      <Modal
        title={editingTable ? "Edit Table Type" : "Select Table Type"}
        visible={isModalVisible}
        onOk={handleCreateTable}
        onCancel={() => setIsModalVisible(false)}
        okText="Create"
        cancelText="Cancel"
      >
        <Select
          placeholder="Select table type"
          value={newTableType}
          onChange={setNewTableType}
          className="w-full"
        >
          <Select.Option value="take-away">Take Away</Select.Option>
          <Select.Option value="card-membership">Card Membership</Select.Option>
          <Select.Option value="dine-in">Dine-In</Select.Option>
        </Select>

        {/* New Select dropdown for location (indoor or outdoor) */}
        <Select
          placeholder="Select table location"
          value={newTableLocation}
          onChange={setNewTableLocation}
          className="w-full mt-4"
        >
          <Select.Option value="indoor">Indoor</Select.Option>
          <Select.Option value="outdoor">Outdoor</Select.Option>
        </Select>
      </Modal>
    </div>
  );
};

export default TableManagement;
