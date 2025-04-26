import styles from "@/styles/User.module.css";
import * as AiIcons from "react-icons/ai";
import * as AiIcons_md from "react-icons/md";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import AllTransact from "./User_Pages/User_allTransactions";
import StudentReservationForm from "./User_Pages/Reservation_Form/student_reservation_form";
import TodayTransaction from "./User_Pages/Dashboard_Forms/Todays_Trasanction";
import Notificationss from "./User_Pages/Dashboard_Forms/Notifications";
import Cookies from 'js-cookie'; 


export default function Incharge_Main() {
    const router = useRouter();     
    const [UserFullData, setUserFullData] = useState(null);
    const [userId, setuserId] = useState("");
    const [userRole, setuserRole] = useState("");

    const handleFormClose = () => {
        handlePageChange("");
        window.location.reload();
    };

    const fetchUserData = async () => {
        const storedUserId = Cookies.get('userID');
        const storedUserRole = Cookies.get('userRole'); 
  
        if (!storedUserId || !storedUserRole) {
            document.cookie = 'userID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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




      const [MyTransactions, setMyTransactions] = useState([]);
      const FetchTransactionData = async () => {
        try {
            const response = await fetch('/api/User_Func/Reservation_Func/Fetch_Transactions');
            const data = await response.json();
            setMyTransactions(data); 
        } catch (error) {
            console.error("Error fetching transaction data: ", error);
        }
    }
    
      useEffect(() => {
        fetchUserData();
        FetchTransactionData();
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
        document.cookie = 'userID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/');
    }


    const [SelectedModification, setSelectForm] = useState("");
    const handlePageChange = (page) => {
            setSelectForm(page);
        };
    const handleReservationForm = () => {
        handlePageChange("StudentReservation");
    };

    // Function to set the selected page
    const [selectedPage, setSelectedPage] = useState("Home");
    const handlePageChange2 = (page) => {
        setSelectedPage(page);
    };

    // Sidebar Open Close Functionalities
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    return (
        <div className={styles.Gen_Body}>
            <title>SRCB AVR | User</title>

            <aside className={`${styles.SidebarPart} ${isSidebarOpen ? styles.open : styles.closed}`}>   
                <div className={styles.mainLogo}>
                    <img src="./Assets/Img/AVR_Logo_White.png" alt="Logo" />
                    {isSidebarOpen && <h2 style={{color: "white"}}>SRCB</h2>}
                </div>             
                <br/><br/><br/><br/><br/>
                <button className={selectedPage === "Home" ? styles.active : ""} onClick={() => handlePageChange2("Home")}><AiIcons.AiOutlineHome size={25}/>{isSidebarOpen && 'Home'}</button>
                <button className={selectedPage === "Transactions" ? styles.active : ""} onClick={() => handlePageChange2("Transactions")}><AiIcons.AiOutlineAppstoreAdd size={25}/>{isSidebarOpen && 'Transactions'}</button>
                <button className={styles.SidebarToggler} onClick={toggleSidebar}>
                    <AiIcons.AiOutlineArrowLeft size={25}/>
                </button>
            </aside>

            <div className={styles.RightSideArea}>
                <header className={styles.HeaderPart}>
                <button className={styles.BurgerIcon} onClick={toggleSidebar}><AiIcons.AiOutlineMenu size={30} /></button>
                    <div className={styles.mainLogo}>
                        <h2></h2>
                    </div>    

                    <div className={styles.HeaderProfilePart}>
                        <button onClick={toggleNotifBar}   className={`${styles.NotifBtn} ${IsNotifBarOpen ? styles.NotifBtnOpened : ""}`}
                        ><AiIcons_md.MdNotifications size={22} /></button>
                        {IsNotifBarOpen && (
                            <div className={styles.NotifBox}>
                                <h4>Notifications</h4>
                                <div>
                                    <Notificationss/>
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

                {selectedPage === "Transactions" && (
                    <AllTransact/>
                )}




                {selectedPage === "Home" && (
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
                            <h4>
                            {MyTransactions.reduce((count, transaction) => {
                                if (transaction.Usertype.toString() === userRole.toString() && 
                                    transaction.User_id.toString() === userId.toString()) {
                                count += 1;
                                }
                                return count;
                            }, 0)}
                            </h4>
                        </span>

                    </div>

                    <div>
                        <span>
                            <AiIcons.AiOutlineWallet size={30} /> 
                        </span>
                        <span>
                            <p>Transactions Today</p>
                            <h4>
                                {
                                    MyTransactions.filter(transaction => {
                                        const transactionDate = new Date(transaction.dateofuse);
                                        if (isNaN(transactionDate)) return false;

                                        const formattedTransactionDate = `${(transactionDate.getMonth() + 1).toString().padStart(2, '0')}/${transactionDate.getDate().toString().padStart(2, '0')}/${transactionDate.getFullYear()}`;

                                        const manilaNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
                                        const formattedToday = `${(manilaNow.getMonth() + 1).toString().padStart(2, '0')}/${manilaNow.getDate().toString().padStart(2, '0')}/${manilaNow.getFullYear()}`;

                                        return (
                                            transaction.Usertype.toString() === userRole.toString() &&
                                            transaction.User_id.toString() === userId.toString() &&
                                            formattedTransactionDate === formattedToday
                                        );
                                    }).length
                                }
                            </h4>
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
                        <TodayTransaction/>
                    </div> 


                    <div className={styles.LowerSquaresDIV}>
                        <AllTransact/>
                    </div>
                </div>

            </div>

            )}





            </div>

            {SelectedModification === "StudentReservation" && (
                <div className={styles.BlurryBackground}>
                <StudentReservationForm userId={userId} userRole={userRole} onClose={handleFormClose} />
            </div>

            )}
        </div>
    </div>
    );
}
