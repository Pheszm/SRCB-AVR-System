import { useState, useEffect } from 'react';
import Dashboard from "./Dashboard";
import Transaction from "./Transactions";
import Inventory from "./Inventory";
import Reports from "./Reports";
import * as AiIcons_md from "react-icons/md";
import Cookies from 'js-cookie'; 
import { useRouter } from "next/router";
import styles from "@/styles/Tables.module.css";
import Settings from "./Settings";
import Swal from 'sweetalert2';

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const user_id = Cookies.get('user_id');
  const [user, setUser] = useState(null);
  const [SelectedModal, setSelectedModal] = useState('');


  const router = useRouter(); 
  function LogoutProcess(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        document.cookie = 'user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'user_type=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/');
      }
    });
  }

  function CloseModal(){
    setSelectedModal('');
  }

useEffect(() => {
  async function fetchUserProfile() {
    if (!user_id) return;

    try {
      const res = await fetch('/api/users', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id }),  // Sending user_id in the body
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data);
        console.log('User profile fetched successfully:', data);
      } else {
        console.error('Error fetching user profile:', data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  }

  fetchUserProfile();
}, [user_id]);


  return (
    <div className="min-h-screen bg-white">
      <title>Incharge | SRCB AVR Reservation & Inventory System</title>
      {/* Header */}
      <header className="shadow" style={{ backgroundColor: '#071240' }}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center relative">
            <h1 className="text-3xl font-bold text-white">{user ? `${user.user_type}` : 'Loading...'}</h1>
            <div className="flex items-center justify-end gap-2 absolute w-full">
              <span className="text-white">{user ? `${user.last_name}, ${user.first_name}` : 'Loading...'}</span>
              <div className="bg-[url('../public/Assets/Img/UnknownProfile.jpg')] bg-cover h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
              </div>
               {/* Profile Menu Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute top-10 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={() => setSelectedModal("ProfileSettings")}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <AiIcons_md.MdSettings  size={20}/>
                    Profile Settings
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={LogoutProcess}>
                    <AiIcons_md.MdExitToApp  size={20}/>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto overflow-y-hidden">
          <nav className="-mb-px flex space-x-8">
            {['Dashboard', 'Transaction', 'Inventory', 'Reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Render Active Tab */}
        {activeTab === 'Dashboard' && <Dashboard />}
        {activeTab === 'Transaction' && <Transaction />}
        {activeTab === 'Inventory' && <Inventory />}
        {activeTab === 'Reports' && <Reports />}

        {SelectedModal === 'ProfileSettings' && (
          <div className={styles.BlurryBackground}>
            <Settings onClose={() => CloseModal()} />
          </div>
        )}

      </main>
    </div>
  );
}
