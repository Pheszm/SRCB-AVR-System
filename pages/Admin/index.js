import styles from "@/styles/Dashboard.module.css";
import * as AiIcons_md from "react-icons/md";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Incharge from "./Incharge";
import Staff from "./Staff";
import Student from "./Student";
import DashboardPage from "./Dashboard";
import Swal from 'sweetalert2';
import Settings from "../Incharge/Settings";
import styles2 from "@/styles/Tables.module.css";

export default function Incharge_Main() {
    const router = useRouter();   
    
    const [SelectedModal, setSelectedModal] = useState('');
    function CloseModal(){
        setSelectedModal('');
    }


    // Toggle dropdown on Profile
    const [IsProfileDropdown, setProfileDpOpen] = useState(false);
    const handleProfileClick = () => {
        setProfileDpOpen(prev => !prev);
    };

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




    function LogoutFunc(){
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

    return (
        <div className={styles.Gen_Body}>
            <title>Admin | SRCB AVR Reservation & Inventory System</title>

            {/* SIDE BAR AREA */}
            <aside className={`${styles.SidebarPart} ${isSidebarOpen ? styles.open : styles.closed}`}>   
                <div className={styles.mainLogo}>
                    <img src="./App_Icon.png" alt="Logo" />
                    {isSidebarOpen && <h2 style={{color: "white"}}>SRCB</h2>}
                </div>  
                <span className={styles.CustomLine}/>           
                <br/><br/><br/><br/><br/>
                <button className={selectedPage === "Dashboard" ? styles.active : ""} onClick={() => handlePageChange("Dashboard")}><AiIcons_md.MdDashboard size={30}/>{isSidebarOpen && 'Dashboard'}</button>
                <button className={selectedPage === "Student" ? styles.active : ""} onClick={() => handlePageChange("Student")}><AiIcons_md.MdSchool size={30}/>{isSidebarOpen && 'Student'}</button>
                <button className={selectedPage === "Staff" ? styles.active : ""} onClick={() => handlePageChange("Staff")}><AiIcons_md.MdBadge size={30}/>{isSidebarOpen && 'Staff'}</button>
                <button className={selectedPage === "Incharge" ? styles.active : ""} onClick={() => handlePageChange("Incharge")}><AiIcons_md.MdManageAccounts size={30}/>{isSidebarOpen && 'Incharge'}</button>
                <button className={styles.SidebarToggler} onClick={toggleSidebar}>
                    <AiIcons_md.MdArrowBack size={25}/>
                </button>
                <button className={styles.LogoutButton} onClick={() => LogoutFunc()}><AiIcons_md.MdExitToApp size={30}/>{isSidebarOpen && 'Logout'}</button>
            </aside>



            {/* RIGHT SIDE AREA */}
            <div className={styles.RightSideArea}>
                <header className={styles.HeaderPart}>
                    <button className={styles.BurgerIcon} onClick={toggleSidebar}><AiIcons_md.MdMenu size={30} /></button>
                    <div className={styles.mainLogo}>
                        <h2></h2>
                    </div>    



                     {/* HEADER PART AREA */}
                    <div className={styles.HeaderProfilePart}>

                        <div className={styles.SeparationLine}></div>
                        <p>ADMINISTRATOR</p>
                        <img onClick={handleProfileClick} className={IsProfileDropdown === true ? styles.ProfileOpened : ""} src="./BSIT_Logo.png"></img>  
                        {IsProfileDropdown && (
                            <div className={styles.DropdownMenu}>
                                <ul>
                                    <li onClick={() => setSelectedModal("ProfileSettings")}><AiIcons_md.MdSettings  size={15} style={{ marginRight: '5px' }}/>Profile Settings</li>
                                    <li onClick={LogoutFunc}><AiIcons_md.MdExitToApp  size={15} style={{ marginRight: '5px' }}/>Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </header>


                {/* MAIN BODY AREA */}
                <div className={styles.BodyArea}>
                    {selectedPage === "Dashboard" && (
                        <DashboardPage/>
                    )}

                    {selectedPage === "Student" && (
                        <Student/>
                    )}

                    {selectedPage === "Staff" && (
                        <Staff/>
                    )}

                    {selectedPage === "Incharge" && (
                        <Incharge/>
                    )}
                </div>
            </div>
        {SelectedModal === 'ProfileSettings' && (
            <div className={styles2.BlurryBackground}>
                <Settings onClose={() => CloseModal()} />
            </div>
        )}
        </div>
    );
}
