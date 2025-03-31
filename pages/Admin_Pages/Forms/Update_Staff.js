import React, { useState, useEffect } from 'react';
import styles from "@/styles/User.module.css";
import Swal from 'sweetalert2';  // Import SweetAlert2



export default function UpdateStaffForm({ staff, onClose, onUpdate }) {
    // Destructure all the properties from the full staff object
    const [fullname, setFullname] = useState(staff?.T_Fullname || '');
    const [selectedOption, setSelectedOption] = useState(staff?.T_Category || '');  // Make sure to modify this if the API needs it.
    const [T_Sex, setTSex] = useState(staff?.T_Sex || '');
    const [T_PhoneNo, setTPhoneNo] = useState(staff?.T_PhoneNo || '');
    const [T_Username, setTUsername] = useState(staff?.T_Username || '');
    const [T_Password, setTPassword] = useState(staff?.T_Password || '');
    const [T_Email, setTEmail] = useState(staff?.T_Email || '');
    const [T_Status, setTStatus] = useState(staff?.T_Status || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!fullname || !T_Sex || !T_Username || !T_Password || !T_Email || !T_PhoneNo) {
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

        const staffData = {
            T_Fullname: fullname,
            T_Sex,
            T_PhoneNo,
            T_Username,
            T_Password,
            T_Email,
            T_Status,
            T_id: staff.T_id  // Include the staff ID for updating
        };

        try {
            const response = await fetch('/api/Admin_Func/StaffFunc', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(staffData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit the form');
            }

            // Show success alert and wait for user to press OK
            await Swal.fire({
                icon: 'success',
                title: 'Staff updated successfully',
                text: 'The staff details have been updated.',
            });

            onUpdate();  // Refresh the data in the parent component
            onClose();   // Close the form
        } catch (error) {
            setErrorMessage(error.message);
            // Show error alert and wait for user to press OK
            await Swal.fire({
                icon: 'error',
                title: 'Error updating staff',
                text: 'There was an issue updating the staff: ' + error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.AddItemForm}>
            <form onSubmit={handleSubmit}>
                <h2>UPDATE STAFF</h2>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                />
                <select value={T_Sex} onChange={(e) => setTSex(e.target.value)} required>
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={T_PhoneNo}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); 
                        if (value.length <= 11) {
                            setTPhoneNo(value);
                        }
                    }}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={T_Email}
                    onChange={(e) => setTEmail(e.target.value)}
                />
                <select value={T_Status} onChange={(e) => setTStatus(e.target.value)} required>
                    <option value="" disabled>Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Disable">Disable</option>
                </select>
                <input
                    type="text"
                    placeholder="Username"
                    value={T_Username}
                    onChange={(e) => setTUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={T_Password}
                    onChange={(e) => setTPassword(e.target.value)}
                />
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button type="submit" className={styles.EditBtnnn} disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update'}
                </button>
            </form>
        </div>
    );
}
