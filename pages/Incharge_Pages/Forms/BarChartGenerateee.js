import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the required Chart.js components
ChartJS.register(CategoryScale, ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const data = {
    labels: [
      'Microphone', 'Speaker', 'Projector', 'Guitar', 'DSLR', 'Drone',
      'Extension Wire', 'Globe', 'Whiteboard', 'Laptop'
    ],
    datasets: [
      {
        label: 'Usage Count',
        data: [120, 150, 90, 30, 60, 45, 110, 40, 80, 160],
        backgroundColor: [
          'rgba(38, 120, 175, 0.6)',
          'rgba(54, 62, 100, 0.6)',
          'rgba(39, 60, 117, 0.6)',
          'rgba(25, 25, 112, 0.6)',
          'rgba(0, 0, 128, 0.6)',
          'rgba(0, 0, 139, 0.6)',
          'rgba(0, 0, 205, 0.6)',
          'rgba(70, 130, 180, 0.6)',
          'rgba(0, 51, 102, 0.6)'
        ],
        
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} uses`;
          }
        }
      }
    }
  };

  return (
    <div style={{ width: '80%', margin: '0 auto', display: "flex", alignItems: "center"}}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
