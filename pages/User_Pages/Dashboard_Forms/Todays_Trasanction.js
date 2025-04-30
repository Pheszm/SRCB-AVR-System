import styles from "@/styles/User.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';  // Make sure to import the router
import Cookies from 'js-cookie'; 
import Swal from 'sweetalert2';

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


    const RevokeTransaction = async (transac_id) => {
        const { value: reason } = await Swal.fire({
          title: 'Revoke Transaction',
          input: 'textarea',
          inputLabel: 'Reason for revocation',
          inputPlaceholder: 'Enter reason here...',
          inputAttributes: {
            'aria-label': 'Reason for revocation'
          },
          showCancelButton: true
        });
      
        if (reason) {
          try {
            const res = await fetch('/api/User_Func/Transaction_Func/Revoke_Transaction', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ transac_id, transac_reason: reason })
            });
      
            const data = await res.json();
            if (data.success) {
              Swal.fire('Success!', 'Transaction has been revoked.', 'success');
              window.location.reload();
            } else {
              Swal.fire('Error', 'Failed to revoke transaction.', 'error');
            }
          } catch (error) {
            Swal.fire('Error', error.message, 'error');
          }
        }
      };


    useEffect(() => {
        FetchTransactionData();
    }, [router]);

    // Extract unique categories and actions from AllTransactions
    const categories = [...new Set(AllTransactions.map(item => item.Transac_Category))];
    const actions = [...new Set(AllTransactions.map(item => item.transac_status))];

    
    const filteredData = AllTransactions.filter(
        ({ dateofuse, fullName, transac_status, Transac_Category, User_id, Usertype, reservation_status }) => {
            
            const transactionMonth = new Date(dateofuse).toISOString().slice(0, 7);  // Extract YYYY-MM from dateofuse
                const userId = Cookies.get('userID'); 
                const userRole = Cookies.get('userRole'); 
    
            // Make sure User_id and Usertype match the session data and reservation_status is approved
            if (parseInt(User_id) === parseInt(userId) && Usertype === userRole &&
                reservation_status === "Approved" && transactionMonth != null) { 
    
                // Filter based on category, month, and search term
                return (
                    (selectedCategory === "" || Transac_Category === selectedCategory) &&
                    (selectedMonth === "" || transactionMonth === selectedMonth) &&  // Compare with YYYY-MM format
                    (dateofuse.toString().toLowerCase().includes(search.toLowerCase()) ||
                        fullName.toLowerCase().includes(search.toLowerCase()) ||
                        transac_status.toLowerCase().includes(search.toLowerCase()) ||
                        Transac_Category.toLowerCase().includes(search.toLowerCase()))
                );
            }
    
            return false; // Ensure the function returns a boolean value
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
            <h3>Upcoming Transactions</h3>
            <br></br>

            <table className={styles.DashTable}>
                <thead>
                    <tr>
                        <th>Status</th> 
                        <th>Time</th>
                        <th>Item/Venue</th> 
                        <th>Action</th> 
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((transaction, index) => {
                        const userId = Cookies.get('userID'); 
                        const userRole = Cookies.get('userRole'); 
                        const DayOfUse = new Date(transaction.dateofuse).toISOString().slice(0, 10).replace(/-/g, '-');

                        if (parseInt(transaction.User_id) === parseInt(userId) && transaction.Usertype === userRole &&
                        transaction.reservation_status === "Approved") {  // CHANGE THIS IF ITS FINAL ALREADY
                            return (
                                <tr key={index}>
                                    <td>{transaction.reservation_status}</td> 
                                    
                                    
                                    <td title={`Day of Use: ${DayOfUse}, From: ${convertTo12HourFormat(transaction.fromtime)}, To: ${convertTo12HourFormat(transaction.totime)}`}
                                    >({DayOfUse}) {convertTo12HourFormat(transaction.fromtime)} to {convertTo12HourFormat(transaction.totime)}</td>
                                    <td title={
                                    transaction.items && transaction.items.length > 0
                                    ? transaction.items.map(item => `${item.I_Quantity || ""} ${item.I_Name || 'AVR Venue'}`).join(', ')
                                    : 'No items'
                                }
                                    >
                                        {transaction.items && transaction.items.length > 0
                                            ? transaction.items.map(item => `${item.I_Quantity || ""} ${item.I_Name || 'AVR Venue'}`).join(', ')
                                            : 'No items'}
                                    </td>
                                    <td>
                                        <button className={styles.CancelBtn} onClick={() => RevokeTransaction(transaction.transac_id)}>Revoke</button>
                                    </td>
                                </tr>
                            );
                        }
                        return null; // If the condition is not met, return null to render nothing
                    })}
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
