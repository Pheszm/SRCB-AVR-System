// components/ViewItem.js

import React, { useState, useEffect } from 'react';
import styles from "@/styles/User.module.css";
import { QR_Maker } from '@/components/QR_Maker';

export default function ViewItemForm({ item, onClose }) {
    const [I_Name, setIName] = useState(item?.I_Name || '');
    const [I_Category, setICategory] = useState(item?.I_Category || '');
    const [I_Quantity, setIQuantity] = useState(item?.I_Quantity || 0);
    const [I_Availability, setIAvailability] = useState(item?.I_Availability || 0);
    const [I_QRcode, set_I_QRcode] = useState(item?.I_QRcode || '');
    const [I_Status, setIStatus] = useState(item?.I_Status || 'Active');
    const [I_DateTimeCreated, setIDateTimeCreated] = useState(item?.I_DateTimeCreated || '');
    const [C_Image, setCImage] = useState(item?.C_Image || '');
    const [C_id, setCId] = useState(item?.C_id || '');
    const [C_Name, setCName] = useState(''); 

    useEffect(() => {
        if (C_id) {
            fetch(`/api/Incharge_Func/Item_Func/Incharge_namee?C_id=${C_id}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.C_Fullname) {
                        setCName(data.C_Fullname); // Set the incharge name
                    } else {
                        setCName('Incharge not found'); // Handle case where no name is found
                    }
                })
                .catch(error => {
                    console.error('Error fetching incharge name:', error);
                    setCName('Error loading name'); // Handle the error state
                });
        }
    }, [C_id]);

    const date = new Date(I_DateTimeCreated);
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
        <div className={styles.AddItemForm}>
            <form>
                <h2>VIEWING ITEM</h2>

                <span className={styles.FieldsArea}>
                    <div
                        className={styles.ImageArea}
                        style={{ backgroundImage: `url('/uploads/${C_Image}')` }}
                    ></div>
                </span>
                
                <span className={styles.FieldsArea}>
                    <label>Item Name:</label>
                    <p>{I_Name}</p>
                </span>

                <span className={styles.SpanFlex}>
                    <span>

                        <span className={styles.FieldsArea}>
                            <label>Status:</label>
                            <p>{I_Status}</p>
                        </span>

                        <span className={styles.FieldsArea}>
                            <label>Quantity:</label>
                            <p>{I_Quantity}</p>
                        </span>

                        <span className={styles.FieldsArea}>
                            <label>Availability:</label>
                            <p>{I_Availability}</p>
                        </span>

                    </span>

                    <QR_Maker value={I_QRcode} size={150} />
                </span>

                <span className={styles.FieldsArea}>
                    <label>Category:</label>
                    <p>{I_Category}</p>
                </span>

                <span className={styles.FieldsArea}>
                    <label>Created By:</label>
                    <p>{C_Name}</p>
                </span>
                <span className={styles.FieldsArea}>
                    <label>Created:</label>
                    <p>{formattedDateTime}</p>
                </span>

            </form>
        </div>
    );
}
