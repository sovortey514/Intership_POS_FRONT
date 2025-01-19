import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Dropdown,
  Menu,
  notification,
  Space,
  Tag,
  Table,
  List,
  Spin,
  Card,
  DatePicker,
} from "antd";
import { DownOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import {
  EditableProTable,
  ProCard,
  ProFormField,
} from "@ant-design/pro-components";
const { Option } = Select;

const TotalAsset = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // 'building', 'department', or 'room'
  const [form] = Form.useForm();
  const [buildings, setBuildings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [assetHolders, setAssetHolder] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("Select Building");
  const [selectedDepartment, setSelectedDepartment] =
    useState("Select Department");
  const [selectedRoom, setSelectedRoom] = useState("Select Room");
  const [selectedAssetHolder, setSelectedAssetHolder] = useState(
    "Select Asset Holder"
  );
  const [showAssetDetails, setShowAssetDetails] = useState(false);

  const [editBuilding, setEditBuilding] = useState(null);
  const [editDepartment, setEditDepartment] = useState(null);
  const [editRoom, setEditRoom] = useState(null);
  const [editAssetHolder, setEditAssetHolder] = useState(null);
  const [fixedAssetCounts2, setFixedAssetcount] = useState([]);

  const [fixedassetwithdepartment, setFixedAssetwithdepartment] =
    useState(null);
  const [data, setData] = useState([]);
  const [assetById, setAssetById] = useState([]);
  const [departmentId, setDepartmentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fixedAssetDetail, setFixedAssetDetail] = useState(null);

  const [role, setRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAssetHolders, setFilteredAssetHolders] =
    useState(assetHolders); // Assume assetHolders is an array of asset holder objects
  // const [selectedAssetHolder, setSelectedAssetHolder] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
    fetchAssetCount();
    fetchAssetDetails();
    fetchUserByusername();
  }, []);

  useEffect(() => {
    const filtered = assetHolders.filter((assetHolder) =>
      assetHolder.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAssetHolders(filtered);
  }, [searchTerm, assetHolders]);

  const handleSelectAssetHolder = (assetHolder) => {
    setSelectedAssetHolder(assetHolder);
    setSearchTerm(assetHolder.name); // Set the input value to the selected asset holder name
  };

  const fetchUserByusername = async () => {
    try {
      const user = localStorage.getItem("username");
      const response = await fetch(`http://localhost:6060/auth/user/${user}`);
      if (response.ok) {
        const userData = await response.json();

        setRole(userData.role);
      } else {
        console.error("Failed to fetch user:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "key",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      key: "department",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Count Date",
      dataIndex: "countDate",
      key: "count date",
    },
    {
      title: "Count By",
      dataIndex: "countBy",
      key: "count by",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          className="bg-white hover:bg-yellow-500 text-yellow-500 border-none rounded-full p-2 shadow-md"
          onClick={() => handleViewClick(record)}
        />
      ),
    },
  ];
  const handleViewClick = (record) => {
    setModalType("fixedAssetDetail"); // Set the modal type to fixed asset detail
    setIsModalVisible(true); // Show the modal
    fetchAssetDetails(record.id); // Fetch details for the selected asset
  };

  const handleSearchClick = () => {
    console.log("Search Term:", searchTerm);
  };

  useEffect(() => {
    if (departmentId) {
      const fetchAssets = async () => {
        setLoading(true);
        try {
          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          };

          // Log the departmentId and headers for debugging
          // console.log("Fetching assets for departmentId:", departmentId);
          // console.log("Headers:", headers);

          const response = await fetch(
            `http://localhost:6060/admin/getFixedAssetsByDepartment/${departmentId}`,
            {
              method: "GET",
              headers,
            }
          );

          if (response.ok) {
            const assetDetails = await response.json();
            setAssetById(assetDetails.fixedAssets || []);
            setEditableRowKeys(assetDetails.fixedAssets.map((item) => item.id));
          } else {
            const errorData = await response.json();

            console.error("Error Response Data:", errorData);

            notification.error({
              message: "Failed to Fetch Asset Details",
              description:
                errorData.message ||
                "There was an error fetching the asset details.",
            });
          }
        } catch (error) {
          console.error("Error fetching asset details:", error);

          notification.error({
            message: "Failed to Fetch Asset Details",
            description: "There was an error fetching the asset details.",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchAssets();
    }
  }, [departmentId, token]);

  // useEffect(() => {
  //   const lowercasedTerm = searchTerm.toLowerCase();
  //   const filtered = assetHolders.filter((holder) =>
  //     holder.name.toLowerCase().includes(lowercasedTerm)
  //   );
  //   const filteruser = fixedAssetDetail?.map((r) =>
  //     r.assetHolder.name.toLowerCase().includes(lowercasedTerm)
  //   );

  //   // Log the original asset holder names for debugging
  //   console.log(
  //     "Original asset holder names:",
  //     fixedAssetDetail?.map((r) => r.assetHolder.name.toLowerCase())
  //   );

  //   // Filter the fixedAssetDetail array
  //   const filteredUsers = fixedAssetDetail?.filter((r) =>
  //     r.assetHolder.name.toLowerCase().includes(lowercasedTerm)
  //   );

  //   // Log the filtered results
  //   console.log("Filtered users:", filteredUsers);
  //   setFilteredAssetHolders(filtered);
  //   setFixedAssetDetail(filteredUsers);
  // }, [searchTerm, assetHolders]);

  const [fixedAssetCountData, setFixedAssetCountData] = useState([]);
  const fetchAssetCount = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(
        "http://localhost:6060/admin/getcreatecount",
        { headers }
      );
      const result = await response.json();

      if (response.ok && result.statusCode === 200) {
        // Transform the API data to match the table columns
        const transformedData = result.fixedAssetCounts2.map((item) => ({
          key: item.id,
          departmentName: item.department.name, // Assuming department name is to be displayed
          countDate: new Date(item.createdAt).toLocaleDateString(), // Format date as needed
          countBy: item.createdBy,
          remark: "", // Assuming there's no remark in the provided data
        }));

        setFixedAssetCountData(transformedData);
      } else {
        notification.error({
          message: "Failed to fetch fixed assets",
          description: result.error || "Unexpected error occurred.",
        });
      }
    } catch (error) {
      console.error("Error fetching fixed assets:", error);
    }
  };

  const fetchAssetDetails = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Ensure token is correctly defined
      };
      const response = await fetch(
        "http://localhost:6060/admin/getcreatedetail",
        { headers }
      );
      const result = await response.json();

      if (response.ok && result.statusCode === 200) {
        if (result.fixedAssetDetails) {
          setFixedAssetDetail(result.fixedAssetDetails);
          console.log(result.fixedAssetDetails); // Log the result to check its structure
        } else {
          console.warn("Fixed asset details not found in the response.");
        }
      } else {
        notification.error({
          message: "Failed to fetch fixed asset details",
          description: result.message || "Unexpected error occurred.",
        });
      }
    } catch (error) {
      console.error("Error fetching fixed asset details:", error);
    }
  };

  const fetchData = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Fetch buildings
      let response = await fetch(
        "http://localhost:6060/admin/getAllBuildings",
        {
          headers,
        }
      );
      let data = await response.json();
      if (response.ok) setBuildings(data.buildings || []);

      // Fetch departments
      response = await fetch("http://localhost:6060/admin/getAllDepartments", {
        headers,
      });
      data = await response.json();
      if (response.ok) setDepartments(data.departments || []);
      console.log(departments);

      // Fetch rooms
      response = await fetch("http://localhost:6060/admin/getAllRooms", {
        headers,
      });
      data = await response.json();
      if (response.ok) setRooms(data.rooms || []);

      // Fetch asset holders
      response = await fetch("http://localhost:6060/admin/getallassetholders", {
        headers,
      });
      data = await response.json();
      if (response.ok) setAssetHolder(data.assetHolders || []);

      // // Fetch fixed asset count
      // response = await fetch("http://localhost:6060/admin/getcreatecount", {
      //   headers,
      // });
      // data = await response.json();
      // if (data.statusCode === 200) {
      //   console.log(data.fixedAssetCount);
      //   setFixedAssetcount(data.fixedAssetCount || []);
      //   console.log(data.fixedAssetCount);
      // } else {
      //   notification.error({
      //     message: "Failed to fetch fixed assets",
      //     description: data.error,
      //   });
      // }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const showModal = (type) => {
    setModalType(type);
    form.resetFields(); // Reset form fields when opening the modal
    setIsModalVisible(true);
    setEditBuilding(null);
    setEditDepartment(null);
    setEditRoom(null);
    setEditAssetHolder(null);
    setFixedAssetDetail(null);
  };

  const handleEditBuilding = (building) => {
    setModalType("building");
    setEditBuilding(building);
    form.setFieldsValue({
      name: building.name,
    });
    setIsModalVisible(true);
  };
  const handleEditDepartment = (department) => {
    console.log(department.building.name);
    setModalType("department");
    setEditDepartment(department);
    form.setFieldsValue({
      name: department.name,
      building: department.building.id,
      floorNumber: department.floorNumber,
      description: department.description,
    });
    setIsModalVisible(true);
  };

  const handleEditRoom = (room) => {
    setModalType("room");
    setEditRoom(room);
    form.setFieldsValue({
      name: room.name,
      building: room.building.id,
      department: room.department.id,
      floorNumber: room.floorNumber,
      description: room.description,
    });
    setIsModalVisible(true);
  };

  const handleEditAssetHolder = (assetholder) => {
    setModalType("assetholder");
    setEditAssetHolder(assetholder);
    form.setFieldsValue({
      name: assetholder.name,
      department: assetholder.department.id, // Assuming department is an object with an id field
      email: assetholder.email, // Example field, adjust based on your form structure
      phoneNumber: assetholder.phoneNumber, // Example field, adjust based on your form structure
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // Validate form fields
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      console.log("Form Values:", values);
      let response;
      let data;

      if (modalType === "building") {
        if (editBuilding) {
          // Edit existing building
          response = await fetch(
            `http://localhost:6060/admin/updateBuilding/${editBuilding.id}`,
            {
              method: "PUT",
              headers,
              body: JSON.stringify(values),
            }
          );

          data = await response.json();
          if (response.ok) {
            setBuildings((prevBuildings) =>
              prevBuildings.map((building) =>
                building.id === editBuilding.id
                  ? { ...building, ...values }
                  : building
              )
            );
            setSelectedBuilding(data.building.name); // Update selection
            notification.success({
              message: "Building updated successfully!",
              duration: 1,
            });
            setIsModalVisible(false);
          } else {
            throw new Error(data.error || "Failed to update building");
          }
        } else {
          // Create new building
          response = await fetch("http://localhost:6060/admin/createBuilding", {
            method: "POST",
            headers,
            body: JSON.stringify(values),
          });

          data = await response.json();

          if (response.ok) {
            setBuildings([...buildings, data.building]); // Update state
            setSelectedBuilding(data.building.name); // Update selection
            notification.success({
              message: "Building created successfully!",
              duration: 1,
            });
            setIsModalVisible(false);
          } else {
            throw new Error(data.error || "Failed to create building");
          }
        }
      } else if (modalType === "department") {
        if (editDepartment) {
          // Edit existing department
          response = await fetch(
            `http://localhost:6060/admin/updateDepartment/${editDepartment.id}`,
            {
              method: "PUT",
              headers,
              body: JSON.stringify({
                ...values,
                building: { id: values.building },
              }),
            }
          );

          data = await response.json();
          if (response.ok) {
            setDepartments((prevDepartments) =>
              prevDepartments.map((department) =>
                department.id === editDepartment.id
                  ? { ...department, ...values }
                  : department
              )
            );
            setSelectedDepartment(data.department.name);
            notification.success({
              message: "Department updated successfully!",
              duration: 1,
            });
            setIsModalVisible(false);
          } else {
            throw new Error(data.error || "Failed to update department");
          }
        } else {
          response = await fetch(
            "http://localhost:6060/admin/createDepartment",
            {
              method: "POST",
              headers,
              body: JSON.stringify({
                ...values,
                building: { id: values.building },
              }),
            }
          );

          data = await response.json();

          if (response.ok && data.department) {
            setDepartments((prev) => [...prev, data.department]);
            setSelectedDepartment(data.department.name);
            notification.success({
              message: "Department created successfully!",
              duration: 1,
            });
            setIsModalVisible(false);
          } else {
            throw new Error(data.error || "Failed to create department");
          }
        }
      } else if (modalType === "room") {
        if (editRoom) {
          // Edit existing room
          response = await fetch(
            `http://localhost:6060/admin/updateRoom/${editRoom.id}`,
            {
              method: "PUT",
              headers,
              body: JSON.stringify({
                ...values,
                department: { id: values.department },
                building: { id: values.building },
              }),
            }
          );

          data = await response.json();
          if (response.ok) {
            setRooms((prevRooms) =>
              prevRooms.map((room) =>
                room.id === editRoom.id ? { ...room, ...values } : room
              )
            );
            setSelectedRoom(data.room.name); // Update selection
            notification.success({
              message: "Room updated successfully!",
              duration: 1,
            });
            setIsModalVisible(false);
          } else {
            throw new Error(data.error || "Failed to update room");
          }
        } else {
          // Create new room
          response = await fetch("http://localhost:6060/admin/createRoom", {
            method: "POST",
            headers,
            body: JSON.stringify({
              ...values,
              department: { id: values.department },
              building: { id: values.building },
            }),
          });

          data = await response.json();
          if (response.ok && data.room) {
            // setRooms([...rooms, data.room]); // Update state
            setSelectedRoom(data.room.name); // Update selection
            notification.success({
              message: "Room created successfully!",
              duration: 1,
            });
            setIsModalVisible(false);
          } else {
            throw new Error(data.error || "Failed to create room");
          }
        }
      } else if (modalType === "assetholder") {
        if (editAssetHolder) {
          // Edit existing asset holder
          response = await fetch(
            `http://localhost:6060/admin/updateassetholderbyId/${editAssetHolder.id}`,
            {
              method: "PUT",
              headers,
              body: JSON.stringify({
                ...values,
                department: { id: values.department },
              }),
            }
          );

          data = await response.json();
          if (response.ok) {
            setAssetHolder((prevAssetHolders) =>
              prevAssetHolders.map((assetholder) =>
                assetholder.id === editAssetHolder.id
                  ? { ...assetholder, ...values }
                  : assetholder
              )
            );
            setSelectedAssetHolder(data.assetholder);
            notification.success({
              message: "Asset holder updated successfully!",
              duration: 1,
            });
            setIsModalVisible(false);
            fetchData();
          } else {
            throw new Error(data.error || "Failed to update asset holder");
          }
        } else {
          // Create new asset holder
          response = await fetch(
            "http://localhost:6060/admin/createassetholder",
            {
              method: "POST",
              headers,
              body: JSON.stringify({
                ...values,
                department: { id: values.department },
              }),
            }
          );

          data = await response.json();
          console.log("Asset Holder Response:", data);
          if (response.ok && data.assetHolder) {
            // setAssetHolder([...assetHolders, data.assetholder]);
            setSelectedAssetHolder(data.assetholder);
            notification.success({
              message: "Asset holder created successfully!",
              duration: 1,
            });
            setIsModalVisible(false);
            fetchData();
          } else {
            throw new Error(data.error || "Failed to create asset holder");
          }
        }
      } else if (modalType === "Audit") {
        try {
          console.log(assetById);
          console.log("department", departmentId);

          const response = await fetch(
            "http://localhost:6060/admin/createcount",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ...values,
                department: { id: departmentId },
                createdBy: "admin",
              }),
            }
          );
          const data = await response.json();
          console.log(data);

          console.log("Department ID:", departmentId);

          if (response.ok) {
            // notification.success({
            //   // message: "Fixed Asset Count created successfully!",
            //   duration: 1,
            // });
            let fixedAssetDetailPayload;
            if (data) {
              // console.log(data)
              for (let i = 0; i < assetById.length; i++) {
                const item = assetById[i];
                fixedAssetDetailPayload = {
                  fixedAssetCount: { id: data.fixedAssetCounts.id },
                  assetHolder: { id: item.assetHolder.id },
                  fixedAsset: { id: item.id },
                  conditions: item.conditions,
                  existenceAsset: item.existenceAsset,
                  remarks: item.remarks,
                  quantityCounted: item.quantityCounted,
                };
              }
            }

            const detailResponse = await fetch(
              "http://localhost:6060/admin/createdetail",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(fixedAssetDetailPayload),
              }
            );

            const detailData = await detailResponse.json();
            console.log("Fixed Asset Detail Response:", detailData);

            if (detailResponse.ok) {
              notification.success({
                message: "Fixed Asset Count created successfully!",
                duration: 1,
              });
            } else {
              throw new Error(
                detailData.error || "Failed to create Fixed Asset Detail"
              );
            }

            setIsModalVisible(false);
            fetchAssetCount();
          } else {
            throw new Error(data.error || "Failed to create Fixed Asset Count");
          }
        } catch (error) {
          notification.error({
            message: error.message,
            duration: 1,
          });
        }
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
      notification.error({
        message: "Failed to submit form",
        description: error.message,
        duration: 1,
      });
    }
  };

  const handlebuildingDelete = async (building) => {
    console.log("Building:", building);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      await fetch(`http://localhost:6060/admin/deleteBuilding/${building.id}`, {
        method: "DELETE",
        headers,
      });

      setBuildings((prevBuildings) =>
        prevBuildings.filter((cat) => cat.id !== building.id)
      );

      notification.success({
        message: "Building  Deleted",
        description: "Building has been deleted successfully.",
        duration: 1,
      });
    } catch (error) {
      console.error("Error deleting building:", error);
      notification.error({
        message: "Failed to delete building ",
        description: error.message,
        duration: 1,
      });
    }
  };

  const handleDepartmentDelete = async (department) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      await fetch(
        `http://localhost:6060/admin/deleteDepartment/${department.id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      setDepartments((prevDepartments) =>
        prevDepartments.filter((cat) => cat.id !== department.id)
      );

      notification.success({
        message: "Department Deleted",
        description: "Department has been deleted successfully.",
        duration: 1,
      });
    } catch (error) {
      console.error("Error deleting building:", error);
      notification.error({
        message: "Failed to delete building ",
        description: error.message,
        duration: 1,
      });
    }
  };

  const handleRoomDelete = async (room) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      await fetch(`http://localhost:6060/admin/deleteroom/${room.id}`, {
        method: "DELETE",
        headers,
      });

      setRooms((prevRooms) => prevRooms.filter((cat) => cat.id !== room.id));
    } catch (error) {
      console.error("Error deleting room:", error);
      notification.error({
        message: "Failed to delete room ",
        description: error.message,
        duration: 1,
      });
    }
  };

  const handleAssetholderDelete = async (assetHolders) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      await fetch(
        `http://localhost:6060/admin/deleteassetbyId/${assetHolders.id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      setAssetHolder((prevAssetHolders) =>
        prevAssetHolders.filter((cat) => cat.id !== assetHolders.id)
      );
    } catch (error) {
      console.error("Error deleting assetholder:", error);
      notification.error({
        message: "Failed to delete assetholder",
        description: error.message,
        duration: 1,
      });
    }
  };

  const handleDepartmentChange = (value) => {
    setDepartmentId(value);
  };

  const createMenu = (
    <Menu>
      <Menu.Item key="1">
        <Button type="link" onClick={() => showModal("building")}>
          Create Building
        </Button>
      </Menu.Item>
      <Menu.Item key="2">
        <Button type="link" onClick={() => showModal("department")}>
          Create Department
        </Button>
      </Menu.Item>
      <Menu.Item key="3">
        <Button type="link" onClick={() => showModal("room")}>
          Create Room
        </Button>
      </Menu.Item>
      <Menu.Item key="4">
        <Button type="link" onClick={() => showModal("assetholder")}>
          Create Assetholder
        </Button>
      </Menu.Item>
    </Menu>
  );

  const buildingMenu = (
    <Menu>
      {buildings.map((building) => (
        <Menu.Item key={building.id}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              type="link"
              onClick={() => setSelectedBuilding(building.name)}
            >
              {building.name}
            </Button>
            <div>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditBuilding(building)}
              />
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handlebuildingDelete(building)}
              />
            </div>
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  const departmentMenu = (
    <Menu>
      {departments.map((department) => (
        <Menu.Item key={department.id}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              type="link"
              onClick={() => setSelectedDepartment(department.name)}
            >
              {department.name}
            </Button>
            <div>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditDepartment(department)}
              />
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleDepartmentDelete(department)}
              />
            </div>
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  const roomMenu = (
    <Menu>
      {rooms.map((room) => (
        <Menu.Item key={room.id}>
          <div className="flex justify-between items-center w-full">
            <Button type="link" onClick={() => setSelectedRoom(room.name)}>
              {room.name}
            </Button>
            <div className="flex gap-2">
              <Button
                type="link"
                onClick={() => handleEditRoom(room)}
                icon={<EditOutlined />}
              />
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleRoomDelete(room)}
              />
            </div>
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleSearchChange = async(e) => {
    const value = e.target.value;
    const lowercasedTerm = value.toLowerCase();
    setSearchTerm(value);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await fetch(
      `http://localhost:6060/admin/getFixedAssetsByDepartment/${departmentId}`,
      {
        method: "GET",
        headers,
      }
    );

    if (response.ok) {
      const assetDetails = await response.json();
      const filteredUsers = assetDetails.fixedAssets?.filter((r) =>
        r.assetHolder.name.toLowerCase().includes(lowercasedTerm)
      );
      setAssetById(filteredUsers);
  }
  };
  const assetholderMenu = (
    <Menu>
      {filteredAssetHolders.map((assetHolder) => (
        <Menu.Item key={assetHolder.id}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              type="link"
              onClick={() => setSelectedAssetHolder(assetHolder)}
            >
              {assetHolder.name}
            </Button>
            <div>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditAssetHolder(assetHolder)}
              />
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleAssetholderDelete(assetHolder)}
              />
            </div>
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  const [editableKeys, setEditableRowKeys] = useState(() =>
    assetById.map((item) => item.id)
  );

  const columnscount = [
    {
      title: "No",
      dataIndex: "key",
      render: (_, __, index) => <span className="text-sm">{index + 1}</span>,
      editable: false,
    },
    // {
    //   title: "Images",
    //   dataIndex: "files", // Assuming your data has an array of file objects here
    //   key: "files",
    //   editable: false,
    //   render: (files) => (
    //     <div style={{ display: 'flex', gap: '10px' }}>
    //       {files?.map((file, index) => (
    //         <img
    //           key={index}
    //           src={file.fileUrl}
    //           alt={file.fileName}
    //           style={{
    //             width: "50px",
    //             height: "50px",
    //             objectFit: "cover",
    //             borderRadius: "4px",
    //           }}
    //           className="border border-gray-300 shadow-md"
    //           onError={(e) => { e.target.src = '/default-image.png'; }} // Fallback image
    //         />
    //       ))}
    //     </div>
    //   ),
    // },
    {
      title: "Fixed Asset Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="text-sm">{text}</span>,
      editable: false,
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      render: (text) => <span className="text-sm">{text}</span>,
      editable: false,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      render: (text) => <span className="text-sm">{text}</span>,
      editable: false,
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      render: (text) => <span className="text-sm">{text}</span>,
      editable: false,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <span className="text-sm">{`$${text}`}</span>,
      editable: false,
    },
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (text) => <span className="text-sm">{text}</span>,
      editable: false,
    },
    {
      title: "Purchase Date",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      render: (text) => <span className="text-sm">{text}</span>,
      editable: false,
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      render: (text) => <span className="text-sm">{text}</span>,
      editable: false,
    },
    {
      title: "Asset Holder",
      dataIndex: ["assetHolder", "name"],
      key: "assetHolder",
      render: (text, record) => (
        <span className="text-sm">{record.assetHolder ? text : "N/A"}</span>
      ),
      editable: false,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text) => <span className="text-sm">{text}</span>,
      editable: false,
    },
    {
      title: "Quantity Counted",
      dataIndex: "quantityCounted",
      key: "quantityCounted",
      editable: true,
      fieldProps: {
        placeholder: "Enter quantity",
        className: "text-sm", // Tailwind class for input fields
      },
    },
    {
      title: "Conditions",
      dataIndex: "conditions",
      key: "conditions",
      editable: true,
      fieldProps: {
        placeholder: "Enter conditions",
        className: "text-sm", // Tailwind class for input fields
      },
    },
    {
      title: "Existence Asset",
      dataIndex: "existenceAsset",
      key: "existenceAsset",
      editable: true,
      fieldProps: {
        placeholder: "Enter existence status",
        className: "text-sm", // Tailwind class for input fields
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      editable: true,
      fieldProps: {
        placeholder: "Enter remarks",
        className: "text-sm", // Tailwind class for input fields
      },
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex">
          {role === "ADMIN" ? (
            <Dropdown overlay={createMenu} placement="bottomLeft">
              <Button
                size="middle"
                className="bg-yellow-500 text-white hover:bg-white hover:text-yellow-500 border-none"
              >
                Create <DownOutlined />
              </Button>
            </Dropdown>
          ) : (
            <></>
          )}
          {role === "ADMIN" ? (
            <Dropdown overlay={buildingMenu} placement="bottomLeft">
              <Button
                size="middle"
                className="ml-2 text-gray-700 hover:bg-yellow-50"
              >
                Building <DownOutlined />
              </Button>
            </Dropdown>
          ) : (
            <></>
          )}

          {role === "ADMIN" ? (
            <Dropdown overlay={departmentMenu} placement="bottomLeft">
              <Button
                size="middle"
                className="ml-2 text-gray-700 hover:bg-yellow-50"
              >
                Department <DownOutlined />
              </Button>
            </Dropdown>
          ) : (
            <></>
          )}
          {role === "ADMIN" ? (
            <Dropdown overlay={roomMenu} placement="bottomLeft">
              <Button
                size="middle"
                className="ml-2 text-gray-700 hover:bg-yellow-50"
              >
                Room <DownOutlined />
              </Button>
            </Dropdown>
          ) : (
            <></>
          )}

          {role === "ADMIN" ? (
            <Dropdown overlay={assetholderMenu} placement="bottomLeft">
              <Button
                size="middle"
                className="ml-2 text-gray-700 hover:bg-yellow-50"
              >
                AssetHolder <DownOutlined />
              </Button>
            </Dropdown>
          ) : (
            <></>
          )}

          <Button
            size="middle"
            className="ml-2 bg-gray-100 hover:bg-yellow-500 hover:text-white rounded-full"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsModalVisible(true);
              setModalType("Audit");
            }}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto pt-4">
        <Table
          columns={columns}
          dataSource={fixedAssetCountData}
          rowKey="key"
        />
      </div>

      <Modal
        title={modalType.charAt(0).toUpperCase() + modalType.slice(1)}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText='Cancel'
        okText='Ok'
        width={
          modalType === "Audit" || modalType === "fixedAssetDetail" ? 1400 : 500
        }
      >
        <Form form={form} layout="vertical">
          {modalType === "building" && (
            <>
              <Form.Item
                name="name"
                label="Building Name"
                rules={[
                  {
                    required: true,
                    message: "Please input the building name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </>
          )}
          {modalType === "department" && (
            <>
              <Form.Item
                name="name"
                label="Department Name"
                rules={[
                  {
                    required: true,
                    message: "Please input the department name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="building"
                label="Building"
                rules={[
                  { required: true, message: "Please select a building!" },
                ]}
              >
                <Select>
                  {buildings.map((building) => (
                    <Option key={building.id} value={building.id}>
                      {building.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="floorNumber" label="Floor Number">
                <Input type="number" />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea />
              </Form.Item>
            </>
          )}
          {modalType === "room" && (
            <>
              <Form.Item
                name="name"
                label="Room Name"
                rules={[
                  { required: true, message: "Please input the room name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="building"
                label="Building"
                rules={[
                  { required: true, message: "Please select a building!" },
                ]}
              >
                <Select>
                  {buildings.map((building) => (
                    <Option key={building.id} value={building.id}>
                      {building.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="department"
                label="Department"
                rules={[
                  { required: true, message: "Please select a department!" },
                ]}
              >
                <Select>
                  {departments.map((department) => (
                    <Option key={department.id} value={department.id}>
                      {department.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="description" label="Description">
                <Input.TextArea />
              </Form.Item>
            </>
          )}
          {modalType === "assetholder" && (
            <>
              <Form.Item
                name="name"
                label="Asset Holder Name"
                rules={[
                  {
                    required: true,
                    message: "Please input the asset holder's name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please input a valid email!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please input the phone number!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="department"
                label="Department"
                rules={[
                  { required: true, message: "Please select a department!" },
                ]}
              >
                <Select>
                  {departments.map((department) => (
                    <Option key={department.id} value={department.id}>
                      {department.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {modalType === "Audit" && (
            <Form
              layout="vertical"
              style={{ maxWidth: "100%", margin: "0 auto", padding: 20 }}
            >
              <div className="flex space-x-4 items-center mb-4">
                {" "}
                {/* Flex container for form items */}
                <Form.Item
                  name="department"
                  label="Department"
                  style={{ width: "200px" }}
                  rules={[
                    { required: true, message: "Please select a department!" },
                  ]}
                >
                  <Select
                    onChange={handleDepartmentChange}
                    placeholder="Select a department"
                    className="w-full"
                  >
                    {departments.map((department) => (
                      <Option key={department.id} value={department.id}>
                        {department.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="date"
                  label="Date"
                  style={{ width: "200px" }}
                  rules={[{ required: true, message: "Please select a date!" }]}
                >
                  <DatePicker className="w-full" />
                </Form.Item>
                <Form.Item
                  name="Assetholder"
                  label="Asset Holder"
                  style={{ width: "200px" }}
                  rules={[
                    {
                      required: true,
                      message: "Please select an asset holder!",
                    },
                  ]}
                >
                  <Dropdown overlay={assetholderMenu} trigger={["click"]}>
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      suffix={
                        <SearchOutlined
                          onClick={handleSearchClick}
                          style={{ cursor: "pointer" }}
                        />
                      }
                      style={{ width: 200, marginLeft: 8 }}
                    />
                  </Dropdown>
                </Form.Item>
              </div>
              <div className="text-sm">
                {assetById.length > 0 ? (
                  <EditableProTable
                    columns={columnscount}
                    rowKey="id"
                    scroll={{
                      x: 1200,
                    }}
                    value={assetById}
                    onChange={setAssetById}
                    recordCreatorProps={false}
                    editable={{
                      type: "multiple",
                      editableKeys,
                      actionRender: (row, config, defaultDoms) => {
                        return [defaultDoms.delete];
                      },
                      onValuesChange: (record, recordList) =>
                        setAssetById(recordList),
                      onChange: setEditableRowKeys,
                    }}
                    className="text-sm"
                  />
                ) : (
                  <Card>No assets found for the selected department.</Card>
                )}
              </div>
            </Form>
          )}
          {modalType === "fixedAssetDetail" && fixedAssetDetail && (
            <div className="w-full overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Department</th>
                    <th className="px-4 py-2 border">Asset Holder</th>
                    <th className="px-4 py-2 border">Fixed Asset</th>
                    <th className="px-4 py-2 border">Model</th>
                    <th className="px-4 py-2 border">Year</th>
                    <th className="px-4 py-2 border">serialNumber</th>
                    <th className="px-4 py-2 border">purchaseDate</th>
                    <th className="px-4 py-2 border">price</th>
                    {/* <th className="px-4 py-2 border">price</th> */}

                    <th className="px-4 py-2 border">Quantity Counted</th>
                    <th className="px-4 py-2 border">Conditions</th>
                    <th className="px-4 py-2 border">Existence Asset</th>
                    <th className="px-4 py-2 border">Remarks</th>
                    <th className="px-4 py-2 border">Count by</th>
                  </tr>
                </thead>
                <tbody>
                  {fixedAssetDetail == [] ?  <td className="px-4 py-2 border">
                        hiiiiiiiiiiiiiiiiiiiiiiiii
                      </td>:<></>}
                  {fixedAssetDetail.map((detail) => (
                    <tr
                      key={detail.id}
                      className="odd:bg-white even:bg-gray-50"
                    >
                      <td className="px-4 py-2 border">
                        {detail.fixedAssetCount.department.name}
                      </td>
                      <td className="px-4 py-2 border">
                        {detail.assetHolder.name} ({detail.assetHolder.email})
                      </td>
                      <td className="px-4 py-2 border">
                        {detail.fixedAsset.name}
                      </td>
                      <td className="px-4 py-2 border">
                        {detail.fixedAsset.model}
                      </td>
                      <td className="px-4 py-2 border">
                        {detail.fixedAsset.year}
                      </td>
                      <td className="px-4 py-2 border">
                        {detail.fixedAsset.serialNumber}
                      </td>
                      <td className="px-4 py-2 border">
                        {detail.fixedAsset.purchaseDate}
                      </td>
                      <td className="px-4 py-2 border">
                        {detail.fixedAsset.price}
                      </td>
                      <td className="px-4 py-2 border">
                        {detail.quantityCounted}
                      </td>
                      <td className="px-4 py-2 border">{detail.conditions}</td>
                      <td className="px-4 py-2 border">
                        {detail.existenceAsset}
                      </td>
                      <td className="px-4 py-2 border">{detail.remarks}</td>
                      <td className="px-4 py-2 border">
                        {detail.fixedAssetCount.createdBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default TotalAsset;
