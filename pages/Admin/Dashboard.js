import { useEffect, useState } from 'react';
import { FiUsers, FiUser, FiCalendar } from 'react-icons/fi';
import styles from "@/styles/Tables.module.css";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/Admin_api/dashboard');
      const data = await res.json();
      setDashboardData(data.dashboardData);
      setRecentActivities(data.recentActivities);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.MainBodyPage}>
      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Students Card */}
        <Card
          title="Total Students"
          total={dashboardData.totalStudents}
          active={dashboardData.activeStudents}
          icon={<FiUsers size={24} />}
          bgColor="bg-blue-100"
          textColor="text-blue-600"
        />

        {/* Staff Card */}
        <Card
          title="Staff Members"
          total={dashboardData.totalStaff}
          active={dashboardData.activeStaff}
          icon={<FiUser size={24} />}
          bgColor="bg-orange-100"
          textColor="text-orange-600"
        />

        {/* Incharge Card */}
        <Card
          title="Incharge"
          total={dashboardData.totalIncharge}
          active={dashboardData.activeIncharge}
          icon={<FiUser size={24} />}
          bgColor="bg-purple-100"
          textColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Overview Section */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Overview</h3>
          <div className="space-y-4">
            {[
              { label: 'Students', count: dashboardData.totalStudents, color: 'bg-blue-300' },
              { label: 'Staff', count: dashboardData.totalStaff, color: 'bg-orange-300' },
              { label: 'Incharge', count: dashboardData.totalIncharge, color: 'bg-purple-300' },
            ].map(({ label, count, color }) => {
              const totalUsers = dashboardData.totalStudents + dashboardData.totalStaff + dashboardData.totalIncharge;
              const percentage = totalUsers ? (count / totalUsers) * 100 : 0;

              return (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 mt-7">{label}</span>
                    <span className="text-sm text-gray-500 mt-7">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="p-1.5 rounded-full bg-gray-100 text-gray-600 mt-1">
                  <FiCalendar size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, total, active, icon, bgColor, textColor }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{total}</h3>
          <div className="flex items-center mt-2">
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {active} Active
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${bgColor} ${textColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
