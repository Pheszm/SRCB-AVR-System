import styles from "@/styles/Admin.module.css";
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

        setIsSubmitting(true);
        setErrorMessage('');  // Clear previous error message

        const inchargeData = {
            C_Fullname: fullname,
            C_Username: username,
            C_Password: password,
            C_Email: email,
            C_PhoneNo: phoneNo,
            C_Sex: sex
        };

        try {
            const response = await fetch('/../../api/Admin_Func/InchargeFunc', {
                method: 'POST',
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
                title: 'Incharge added successfully',
                text: 'The new incharge member has been added to the system.',
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
                <h2>ADD INCHARGE</h2>
                
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
