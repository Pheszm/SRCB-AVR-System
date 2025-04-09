import styles from "@/styles/ReservationPage.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/router"; 
import ItemCategoryForm from "./ItemCategory"; // Import the item category form
import Swal from 'sweetalert2';

export default function Student_Reservation_Form({ userId, userRole, onClose }) {
  const [SelectModall, setSelectModall] = useState("");
  const handleModalChange = (page) => {
    setSelectModall(page);
  };

  const TheDateSelected = useRef("");
  const setTheDateSelected = (newDate) => {
    TheDateSelected.current = newDate;
  };

  const TheFromTimeSelected = useRef("");
  const setTheFromTimeSelected = (newDate) => {
    TheFromTimeSelected.current = newDate;
  };

  const TheToTimeSelected = useRef("");
  const setTheToTimeSelected = (newDate) => {
    TheToTimeSelected.current = newDate;
  };


  const [SelectedRequestedBy, setSelectedRequestedBy] = useState("");

  const [reasonField, setreasonField] = useState("");

  const router = useRouter(); 

  const [WarningSign, setWarningSign] = useState("");

  const [staffs, setStaffs] = useState([]);
  const [selectedPage, setSelectedPage] = useState("AVRITEMS");
  const handlePageChange = (page) => {
    setSelectedPage(page);
  };
  

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [Venueconflicts, setVenueConflicts] = useState([]);


  function formatDate(inputDate) {
    const [year, month, day] = inputDate.split("-");  
    return `${day}/${month}/${year}`;  
  }


  const handleChange = (e) => { //DANI NAKO NAG STRUGGLE RONNNN HEREEEE
    const newDate = formatDate(e.target.value);
    setTheDateSelected(newDate);
    if(selectedPage === "AVRITEMS"){
      CheckItemConflict();  
    }
   else if(selectedPage === "AVRVENUE"){
    CheckVenueConflict();  
  }
  };


  const handleChangeFromTime = (e) => {
    setTheFromTimeSelected(e.target.value);
    if(selectedPage === "AVRITEMS"){
      CheckItemConflict();  
    }
    else if(selectedPage === "AVRVENUE"){
    CheckVenueConflict();  
  }
  };


  const handleChangeToTime = (e) => {
    setTheToTimeSelected(e.target.value);
    if(selectedPage === "AVRITEMS"){
      CheckItemConflict();  
    }
    else if(selectedPage === "AVRVENUE"){
    CheckVenueConflict();  
  }
  };

  const [student, setStudent] = useState(null);

  const [selectedItems, setSelectedItems] = useState([]);

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/User_Func/Reservation_Func/Staff_datas_fetch');
      if (!res.ok) {
        throw new Error('Failed to fetch staff');
      }
      const data = await res.json();
      setStaffs(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    TheFromTimeSelected.current = "";
    TheToTimeSelected.current = "";
    TheDateSelected.current = "";

    const fetchStudent = async () => {
      try {
        const res = await fetch(`/api/User_Func/Reservation_Func/Student_Res_Fetch?userId=${userId}`);
        if (!res.ok) {
          throw new Error('Student not found');
        }
        const data = await res.json();
        setStudent(data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    if (userId) {
      fetchStudent();
    }
    fetchStaff();
  }, [userId]);


  const handleItemSelect = (item, quantity) => {
    if (quantity > item.I_Availability) {
      alert('Quantity exceeds available stock!');
      return;
    }
    const itemExists = selectedItems.find(i => i.I_id === item.I_id);
    if (itemExists) {
      setSelectedItems(selectedItems.map(i => 
        i.I_id === item.I_id ? {...i, I_id: i.I_id, I_Name: i.I_Name, quantity: quantity } : i
      ));
    } else {
      setSelectedItems([...selectedItems, {I_id: item.I_id, I_Name: item.I_Name, quantity }]);
    }

    CheckItemConflict();
  };


  
  const CheckVenueConflict = async () => {
    try {
        const res = await fetch('/api/User_Func/Reservation_Func/Venue_TransactionFetch');
        if (!res.ok) throw new Error('Failed to fetch item Transactions');
  
        const Venue_Transac = await res.json();

        let venueconflicts = [];
  
            for (const transaction of Venue_Transac) {
                const formatDate = (date) => {
                const d = new Date(date);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0'); 
                const year = d.getFullYear();
              
                  return `${day}/${month}/${year}`;
                };

                    const existingFromTime = transaction.fromtime; 
                    const existingToTime = transaction.totime; 
                    const existingDate = formatDate(transaction.dateofuse); 

                    const existingFromTimeFormated = existingFromTime.slice(0, 5);
                    const existingToTimeFormated = existingToTime.slice(0, 5);
                    const requestedFromTime = TheFromTimeSelected.current.toString().slice(0, 5);
                    const requestedToTime = TheToTimeSelected.current.toString().slice(0, 5);


                    if (TheDateSelected.current == existingDate) {
                  
                      if (
                                (requestedFromTime < existingToTimeFormated && requestedFromTime >= existingFromTimeFormated) || 
                                (requestedToTime > existingFromTimeFormated && requestedToTime <= existingToTimeFormated) || 
                                (requestedFromTime <= existingFromTimeFormated && requestedToTime >= existingToTimeFormated) 
                            ) {
                              venueconflicts.push({
                                transactionId: transaction.transac_id,
                                existingFromTime: convertTo12HourFormat(existingFromTime),
                                existingToTime: convertTo12HourFormat(existingToTime),
                                conflictDate: existingDate,
                            });
                        }
                    }
            }
  


        function convertTo12HourFormat(time) {
          const [hours, minutes] = time.split(":");
        
          let hour = parseInt(hours, 10);
          const ampm = hour >= 12 ? 'PM' : 'AM';
        
          // Handle the case for midnight (00:00) and noon (12:00)
          if (hour === 0) {
            hour = 12; // Midnight (00:00) should be 12:00 AM
          } else if (hour > 12) {
            hour = hour - 12; // Convert 24-hour to 12-hour format (for hours 13-23)
          }
        
          return `${hour}:${minutes} ${ampm}`;
        }
        

        // Update conflicts state
        if (venueconflicts.length > 0) {
            console.log('Conflicts found:', venueconflicts);
            setWarningSign("WarningVenue");
            setVenueConflicts(venueconflicts);
        } else {
            console.log('No conflicts found');
            setWarningSign("");
            setConflicts([]);
        }
    } catch (error) {
        console.error('Error checking conflicts:', error);
    }
};




  const CheckItemConflict = async () => {
    try {
        const res = await fetch('/api/User_Func/Reservation_Func/Item_TransactionFetch');
        if (!res.ok) throw new Error('Failed to fetch item Transactions');
  
        const Item_Transac = await res.json();
        let conflicts = [];
  
        // Get the table by ID and its rows
        const table = document.getElementById("ItemTablee");
        const rows = table ? table.querySelectorAll("tbody tr") : [];
  
        // Loop through each row (table item) and check for conflicts
        rows.forEach(row => {
            const quantityCell = row.querySelector('td:nth-child(1)');
            const nameCell = row.querySelector('td:nth-child(2)');
            const I_id = row.getAttribute('value');  // Get I_id from the row key
            const quantity = parseInt(quantityCell.textContent, 10);
            const itemName = nameCell.textContent;
  
            // Loop through each existing transaction to find conflicts
            for (const transaction of Item_Transac) {
              //  console.log(transaction.I_id);


                const formatDate = (date) => {
                const d = new Date(date);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
                const year = d.getFullYear();
              
                return `${day}/${month}/${year}`;
              };

              

                if (transaction.I_id === parseInt(I_id)) {  // Compare I_id
                    const existingQuantity = Number(transaction.Quantity);  // Ensure it's a number
                    const existingFromTime = transaction.fromtime; // Assuming 'fromtime' in the transaction
                    const existingToTime = transaction.totime; // Assuming 'totime' in the transaction
                    const existingDate = formatDate(transaction.dateofuse); // Assuming 'dateofuse' in the transaction


                    // Convert time strings to Date objects for comparison
                    const existingFromTimeFormated = existingFromTime.slice(0, 5);
                    const existingToTimeFormated = existingToTime.slice(0, 5);
                    const requestedFromTime = TheFromTimeSelected.current.toString().slice(0, 5);
                    const requestedToTime = TheToTimeSelected.current.toString().slice(0, 5);
                    // Check if the requested time range conflicts with the existing reservation's time range
                    if (TheDateSelected.current == existingDate) {
                          if (
                                (requestedFromTime < existingToTimeFormated && requestedFromTime >= existingFromTimeFormated) || 
                                (requestedToTime > existingFromTimeFormated && requestedToTime <= existingToTimeFormated) || 
                                (requestedFromTime <= existingFromTimeFormated && requestedToTime >= existingToTimeFormated) 
                            ) {
                            conflicts.push({
                                item: itemName,
                                conflictQuantity: transaction.Quantity,
                                transactionId: transaction.transac_id,
                                existingFromTime: convertTo12HourFormat(existingFromTime),
                                existingToTime: convertTo12HourFormat(existingToTime),
                                conflictDate: existingDate,
                            });
                        }
                    }
                }
            }
        });


        function convertTo12HourFormat(time) {
          const [hours, minutes] = time.split(":");
        
          let hour = parseInt(hours, 10);
          const ampm = hour >= 12 ? 'PM' : 'AM';
        
          // Handle the case for midnight (00:00) and noon (12:00)
          if (hour === 0) {
            hour = 12; // Midnight (00:00) should be 12:00 AM
          } else if (hour > 12) {
            hour = hour - 12; // Convert 24-hour to 12-hour format (for hours 13-23)
          }
        
          return `${hour}:${minutes} ${ampm}`;
        }
        

        // Update conflicts state
        if (conflicts.length > 0) {
            console.log('Conflicts found:', conflicts);
            setWarningSign("Warning");
            setConflicts(conflicts);
        } else {
            console.log('No conflicts found');
            setWarningSign("");
            setConflicts([]);
        }
    } catch (error) {
        console.error('Error checking conflicts:', error);
    }
};




  const handleRemoveItem = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.I_id !== itemId));
    CheckItemConflict();
  };

  function formatterDate(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`; // Returns in YYYY-MM-DD format
}


  // Time validation function
  const validateTime = (fromTime, toTime) => {
    const from = new Date(`1970-01-01T${fromTime}:00`);
    const to = new Date(`1970-01-01T${toTime}:00`);
    const start = new Date("1970-01-01T08:00:00");
    const end = new Date("1970-01-01T17:00:00");

    if (from < start || from > end) {
      return 'From time must be between 8:00 AM and 5:00 PM.';
    }

    if (to < start || to > end) {
      return 'To time must be between 8:00 AM and 5:00 PM.';
    }

    if (from >= to) {
      return 'From time cannot be after To time.';
    }

    return null;
  };

  // Date validation function (ensures the date is at least 3 days from now)
  const validateDate = (date) => {
    const selectedDate = new Date(date);
    const currentDate = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(currentDate.getDate() + 3); // Set the minimum date to 3 days from now

    if (selectedDate < threeDaysFromNow) {
      return 'The reservation date must be at least 3 days from today.';
    }

    return null;
  };

  const handleSubmitTransaction = async () => {
    // Validate form data first
    if (!TheDateSelected.current || !TheFromTimeSelected.current || !TheToTimeSelected.current || !SelectedRequestedBy) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill all required fields.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    const dateValidationError = validateDate(TheDateSelected.current);
    if (dateValidationError) {
      Swal.fire({
        title: 'Error!',
        text: dateValidationError,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    const timeValidationError = validateTime(TheFromTimeSelected.current, TheToTimeSelected.current);
    if (timeValidationError) {
      Swal.fire({
        title: 'Error!',
        text: timeValidationError,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    if (!reasonField.trim()) {
      Swal.fire({
        title: 'Error!',
        text: 'Please provide a reason for the reservation.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    if (selectedItems.length === 0 && selectedPage === "AVRITEMS") {
      Swal.fire({
        title: 'Error!',
        text: 'Please add at least one item to the reservation.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    // Prepare transaction data
    const transactionData = {
      Usertype: userRole,
      User_id: userId,
      requestedby_id: SelectedRequestedBy,
      approvedby_id: null,  // Can be set later if necessary
      transac_reason: reasonField,
      Transac_Category: selectedPage,
      Items_Needed: selectedItems,  // Send selected items as an array
      dateofuse: formatterDate(TheDateSelected.current),
      fromtime: TheFromTimeSelected.current,
      totime: TheToTimeSelected.current,
      returnedtime: null,  // For now it's null, but can be added later
      comments_afteruse: null,  // For now it's null, but can be added later
    };
  
    // Send data to API
    try {
      const res = await fetch('/api/User_Func/Reservation_Func/Add_Reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });
  
      if (!res.ok) {
        throw new Error('Failed to submit transaction');
      }
  
      const responseData = await res.json();
      Swal.fire({
        title: 'Success!',
        text: 'Your reservation has been submitted successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
  
      onClose();  // Close the form after submission
    } catch (error) {
      console.error('Error submitting transaction:', error);
  
      Swal.fire({
        title: 'Error!',
        text: 'There was an issue submitting your reservation. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };
  

  if (!student) {
    return <div style={{ color: "#ffffff" }}>Loading student data...</div>;
  }

  return (
    <div className={styles.Gen_Background}>
      <title>SRCB AVR | Student Reservation Form</title>

      <div className={styles.SecondBodyLayer}>
        <div className={styles.ItemReservationForm}>
          <button onClick={onClose} className={styles.FormCloseButton}>X</button>
          <div className={styles.mainLogo}>
            <img src="./Assets/Img/AVR_Logo_Blue.png" alt="Logo" />
            <h2>SRCB</h2>
          </div>
          <h4>AVR Reservation Form</h4>

          <div className={styles.SelectionDiv}>
            <button className={selectedPage === "AVRITEMS" ? styles.active : ""} onClick={() => handlePageChange("AVRITEMS")}>AVR ITEM</button>
            <button className={selectedPage === "AVRVENUE" ? styles.active : ""} onClick={() => handlePageChange("AVRVENUE")}>AVR VENUE</button>
          </div>

          {selectedPage === "AVRITEMS" && student && (
            <div className={styles.MAINAVRITEMSDIV}>
              <div className={styles.ItemInformationArea}>
                <div>
                  <input 
                    id="IFullName" 
                    type="text" 
                    placeholder="Full Name" 
                    value={student.S_Fullname} 
                    className={styles.HasDataAlr}
                    readOnly 
                  />
                  <label>Date & Time of Use</label>
                  <input 
                    onChange={handleChange}
                    type="date" 
                    placeholder="Date of Use" 
                  />
                  <span>
                    <label>From</label>
                    <input 
                      onChange={handleChangeFromTime}
                      type="time" 
                      placeholder="From Time" 
                    />
                    <label>To</label>
                    <input 
                      onChange={handleChangeToTime}
                      type="time" 
                      placeholder="To Time" 
                    />
                  </span>

                  <select placeholder="Requested By"
                    onChange={(e) => setSelectedRequestedBy(e.target.value)}
                  >
                    <option value="" disabled selected>Requested By</option>
                    {staffs.map((staff) => (
                      <option key={staff.T_id} value={staff.T_id}>
                        {staff.T_Fullname}
                      </option>
                    ))}
                  </select>

                  <textarea 
                    id="IPurpose" 
                    onChange={(e) => setreasonField(e.target.value)}
                    className={styles.messagetypebox} 
                    placeholder="Purpose" 
                  />
                </div>

                <div className={styles.ItemSelectionArea}>
                  <span className={styles.FlexBetweeen}>
                    <label>Materials Needed</label>
                    <button className={styles.AddItemBtn} onClick={() => handleModalChange("ItemCategoryy")}>ADD ITEM +</button>
                  </span>

                  <div className={styles.TableContainer}>
                    <table className={styles.TableAreaaa} id="ItemTablee">
                      <tbody>
                        {selectedItems.map(item => (
                          <tr key={item.I_id} value={item.I_id}>
                            <td>{item.quantity}</td>
                            <td>{item.I_Name}</td>
                            <td><button className={styles.RemoveButton} onClick={() => handleRemoveItem(item.I_id)}>Remove</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <span className={styles.FlexBetweeen2}>
                  {WarningSign === "Warning" && (
                    <button 
                    className={styles.WarningBtn} 
                    onClick={() => {CheckItemConflict(); setIsDropdownOpen2(prevState => !prevState);}}>

                    <b>Warning:</b> {conflicts.length} items/s have a conflict schedule!
                  </button>
                  )}


                {isDropdownOpen2 && conflicts.length > 0 && (
                  <div className={styles.ConflictDropdown}>
                    <ul>
                      {conflicts.map((conflicts, index) => (
                        <li key={index}>
                          <strong>Item:</strong> {conflicts.conflictQuantity} {conflicts.item}<br />
                          <strong>Requested Date:</strong> {conflicts.conflictDate}<br />
                          <strong>Requested Time:</strong> {conflicts.existingFromTime} to {conflicts.existingToTime}<br />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                  </span>
                </div>
              </div>
              <button className={styles.SubmitBtn} onClick={handleSubmitTransaction}>Submit</button>
            </div>
          )}



          {selectedPage === "AVRVENUE" && (
            <div className={styles.MAINAVRITEMSDIV}>
              <div className={styles.VenueInformationArea}>
                <div>
                  <input 
                    id="IFullName" 
                    type="text" 
                    placeholder="Full Name" 
                    value={student.S_Fullname} 
                    className={styles.HasDataAlr}
                    readOnly 
                  />
                  <label>Date & Time of Use</label>
                  <input 
                    onChange={handleChange}
                    type="date" 
                    placeholder="Date of Use" 
                  />
                  <span>
                    <label>From</label>
                    <input 
                      onChange={handleChangeFromTime}
                      type="time" 
                      placeholder="From Time" 
                    />
                    <label>To</label>
                    <input 
                      onChange={handleChangeToTime}
                      type="time" 
                      placeholder="To Time" 
                    />
                  </span>

                  <select placeholder="Requested By"
                    onChange={(e) => setSelectedRequestedBy(e.target.value)}
                  >
                    <option value="" disabled selected>Requested By</option>
                    {staffs.map((staff) => (
                      <option key={staff.T_id} value={staff.T_id}>
                        {staff.T_Fullname}
                      </option>
                    ))}
                  </select>

                  <textarea 
                    onChange={(e) => setreasonField(e.target.value)}
                    className={styles.messagetypebox} 
                    placeholder="Purpose" 
                  />

                <span className={styles.FlexBetweeen2}>
                  {WarningSign === "WarningVenue" && (
                    <button 
                    className={styles.WarningBtn} 
                    onClick={() => {CheckVenueConflict(); setIsDropdownOpen(prevState => !prevState);}}>

                    <b>Warning:</b> {conflicts.length} item/s has a conflict schedule!
                  </button>
                  )}


                {isDropdownOpen && Venueconflicts.length > 0 && (
                  <div className={styles.ConflictDropdown}>
                    <ul>
                      {Venueconflicts.map((conflicts, index) => (
                        <li key={index}>
                          <strong>Item No. </strong> {index + 1}<br />
                          <strong>Requested Date:</strong> {conflicts.conflictDate}<br />
                          <strong>Requested Time:</strong> {conflicts.existingFromTime} to {conflicts.existingToTime}<br />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                  </span>
                </div>

              </div>
              <button className={styles.SubmitBtn} onClick={handleSubmitTransaction}>Submit</button>
            </div>
          )}
        </div>
      </div>

      {SelectModall === "ItemCategoryy" && (
        <div className={styles.BlurryBackground}>
          <ItemCategoryForm onClose={() => setSelectModall("")} onSelectItem={handleItemSelect} />
        </div>
      )}


    </div>
  );
}
