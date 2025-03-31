// components/ViewStudent.js

import React, { useState, useEffect } from 'react';
import styles from "@/styles/User.module.css";
import { QR_Maker } from '@/components/QR_Maker';





export default function UpdateStudentForm({ student, onClose, onUpdate }) {
    // Destructure all the properties from the full student object
    const [fullname, setFullname] = useState(student?.S_Fullname || '');
    const [selectedOption, setSelectedOption] = useState(student?.S_Category || '');
    const [S_Sex, setSSex] = useState(student?.S_Sex || '');
    const [S_Level, setSLevel] = useState(student?.S_Level || '');
    const [S_StudentID, setSStudentID] = useState(student?.S_StudentID || '');
    const [S_Email, setSEmail] = useState(student?.S_Email || '');
    const [S_PhoneNo, setSPhoneNo] = useState(student?.S_PhoneNo || '');
    const [S_Username, setSUsername] = useState(student?.S_Username || '');
    const [S_Password, setSPassword] = useState(student?.S_Password || '');
    const [S_QRcode, set_QRcode] = useState(student?.S_QRcode || '');


    const [ S_DateTimeCreated, SetDateTimeCreated] = useState(student?. S_DateTimeCreated || '');
    const dateString = "2025-03-20T03:49:41.000Z";
    const date = new Date(dateString);

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

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!fullname || !selectedOption || !S_Sex || !S_Level || !S_StudentID || !S_Email || !S_PhoneNo || !S_Username || !S_Password) {
            alert("Please fill all fields.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        const studentData = {
            S_Fullname: fullname,
            S_Category: selectedOption,
            S_Sex,
            S_Level,
            S_StudentID,
            S_Email,
            S_PhoneNo,
            S_Username,
            S_Password,
            S_QRcode,
            S_id: student.S_id 
        };

        try {
            const response = await fetch('/../../api/Admin_Func/StudentFunc', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit the form');
            }

            alert('Student updated successfully');
            onUpdate();  // Refresh the data in the parent component
            onClose();   // Close the form
        } catch (error) {
            setErrorMessage(error.message);
            alert('Error submitting form: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.AddItemForm}>
            <form onSubmit={handleSubmit}>
                <h2>VIEWING STUDENT</h2>

                <span className={styles.FieldsArea}>
                    <label>Fullname:</label>
                    <p>{fullname}</p>
                </span>

                <span className={styles.SpanFlex}>
                    <span>
                        <span className={styles.FieldsArea}>
                            <label>Sex:</label>
                            <p>{S_Sex}</p>
                        </span>

                        <span className={styles.FieldsArea}>
                            <label>Student ID:</label>
                            <p>{S_StudentID}</p>
                        </span>

                        <span className={styles.FieldsArea}>
                            <label>Phone No:</label>
                            <p>{S_PhoneNo}</p>
                        </span>
                    </span>

                    <QR_Maker value={S_QRcode} size={150} />
                </span>


                <span className={styles.FieldsArea}>
                    <label>Category:</label>
                    <p>{selectedOption}</p>
                </span>

                <span className={styles.FieldsArea}>
                    <label>Email:</label>
                    <p>{S_Email}</p>
                </span>
                

                <span className={styles.FieldsArea}>
                    <label>Level:</label>
                    <p>{S_Level}</p>
                </span>
                

                <span className={styles.FieldsArea}>
                    <label>Username:</label>
                    <p>{S_Username}</p>
                </span>

                <span className={styles.FieldsArea}>
                    <label>Password:</label>
                    <p>{S_Password}</p>
                </span>

                <span className={styles.FieldsArea}>
                    <label>Created:</label>
                    <p>{formattedDateTime}</p>
                </span>

                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </form>
        </div>
    );
}
