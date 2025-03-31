import styles from "@/styles/User.module.css";
import * as AiIcons from "react-icons/ai";
import * as AiIcons_md from "react-icons/md";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import AllTransact from "./User_Pages/User_allTransactions";
import StudentReservationForm from "./User_Pages/Reservation_Form/student_reservation_form";


export default function Incharge_Main() {
    const router = useRouter();     
    const [UserFullData, setUserFullData] = useState(null);
    const [userId, setuserId] = useState("");
    const [userRole, setuserRole] = useState("");

    const handleFormClose = () => {
        handlePageChange("");
        fetchItems();
    };

    const fetchUserData = async () => {
        const storedUserId = sessionStorage.getItem('userId');
        const storedUserRole = sessionStorage.getItem('userRole');
  
        if (!storedUserId || !storedUserRole) {
          // If there's no userId or userRole, redirect to the login page
          router.push('/'); // Adjust the path to your login page
          return;
        }
  
        setuserId(storedUserId); 
        setuserRole(storedUserRole); 

        try {
          // Make the API call to fetch user data based on userId and userRole
          const response = await fetch(`/api/User_Data/RetrieveData?userId=${storedUserId}&userRole=${storedUserRole}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
  
          const data = await response.json();

          setUserFullData(data.user); 

        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };


      useEffect(() => {
        fetchUserData();
          }, [router]);


    const today = new Date().toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' });
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
        document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        router.push('/');
    }


    const [SelectedModification, setSelectForm] = useState("");
    const handlePageChange = (page) => {
            setSelectForm(page);
        };
    const handleReservationForm = () => {
        handlePageChange("StudentReservation");
    };


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
                        <p>{UserFullData?.fullname}</p>
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
                                onClick={handleReservationForm}
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

            {SelectedModification === "StudentReservation" && (
                <div className={styles.BlurryBackground}>
                <StudentReservationForm userId={userId} userRole={userRole} onClose={handleFormClose} />
                <button className={styles.closeBtn} onClick={() => handlePageChange("")}>X</button>
            </div>

            )}
        </div>
    </div>
    );
}
