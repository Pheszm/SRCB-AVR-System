import styles from "@/styles/User.module.css";
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Updating_Item_Form({ item, category, onClose }) {
  const [itemName, setItemName] = useState(item.I_Name || '');
  const [itemCategory, setItemCategory] = useState(item.I_Category || '');
  const [itemStatus, setItemStatus] = useState(item.I_Status || '');
  const [itemQuantity, setItemQuantity] = useState(item.I_Quantity || '');
  const [itemAvailability, setItemAvailability] = useState(item.I_Availability || '');
  const [image, setImage] = useState(null);  // For the new image
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [categories, setCategories] = useState(category);

  // Get the userId (C_id) from sessionStorage
  const C_id = sessionStorage.getItem('userId'); // Assuming userId is stored in sessionStorage

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!itemName || !itemCategory || !itemQuantity || !itemAvailability) {
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
    formData.append('I_id', item.I_id); // Add the item ID here to specify which item to update
    formData.append('I_Name', itemName);
    formData.append('I_Category', itemCategory);
    formData.append('I_Status', itemStatus);
    formData.append('I_Quantity', itemQuantity);
    formData.append('I_Availability', itemAvailability);
    formData.append('C_id', C_id);  // Append C_id (userId) to formData
  
    if (image) {
      formData.append('C_Image', image);  // Add image to formData if a new image is provided
    }
  
    try {
      // Sending the data to the API to update the item
      const response = await fetch('/api/Incharge_Func/Item_Func/Update_item_Func', {
        method: 'PUT',
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update the item');
      }
  
      // Show success alert
      await Swal.fire({
        icon: 'success',
        title: 'Item updated successfully',
        text: 'The item details have been updated.',
      });
  
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
      setImage(file);  // Store the new image file
    }
  };

  return (
    <div className={styles.AddItemForm}>
      <form onSubmit={handleSubmit}>
        <h2>UPDATE ITEM</h2>

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

        <select value={itemStatus} onChange={(e) => setItemStatus(e.target.value)} required>
                    <option value="" disabled>Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Disable">Disable</option>
                </select>

        {/* Image Input */}
        <p><b>Note:</b> Upload image to if you want to update the image</p>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
        />

        {/* Error Message Display */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* Submit Button */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Update'}
        </button>
      </form>
    </div>
  );
}
