import styles from "@/styles/Incharge.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState } from 'react';
import AddItemsForm from "./Forms/AddStudent";

export default function Incharge_Reservations() {
    const [SelectedModification, setSelectForm] = useState("");
    const handlePageChange = (page) => {
        setSelectForm(page);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [showActions, setShowActions] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedUserType, setSelectedUserType] = useState(""); // New state for userType filter
    const rowsPerPage = 10;

    const data = Array.from({ length: 500 }, (_, index) => ({
        id: index + 1,
        reservationDate: `2025-03-${(index % 30) + 1}`,  // Example date
        userType: index % 2 === 0 ? 'Student' : 'Faculty', // Example usertype
        fullName: `User ${index + 1}`,  // Example full name
        need: `Need ${index + 1}`,  // Example need
        category: index % 2 === 0 ? 'Item' : 'Venue',   // Example category (Category 1 to Category 5)
    }));

    // Extract unique categories and user types from the data
    const categories = [...new Set(data.map(item => item.category))];
    const userTypes = [...new Set(data.map(item => item.userType))]; // Get unique user types

    const filteredData = data.filter(
        ({ reservationDate, userType, fullName, need, category }) =>
            (selectedCategory === "" || category === selectedCategory) &&
            (selectedUserType === "" || userType === selectedUserType) &&  // Added filter for userType
            (reservationDate.toLowerCase().includes(search.toLowerCase()) ||
            userType.toLowerCase().includes(search.toLowerCase()) ||
            fullName.toLowerCase().includes(search.toLowerCase()) ||
            need.toLowerCase().includes(search.toLowerCase()) ||
            category.toLowerCase().includes(search.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className={styles.ItemBodyArea}>
            {/* Updated Header Section */}
            <header className={styles.HeaderSection}>
                <h2>Reservations</h2>
                <p>Manage and track reservation requests</p>
                <br/><br/>
            </header>

            <div className={styles.ItemFilterArea}>
                <input
                    type="search"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value); 
                        setCurrentPage(1); 
                    }}
                />

                <div>
                    <select 
                        value={selectedCategory} 
                        onChange={(e) => {setSelectedCategory(e.target.value), setCurrentPage(1);}}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <select 
                        value={selectedUserType} 
                        onChange={(e) => {setSelectedUserType(e.target.value), setCurrentPage(1);}}
                    >
                        <option value="">All User Types</option>
                        {userTypes.map((userType) => (
                            <option key={userType} value={userType}>
                                {userType}
                            </option>
                        ))}
                    </select>
                </div>

                <button className={`${styles.SettingsBtn} ${showActions ? styles.SettingsBtnOpened : ""}`} onClick={() => setShowActions(!showActions)}>
                    Settings
                </button>
            </div>

            <table className={styles.ItemTable}>
                <thead>
                    <tr>
                        <th>Date & Time</th>
                        <th className={styles.QtyColumn}>Usertype</th>
                        <th className={styles.QtyColumn}>Fullname</th>
                        <th className={styles.QtyColumn}>Need</th>
                        <th>Category</th>
                        {showActions && (
                        <th>Actions</th>
                    )}
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map(({ id, reservationDate, userType, fullName, need, category }) => (
                        <tr key={id}>
                            <td>{reservationDate}</td>
                            <td>{userType}</td>
                            <td>{fullName}</td>
                            <td>{need}</td>
                            <td>{category}</td>
                            {showActions && (
                            <td>
                                <button>View</button>
                                <button>Approve</button>
                                <button>Decline</button>
                            </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.PagenationArea}>
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
            </div>

            {SelectedModification === "AddItem" && (
            <div className={styles.BlurryBackground}>
                 {SelectedModification === "AddItem" && <AddItemsForm/>}
                <button className={styles.closeBtn} onClick={() => handlePageChange("")}>X</button>
            </div>
            )}
        </div>
    );
}
