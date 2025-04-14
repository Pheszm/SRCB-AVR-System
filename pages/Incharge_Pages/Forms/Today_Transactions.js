import styles from "@/styles/User.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  // Make sure to import the router

export default function Incharge_AVRLogs() {
    const router = useRouter();  // Initialize the router

    const [SelectedModification, setSelectForm] = useState("");
    const handlePageChange = (page) => {
        setSelectForm(page);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");  // New state for month filter
    const rowsPerPage = 7;

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

    // Extract unique categories and actions from AllTransactions
    const categories = [...new Set(AllTransactions.map(item => item.Transac_Category))];
    const actions = [...new Set(AllTransactions.map(item => item.transac_status))];

    const filteredData = AllTransactions.filter(
        ({ dateofuse, fullName, transac_status, Transac_Category }) => {
            const transactionMonth = new Date(dateofuse).toISOString().slice(0, 7);  // Extract YYYY-MM from dateofuse
            return (
                (selectedCategory === "" || Transac_Category === selectedCategory) &&
                (selectedMonth === "" || transactionMonth === selectedMonth) &&  // Compare with YYYY-MM format
                (dateofuse.toLowerCase().includes(search.toLowerCase()) ||
                    fullName.toLowerCase().includes(search.toLowerCase()) ||
                    transac_status.toLowerCase().includes(search.toLowerCase()) ||
                    Transac_Category.toLowerCase().includes(search.toLowerCase()))
            );
        }
    );
    

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Helper function to format time (if necessary)
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

    return (
        <div>

            {/* Updated Table */}
            <table className={styles.DashTable}>
                <thead>
                    <tr>
                        <th>Status</th> {/* Could be the action or status */}
                        <th>Date & Time</th>
                        <th>Fullname</th>
                        <th>Item/Venue</th> {/* Can be renamed based on context */}
                         <th>Actions</th> {/* Conditionally show the Actions column */}
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.reservation_status}</td> {/* Display the status */}
                            <td>{convertTo12HourFormat(transaction.fromtime)} to {convertTo12HourFormat(transaction.totime)}</td>
                            <td>{transaction.fullName}</td>
                            <td>
                                {transaction.items && transaction.items.length > 0
                                    ? transaction.items.map(item => `${item.I_Quantity || ""} ${item.I_Name || 'AVR Venue'}`).join(', ')
                                    : 'No items'}
                            </td>
                                <td>
                                    {/* Add action buttons or functionality here */}
                                    <button>Returned</button>
                                </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
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
