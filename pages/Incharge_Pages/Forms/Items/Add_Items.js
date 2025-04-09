import styles from "@/styles/User.module.css";
import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function Adding_Item_Form({ category, onClose }) {
    const [itemName, setItemName] = useState('');
    const [itemCategory, setItemCategory] = useState('');
    const [itemQuantity, setItemQuantity] = useState('');
    const [itemAvailability, setItemAvailability] = useState('');
    const [image, setImage] = useState(null);  // Add state for image
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
  const [categories, setCategories] = useState(category); 

    // Get the userId (C_id) from sessionStorage
    const C_id = sessionStorage.getItem('userId'); // Assuming userId is stored in sessionStorage

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!itemName || !itemCategory || !itemQuantity || !itemAvailability || !image) {
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
        formData.append('I_Name', itemName);
        formData.append('I_Category', itemCategory);
        formData.append('I_Quantity', itemQuantity);
        formData.append('I_Availability', itemAvailability);
        formData.append('C_Image', image);  // Add image to the formData
        formData.append('C_id', C_id);      // Append C_id (userId) to formData

        try {
            // Sending the data to the API
            const response = await fetch('/../../api/Incharge_Func/Item_Func/Add_item_Func', {
                method: 'POST',
                body: formData, // Send formData instead of JSON
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit the form');
            }

            // Show success alert
            await Swal.fire({
                icon: 'success',
                title: 'Item added successfully',
                text: 'The new item has been added to the system.',
            });

            // Reset form fields
            setItemName('');
            setItemCategory('');
            setItemQuantity('');
            setItemAvailability('');
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
                <span className={styles.SpanHeader}>
                <h2>ADD ITEM</h2>
                <button onClick={onClose} className={styles.FormCloseButton}>X</button>
                </span>
                {/* Item Name Input */}
                <input
                    type="text"
                    placeholder="Item Name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                />

                {/* Item Category Input */}
                <input 
                        list="options"  
                        className={styles.searchableSelect} 
                        placeholder="Category" 
                        value={itemCategory}
                        onChange={(e) => setItemCategory(e.target.value)}
                    />
                    <datalist id="options">
                    {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </datalist>


                {/* Item Quantity Input */}
                <input
                    type="number"
                    placeholder="Item Quantity"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(e.target.value)}
                />

                    {/* Item Availability Input */}
                    <input
                        type="number"
                        placeholder="Item Availability"
                        value={itemAvailability}
                        onChange={(e) => setItemAvailability(e.target.value)}
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
