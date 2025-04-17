import styles from "@/styles/Incharge.module.css";
import { useState, useEffect } from "react";

export default function Incharge_AVRLogs() {
    const [logsData, setLogsData] = useState([]);  // To store fetched logs
    const [selectedModification, setSelectForm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedAction, setSelectedAction] = useState("");  // Action filter
    const [selectedMonth, setSelectedMonth] = useState("");  // New state for month filter
    const rowsPerPage = 10;

    useEffect(() => {
        // Fetch logs data from the API
        const fetchLogs = async () => {
            try {
                const response = await fetch('/api/Incharge_Func/Activity_Logs_Func/Fetch_Logs'); // Adjust the endpoint path as per your setup
                const data = await response.json();
                setLogsData(data);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };

        fetchLogs();
    }, []);

    const filteredData = logsData.filter(({ DateTimeModified, Action, I_Name, C_Fullname }) => {
        // Convert DateTimeModified to a Date object
        const date = new Date(DateTimeModified); // JavaScript Date constructor will handle the format properly
    
        // Format the date as YYYY-MM (e.g., 2025-03)
        const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
        return (
            (selectedAction === "" || Action === selectedAction) &&
            (selectedMonth === "" || yearMonth === selectedMonth) &&
            (DateTimeModified.toLowerCase().includes(search.toLowerCase()) ||
                Action.toLowerCase().includes(search.toLowerCase()) ||
                I_Name.toLowerCase().includes(search.toLowerCase()) ||
                C_Fullname.toLowerCase().includes(search.toLowerCase()))
        );
    });
    

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Function to export data to CSV
    const exportToCSV = () => {
        // Define headers first
        const headers = ["Date & Time", "Action", "Item", "By"];

        // Prepare the rows by formatting the data first
        const rows = currentRows.map(log => {
            const date = new Date(log.DateTimeModified);
            const formattedDateTime = date.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            });

            // Wrap Date & Time in quotes to ensure it's treated as a single field in the CSV
            const quotedDateTime = `"${formattedDateTime.replace(/"/g, '""')}"`;  // Escape any quotes inside the DateTime

            // Format the Item/Venue (handling multiple items if needed)
            const quotedItem = `"${log.I_Name.replace(/"/g, '""')}"`; // Escape any quotes inside the Item

            // Return the row data
            return [
                quotedDateTime,  // Wrapped Date & Time in quotes
                log.Action,
                quotedItem,      // Wrapped Item in quotes
                log.C_Fullname   // No quotes needed for Full Name
            ];
        });

        // Join headers and rows to create the CSV content
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        // Create a Blob and trigger the download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "activity_logs.csv";
        link.click();
    };

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
                    <button className={styles.SettingsBtn} onClick={exportToCSV}>
                        Export Table
                    </button>
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
                        onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }}
                    />
                </div>

                <div>
                    <select
                        value={selectedAction}
                        onChange={(e) => { setSelectedAction(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="">All Action</option>
                        <option value="ADD">ADD</option>
                        <option value="UPDATE">UPDATE</option>
                        <option value="REMOVE">REMOVE</option>
                    </select>
                </div>
            </div>

            <table className={styles.ItemTable}>
                <thead>
                    <tr>
                        <th>Date & Time</th>
                        <th>Action</th>
                        <th>Item</th>
                        <th>By</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((log) => {
                        const date = new Date(log.DateTimeModified);
                        const formattedDateTime = date.toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true,
                        });

                        return (
                            <tr key={log.logs_id}>
                                <td>{formattedDateTime}</td>
                                <td>{log.Action}</td>
                                <td>{log.I_Name}</td>  {/* Display I_Name from Item table */}
                                <td>{log.C_Fullname}</td>  {/* Display C_Fullname from Incharge table */}
                            </tr>
                        );
                    })}
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

            {selectedModification === "AddItem" && (
                <div className={styles.BlurryBackground}>
                    <button className={styles.closeBtn} onClick={() => setSelectForm("")}>X</button>
                </div>
            )}
        </div>
    );
}
