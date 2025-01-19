import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function LineChart() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMonthlyData = async () => {
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
          // Initialize all months with zero count
          const allMonths = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];

          // Initialize counters for each type
          const assetsByMonth = {
            created: {},
            available: {},
            assigned: {},
          };

          result.fixedAssets.forEach((asset) => {
            const month = new Date(asset.createdAt).toLocaleString("default", {
              month: "long",
            });

            // Count created assets
            assetsByMonth.created[month] =
              (assetsByMonth.created[month] || 0) + 1;

            // Count available and assigned assets
            if (asset.statustext === "Available") {
              assetsByMonth.available[month] =
                (assetsByMonth.available[month] || 0) + 1;
            } else if (asset.statustext === "In Use") {
              assetsByMonth.assigned[month] =
                (assetsByMonth.assigned[month] || 0) + 1;
            }
          });

          // Prepare data for the chart
          const createdData = allMonths.map(
            (month) => assetsByMonth.created[month] || 0
          );
          const availableData = allMonths.map(
            (month) => assetsByMonth.available[month] || 0
          );
          const assignedData = allMonths.map(
            (month) => assetsByMonth.assigned[month] || 0
          );

          setChartData({
            labels: allMonths,
            datasets: [
              {
                label: "Assets Created",
                data: createdData.map((value) => Math.round(value)), // Ensure integer values
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)",
                fill: true,
              },
              {
                label: "Assets Available",
                data: availableData.map((value) => Math.round(value)), // Ensure integer values
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                fill: true,
              },
              {
                label: "Assets Assigned",
                data: assignedData.map((value) => Math.round(value)), // Ensure integer values
                borderColor: "rgb(255, 159, 64)",
                backgroundColor: "rgba(255, 159, 64, 0.5)",
                fill: true,
              },
            ],
          });
        } else {
          showNotification.error({
            message: "Failed to fetch fixed assets",
            description: result.error,
          });
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchMonthlyData();
  }, [token]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // Ensure integer y-axis values
        },
      },
    },
  };

  return (
    <TitleCard title="Monthly Asset Data">
    <div style={{ height: "250px" }}>
      <Line data={chartData} options={options} />
    </div>
  </TitleCard>
  );
}

export default LineChart;
