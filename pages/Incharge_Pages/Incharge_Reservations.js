import styles from "@/styles/Incharge.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState, useEffect } from 'react';
import AddItemsForm from "./Forms/Transaction/View_Transaction";
import { useRouter } from "next/router";
import Swal from 'sweetalert2'; 
import Cookies from 'js-cookie'; 

// Dummy categories and userTypes, replace with actual data fetching if needed
const categories = ["AVRITEMS", "AVRVENUE"];
const userTypes = ["Staff", "Student"];

export default function Incharge_Reservations() {
    const router = useRouter();  
    const [SelectedModification, setSelectForm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [showActions, setShowActions] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedUserType, setSelectedUserType] = useState("");
    const rowsPerPage = 10;
    const [AllTransactions, setAllTransactions] = useState([]);

    const FetchTransactionData = async () => {
        try {
            const response = await fetch('/api/Incharge_Func/Reservation_Func/Fetch_AllTransaction');
            const Transacdata = await response.json();
            setAllTransactions(Transacdata); 
        } catch (error) {
            console.error("Error fetching transaction data: ", error);
        }
    };



    const handleFormClose = () => {
        FetchTransactionData();
        setSelectForm("");
    };

    const [SelectedTransaction, setSelectedTransaction] = useState(null);
    const handleViewReservation = (transaction) => {
        setSelectedTransaction(transaction);
        setSelectForm("ViewTransaction");
    };

    
    useEffect(() => {
        FetchTransactionData();
    }, [router]);

    // Helper functions
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const convertTo12HourFormat = (time) => {
        const [hour, minute] = time.split(':');
        const h = parseInt(hour, 10);
        const suffix = h >= 12 ? "PM" : "AM";
        const hour12 = h % 12 || 12;
        return `${hour12}:${minute} ${suffix}`;
    };

// Apply filters
const filteredData = AllTransactions.filter(transaction => {
    // Filter for transactions with "Pending" status
    if (transaction.reservation_status !== "Pending") {
        return false; // Exclude transactions that are not "Pending"
    }


    
    // Match search terms
    const matchesSearch = 
        transaction.Usertype.toLowerCase().includes(search.toLowerCase()) ||   
        transaction.dateofuse.toLowerCase().includes(search.toLowerCase()) ||
        transaction.fromtime.toLowerCase().includes(search.toLowerCase()) ||
        transaction.totime.toLowerCase().includes(search.toLowerCase()) ||
        transaction.fullName.toLowerCase().includes(search.toLowerCase()) ||
        transaction.Transac_Category.toLowerCase().includes(search.toLowerCase());

    // Match category if selectedCategory is set
    const matchesCategory = selectedCategory ? transaction.Transac_Category === selectedCategory : true;

    // Match user type if selectedUserType is set
    const matchesUserType = selectedUserType ? transaction.Usertype === selectedUserType : true;

    // Return true if all conditions match
    return matchesSearch && matchesCategory && matchesUserType;
});



    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);









    const handleAction = async (transac_id, actionType) => {
        if (actionType === "approve") {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You are approving this reservation.",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                confirmButtonText: "Yes, approve it!"
            });
    
            if (result.isConfirmed) {
                try {
                    const res = await fetch("/api/Incharge_Func/Reservation_Func/Action_Reservation", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            transac_id,
                            approvedby_id: Cookies.get('userID'),
                            action: "approve",
                            comment: null
                        })
                    });
    
                    const data = await res.json();
                    if (res.ok) {
                        Swal.fire("Approved!", data.message, "success");
                        FetchTransactionData(); // refresh table
                    } else {
                        Swal.fire("Error!", data.message, "error");
                    }
                } catch (err) {
                    Swal.fire("Error!", "Something went wrong.", "error");
                }
            }
        }
    
        if (actionType === "decline") {
            const { value: comment } = await Swal.fire({
                title: "Decline Reservation",
                input: "textarea",
                inputLabel: "Reason for declining",
                inputPlaceholder: "Type your reason here...",
                inputAttributes: {
                    "aria-label": "Type your reason here"
                },
                showCancelButton: true
            });
    
            if (comment) {
                try {
                    const res = await fetch("/api/Incharge_Func/Reservation_Func/Action_Reservation", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            transac_id,
                            approvedby_id: Cookies.get('userID'),
                            action: "decline",
                            comment
                        })
                    });
    
                    const data = await res.json();
                    if (res.ok) {
                        Swal.fire("Declined!", data.message, "success");
                        FetchTransactionData(); // refresh table
                    } else {
                        Swal.fire("Error!", data.message, "error");
                    }
                } catch (err) {
                    Swal.fire("Error!", "Something went wrong.", "error");
                }
            }
        }
    };



    
    return (
        <div className={styles.ItemBodyArea}>
            <h2>Reservations</h2>
            <p>Manage and track reservation requests</p>
            <br /><br />

            <div className={styles.ItemFilterArea}>
                <input
                    type="search"
                    placeholder="Search for Reservations"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value); 
                        setCurrentPage(1); 
                    }}
                />

                <div>
                    <select 
                        value={selectedCategory} 
                        onChange={(e) => {setSelectedCategory(e.target.value); setCurrentPage(1);}}
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
                        onChange={(e) => {setSelectedUserType(e.target.value); setCurrentPage(1);}}
                    >
                        <option value="">All User Types</option>
                        {userTypes.map((userType) => (
                            <option key={userType} value={userType}>
                                {userType}
                            </option>
                        ))}
                    </select>
                </div>

                <button 
                    className={`${styles.SettingsBtn} ${showActions ? styles.SettingsBtnOpened : ""}`} 
                    onClick={() => setShowActions(!showActions)}
                >
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
                        {showActions && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentRows
                        .filter(transaction => transaction.reservation_status === "Pending")
                        .map((transaction, index) => (
                            <tr key={index}>
                                <td>
                                    {formatDate(transaction.dateofuse)}, {convertTo12HourFormat(transaction.fromtime)} to {convertTo12HourFormat(transaction.totime)}
                                </td>
                                <td>{transaction.Usertype}</td>
                                <td>{transaction.fullName}</td>
                                <td>
                                    {transaction.items && Array.isArray(transaction.items) && transaction.items.length > 0 
                                        ? transaction.items.map(item => `${item.Quantity || ""} ${item.I_Name || 'AVR Venue'}`).join(', ') 
                                        : 'N/A'}
                                </td>
                                <td>{transaction.Transac_Category}</td>
                                {showActions && (
                                    <td>
                                    <button
                                    onClick={() => handleViewReservation(transaction)}
                                    >View
                                    </button>

                                    <button 
                                            className={styles.SuccessBtnnn} 
                                            onClick={() => handleAction(transaction.transac_id, "approve")}
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            className={styles.RemoveBtnnn} 
                                            onClick={() => handleAction(transaction.transac_id, "decline")}
                                        >
                                            Decline
                                        </button>
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
                <span>{`${currentPage}`}</span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            {SelectedModification === "ViewTransaction" && SelectedTransaction && (
                <div className={styles.BlurryBackground}>
                    <AddItemsForm transaction={SelectedTransaction} onClose={handleFormClose} />
                </div>
            )}

        </div>
    );
}
