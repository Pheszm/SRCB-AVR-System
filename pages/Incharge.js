import styles from "@/styles/Incharge.module.css";
import * as AiIcons from "react-icons/ai";
import * as AiIcons_md from "react-icons/md";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Dashboard from "./Incharge_Pages/Incharge_Dashboard";
import Reservations from "./Incharge_Pages/Incharge_Reservations";
import AVRLogs from "./Incharge_Pages/Incharge_AVRLogs";
import Items from "./Incharge_Pages/Incharge_Items";
import Transactions from "./Incharge_Pages/Incharge_Transactions";
import MyProfile from "./User_Pages/Profile_Modal";
import Cookies from 'js-cookie'; 

export default function Incharge_Main() {
    const router = useRouter(); 
    const [UserFullData, setUserFullData] = useState(null);

        const [SelectedModification, setSelectForm] = useState("");
        const handlePageChange2 = (page) => {
                setSelectForm(page);
            };
            
            const handleFormClose = () => {
                handlePageChange2("");
            };

    useEffect(() => {
        const fetchUserData = async () => {
          const userId = Cookies.get('userID');
          const userRole = Cookies.get('userRole'); 
    
          if (!userId || !userRole) {
            document.cookie = 'userID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            router.push('/'); 
            return;
          }
    
          try {
            // Make the API call to fetch user data based on userId and userRole
            const response = await fetch(`/api/User_Data/RetrieveData?userId=${userId}&userRole=${userRole}`);
            if (!response.ok) {
              throw new Error('Failed to fetch user data');
            }
    
            const data = await response.json();

            setUserFullData(data.user); 

          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
    
        fetchUserData();
      }, [router]);
    


    // Function to set the selected page
    const [selectedPage, setSelectedPage] = useState("Dashboard");
    const handlePageChange = (page) => {
        setSelectedPage(page);
    };

    // Sidebar Open Close Functionalities
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Toggle dropdown on Profile
    const [IsNotifBarOpen, setNotifBarOpen] = useState(false);
    const toggleNotifBar = () => {
        setNotifBarOpen(prev => !prev);
    };
    

    // Toggle dropdown on Profile
    const [IsProfileDropdown, setProfileDpOpen] = useState(false);
    const handleProfileClick = () => {
        setProfileDpOpen(prev => !prev);
    };

    function LogoutProcess(){
        document.cookie = 'userID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/');
    }

    return (
        <div className={styles.Gen_Body}>
            <title>SRCB AVR | Incharge</title>
            {/* Sidebar */}
            
            <aside className={`${styles.SidebarPart} ${isSidebarOpen ? styles.open : styles.closed}`}>   
                <div className={styles.mainLogo}>
                    <img src="./Assets/Img/AVR_Logo_White.png" alt="Logo" />
                    {isSidebarOpen && <h2>SRCB</h2>}
                </div>             

                <button className={selectedPage === "Dashboard" ? styles.active : ""} onClick={() => handlePageChange("Dashboard")}><AiIcons.AiOutlineHome size={25}/>{isSidebarOpen && 'Dashboard'}</button>
                <button className={selectedPage === "Reservations" ? styles.active : ""} onClick={() => handlePageChange("Reservations")}><AiIcons.AiOutlineCalendar size={25}/>{isSidebarOpen && 'Reservations'}</button>
                <button className={selectedPage === "Items" ? styles.active : ""} onClick={() => handlePageChange("Items")}><AiIcons.AiOutlineAppstoreAdd size={25}/>{isSidebarOpen && 'Items'}</button>
                <button className={selectedPage === "Transactions" ? styles.active : ""} onClick={() => handlePageChange("Transactions")}><AiIcons.AiOutlineBarChart size={25}/>{isSidebarOpen && 'Transactions'}</button>
                <button className={selectedPage === "AVRLogs" ? styles.active : ""} onClick={() => handlePageChange("AVRLogs")}><AiIcons.AiOutlineFileSearch size={25}/>{isSidebarOpen && 'Activity Logs'}</button>
                <button className={styles.SidebarToggler} onClick={toggleSidebar}>
                    <AiIcons.AiOutlineArrowLeft size={25}/>
                </button>
            </aside>

            {/* Right Side Area */}
            <div className={styles.RightSideArea}>
                <header className={styles.HeaderPart}>
                    <button className={styles.BurgerIcon} onClick={toggleSidebar}><AiIcons.AiOutlineMenu size={30} /></button>
                    
                    <div className={styles.HeaderProfilePart}>
            
                        {IsNotifBarOpen && (
                            <div className={styles.NotifBox}>
                                <h4>Notifications</h4>
                                <div>
                                    Notif Main Body
                                </div>
                            </div>
                        )}
                        <div className={styles.SeparationLine}></div>
                        <p>{UserFullData?.fullname}</p>
                        <img onClick={handleProfileClick} className={IsProfileDropdown === true ? styles.ProfileOpened : ""} src="./Assets/Img/UnknownProfile.jpg"></img>  
                        {IsProfileDropdown && (
                            <div className={styles.DropdownMenu}>
                                <ul>
                                    <li onClick={() => handlePageChange2("ViewMyProfile")}><AiIcons_md.MdSettings  size={15} style={{ marginRight: '5px' }}/>Profile Settings</li>
                                    <li onClick={LogoutProcess}><AiIcons_md.MdExitToApp  size={15} style={{ marginRight: '5px' }}/>Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </header>
                <div className={styles.BodyArea}>
                    {selectedPage === "Dashboard" && <Dashboard ChangePage={setSelectedPage} />}
                    {selectedPage === "Reservations" && <Reservations />}
                    {selectedPage === "AVRLogs" && <AVRLogs />}
                    {selectedPage === "Items" && <Items />}
                    {selectedPage === "Transactions" && <Transactions />}
                </div>
            </div>

            {SelectedModification === "ViewMyProfile" && (
                <div className={styles.BlurryBackground}>
                <MyProfile onClose={handleFormClose} />
            </div>
            )}
        </div>
    );
}
