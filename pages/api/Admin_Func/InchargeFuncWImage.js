import pool from '@/lib/db';
import formidable from 'formidable';  // Correct import for Formidable
import fs from 'fs';
import path from 'path';

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,  // Disable body parsing so we can use formidable
  },
};

// Initialize formidable to handle file uploads
const form = formidable({
  uploadDir: path.join(process.cwd(), 'public/uploads'), // Use absolute path to store images
  keepExtensions: true,  // Retain file extensions
  multiples: false,      // Handle only one file per request (if you need multiple files, set this to true)
  filename: (name, ext, part, form) => `${Date.now()}${ext}`, // Add timestamp to filename to prevent name conflicts
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Fetch all incharge members
    const [rows] = await pool.query('SELECT * FROM incharge');
    res.status(200).json(rows);


    
  } else if (req.method === 'POST') {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading file' });
      }

      const { C_Username, C_Password, C_Email, C_PhoneNo, C_Sex, C_Fullname } = fields;

      // Get the image file path, if any
      const imagePath = files.C_Image ? path.basename(files.C_Image[0].filepath) : null;

      try {
        // Check if the username already exists
        const [existingIncharge] = await pool.query('SELECT * FROM incharge WHERE C_Username = ?', [C_Username]);

        if (existingIncharge.length > 0) {
          return res.status(400).json({ message: 'Username already exists' });
        }

        // Insert the new incharge data into the database
        await pool.query(
          'INSERT INTO incharge (C_Username, C_Password, C_Email, C_PhoneNo, C_Sex, C_Fullname, C_Image) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            C_Username,
            C_Password,
            C_Email,
            C_PhoneNo,
            C_Sex,
            C_Fullname,
            imagePath, // Store the relative image path in the database
          ]
        );

        res.status(201).json({ message: 'Incharge added successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

  }


  
  else if (req.method === 'PUT') {
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Form parsing error:', err); // Add logging here for debugging
            return res.status(400).json({ message: 'Error uploading file' });
        }

        const {
            C_id,
            C_Username,
            C_Password,
            C_Email,
            C_PhoneNo,
            C_Sex,
            C_Fullname,
        } = fields;

        // Get the updated image path if a new file is uploaded
        const imagePath = files.C_Image ? path.basename(files.C_Image[0].filepath) : null;

        console.log('Received fields:', fields);  // Log fields
        console.log('Received files:', files);    // Log files for debugging

        try {
            // Check if the incharge exists
            const [existingIncharge] = await pool.query('SELECT * FROM incharge WHERE C_Username = ?', [C_Username]);

            if (!existingIncharge.length) {
                console.log('Incharge not found in database.');
                return res.status(404).json({ message: 'Incharge not found' });
            }

            // Update the incharge data in the database
            let queryParams = [
                C_Username,
                C_Password,
                C_Email,
                C_PhoneNo,
                C_Sex,
                C_Fullname,
                C_id, // The ID of the incharge to update
            ];

            let query = 'UPDATE incharge SET C_Username=?, C_Password=?, C_Email=?, C_PhoneNo=?, C_Sex=?, C_Fullname=? WHERE C_id=?';

            if (imagePath) {
                // If there's a new image, add the image path to the update query
                query = 'UPDATE incharge SET C_Username=?, C_Password=?, C_Email=?, C_PhoneNo=?, C_Sex=?, C_Fullname=?, C_Image=? WHERE C_id=?';
                queryParams.push(imagePath);  // Add image path to the query parameters
            }

            // Execute the update query
            await pool.query(query, queryParams);
            console.log('Incharge updated successfully.');

            res.status(200).json({ message: 'Incharge updated successfully' });
        } catch (error) {
            console.error('Database update error:', error);  // Log the error for debugging
            res.status(500).json({ message: 'Internal server error' });
        }
    });
}

    
  
   else if (req.method === 'DELETE') {
    // Delete the incharge record
    const { C_id } = req.body;
    await pool.query('DELETE FROM incharge WHERE C_id=?', [C_id]);
    res.status(200).json({ message: 'Incharge deleted' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}


////////////////////////////////////////////////////////
///////////////////////////////////////////////////////















//ADD INCHARGE
import styles from "@/styles/User.module.css";
import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function Adding_Item_Form({ onClose }) {
    const [fullname, setFullname] = useState('');
    const [sex, setSex] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);  // Add state for image
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!fullname || !sex || !username || !email || !phoneNo || !password || !image) {
            await Swal.fire({
                icon: 'warning',
                title: 'Please fill all fields',
                text: 'All fields are required to submit the form.',
            });
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');  // Clear previous error message

        // Prepare form data
        const formData = new FormData();
        formData.append('C_Fullname', fullname);
        formData.append('C_Username', username);
        formData.append('C_Password', password);
        formData.append('C_Email', email);
        formData.append('C_PhoneNo', phoneNo);
        formData.append('C_Sex', sex);
        formData.append('C_Image', image);  // Add image to the formData

        try {
            // Sending the data to the API
            const response = await fetch('/../../api/Admin_Func/InchargeFunc', {
                method: 'POST',
                body: formData, // send formData instead of JSON
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit the form');
            }

            // Show success alert
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
            setImage(null);  // Reset the image field

            // Call the onClose callback passed from the parent to close the form
            onClose();  // Close the form by resetting the parent state
        } catch (error) {
            setErrorMessage(error.message);
            // Show error alert
            await Swal.fire({
                icon: 'error',
                title: 'Error submitting form',
                text: 'There was an issue submitting the form: ' + error.message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);  // Store the image file
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

                {/* Image Input */}
                <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    required
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






















//UPDATE INCHARGE
import React, { useState } from 'react';
import styles from "@/styles/Admin.module.css";
import Swal from 'sweetalert2';  // Import SweetAlert2

export default function UpdateInchargeForm({ incharge, onClose, onUpdate }) {
    const [fullname, setFullname] = useState(incharge?.C_Fullname || '');
    const [C_Sex, setCSex] = useState(incharge?.C_Sex || '');
    const [C_PhoneNo, setCPhoneNo] = useState(incharge?.C_PhoneNo || '');
    const [C_Username, setCUsername] = useState(incharge?.C_Username || '');
    const [C_Password, setCPassword] = useState(incharge?.C_Password || '');
    const [C_Email, setCEmail] = useState(incharge?.C_Email || '');
    const [image, setImage] = useState(null);  // To handle the selected image
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!fullname || !C_Sex || !C_Username || !C_Password || !C_Email || !C_PhoneNo) {
            await Swal.fire({
                icon: 'warning',
                title: 'Please fill all fields',
                text: 'All fields are required to submit the form.',
            });
            return;
        }
    
        setIsSubmitting(true);
        setErrorMessage('');
    
        const formData = new FormData();
        formData.append('C_Fullname', fullname);
        formData.append('C_Sex', C_Sex);
        formData.append('C_PhoneNo', C_PhoneNo);
        formData.append('C_Username', C_Username);
        formData.append('C_Password', C_Password);
        formData.append('C_Email', C_Email);
        formData.append('C_id', incharge.C_id);  // Include the incharge ID for updating
        if (image) formData.append('C_Image', image);  // Attach image if selected
    
        try {
            const response = await fetch('/api/Admin_Func/InchargeFunc', {
                method: 'PUT',
                body: formData,
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update incharge');
            }
    
            await Swal.fire({
                icon: 'success',
                title: 'Incharge updated successfully',
                text: 'The incharge details have been updated.',
            });
    
            onUpdate();  // Refresh the data in the parent component
            onClose();   // Close the form
        } catch (error) {
            setErrorMessage(error.message);
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

                {/* Display existing image */}
                {incharge?.C_Image && (
                    <div className={styles.ImageArea} style={{ backgroundImage: `url('/uploads/${incharge.C_Image}')` }}>
                            <input
                                className={styles.ImageAreaadderr}
                                type="file"
                                accept="image/*"
                                
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                    </div>
                )}



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
