import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { FaMicrochip, FaDesktop, FaTools, FaBoxes } from 'react-icons/fa';

export default function Overview_Instructor() {
  const [equipmentHealth, setEquipmentHealth] = useState([]);
  const [equipmentCategories, setEquipmentCategories] = useState([]);
  const performanceCanvasRef = useRef(null);
  const difficultyCanvasRef = useRef(null);

  // Fetch data from API dynamically
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/Incharge_api/dashboard');
        const data = await res.json();
        setEquipmentHealth(data.equipmentHealth);
        setEquipmentCategories(data.equipmentCategories);
      } catch (err) {
        console.error('Failed to fetch equipment overview data:', err);
      }
    }
    fetchData();
  }, []);

  // Draw charts whenever data changes
  useEffect(() => {
    let performanceChart;
    let difficultyChart;

    if (performanceCanvasRef.current && equipmentHealth.length > 0) {
      performanceChart = new Chart(performanceCanvasRef.current.getContext('2d'), {
        type: 'bar',
        data: {
          labels: equipmentHealth.map(e => e.status),
          datasets: [{
            label: 'Equipment Count',
            data: equipmentHealth.map(e => e.count),
            backgroundColor: equipmentHealth.map(e => {
              switch (e.status) {
                case 'New': return 'rgba(191, 219, 254, 0.7)';       // light blue
                case 'Excellent': return 'rgba(147, 197, 253, 0.7)';  // soft blue
                case 'Good': return 'rgba(96, 165, 250, 0.7)';        // medium blue
                case 'Fair': return 'rgba(59, 130, 246, 0.7)';        // blue
                case 'Poor': return 'rgba(37, 99, 235, 0.7)';         // deep blue
                case 'Broken': return 'rgba(30, 64, 175, 0.7)';       // navy blue
                default: return 'rgba(203, 213, 225, 0.7)';           // fallback gray-blue
              }
            }),
            borderColor: equipmentHealth.map(e => {
              switch (e.status) {
                case 'New': return 'rgba(191, 219, 254, 1)';
                case 'Excellent': return 'rgba(147, 197, 253, 1)';
                case 'Good': return 'rgba(96, 165, 250, 1)';
                case 'Fair': return 'rgba(59, 130, 246, 1)';
                case 'Poor': return 'rgba(37, 99, 235, 1)';
                case 'Broken': return 'rgba(30, 64, 175, 1)';
                default: return 'rgba(203, 213, 225, 1)';
              }
            }),
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Count' } }
          },
          plugins: { legend: { position: 'top' } }
        }
      });
    }

    if (difficultyCanvasRef.current && equipmentCategories.length > 0) {
      const baseBlueShades = [
        'rgba(191, 219, 254, 0.7)',
        'rgba(147, 197, 253, 0.7)',
        'rgba(96, 165, 250, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(37, 99, 235, 0.7)',
        'rgba(30, 64, 175, 0.7)',
      ];
      const borderShades = baseBlueShades.map(color => color.replace('0.7', '1'));

      difficultyChart = new Chart(difficultyCanvasRef.current.getContext('2d'), {
        type: 'pie',
        data: {
          labels: equipmentCategories.map(c => c.category),
          datasets: [{
            data: equipmentCategories.map(c => c.count),
            backgroundColor: baseBlueShades.slice(0, equipmentCategories.length),
            borderColor: borderShades.slice(0, equipmentCategories.length),
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    return () => {
      if (performanceChart) performanceChart.destroy();
      if (difficultyChart) difficultyChart.destroy();
    };
  }, [equipmentHealth, equipmentCategories]);

  // Helper values
  const newCount = equipmentHealth.find(e => e.status === 'New')?.count || 0;
  const totalCount = equipmentHealth.reduce((sum, e) => sum + e.count, 0);
  const totalCategories = equipmentCategories.length;
  const ongoingMaintenanceCount = 3;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat Card 1 */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 text-blue-500">
              <FaMicrochip className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <dt className="text-sm font-medium text-gray-500 truncate">New Equipment</dt>
              <dd className="text-2xl font-semibold text-gray-900">{newCount}</dd>
            </div>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="flex-shrink-0 bg-blue-200 rounded-full p-3 text-blue-600">
              <FaDesktop className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Equipment</dt>
              <dd className="text-2xl font-semibold text-gray-900">{totalCount}</dd>
            </div>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="flex-shrink-0 bg-blue-300 rounded-full p-3 text-blue-700">
              <FaTools className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Ongoing Maintenance</dt>
              <dd className="text-2xl font-semibold text-gray-900">{ongoingMaintenanceCount}</dd>
            </div>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 text-blue-500">
              <FaBoxes className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Categories</dt>
              <dd className="text-2xl font-semibold text-gray-900">{totalCategories}</dd>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment Health Breakdown</h3>
          <div className="h-64">
            <canvas ref={performanceCanvasRef}></canvas>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment Count Categorized</h3>
          <div className="h-64">
            <canvas ref={difficultyCanvasRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
