import styles from "@/styles/User.module.css";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Incharge_Main() {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/Incharge_Func/Reservation_Func/Fetch_AllTransaction');
                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        }

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

    return (
        <div className={styles.NotificationWrapper}>
            <ul className={styles.NotificationList}>
                {filteredData
                    .filter(transaction => !transaction.approvedby_id)
                    .map((transaction, index) => (
                        <li key={index} className={styles.NotificationItem}>
                            <p className={styles.NotifText}>Approved Transaction - {formatDate(transaction.DateFiled)}</p>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}
