import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import TitleCard from "../../../components/Cards/TitleCard";
import { PlusCircleIcon, CircleStackIcon, CogIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { notification } from 'antd';

function UserChannels() {
    const [pieChartData, setPieChartData] = useState([]);
    const token = localStorage.getItem("token");
    const [statsData, setStatsData] = useState([]);
    useEffect(() => {
        // Assuming fetchFixedAssets is defined somewhere else and it sets statsData
        const fetchFixedAssets = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                };
                const response = await fetch("http://localhost:6060/admin/getAllFixedAssets", { headers });
                const result = await response.json();

                if (result.statusCode === 200) {
                    // Calculate totals
                    const totalAssets = result.fixedAssets.length;
                    const inUseAssets = result.fixedAssets.filter(asset => asset.statustext === 'In Use').length;
                    const availableAssets = result.fixedAssets.filter(asset => asset.statustext === 'Available').length;
                    // const newAssets = result.fixedAssets.filter(asset => asset.isNew).length; // Assuming you have a way to determine new assets

                    // Update stats data with calculated values
                    setStatsData([
                        // { title: "New Asset", value: newAssets, icon: <PlusCircleIcon className='w-8 h-8' /> },
                        { title: "Total Asset", value: totalAssets, icon: <CircleStackIcon className='w-8 h-8' /> },
                        { title: "In Use", value: inUseAssets, icon: <CogIcon className='w-8 h-8' /> },
                        { title: "Available", value: availableAssets, icon: <CheckCircleIcon className='w-8 h-8' /> },
                    ]);

                    // Prepare data for PieChart
                    const pieChartData = [
                        // { source: "New Asset", count: newAssets },
                        { source: "Total Asset", count: totalAssets },
                        { source: "In Use", count: inUseAssets },
                        { source: "Available", count: availableAssets },
                    ];
                    setPieChartData(pieChartData);
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

        fetchFixedAssets();
    }, []);


    const colors = ['#87CEEB', '#F59E0B', '#EF4444','#34D399'];


    return (
        <TitleCard title={"Detail about Fixed Asset"}>
            <div className="flex justify-center">
                <PieChart width={250} height={250}> {/* Adjusted size */}
                    <Pie
                        data={pieChartData}
                        dataKey="count"
                        nameKey="source"
                        cx="50%"
                        cy="50%"
                        outerRadius={80} 
                        fill="#8884d8"
                        label
                    >
                        {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>
        </TitleCard>
    );
}

export default UserChannels;
