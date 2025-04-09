import styles from "@/styles/User.module.css";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";

export default function Incharge_Main() {
    const [showActions, setShowActions] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 7;

    // Filtered data based on search term
    const filteredData = transactions.filter(item => 
        item.transac_status.toLowerCase().includes(search.toLowerCase()) || 
        item.dateofuse.toLowerCase().includes(search.toLowerCase()) || 
        item.Transac_Category.toLowerCase().includes(search.toLowerCase())
    );

    // Calculate total pages based on filtered data
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const router = useRouter(); 

    // Fetch data from API
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/User_Func/Reservation_Func/Fetch_Transactions');
                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        }

        fetchData();
    }, []);

    // Get rows for the current page
    const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to page 1 on new search
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    function convertTo12HourFormat(time) {
        const [hours, minutes] = time.split(":");
        let hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';

        // Handle the case for midnight (00:00) and noon (12:00)
        if (hour === 0) {
            hour = 12; // Midnight (00:00) should be 12:00 AM
        } else if (hour > 12) {
            hour = hour - 12; // Convert 24-hour to 12-hour format (for hours 13-23)
        }

        return `${hour}:${minutes} ${ampm}`;
    }

    // Handle pagination buttons
    const handlePagination = (direction) => {
        if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

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

    // Logout process
    function LogoutProcess() {
        router.push('/');
    }

    return (
        <div>
            <h3>All Transaction</h3>
            <br />
            <span className={styles.ItemFilterArea}>
                <input
                    className={styles.SearchBarrrr}
                    type="search"
                    placeholder="Search for Transactions"
                    value={search}
                    onChange={handleSearchChange}
                />
                <button 
                    className={`${styles.SettingsBtn} ${showActions ? styles.SettingsBtnOpened : ""}`} 
                    onClick={() => setShowActions(!showActions)}
                >
                    Settings
                </button>
            </span>

            <div className={styles.DashTableWrapper}>
                <table className={styles.DashTable}>
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Date & Time</th>
                            <th>Item/Venue</th>
                            {showActions ? <th>Actions</th> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((transaction, index) => {
                            const userId = sessionStorage.getItem('userId'); // Get the userId from sessionStorage
                            const userRole = sessionStorage.getItem('userRole'); // Get the userRole from sessionStorage


                            if (parseInt(transaction.User_id) === parseInt(userId) && transaction.Usertype === userRole) {
                                return (
                                    <tr key={index}>
                                        <td>{transaction.reservation_status}</td>
                                        <td>{formatDate(transaction.dateofuse)}, {convertTo12HourFormat(transaction.fromtime)} to {convertTo12HourFormat(transaction.totime)}</td>
                                        <td>
                                        {transaction.items && Array.isArray(transaction.items) && transaction.items.length > 0 
    ? transaction.items.map(item => `${item.Quantity || ""} ${item.I_Name || 'AVR Venue'}`).join(', ') 
    : 'HAHA'}

                                        </td>
                                        {showActions && (
                                            <td>
                                                <button>View</button>
                                                {transaction.transac_status === "Ongoing" && (
                                                    <button className={styles.SuccessBtnnn}>Returned</button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            }
                            return null; // If the condition doesn't match, render nothing
                        })}
                    </tbody>
                </table>
            </div>

            <span className={styles.PagenationArea}>
                <button
                    onClick={() => handlePagination('prev')}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>{currentPage}</span>
                <button
                    onClick={() => handlePagination('next')}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </span>
        </div>
    );
}
