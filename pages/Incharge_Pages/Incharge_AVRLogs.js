import styles from "@/styles/Incharge.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState } from 'react';

export default function Incharge_AVRLogs() {
    const [SelectedModification, setSelectForm] = useState("");
    const handlePageChange = (page) => {
        setSelectForm(page);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedAction, setSelectedAction] = useState("");  // Action filter
    const [selectedMonth, setSelectedMonth] = useState("");  // New state for month filter
    const rowsPerPage = 10;

    // Sample names array
    const sampleNames = [
        'John Doe',
        'Jane Smith',
        'Michael Johnson',
        'Emily Davis',
        'David Lee'
    ];

    const data = Array.from({ length: 500 }, (_, index) => ({
        id: index + 1,
        reservationDate: `3/${(index % 30) + 1}/2025 ${(index % 12) + 1}:00PM to ${(index % 12) + 2}:00PM`,  // Example date and time
        fullName: sampleNames[index % sampleNames.length],  // Sample names cycle through
        action: ['Update', 'Add', 'Remove', 'Approved', 'Canceled', 'Declined'][index % 6], // Random sample actions
        record: index % 5 === 0 ? 'AVR Venue' : index % 5 === 1 ? 'Speaker' : index % 5 === 2 ? 'Microphone' : index % 5 === 3 ? 'Lighting' : 'Projector',
        category: index % 2 === 0 ? 'Venue' : 'Item',   // Example category (Venue and Item only)
    }));

    // Extract unique categories, actions, and dates from the data
    const categories = [...new Set(data.map(item => item.category))];
    const actions = [...new Set(data.map(item => item.action))];  // Extract unique actions

    const filteredData = data.filter(
        ({ reservationDate, fullName, action, record, category }) => {
            // Extract the year and month from reservationDate (formatted as MM/DD/YYYY HH:MMAM/PM to HH:MMAM/PM)
            const dateParts = reservationDate.split(" ")[0].split("/"); // Extract MM/DD/YYYY
            const yearMonth = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}`;  // Format as YYYY-MM (e.g., 2025-03)

            return (
                (selectedCategory === "" || category === selectedCategory) &&
                (selectedAction === "" || action === selectedAction) &&
                (selectedMonth === "" || yearMonth === selectedMonth) &&  // Filter by selected month
                (reservationDate.toLowerCase().includes(search.toLowerCase()) ||
                    fullName.toLowerCase().includes(search.toLowerCase()) ||
                    action.toLowerCase().includes(search.toLowerCase()) ||
                    record.toLowerCase().includes(search.toLowerCase()) ||
                    category.toLowerCase().includes(search.toLowerCase()))
            );
        }
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className={styles.ItemBodyArea}>
            {/* Updated Header Section */}
            <header className={styles.HeaderSection}>
               <div>
                <h2>Activity Logs</h2>
                    <p>Monitor activity logs to track system events and user actions.</p>
                    <br /><br />
               </div>
               <div>
                    <button className={styles.SettingsBtn}>Export Table</button>
               </div>
            </header>

            <div className={styles.ItemFilterArea}>
                <input
                    type="search"
                    placeholder="Search for Logs"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                <div className={styles.datefiltering}>
                    <label>Month:</label>
                    <input
                        type="month"
                        value={selectedMonth}
                        placeholder="Select Month"
                        className={styles.DatePickerrr}
                        onChange={(e) => { setSelectedMonth(e.target.value), setCurrentPage(1); }}
                    />
                </div>

                <div>
                    <select
                        value={selectedAction}
                        onChange={(e) => { setSelectedAction(e.target.value), setCurrentPage(1); }}
                    >
                        <option value="">All Actions</option>
                        {actions.map((action) => (
                            <option key={action} value={action}>
                                {action}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => { setSelectedCategory(e.target.value), setCurrentPage(1); }}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            <table className={styles.ItemTable}>
                <thead>
                    <tr>
                        <th>Date & Time</th>
                        <th>Fullname</th>
                        <th>Action</th>
                        <th>Record</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map(({ id, reservationDate, fullName, action, record, category }) => (
                        <tr key={id}>
                            <td>{reservationDate}</td>
                            <td>{fullName}</td>
                            <td>{action}</td>
                            <td>{record}</td>
                            <td>{category}</td>
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
                    {SelectedModification === "AddItem" && <AddItemsForm />}
                    <button className={styles.closeBtn} onClick={() => handlePageChange("")}>X</button>
                </div>
            )}
        </div>
    );
}
