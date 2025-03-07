
import React, { useEffect, useState } from "react";
import { Button, Space, notification, Select, Modal, Input, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { SearchOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable, } from "react-beautiful-dnd";

import { createTable, fetchTable, deleteTablesById, updateTables } from "../../../api/table/table";


const TableManagement = () => {


  const [filter, setFilter] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTableType, setNewTableType] = useState("");
  const [newTableLocation, setNewTableLocation] = useState("indoor");
  const [searchText, setSearchText] = useState("");
  const [editingTable, setEditingTable] = useState(null);
  const [selectedTables, setSelectedTables] = useState([]);
  const [tables, setTables] = useState([]);
  const token = localStorage.getItem("token");

  

  const handleAddTable = () => {
    setIsModalVisible(true);
    setEditingTable(null);
  };

  const handleMergeTables = () => {
    if (selectedTables.length !== 2) {
      notification.error({
        message: "Merge Error",
        description: "Select exactly two tables to merge.",
      });
      return;
    }

    const [table1, table2] = selectedTables;

    if (table1.location !== table2.location) {
      notification.error({
        message: "Merge Error",
        description: "Tables must be in the same location.",
      });
      return;
    }

    if (table1.merged || table2.merged) {
      notification.error({
        message: "Merge Error",
        description: "Cannot merge tables that are already merged.",
      });
      return;
    }

    const mergedTable = {
      id: table1.id,
      name: `${table1.name}-${table2.name}`,
      status: table1.status === "available" && table2.status === "available" ? "available" : "occupied",
      type: table1.type,
      location: table1.location,
      merged: [table1, table2],
    };

    setTables((prevTables) =>
      prevTables.filter((t) => t.id !== table2.id).map((t) => (t.id === table1.id ? mergedTable : t))
    );

    setSelectedTables([]);
    notification.success({
      message: "Tables Merged",
      description: `Tables ${table1.name} and ${table2.name} merged successfully.`,
    });
  };

  const handleSplitTable = (table) => {
    if (!table.merged) {
      notification.error({
        message: "Split Error",
        description: "This table is not merged.",
      });
      return;
    }

    setTables((prevTables) => [...prevTables.filter((t) => t.id !== table.id), ...table.merged]);

    notification.success({
      message: "Table Split",
      description: `Table ${table.name} split into separate tables.`,
    });
  };

  // const handleCreateTable = async () => {
  //   if (!newTableType) {
  //     notification.error({
  //       message: "Please select a table type",
  //       description: "You must select either Take Away, Card Membership, or Dine-In.",
  //     });
  //     return;
  //   }

  //   const newTable = {
  //     name: `T-0${tables.length + 1}`,
  //     status: "available",
  //     type: newTableType,
  //     location: newTableLocation,
  //   };

  //   try {
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       notification.error({
  //         message: "Authentication Error",
  //         description: "You must be logged in to create a table.",
  //       });
  //       return;
  //     }

  //     const response = await createTable(newTable, token);

  //     if (response.error) {
  //       notification.error({
  //         message: "Error",
  //         description: response.error,
  //       });
  //     } else {
  //       setTables([...tables, response]);
  //       notification.success({
  //         message: "Table Added",
  //         description: `New table "${response.name}" for ${response.type} has been added successfully.`,
  //       });
  //       setIsModalVisible(false);
  //     }
  //   } catch (error) {
  //     console.error("❌ Error creating table:", error);
  //     notification.error({
  //       message: "Error",
  //       description: "An error occurred while creating the table.",
  //     });
  //   }
  // };
  const handleCreateTable = async () => {
    // Validate table type and location
    if (!newTableType || !newTableLocation) {
      notification.error({
        message: "Missing Information",
        description: "You must select both table type and location.",
      });
      return;
    }

    const newTable = {
      name: `T-0${tables.length + 1}`,
      status: "available",
      type: newTableType,
      location: newTableLocation,
    };

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        notification.error({
          message: "Authentication Error",
          description: "You must be logged in to create a table.",
        });
        return;
      }

      const response = await createTable(newTable, token);

      if (response.error) {
        notification.error({
          message: "Error",
          description: response.error,
        });
      } else {
        setTables([...tables, response]);
        notification.success({
          message: "Table Added",
          description: `New table "${response.name}" for ${response.type} has been added successfully.`,
        });
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("❌ Error creating table:", error);
      notification.error({
        message: "Error",
        description: "An error occurred while creating the table.",
      });
    }
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

  const handledeleteTables = async (id) => {
    if (!id) {
      console.error("❌ Invalid Table ID:", id);
      notification.error({
        message: "Delete Error",
        description: "Invalid table ID. Cannot delete.",
      });
      return;
    }

    try {
      const response = await deleteTablesById(id, token); // Call delete API function

      if (response.success) {
        await handlefetchTables();
        notification.success({
          message: "Table Deleted",
          description: response.message,
        });
      } else {
        notification.error({
          message: "Failed to delete Table",
          description: response.error || "An unknown error occurred.",
        });
      }
    } catch (error) {
      console.error("❌ Error deleting table:", error);
      notification.error({
        message: "Delete Error",
        description: "An error occurred while deleting the table.",
      });
    }
  };

  const handleUpdateTable = async () => {
    if (!editingTable || !newTableType || !newTableLocation) {
      notification.error({
        message: "Update Error",
        description: "Please select both table type and location.",
      });
      return;
    }

    try {
      const updatedTable = {
        name: editingTable.name,
        status: editingTable.status,
        type: newTableType,
        location: newTableLocation,
      };

      const response = await updateTables(editingTable.id, updatedTable, token);

      if (response.error) {
        notification.error({
          message: "Update Failed",
          description: response.error,
        });
      } else {
        setTables((prevTables) =>
          prevTables.map((t) => (t.id === editingTable.id ? response : t))
        );
        notification.success({
          message: "Table Updated",
          description: `Table "${response.name}" has been updated successfully.`,
        });
        setIsModalVisible(false);
        setEditingTable(null);
      }
    } catch (error) {
      console.error("❌ Error updating table:", error);
      notification.error({
        message: "Update Error",
        description: "An error occurred while updating the table.",
      });
    }
  };


  const handleEditTable = (table) => {
    setEditingTable(table);
    setNewTableType(table.type);
    setNewTableLocation(table.location);
    setIsModalVisible(true);
  };


  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTables = [...tables];
    const [movedTable] = reorderedTables.splice(result.source.index, 1);
    reorderedTables.splice(result.destination.index, 0, movedTable);

    setTables(reorderedTables);
  };

  const tableColors = {
    available: "border-t-8 border-[#34D399]",
    occupied: "border-t-8 border-[#F87171]",
    reserved: "border-t-8 border-[#FBBF24]",
  };

  const handleSelectTable = (table) => {
    setSelectedTables((prev) => {
      if (prev.includes(table)) {
        return prev.filter((t) => t !== table);
      } else {
        return prev.length < 2 ? [...prev, table] : prev;
      }
    });
  };


  const filteredTables = tables.filter((table) => {
    const matchesStatus = filter === "all" || table.status === filter;
    const matchesType = ["take-away", "card-membership", "dine-in"].includes(filter)
      ? table.type === filter
      : true;
    const matchesSearch = table.name && table.name.toLowerCase().includes(searchText.toLowerCase());

    return (matchesStatus || matchesType) && matchesSearch;
  });


  useEffect(() => {
    handlefetchTables();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Table List</h2>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search tables..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-48 border-2 border-gray-300 rounded-lg focus:outline-none"
            prefix={<SearchOutlined />}
          />
          <Button type="default" onClick={handleMergeTables} className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 rounded-lg">
            Merge Tables
          </Button>
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

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tables">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4"
            >
              {filteredTables.map((table, index) => (
                <Draggable key={table.id} draggableId={String(table.id)} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative bg-white ${tableColors[table.status]} text-white flex flex-col justify-center items-center rounded-lg p-6 cursor-pointer hover:scale-105 hover:bg-gray-100 hover:shadow-lg transition-all`}
                      onClick={() => handleSelectTable(table)}
                    >
                      <div className="flex flex-col items-center">
                        <div className="bg-white text-gray-700 rounded-full w-16 h-16 flex justify-center items-center mb-2 border-2 border-gray-300">
                          <span className="font-semibold text-xl tracking-wider">{table.name}</span>
                        </div>
                        <span className="text-sm mt-2 uppercase font-semibold text-gray-700">{table.type.replace("-", " ")}</span>
                        <span className="text-xs mt-1 text-gray-600 uppercase">{table.location}</span>
                      </div>

                      {selectedTables.includes(table) && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs shadow-md">
                          Selected
                        </div>
                      )}

                      {table.merged && (
                        <Button
                          className="absolute bottom-2 text-xs text-white bg-red-500 px-2 py-1 rounded-lg shadow-md hover:bg-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSplitTable(table);
                          }}
                        >
                          Split Table
                        </Button>
                      )}

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

                        <Popconfirm title="Are you sure you want to delete this supplier?" okText="Yes" cancelText="No"
                          onConfirm={() => handledeleteTables(table.id)}>
                          <div className="p-1 rounded-full bg-white border border-gray-300 hover:bg-gray-200 transition-colors">
                            <DeleteOutlined
                              onClick={(e) => {
                                e.stopPropagation();

                              }}
                              className="text-red-500 cursor-pointer text-lg hover:text-red-600 transition-colors"
                            />
                          </div>
                        </Popconfirm>,
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* <Modal
        title={editingTable ? "Edit Table" : "Create New Table"}
        visible={isModalVisible}
        onOk={editingTable ? handleUpdateTable : handleCreateTable}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTable(null);
        }}
        okText={editingTable ? "Update" : "Create"}
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
        <Select
          placeholder="Select table location"
          value={newTableLocation}
          onChange={setNewTableLocation}
          className="w-full mt-4"
        >
          <Select.Option value="indoor">Indoor</Select.Option>
          <Select.Option value="outdoor">Outdoor</Select.Option>
        </Select>
      </Modal> */}

      <Modal
        title={editingTable ? "Edit Table" : "Create New Table"}
        visible={isModalVisible}
        onOk={editingTable ? handleUpdateTable : handleCreateTable}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTable(null);
        }}
        okText={editingTable ? "Update" : "Create"}
        cancelText="Cancel"
      >
        <Select
          placeholder="Select table type"
          value={newTableType}
          onChange={setNewTableType}
          className="w-full"
        >
          <Select.Option value="take-away">Take Away</Select.Option>
          {/* <Select.Option value="card-membership">Card Membership</Select.Option> */}
          <Select.Option value="dine-in">Dine-In</Select.Option>
        </Select>

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
