import { useState, useEffect } from "react";
import DashboardStats from "./components/DashboardStats";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import UserChannels from "./components/UserChannels";
import LineChart from "./components/LineChart";
// import BarChart from './components/BarChart'
import DashboardTopBar from "./components/DashboardTopBar";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";
// import CircleStackIcon from '@heroicons/react/24/outline/CircleStackIcon';
import PlusCircleIcon from "@heroicons/react/24/outline/PlusCircleIcon";
import CogIcon from "@heroicons/react/24/outline/CogIcon";
import CheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import { DatePicker } from "antd";
const token = localStorage.getItem("token");

function Dashboard() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [statsData, setStatsData] = useState([]);

  // Function to fetch fixed assets data
  const fetchFixedAssets = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(
        "http://localhost:6060/admin/getAllFixedAssets",
        { headers }
      );
      const result = await response.json();
      if (result.statusCode === 200) {
        console.log(result.fixedAssets);
        setData(result.fixedAssets || []);

        // Calculate totals
        const totalAssets = result.fixedAssets.length;
        const inUseAssets = result.fixedAssets.filter(
          (asset) => asset.statustext === "In Use"
        ).length;
        const availableAssets = result.fixedAssets.filter(
          (asset) => asset.statustext === "Avaliable"
        ).length;
        // const newAssets = result.fixedAssets.filter(
        //   (asset) => asset.isNew
        // ).length; // Assuming you have a way to determine new assets

        // Update stats data with calculated values
        setStatsData([
          // {
          //   title: "New Asset",
          //   value: newAssets,
          //   icon: <PlusCircleIcon className="w-8 h-8" />,
          // },
          {
            title: "Total Asset",
            value: totalAssets,
            icon: <CircleStackIcon className="w-8 h-8" />,
          },
          {
            title: "In Use",
            value: inUseAssets,
            icon: <CogIcon className="w-8 h-8" />,
          },
          {
            title: "Available",
            value: availableAssets,
            icon: <CheckCircleIcon className="w-8 h-8" />,
          },
        ]);
      } else {
        showNotification.error({
          message: "Failed to fetch fixed assets",
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Error fetching fixed assets:", error);
    }
  };
  useEffect(() => {
    fetchFixedAssets();
  }, []);

  const updateDashboardPeriod = (newRange) => {
    // Dashboard range changed, write code to refresh your values
    dispatch(
      showNotification({
        message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`,
        status: 1,
      })
    );
  };

  return (
    <>
      {/** ---------------------- Select Period Content ------------------------- */}
      <DatePicker
        className="border border-gray-300 rounded-lg p-2 text-gray-700 placeholder-gray-500 w-1/4 md:w-1/6 lg:w-1/8 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out mt-3"
        placeholderText="Select purchase date"
      />
      {/* <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} /> */}

      {/** ---------------------- Different stats content 1 ------------------------- */}
      <div className="grid lg:grid-cols-4 mt-7 md:grid-cols-2 grid-cols-1 gap-6">
        {statsData.map((item, index) => (
          <DashboardStats
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            colorIndex={index} // Assigning color index based on the map index
          />
        ))}
      </div>

      {/** ---------------------- Different charts ------------------------- */}
      <div className="flex flex-wrap mt-2 gap-6">
        <div className="flex-1 min-w-[300px]">
          <LineChart />
          {/* <BarChart /> */}
        </div>
        <div className="flex-1 min-w-[300px]">
          <UserChannels />
          {/* <DoughnutChart /> */}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
