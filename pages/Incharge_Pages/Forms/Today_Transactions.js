import styles from "@/styles/User.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

export default function Incharge_AVRLogs() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
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

    const filteredData = AllTransactions.filter(
        ({ dateofuse, fullName, transac_status, Transac_Category, reservation_status }) => {
            if (reservation_status === "Approved") {
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
        }
    );

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const convertTo12HourFormat = (time) => {
        let [hour, minute] = time.split(":");
        hour = parseInt(hour);
        const suffix = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${suffix}`;
    };

    const handleReturn = async (transac_id) => {
        const { value: comment, isConfirmed } = await Swal.fire({
            title: 'Mark as Returned',
            input: 'textarea',
            inputLabel: 'Add a Comment of After Use',
            inputPlaceholder: 'Type your comment here...',
            inputAttributes: {
                'aria-label': 'Type your comment here'
            },
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write something!';
                }
            }
        });
    
        if (!isConfirmed) {
            return; // User clicked cancel or closed the dialog
        }
    
        try {
            const response = await fetch('/api/Incharge_Func/Reservation_Func/MarkAsReturned', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transac_id, comments_afteruse: comment })
            });
    
            if (response.ok) {
                Swal.fire('Success!', 'Transaction marked as returned.', 'success');
                FetchTransactionData();
            } else {
                const errorData = await response.json();
                Swal.fire('Error', errorData.message || 'Failed to update the transaction.', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'An unexpected error occurred.', 'error');
        }
    };

    return (
        <div>
            <table className={styles.DashTable}>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Date & Time</th>
                        <th>Fullname</th>
                        <th>Item/Venue</th> 
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.reservation_status}</td>
                            <td>{convertTo12HourFormat(transaction.fromtime)} to {convertTo12HourFormat(transaction.totime)}</td>
                            <td>{transaction.fullName}</td>
                            <td>
                                {transaction.items && transaction.items.length > 0
                                    ? transaction.items.map(item => `${item.I_Quantity || ""} ${item.I_Name || 'AVR Venue'}`).join(', ')
                                    : 'No items'}
                            </td>
                            <td>
                                <button onClick={() => handleReturn(transaction.transac_id)}>Returned</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <span className={styles.PagenationArea}>
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>{currentPage}</span>
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </span>
        </div>
    );
}
