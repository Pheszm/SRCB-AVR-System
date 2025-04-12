import React, { useState, useEffect } from 'react';
import styles from "@/styles/User.module.css";
import styles2 from "@/styles/ReservationPage.module.css";

export default function ViewTransaction({ transaction, onClose }) {
  const [WarningSign, setWarningSign] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minute} ${suffix}`;
  };

  const FormatDateTimeFromDB = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${year}/${month}/${day}, ${hours}:${minutes} ${ampm}`;
  };




  const CheckItemConflict = async () => {
    try {
      const res = await fetch('/api/User_Func/Reservation_Func/Item_TransactionFetch');
      if (!res.ok) throw new Error('Failed to fetch item Transactions');
      console.log("================================================================================");  
      const Item_Transac = await res.json();  // List of existing transactions
      let conflicts = [];  // Array to store conflict details
      
      // Iterate through each item in the current transaction
      transaction.items.forEach(row => {
  
        // Check each existing transaction
        Item_Transac.forEach(ExistTransac => {
          
          // Format date to dd/mm/yyyy
          const formatDate = (date) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;  // Format as dd/mm/yyyy
          };
  
          // Check if the item ID matches
          if (ExistTransac.I_id === parseInt(row.I_id)) {  // Compare item ID
            const existingQuantity = Number(ExistTransac.Quantity);  // Ensure it's a number
            const existingFromTime = ExistTransac.fromtime; // Existing reservation 'fromtime'
            const existingToTime = ExistTransac.totime; // Existing reservation 'totime'
            const existingDate = formatDate(ExistTransac.dateofuse); // Format dateofuse
  
            // Convert time strings to hh:mm format for comparison (Ensure they exist before using)
            const existingFromTimeFormatted = existingFromTime ? existingFromTime.slice(0, 5) : ''; // Format to hh:mm
            const existingToTimeFormatted = existingToTime ? existingToTime.slice(0, 5) : '';   // Format to hh:mm
            
            // Ensure row.fromtime and row.totime are not undefined before proceeding
            const requestedFromTime = transaction.fromtime.toString().slice(0, 5); // Format to hh:mm
            const requestedToTime = transaction.totime.toString().slice(0, 5);   // Format to hh:mm
  
            // Log values for debugging (remove in production)
            console.log(`Miners: ${formatDate(transaction.dateofuse) }, Existerrr: ${existingDate}`);
            console.log(`Requested From Time: ${requestedFromTime}, Requested To Time: ${requestedToTime}`);
            console.log(`Existing From Time: ${existingFromTimeFormatted}, Existing To Time: ${existingToTimeFormatted}`);

            // Check if the requested date and time overlap with the existing reservation
            if (formatDate(transaction.dateofuse) === existingDate) {
              console.log("HAHAHAHAHAHAH");
              if (
                (requestedFromTime < existingToTimeFormatted && requestedFromTime >= existingFromTimeFormatted) || 
                (requestedToTime > existingFromTimeFormatted && requestedToTime <= existingToTimeFormatted) || 
                (requestedFromTime <= existingFromTimeFormatted && requestedToTime >= existingToTimeFormatted)
              ) {
                
                // Add conflict details to the conflicts array
                conflicts.push({
                  item: row.I_Name,  // Item name from the row in the transaction
                  conflictQuantity: existingQuantity,
                  transactionId: ExistTransac.transac_id, 
                  reason: ExistTransac.transac_reason, 
                  existingFromTime: convertTo12HourFormat(existingFromTime),  // Convert to 12-hour format
                  existingToTime: convertTo12HourFormat(existingToTime),      // Convert to 12-hour format
                  conflictDate: existingDate,
                });
              }
            }
          }
        });
      });
  
      // After checking all items, handle the conflicts
      if (conflicts.length > 0) {
        setConflicts(conflicts);
        setWarningSign("Warning");  // Trigger the warning message
      } else {
        setConflicts([]);  // Clear conflicts if no conflicts found
        setWarningSign(null);  // Clear warning if no conflicts
      }
    } catch (error) {
      console.error('Error checking conflicts:', error);  // Log errors for debugging
    }
  };
  

  

  useEffect(() => {
    CheckItemConflict();
  }, [transaction]);

  return (
    <div className={styles.AddItemForm}>
      <form className={styles.Formmmm}>
        <span className={styles.SpanHeader}>
          <h2>PENDING RESERVATION</h2>
          <button onClick={onClose} className={styles.FormCloseButton}>X</button>
        </span>

        <div className={styles.ResponsiveAligner}>
          <div className={styles.RightAreaa}>
            <span className={styles.FieldsArea}>
              <label>Name:</label>
              <p>{transaction.fullName}</p>
            </span>

            <span className={styles.FieldsArea}>
              <label>Usertype:</label>
              <p>{transaction.Usertype}</p>
            </span>

            <span className={styles.FieldsArea}>
              <label>Date of Use:</label>
              <p>{formatDate(transaction.dateofuse)}, {convertTo12HourFormat(transaction.fromtime)} to {convertTo12HourFormat(transaction.totime)}</p>
            </span>

            <span className={styles.FieldsArea}>
              <label>Purpose:</label>
              <p>{transaction.transac_reason}</p>
            </span>
          </div>

          <div className={styles.RightAreaa}>
            <span className={styles.FieldsArea}>
              <label>Need/s:</label>
              <p>
                {transaction.items && transaction.items.length > 0
                  ? transaction.items.map(item => `${item.Quantity || ''} ${item.I_Name || 'AVR Venue'}`).join(', ')
                  : 'N/A'}
              </p>
            </span>

            <span className={styles.FieldsArea}>
              <label>Requested By:</label>
              <p>{transaction.requestedby_fullname}</p>
            </span>

            <span className={styles.FieldsArea}>
              <label>Date Filed:</label>
              <p>{FormatDateTimeFromDB(transaction.DateFiled)}</p>
            </span>
          </div>
        </div>

        <span className={styles.SpanFlex}>
            .
        {WarningSign === "Warning" && (
          <button
            type="button"
            className={styles.WarningBtn} 
            onClick={() => setIsDropdownOpen2(prev => !prev)}
          >
            <b>Warning:</b> {conflicts.length} item(s) have a conflict schedule!
          </button>
        )}
            <span className={styles.SpanFlex}>
                <button className={styles.SuccessBtnnn}>Approve</button>
                <button className={styles.RemoveBtnnn}>Decline</button>
            </span>
        </span>
        

        {isDropdownOpen2 && conflicts.length > 0 && (
          <div className={styles.ConflictDropdown}>
            <ul>
              {conflicts.map((conflict, index) => (
                <li key={index}>
                  <strong>Item:</strong> {conflict.conflictQuantity} {conflict.item}<br />
                  <strong>Requested Date:</strong> {conflict.conflictDate}<br />
                  <strong>Requested Time:</strong> {conflict.existingFromTime} to {conflict.existingToTime}<br />
                  <strong>Reason:</strong> {conflict.reason}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}
