import styles from "@/styles/User.module.css";
import * as AiIcons from "react-icons/ai";
import * as AiIcons_md from "react-icons/md";
import React, { useState } from 'react';
import { useRouter } from "next/router";
import AllTransact from "./User_Pages/User_allTransactions";

export default function Incharge_Main() {
        const [showActions, setShowActions] = useState(false);
    const router = useRouter(); 
    const today = new Date().toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' });
    const [search, setSearch] = useState("");
    // Sample filteredData array (replace with actual data)
    const filteredData = [
        { status: "Upcoming", date: "3/6/2025 (1:00PM to 4:00PM)", items: "1 Microphone, 1 Speaker" },
        { status: "Ongoing", date: "3/6/2025 (1:00PM to 4:00PM)", items: "1 Projector" },
        // Add more data objects as necessary
    ];

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    // Get rows for the current page
    const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Toggle dropdown on Notif
    const [IsNotifBarOpen, setNotifBarOpen] = useState(false);
    const toggleNotifBar = () => {
        setNotifBarOpen(prev => !prev);
    };
    
    // Toggle dropdown on Profile
    const [IsProfileDropdown, setProfileDpOpen] = useState(false);
    const handleProfileClick = () => {
        setProfileDpOpen(prev => !prev);
    };

    function LogoutProcess() {
        router.push('/');
    }

    
    function GotoStudentResForm(){
        router.push('/student_reservation');
    }

    return (
        <div className={styles.Gen_Body}>
            <title>SRCB AVR | User</title>


            {/* Right Side Area */}
            <div className={styles.RightSideArea}>
                <header className={styles.HeaderPart}>
                    <div className={styles.mainLogo}>
                        <img src="./Assets/Img/AVR_Logo_Blue.png" alt="Logo" />
                        <h2>SRCB</h2>
                    </div>    

                    <div className={styles.HeaderProfilePart}>
                        <button onClick={toggleNotifBar}   className={`${styles.NotifBtn} ${IsNotifBarOpen ? styles.NotifBtnOpened : ""}`}
                        ><AiIcons_md.MdNotifications size={22} /></button>
                        {IsNotifBarOpen && (
                            <div className={styles.NotifBox}>
                                <h4>Notifications</h4>
                                <div>
                                    Notif Main Body
                                </div>
                            </div>
                        )}
                        <div className={styles.SeparationLine}></div>
                        <p>Carl Wyne S. Gallardo</p>
                        <img onClick={handleProfileClick} className={IsProfileDropdown === true ? styles.ProfileOpened : ""} src="./Assets/Img/UnknownProfile.jpg"></img>  
                        {IsProfileDropdown && (
                            <div className={styles.DropdownMenu}>
                                <ul>
                                    <li><AiIcons_md.MdSettings  size={15} style={{ marginRight: '5px' }}/>Profile Settings</li>
                                    <li onClick={LogoutProcess}><AiIcons_md.MdExitToApp  size={15} style={{ marginRight: '5px' }}/>Logout</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </header>
                <div className={styles.BodyArea}>






                <div className={styles.DashBodyArea}>

                    <div className={styles.UpperSquares}>
                        <div className={styles.CenterItemDIV}>
                            <span>
                                <button 
                                onClick={GotoStudentResForm}
                                className={styles.CommonButtonn}>
                                    <AiIcons.AiOutlineCalendar size={30} /> 
                                    RESERVE NOW
                                </button>
                            </span>
                        </div>

                        <div>
                            <span>
                                <AiIcons.AiOutlineAppstore  size={30} /> 
                            </span>
                            <span>
                                <p>Total Transactions</p>
                                <h4>20</h4>
                            </span>
                        </div>

                        <div>
                            <span>
                                <AiIcons.AiOutlineWallet size={30} /> 
                            </span>
                            <span>
                                <p>Transactions Today</p>
                                <h4>7</h4>
                            </span>
                        </div>

                        <div>
                            <span>
                                <AiIcons.AiOutlineClockCircle size={30} /> 
                            </span>
                            <span>
                                <p>Date Today</p>
                                <h4>{today}</h4>
                            </span>
                        </div>
                    </div>



                    <div className={styles.LowerSquares}>

                        <div className={styles.LowerSquaresDIV}>
                            <h3>Upcoming Transactions</h3>
                            <div className={styles.DashTableWrapper}>
                                <table className={styles.DashTable}>
                                    <thead>
                                        <tr>
                                            <th>Status</th>
                                            <th>Date & Time</th>
                                            <th>Item/Venue</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Upcoming</td>
                                            <td>3/6/2025 (1:00PM to 4:00PM)</td>
                                            <td>1 Microphone, 1 Speaker</td>
                                            <td>
                                                <button>View</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Ongoing</td>
                                            <td>3/6/2025 (1:00PM to 4:00PM)</td>
                                            <td>1 Projector</td>
                                            <td>
                                                <button>View</button>
                                                <button className={styles.SuccessBtnnn}>Returned</button>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div> 


                        <div className={styles.LowerSquaresDIV}>
                            <AllTransact/>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    );
}
