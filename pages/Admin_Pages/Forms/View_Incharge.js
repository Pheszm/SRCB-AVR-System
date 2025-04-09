import React, { useState } from 'react';
import styles from "@/styles/User.module.css";
import { QR_Maker } from '@/components/QR_Maker';


export default function ViewInchargeForm({ incharge, onClose }) {
    const [fullname, setFullname] = useState(incharge?.C_Fullname || '');
    const [C_Sex, setCSex] = useState(incharge?.C_Sex || '');
    const [C_Email, setCEmail] = useState(incharge?.C_Email || '');
    const [C_PhoneNo, setCPhoneNo] = useState(incharge?.C_PhoneNo || '');
    const [C_Username, setCUsername] = useState(incharge?.C_Username || '');
    const [C_QRcode, setCQRcode] = useState(incharge?.C_QRcode || '');
    const [C_Password, setCPassword] = useState(incharge?.C_Password || '');
    const [C_DateTimeCreated, SetDateTimeCreated] = useState(incharge?.C_DateTimeCreated || '');

    const date = new Date(C_DateTimeCreated);
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
            <h2>VIEWING INCHARGE</h2>
                    <button onClick={onClose} className={styles.FormCloseButton}>X</button>
                </span>

               

                <span className={styles.FieldsArea}>
                    <label>Fullname:</label>
                    <p>{fullname}</p>
                </span>


                
                <span className={styles.SpanFlex}>
                    <span>
                        <span className={styles.FieldsArea}>
                            <label>Role:</label>
                            <p>Incharge</p>
                        </span>


                        <span className={styles.FieldsArea}>
                            <label>Sex:</label>
                            <p>{C_Sex}</p>
                        </span>

                        <span className={styles.FieldsArea}>
                            <label>Phone No:</label>
                            <p>{C_PhoneNo}</p>
                        </span>
                        
                    </span>
                    
                    <QR_Maker value={C_QRcode} size={150} />
                </span>


                <span className={styles.FieldsArea}>
                    <label>Email:</label>
                    <p>{C_Email}</p>
                </span>



                <span className={styles.FieldsArea}>
                    <label>Username:</label>
                    <p>{C_Username}</p>
                </span>

                <span className={styles.FieldsArea}>
                    <label>Password:</label>
                    <p>{C_Password}</p>
                </span>

                <span className={styles.FieldsArea}>
                    <label>Created:</label>
                    <p>{formattedDateTime}</p>
                </span>

            </form>
        </div>
    );
}
