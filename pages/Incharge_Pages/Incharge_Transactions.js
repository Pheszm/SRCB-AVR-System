import React, { useState, useEffect } from 'react';
import * as AiIcons from "react-icons/ai";
import styles from "@/styles/Incharge.module.css";
import { useRouter } from 'next/router';

export default function Incharge_AVRLogs() {
    const router = useRouter();

    const [SelectedModification, setSelectForm] = useState("");
    const handlePageChange = (page) => {
        setSelectForm(page);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [showActions, setShowActions] = useState(false);
    const rowsPerPage = 10;

    const [AllTransactions, setAllTransactions] = useState([]);

    const FetchTransactionData = async () => {
        try {
            const response = await fetch('/api/Incharge_Func/Reservation_Func/Fetch_AllTransaction');
            const transactions = await response.json();
            setAllTransactions(transactions); 
        } catch (error) {
            console.error("Error fetching transaction data: ", error);
        }
    };

    useEffect(() => {
        FetchTransactionData();
    }, [router]);

    const categories = [...new Set(AllTransactions.map(item => item.Transac_Category))];
    const actions = [...new Set(AllTransactions.map(item => item.transac_status))];

    const filteredData = AllTransactions.filter(
        ({ dateofuse, fullName, transac_status, Transac_Category }) => {
            const transactionMonth = new Date(dateofuse).toISOString().slice(0, 7);  
            return (
                (selectedCategory === "" || Transac_Category === selectedCategory) &&
                (selectedMonth === "" || transactionMonth === selectedMonth) &&  
                (dateofuse.toLowerCase().includes(search.toLowerCase()) ||
                    fullName.toLowerCase().includes(search.toLowerCase()) ||
                    transac_status.toLowerCase().includes(search.toLowerCase()) ||
                    Transac_Category.toLowerCase().includes(search.toLowerCase()))
            );
        }
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const convertTo12HourFormat = (time) => {
        let [hour, minute] = time.split(":");
        let suffix = "AM";
        if (parseInt(hour) >= 12) {
            suffix = "PM";
            if (hour > 12) hour -= 12;
        }
        return `${hour}:${minute} ${suffix}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

// Function to export data to CSV
const exportToCSV = () => {
    // Define headers first
    const headers = ["Status", "Date & Time", "Fullname", "Item/Venue", "Category"];

    // Prepare the rows by formatting the data first
    const rows = currentRows.map(transaction => {
        // Format Date & Time
        const formattedDateTime = `${formatDate(transaction.dateofuse)} from ${convertTo12HourFormat(transaction.fromtime)} to ${convertTo12HourFormat(transaction.totime)}`;
        
        // Wrap Date & Time in quotes to ensure it's treated as a single field in the CSV
        const quotedDateTime = `"${formattedDateTime.replace(/"/g, '""')}"`;  // Escape any quotes inside the DateTime

        // Format the Item/Venue (handling multiple items)
        const itemList = transaction.items && transaction.items.length > 0
            ? transaction.items.map(item => `${item.I_Quantity || ""} ${item.I_Name || 'AVR Venue'}`).join(', ') // Join multiple items with comma
            : 'No items';

        // Ensure itemList is wrapped in quotes to handle any commas properly
        const quotedItemList = `"${itemList.replace(/"/g, '""')}"`; // Escape any quotes inside the items

        // Now return the row with the formatted data
        return [
            transaction.reservation_status,
            quotedDateTime,     // Wrapped Date & Time in quotes
            transaction.fullName,
            quotedItemList,     // Wrapped item list in quotes
            transaction.Transac_Category
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
    link.download = "transactions.csv";
    link.click();
};



    return (
        <div className={styles.ItemBodyArea}>
            <header className={styles.HeaderSection}>
                <div>
                    <h2>Transactions</h2>
                    <p>Keep track of transactions to monitor system events and user activities.</p>
                    <br /><br />
                </div>
                <div>
                    <button className={styles.SettingsBtn} onClick={exportToCSV}>Export Table</button>
                    <button className={`${styles.SettingsBtn} ${showActions ? styles.SettingsBtnOpened : ""}`} onClick={() => setShowActions(!showActions)}>
                        Settings
                    </button>
                </div>
            </header>

            <div className={styles.ItemFilterArea}>
                <input
                    type="search"
                    placeholder="Search for Transactions"
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
                        <th>Status</th>
                        <th>Date & Time</th>
                        <th>Fullname</th>
                        <th>Item/Venue</th>
                        <th>Category</th>
                        {showActions && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.reservation_status}</td>
                            <td>{formatDate(transaction.dateofuse)} from {convertTo12HourFormat(transaction.fromtime)} to {convertTo12HourFormat(transaction.totime)}</td>
                            <td>{transaction.fullName}</td>
                            <td>
                                {transaction.items && transaction.items.length > 0
                                    ? transaction.items.map(item => `${item.I_Quantity || ""} ${item.I_Name || 'AVR Venue'}`).join(', ')
                                    : 'No items'}
                            </td>
                            <td>{transaction.Transac_Category}</td>
                            {showActions && (
                                <td>
                                    <button>View</button>
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
                    {SelectedModification === "AddItem" && <AddItemsForm />}
                    <button className={styles.closeBtn} onClick={() => handlePageChange("")}>X</button>
                </div>
            )}
        </div>
    );
}
