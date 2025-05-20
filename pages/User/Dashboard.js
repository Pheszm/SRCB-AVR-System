import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import Cookies from 'js-cookie';

export default function User_Dashboard() {
  const user_id = Cookies.get('user_id');
  const [reservationStats, setReservationStats] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const statusCanvasRef = useRef(null);
  const timelineCanvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/User_api/dashboard?user_id=${user_id}`);
        const data = await res.json();
        setReservationStats(data.reservationStats);
        setTimelineData(data.timelineData);
      } catch (err) {
        console.error('Failed to fetch user dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user_id]);

  // Draw charts
  useEffect(() => {
    let statusChart;
    let timelineChart;

    if (statusCanvasRef.current && reservationStats.length > 0) {
      statusChart = new Chart(statusCanvasRef.current.getContext('2d'), {
        type: 'bar',
        data: {
          labels: reservationStats.map(item => item.status),
          datasets: [{
            label: 'Reservations',
            data: reservationStats.map(item => item.count),
            backgroundColor: reservationStats.map(item => {
              switch (item.status) {
                case 'Pending': return 'rgba(147, 197, 253, 0.7)';   // blue-300
                case 'Approved': return 'rgba(59, 130, 246, 0.7)';    // blue-600
                case 'Rejected': return 'rgba(239, 68, 68, 0.7)';     // red-500 (kept for visibility)
                case 'Upcoming': return 'rgba(96, 165, 250, 0.7)';    // blue-400
                case 'Completed': return 'rgba(29, 78, 216, 0.7)';    // blue-800
                case 'Cancelled': return 'rgba(191, 219, 254, 0.7)';  // blue-100
                default: return 'rgba(147, 197, 253, 0.7)';           // blue-300
              }
            }),
            borderColor: reservationStats.map(item => {
              switch (item.status) {
                case 'Pending': return 'rgba(147, 197, 253, 1)';
                case 'Approved': return 'rgba(59, 130, 246, 1)';
                case 'Rejected': return 'rgba(239, 68, 68, 1)';
                case 'Upcoming': return 'rgba(96, 165, 250, 1)';
                case 'Completed': return 'rgba(29, 78, 216, 1)';
                case 'Cancelled': return 'rgba(191, 219, 254, 1)';
                default: return 'rgba(147, 197, 253, 1)';
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
          plugins: { 
            legend: { display: false },
            title: { display: true, text: 'Reservation Status Breakdown', color: '#1e3a8a' }
          }
        }
      });
    }

    if (timelineCanvasRef.current && timelineData.length > 0) {
      timelineChart = new Chart(timelineCanvasRef.current.getContext('2d'), {
        type: 'line',
        data: {
          labels: timelineData.map(item => item.month),
          datasets: [{
            label: 'Reservations',
            data: timelineData.map(item => item.count),
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: 'rgba(29, 78, 216, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(29, 78, 216, 1)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { 
              beginAtZero: true, 
              title: { display: true, text: 'Reservations', color: '#1e3a8a' },
              grid: { color: 'rgba(226, 232, 240, 0.5)' }
            },
            x: { 
              title: { display: true, text: 'Timeline', color: '#1e3a8a' },
              grid: { color: 'rgba(226, 232, 240, 0.5)' }
            }
          },
          plugins: { 
            legend: { display: false },
            title: { display: true, text: 'Reservation Activity', color: '#1e3a8a' }
          }
        }
      });
    }

    return () => {
      if (statusChart) statusChart.destroy();
      if (timelineChart) timelineChart.destroy();
    };
  }, [reservationStats, timelineData]);

  // Calculate summary values
  const pendingCount = reservationStats.find(s => s.status === 'Pending')?.count || 0;
  const approvedCount = reservationStats.find(s => s.status === 'Approved')?.count || 0;
  const upcomingCount = reservationStats.find(s => s.status === 'Upcoming')?.count || 0;
  const totalReservations = reservationStats.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Reservations */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 text-blue-600">
              <FaCalendarAlt className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Reservations</dt>
              <dd className="text-2xl font-semibold text-gray-900">{totalReservations}</dd>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 text-blue-600">
              <FaClock className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Pending Approvals</dt>
              <dd className="text-2xl font-semibold text-gray-900">{pendingCount}</dd>
            </div>
          </div>
        </div>

        {/* Approved Reservations */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 text-blue-600">
              <FaCheckCircle className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
              <dd className="text-2xl font-semibold text-gray-900">{approvedCount}</dd>
            </div>
          </div>
        </div>

        {/* Upcoming Reservations */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <div className="px-4 py-5 sm:p-6 flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 text-blue-600">
              <FaExclamationTriangle className="h-6 w-6" />
            </div>
            <div className="ml-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Upcoming</dt>
              <dd className="text-2xl font-semibold text-gray-900">{upcomingCount}</dd>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status Breakdown Chart */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Reservation Status Breakdown</h3>
          <div className="h-64">
            <canvas ref={statusCanvasRef}></canvas>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Reservation Activity</h3>
          <div className="h-64">
            <canvas ref={timelineCanvasRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}