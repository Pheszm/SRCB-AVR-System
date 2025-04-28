import styles from "@/styles/User.module.css";
import React, { useState } from 'react';
import Swal from 'sweetalert2';  // Import SweetAlert2

export default function Adding_Item_Form({ onClose }) {
    const [fullname, setFullname] = useState('');
    const [sex, setSex] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!fullname || !sex || !username || !email || !phoneNo || !password) {
            await Swal.fire({
                icon: 'warning',
                title: 'Please fill all fields',
                text: 'All fields are required to submit the form.',
            });
            return;
        }
        if (password.length < 8) {
            await Swal.fire({
                icon: 'warning',
                title: 'Password is too short',
                text: 'Password must be at least 8 characters long.',
            });
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');  // Clear previous error message

        const staffData = {
            T_Fullname: fullname,
            T_Username: username,
            T_Password: password,
            T_Email: email,
            T_PhoneNo: phoneNo,
            T_Sex: sex
        };

        try {
            const response = await fetch('/../../api/Admin_Func/StaffFunc', {
                method: 'POST',
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
                title: 'Staff added successfully',
                text: 'The new staff member has been added to the system.',
            });

            // Reset form fields
            setFullname('');
            setUsername('');
            setEmail('');
            setPhoneNo('');
            setPassword('');
            setSex('');

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
                <span className={styles.SpanHeader}>
                    <h2>ADD STAFF</h2>
                    <button onClick={onClose} className={styles.FormCloseButton}>X</button>
                </span>
               
                
                {/* Full Name Input */}
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                />

                {/* Gender Dropdown (Combo Box) */}
                <select value={sex} onChange={(e) => setSex(e.target.value)} required>
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>


                {/* Email Input */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Phone Number Input */}
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNo}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); 
                        if (value.length <= 11) {
                            setPhoneNo(value);
                        }
                    }}
                />

                {/* Username Input */}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                
                {/* Password Input */}
                <input
                    type="text"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
