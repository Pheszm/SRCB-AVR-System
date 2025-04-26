import styles from "@/styles/Admin.module.css";
import * as AiIcons from "react-icons/ai";
import * as AiIcons_md from "react-icons/md";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Inchargee from "./Admin_Pages/Admin_Incharge";
import Stafff from "./Admin_Pages/Admin_Staff";
import Studentt from "./Admin_Pages/Admin_Student";
import Cookies from 'js-cookie'; 

export default function Incharge_Main() {
    const router = useRouter(); 


  useEffect(() => {
    const userId = Cookies.get('userID');
    const userRole = Cookies.get('userRole'); 

    if (!userId || !userRole) {
    document.cookie = 'userID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push('/');  // Adjust the path to your actual login page
    }
  }, [router]);

    
    // Function to set the selected page
    const [selectedPage, setSelectedPage] = useState("Student");
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
            <title>SRCB AVR | Admin</title>
            {/* Sidebar */}
            
            <aside className={`${styles.SidebarPart} ${isSidebarOpen ? styles.open : styles.closed}`}>   
                <div className={styles.mainLogo}>
                    <img src="./Assets/Img/AVR_Logo_White.png" alt="Logo" />
                    {isSidebarOpen && <h2>SRCB</h2>}
                </div>             

                <button className={selectedPage === "Student" ? styles.active : ""} onClick={() => handlePageChange("Student")}><AiIcons.AiOutlineBook size={25}/>{isSidebarOpen && 'Student'}</button>
                <button className={selectedPage === "Staff" ? styles.active : ""} onClick={() => handlePageChange("Staff")}><AiIcons.AiOutlineUser size={25}/>{isSidebarOpen && 'Staff'}</button>
                <button className={selectedPage === "Incharge" ? styles.active : ""} onClick={() => handlePageChange("Incharge")}><AiIcons.AiOutlineUsergroupAdd  size={25}/>{isSidebarOpen && 'Incharge'}</button>
                <button className={styles.SidebarToggler} onClick={toggleSidebar}>
                    <AiIcons.AiOutlineArrowLeft size={25}/>
                </button>
            </aside>

            {/* Right Side Area */}
            <div className={styles.RightSideArea}>
                <header className={styles.HeaderPart}>
                    <button className={styles.BurgerIcon} onClick={toggleSidebar}><AiIcons.AiOutlineMenu size={30} /></button>
                    
                    <div className={styles.HeaderProfilePart}>
                        <p>ADMIN</p>
                        <img onClick={handleProfileClick} className={IsProfileDropdown === true ? styles.ProfileOpened : ""} src="./Assets/Img/UnknownProfile.jpg"></img>  
                        {IsProfileDropdown && (
                            <div className={styles.DropdownMenu}>
                                <ul>
                                    <li onClick={LogoutProcess}><AiIcons_md.MdExitToApp  size={15} style={{ marginRight: '5px' }}/>Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </header>
                <div className={styles.BodyArea}>
                    {selectedPage === "Student" && <Studentt />}
                    {selectedPage === "Staff" && <Stafff />}
                    {selectedPage === "Incharge" && <Inchargee />}
                </div>
            </div>

        </div>
    );
}
