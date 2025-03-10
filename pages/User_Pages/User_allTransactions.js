import styles from "@/styles/User.module.css";
import React, { useState } from 'react';
import { useRouter } from "next/router";

export default function Incharge_Main() {
    const [showActions, setShowActions] = useState(false);
    const router = useRouter(); 
    const today = new Date().toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' });
    const [search, setSearch] = useState("");

    // Helper function to generate random date
    const getRandomDate = () => {
        const startDate = new Date();
        const randomDays = Math.floor(Math.random() * 30);  // Generate random day within 30 days
        startDate.setDate(startDate.getDate() + randomDays);
        const hours = Math.floor(Math.random() * 12) + 1; // Random hour between 1 and 12
        const minutes = Math.floor(Math.random() * 60);
        return `${startDate.toLocaleDateString('en-PH')} (${hours}:${minutes < 10 ? '0' : ''}${minutes}AM to ${hours + 3}:${minutes < 10 ? '0' : ''}${minutes}PM)`;
    };

    // Helper function to generate random status
    const getRandomStatus = () => {
        const statuses = ["Upcoming", "Ongoing", "Completed"];
        return statuses[Math.floor(Math.random() * statuses.length)];
    };

    // Helper function to generate random items
    const getRandomItems = () => {
        const items = [
            "1 Microphone", "1 Projector", "2 Laptops", "1 Speaker", "1 Whiteboard", 
            "5 Chairs", "1 Sound System", "3 Tables", "2 Microphones", "3 Projectors"
        ];
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    };

    // Generate random sample data (30 items)
    const generateRandomData = () => {
        let data = [];
        for (let i = 0; i < 30; i++) {
            data.push({
                status: getRandomStatus(),
                date: getRandomDate(),
                items: getRandomItems()
            });
        }
        return data;
    };

    // Get random data and filter it based on search
    const data = generateRandomData();
    const filteredData = data.filter(item => 
        item.status.toLowerCase().includes(search.toLowerCase()) || 
        item.date.toLowerCase().includes(search.toLowerCase()) || 
        item.items.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 7;
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

    return (
        <div>
            <h3>All Transaction</h3>
            <br/>
            <span className={styles.ItemFilterArea}>
                <input
                    className={styles.SearchBarrrr}
                    type="search"
                    placeholder="Search for Transactions"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                <button className={`${styles.SettingsBtn} ${showActions ? styles.SettingsBtnOpened : ""}`} onClick={() => setShowActions(!showActions)}>
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
                        {currentRows.map((item, index) => (
                            <tr key={index}>
                                <td>{item.status}</td>
                                <td>{item.date}</td>
                                <td>{item.items}</td>
                                {showActions && (
                                    <td>
                                        <button>View</button>
                                        {item.status === "Ongoing" && (
                                            <button className={styles.SuccessBtnnn}>Returned</button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <span className={styles.PagenationArea}>
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>{currentPage}</span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </span>
        </div>
    );
}
