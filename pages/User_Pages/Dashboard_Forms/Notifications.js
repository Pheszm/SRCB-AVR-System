import styles from "@/styles/User.module.css";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import ViewTransaction from "./ViewTransaction";

export default function Incharge_Main() {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState("");

    async function fetchData() {
        try {
            const response = await fetch('/api/Incharge_Func/Reservation_Func/Fetch_AllTransaction');
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = transactions.filter(item => {
        const userId = Cookies.get('userID');
        const userRole = Cookies.get('userRole');

        return (
            parseInt(item.User_id) === parseInt(userId) &&
            item.Usertype === userRole &&
            (
                item.transac_status.toLowerCase().includes(search.toLowerCase()) ||
                item.dateofuse.toLowerCase().includes(search.toLowerCase()) ||
                item.Transac_Category.toLowerCase().includes(search.toLowerCase())
            )
        );
    });

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };


        const [SelectedModification, setSelectForm] = useState("");
            const handleFormClose = () => {
                setSelectForm("");
            };
        const [SelectedTransaction, setSelectedTransaction] = useState(null);
        const handleViewTransaction = (transaction) => {
            setSelectedTransaction(transaction);
            setSelectForm("ViewTransaction");
        };
    

        const MarkAsRead = async (transactionId) => {
            try { 
                const response = await fetch('/api/User_Func/Transaction_Func/MarkAsReadFunc', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ transac_id: transactionId }),
                });
                if (!response.ok) {
                    throw new Error('Failed to mark as read');
                }
                const data = await response.json();
                fetchData();
            } catch (error) {
                console.error('Error marking transaction as read:', error);
            }
        };

    return (
        <div className={styles.NotificationWrapper}>
            <ul className={styles.NotificationList}>
                {filteredData
                    .filter(transaction => transaction.approvedby_id)
                    .map((transaction, index) => (
                        <li
                            title={`A ${transaction.reservation_status} transaction by ${transaction.approvedby_fullname}`}
                            key={index}
                            className={`${styles.NotificationItem} ${transaction.notif_status === "Unread" ? styles.Unread : ""}`}
                            onClick={() => {
                                handleViewTransaction(transaction);
                                MarkAsRead(transaction.transac_id);
                            }}
                        >
                            <p className={styles.NotifText}>
                                {transaction.reservation_status} transaction by {transaction.approvedby_fullname}
                            </p>
                        </li>
                    ))
                }
            </ul>


            {SelectedModification === "ViewTransaction" && SelectedTransaction && (
                <div className={styles.BlurryBackground2}>
                    <ViewTransaction transaction={SelectedTransaction} onClose={handleFormClose} />
                </div>
            )}
        </div>
    );
}
