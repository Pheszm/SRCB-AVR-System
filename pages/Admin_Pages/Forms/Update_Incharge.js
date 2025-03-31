import React, { useState } from 'react';
import styles from "@/styles/User.module.css";
import Swal from 'sweetalert2';  // Import SweetAlert2

export default function UpdateInchargeForm({ incharge, onClose, onUpdate }) {
    // Destructure all the properties from the full incharge object
    const [fullname, setFullname] = useState(incharge?.C_Fullname || '');
    const [selectedOption, setSelectedOption] = useState(incharge?.C_Category || '');  // Modify if the API needs it
    const [C_Sex, setCSex] = useState(incharge?.C_Sex || '');
    const [C_PhoneNo, setCPhoneNo] = useState(incharge?.C_PhoneNo || '');
    const [C_Username, setCUsername] = useState(incharge?.C_Username || '');
    const [C_Password, setCPassword] = useState(incharge?.C_Password || '');
    const [C_Status, setCStatus] = useState(incharge?.C_Status || '');
    const [C_Email, setCEmail] = useState(incharge?.C_Email || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!fullname || !C_Sex || !C_Username || !C_Password || !C_Email || !C_PhoneNo) {
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

        const inchargeData = {
            C_Fullname: fullname,
            C_Sex,
            C_PhoneNo,
            C_Username,
            C_Password,
            C_Email,
            C_Status,
            C_id: incharge.C_id  // Include the incharge ID for updating
        };

        try {
            const response = await fetch('/api/Admin_Func/InchargeFunc', { // Update API endpoint for Incharge
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inchargeData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit the form');
            }

            // Show success alert and wait for user to press OK
            await Swal.fire({
                icon: 'success',
                title: 'Incharge updated successfully',
                text: 'The incharge details have been updated.',
            });

            onUpdate();  // Refresh the data in the parent component
            onClose();   // Close the form
        } catch (error) {
            setErrorMessage(error.message);
            // Show error alert and wait for user to press OK
            await Swal.fire({
                icon: 'error',
                title: 'Error updating incharge',
                text: 'There was an issue updating the incharge: ' + error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.AddItemForm}>
            <form onSubmit={handleSubmit}>
                <h2>UPDATE INCHARGE</h2>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                />
                <select value={C_Sex} onChange={(e) => setCSex(e.target.value)} required>
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={C_PhoneNo}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); 
                        if (value.length <= 11) {
                            setCPhoneNo(value);
                        }
                    }}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={C_Email}
                    onChange={(e) => setCEmail(e.target.value)}
                />
                <select value={C_Status} onChange={(e) => setCStatus(e.target.value)} required>
                    <option value="" disabled>Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Disable">Disable</option>
                </select>
                <input
                    type="text"
                    placeholder="Username"
                    value={C_Username}
                    onChange={(e) => setCUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={C_Password}
                    onChange={(e) => setCPassword(e.target.value)}
                />
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button type="submit" className={styles.EditBtnnn} disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update'}
                </button>
            </form>
        </div>
    );
}
