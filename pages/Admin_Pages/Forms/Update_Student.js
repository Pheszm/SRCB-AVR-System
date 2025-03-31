import React, { useState, useEffect } from 'react';
import styles from "@/styles/User.module.css";
import Swal from 'sweetalert2';  // Import SweetAlert2

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
    const [S_Status, setSStatus] = useState(student?.S_Status || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!fullname || !selectedOption || !S_Sex || !S_Level || !S_StudentID || !S_Email || !S_PhoneNo || !S_Username || !S_Password) {
            // Use SweetAlert for validation error
            await Swal.fire({
                icon: 'warning',
                title: 'Please fill all fields',
                text: 'All fields are required to submit the form.',
            });
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
            S_Status,
            S_Password,
            S_id: student.S_id  // Include the student ID for updating
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

            // Show success alert and wait for user to press OK
            await Swal.fire({
                icon: 'success',
                title: 'Student updated successfully',
                text: 'The student details have been updated.',
            });

            onUpdate();  // Refresh the data in the parent component
            onClose();   // Close the form
        } catch (error) {
            setErrorMessage(error.message);
            // Show error alert and wait for user to press OK
            await Swal.fire({
                icon: 'error',
                title: 'Error updating student',
                text: 'There was an issue updating the student: ' + error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.AddItemForm}>
            <form onSubmit={handleSubmit}>
                <h2>UPDATE STUDENT</h2>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                />
                <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} required>
                    <option value="" disabled>Select Category</option>
                    <option value="Basic Education Department">Basic Education Department</option>
                    <option value="Senior High Department">Senior High Department</option>
                    <option value="Higher Education Department">Higher Education Department</option>
                </select>
                <select value={S_Sex} onChange={(e) => setSSex(e.target.value)} required>
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <input
                    type="text"
                    placeholder="Level (e.g., Year 1)"
                    value={S_Level}
                    onChange={(e) => setSLevel(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Student ID"
                    value={S_StudentID}
                    onChange={(e) => setSStudentID(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={S_Email}
                    onChange={(e) => setSEmail(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Phone Number"
                    value={S_PhoneNo}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); 
                        if (value.length <= 11) {
                            setSPhoneNo(value);
                        }
                    }}
                />

                <select value={S_Status} onChange={(e) => setSStatus(e.target.value)} required>
                    <option value="" disabled>Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Disable">Disable</option>
                </select>
                <input
                    type="text"
                    placeholder="Username"
                    value={S_Username}
                    onChange={(e) => setSUsername(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Password"
                    value={S_Password}
                    onChange={(e) => setSPassword(e.target.value)}
                />
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button type="submit" className={styles.EditBtnnn} disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update'}
                </button>
            </form>
        </div>
    );
}
