import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2'; // <-- Use Pie instead of Doughnut
import { Chart as ChartJS, CategoryScale, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the required Chart.js components
ChartJS.register(CategoryScale, ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [itemData, setItemData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await fetch('/api/Incharge_Func/Dashboard/Fetch_TopItems');
        const data = await response.json();

        if (response.ok) {
          setItemData(data);
        } else {
          console.error('Error fetching item data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching item data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, []);

  // Extract item names and usage counts for the chart
  const labels = itemData.map(item => item.I_Name);
  const data = itemData.map(item => item.usageCount);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Usage Count',
        data,
        backgroundColor: [
          'rgba(38, 120, 175, 0.6)',
          'rgba(54, 62, 100, 0.6)',
          'rgba(39, 60, 117, 0.6)',
          'rgba(25, 25, 112, 0.6)',
          'rgba(0, 0, 128, 0.6)',
          'rgba(0, 0, 139, 0.6)',
          'rgba(0, 0, 205, 0.6)',
          'rgba(70, 130, 180, 0.6)',
          'rgba(0, 51, 102, 0.6)',
          'rgba(139, 69, 19, 0.6)', // Add more colors if necessary
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} uses`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', margin: 'auto', display: 'flex', alignItems: 'center' }}>
      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <Pie data={chartData} options={options} /> 
      )}
    </div>
  );
};

export default PieChart;
