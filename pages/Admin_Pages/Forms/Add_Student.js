import styles from "@/styles/User.module.css";
import React, { useState } from 'react';
import Swal from 'sweetalert2';  // Import SweetAlert2

export default function Adding_Item_Form({ onClose }) {
    const [fullname, setFullname] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [S_Sex, setSSex] = useState('');
    const [S_Level, setSLevel] = useState('');
    const [S_StudentID, setSStudentID] = useState('');
    const [S_Email, setSEmail] = useState('');
    const [S_PhoneNo, setSPhoneNo] = useState('');
    const [S_Username, setSUsername] = useState('');
    const [S_Password, setSPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!fullname || !selectedOption || !S_Sex || !S_Level || !S_StudentID || !S_Email || !S_PhoneNo || !S_Username || !S_Password) {
            await Swal.fire({
                icon: 'warning',
                title: 'Please fill all fields',
                text: 'All fields are required to submit the form.',
            });
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');  // Clear previous error message

        const studentData = {
            S_Fullname: fullname,
            S_Category: selectedOption,
            S_Sex,
            S_Level,
            S_StudentID,
            S_Email,
            S_PhoneNo,
            S_Username,
            S_Password
        };

        try {
            const response = await fetch('/../../api/Admin_Func/StudentFunc', {
                method: 'POST',
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
                title: 'Student added successfully',
                text: 'The new student has been added to the system.',
            });

            // Reset form fields
            setFullname('');
            setSelectedOption('');
            setSLevel('');
            setSStudentID('');
            setSSex('');
            setSEmail('');
            setSPhoneNo('');
            setSUsername('');
            setSPassword('');

            // Call the onClose callback passed from the parent to close the form
            onClose();  // Close the form by resetting the parent state
        } catch (error) {
            setErrorMessage(error.message);
            // Show error alert and wait for user to press OK
            await Swal.fire({
                icon: 'error',
                title: 'Error submitting form',
                text: 'There was an issue submitting the form: ' + error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.AddItemForm}>
            <form onSubmit={handleSubmit}>
                {/* Full Name Input */}
                <h2>ADD STUDENT</h2>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                />

                {/* Category Dropdown (Combo Box) */}
                <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} required>
                    <option value="" disabled>Select Category</option>
                    <option value="Basic Education Department">Basic Education Department</option>
                    <option value="Senior High Department">Senior High Department</option>
                    <option value="Higher Education Department">Higher Education Department</option>
                </select>

                {/* Gender Dropdown (Combo Box) */}
                <select value={S_Sex} onChange={(e) => setSSex(e.target.value)} required>
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                {/* Level Input */}
                <input
                    type="text"
                    placeholder="Level (e.g., Year 1)"
                    value={S_Level}
                    onChange={(e) => setSLevel(e.target.value)}
                />

                {/* Student ID Input */}
                <input
                    type="text"
                    placeholder="Student ID"
                    value={S_StudentID}
                    onChange={(e) => setSStudentID(e.target.value.toUpperCase())}
                />

                {/* Email Input */}
                <input
                    type="email"
                    placeholder="Email"
                    value={S_Email}
                    onChange={(e) => setSEmail(e.target.value)}
                />

                {/* Phone Number Input */}
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


                {/* Username Input */}
                <input
                    type="text"
                    placeholder="Username"
                    value={S_Username}
                    onChange={(e) => setSUsername(e.target.value)}
                />

                {/* Password Input */}
                <input
                    type="text"
                    placeholder="Password"
                    value={S_Password}
                    onChange={(e) => setSPassword(e.target.value)}
                />

                {/* Error Message Display */}
                {errorMessage && <div className="error-message">{errorMessage}</div>}

                {/* Submit Button */}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}
