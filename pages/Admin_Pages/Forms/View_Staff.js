// components/ViewStudent.js

import React, { useState, useEffect } from 'react';
import styles from "@/styles/User.module.css";
import { QR_Maker } from '@/components/QR_Maker';


export default function UpdateStudentForm({ staff, onClose, onUpdate }) {
    const [fullname, setFullname] = useState(staff?.T_Fullname || '');
    const [T_Sex, setSSex] = useState(staff?.T_Sex || '');
    const [T_Email, setSEmail] = useState(staff?.T_Email || '');
    const [T_PhoneNo, setSPhoneNo] = useState(staff?.T_PhoneNo || '');
    const [T_Username, setSUsername] = useState(staff?.T_Username || '');
    const [T_Password, setSPassword] = useState(staff?.T_Password || '');
    const [S_DateTimeCreated, SetDateTimeCreated] = useState(staff?.T_DateTimeCreated || '');
    const [T_QRcode, set_QRcode] = useState(staff?.T_QRcode || '');

    const date = new Date(S_DateTimeCreated);
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
                <span className={styles.SpanHeader}>
                    <h2>VIEWING STAFF</h2>
                    <button onClick={onClose} className={styles.FormCloseButton}>X</button>
                </span>
                

                <div className={styles.ResponsiveAligner}>
                    <div className={styles.RightAreaa2}>
                        
                <span className={styles.FieldsArea}>
                    <label>Email:</label>
                    <p>{T_Email}</p>
                </span>



                <span className={styles.FieldsArea}>
                    <label>Username:</label>
                    <p>{T_Username}</p>
                </span>

                <span className={styles.FieldsArea}>
                    <label>Password:</label>
                    <p>{T_Password}</p>
                </span>

                <span className={styles.FieldsArea}>
                    <label>Created:</label>
                    <p>{formattedDateTime}</p>
                </span>
                    </div>

                    <div>
                    <span className={styles.FieldsArea}>
                    <label>Fullname:</label>
                    <p>{fullname}</p>
                </span>



                <span className={styles.SpanFlex}>
                    <span>
                        <span className={styles.FieldsArea}>
                            <label>Role:</label>
                            <p>Staff</p>
                        </span>

                        <span className={styles.FieldsArea}>
                            <label>Sex:</label>
                            <p>{T_Sex}</p>
                        </span>

                        <span className={styles.FieldsArea}>
                            <label>Phone No:</label>
                            <p>{T_PhoneNo}</p>
                        </span>
                    </span>

                    <QR_Maker value={T_QRcode} size={150} />
                </span>
                    </div>
                </div>
                



            </form>
        </div>
    );
}
