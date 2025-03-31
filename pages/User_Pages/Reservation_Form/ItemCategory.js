import React, { useState, useEffect } from 'react';
import styles from "@/styles/User.module.css";

export default function ItemCategoryForm({ onClose }) { 
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // Store selected item details
  const [borrowQuantity, setBorrowQuantity] = useState(1); // Store borrow quantity

  useEffect(() => {
    // Fetch items from your API
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/User_Func/Reservation_Func/Fetch_Items');
        const data = await response.json();
        setItems(data); // Store fetched items in the state
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = items.filter(item =>
    item.I_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemClick = (item) => {
    setSelectedItem(item); // Set selected item
    setBorrowQuantity(1); // Reset quantity when new item is selected
  };

  const handleQuantityChange = (event) => {
    setBorrowQuantity(event.target.value); // Update borrow quantity
  };

  const handleBorrowSubmit = () => {
    if (selectedItem) {
      console.log(`Borrowing ${borrowQuantity} of ${selectedItem.I_Name}`);
      // Implement borrowing logic, like making an API request
    }
  };

  return (
    <div className={styles.Formmm}>
    <span className={styles.SpanFlexx}>
        <h4>Select Item</h4>
        <button onClick={onClose}>X</button>
    </span>

      <input
        type="search"
        placeholder="Search for Item"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <div className={styles.ScrollableBoxx}>
        {filteredItems.map(item => (
          <div
            key={item.I_id}
            className={`${styles.ItemBoxxx} ${selectedItem && selectedItem.I_id === item.I_id ? styles.ItemBoxxxSelected : ''}`} // Apply highlight if selected
            onClick={() => handleItemClick(item)} // Pass item object
          >
            <img
              src={`/uploads/${item.C_Image}`} // Image path based on the public folder
              alt={item.I_Name}
              className={styles.ItemImage}
            />
            <p>{item.I_Name}</p>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className={styles.SelectedItemDetails}>
          <h5>{selectedItem.I_Name}</h5>
          <p>Availability: {selectedItem.I_Availability}</p> {/* Assuming `I_Availability` holds the available quantity */}
          

          <span>
            <label htmlFor="quantity">Quantity to Borrow: </label>
            <input
                type="number"
                id="quantity"
                value={borrowQuantity}
                onChange={handleQuantityChange}
                min="1"
                max={selectedItem.I_Availability} // Limit max quantity to availability
            />
          </span>
          
          <button onClick={handleBorrowSubmit}>Borrow</button>
        </div>
      )}
    </div>
  );
}
