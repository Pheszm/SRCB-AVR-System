import React, { useState, useEffect } from 'react';
import styles from "@/styles/User.module.css";
import * as AiIcons_md from "react-icons/md";
import { QR_Login } from "@/components/QR_Scanning";

export default function ItemCategoryForm({ onClose, onSelectItem }) { 
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // Store selected item details
  const [borrowQuantity, setBorrowQuantity] = useState(1); // Store borrow quantity
  const [ItemId, setItemId] = useState(''); // Store borrow quantity



    // Open or Close the QR Scanner
    const [isScanning, setIsScanning] = useState(false);
    const toggleScan = () => {
      setIsScanning(prev => !prev);
      document.querySelector(`.${styles.qrOverlay}`).style.display = isScanning ? 'none' : 'flex';
    };
  
    // QR Scanner Data Reciever
    const handleScanSuccess = (decodedText) => {
      setSearchTerm(decodedText);
      console.log("QR Code Scanned:", decodedText);
      toggleScan();
    };


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
    item.I_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.I_QRcode.includes(searchTerm)
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
      // Pass the selected item and quantity back to the parent component
      onSelectItem(selectedItem, borrowQuantity);
      onClose(); // Close the form after selection
    }
  };

  return (
    <div className={styles.Formmm}>
      <span className={styles.SpanFlexx}>
        <h4>Select Item</h4>
        <button className={styles.ExitButtoonnn} onClick={onClose}>X</button>
      </span>

      <span className={styles.SpanFlexx3}>
        <input 
          type="search"
          placeholder="Search for Item"
          value={searchTerm}
          className={styles.SearchBarrr}
          onChange={handleSearchChange}
        />
        <button onClick={toggleScan}>
          <AiIcons_md.MdQrCode size={30}/>
        </button>
      </span>


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
          <h5>ITEM: {selectedItem.I_Name}</h5>
          <p>Availability: {selectedItem.I_Availability}</p> {/* Assuming `I_Availability` holds the available quantity */}
          
          <span className={styles.SpanFlexx2}>
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
          
          <button className={styles.SubmitButtonnn} onClick={handleBorrowSubmit}>Borrow</button>
        </div>
      )}

      {isScanning && (
              <div className={styles.BlurryBackground}>
              <div className={styles.AddItemForm}>
                <QR_Login ScanningStatus={isScanning} onScanSuccess={handleScanSuccess} CloseForm={toggleScan} />
              </div>
          </div>
      )}

      
    </div>
  );
}
