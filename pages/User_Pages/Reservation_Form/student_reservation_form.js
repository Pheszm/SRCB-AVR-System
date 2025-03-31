import styles from "@/styles/ReservationPage.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState, useEffect } from 'react';
import { QR_Login } from "@/components/QR_Scanning";
import { useRouter } from "next/router"; 
import ItemCategory from "./ItemCategory";

export default function Student_Reservation_Form({ userId, userRole, onClose }) {
  const [SelectModall, setSelectModall] = useState("");
  const handleModalChange = (page) => {
    setSelectModall(page);
  };


  const router = useRouter(); 
  const [staffs, setStaffs] = useState([]);
  const [selectedPage, setSelectedPage] = useState("AVRITEMS");
  const handlePageChange = (page) => {
    setSelectedPage(page);
  };
  const [isScanning, setIsScanning] = useState(false);
  const toggleScan = () => {
    setIsScanning(prev => !prev);
    document.querySelector(`.${styles.qrOverlay}`).style.display = isScanning ? 'none' : 'flex';
  };
  const [student, setStudent] = useState(null);

  // Fetch staff data
  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/User_Func/Reservation_Func/Staff_datas_fetch'); // Adjust this to your API endpoint
      if (!res.ok) {
        throw new Error('Failed to fetch staff');
      }
      const data = await res.json();
      setStaffs(data); // Assuming 'data' is an array of staff
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch student data using the userId
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`/api/User_Func/Reservation_Func/Student_Res_Fetch?userId=${userId}`);
        if (!res.ok) {
          throw new Error('Student not found');
        }
        const data = await res.json();
        setStudent(data); // Update state with the fetched student data
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    if (userId) {
      fetchStudent();
    }
    fetchStaff();
  }, [userId]); // Re-fetch when the userId changes

  // QR Scanner Data Receiver
  const handleScanSuccess = (decodedText) => {
    console.log("QR Code Scanned:", decodedText);
    toggleScan();
  };

  if (!student) {
    return <div>Loading student data...</div>; // Display loading while fetching student data
  }

  return (
    <div className={styles.Gen_Background}>
      <title>SRCB AVR | Student Reservation Form</title>

      <div className={styles.SecondBodyLayer}>
        <div className={styles.ItemReservationForm}>
        
          <div className={styles.mainLogo}>
            <img src="./Assets/Img/AVR_Logo_White.png" alt="Logo" />
            <h2>SRCB</h2>
          </div>
          <h4>AVR Reservation Reservation Form</h4>

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
                    value={student.S_Fullname} // Populate full name from the fetched data
                    className={styles.HasDataAlr}
                    readOnly 
                  />

                  <label>Date & Time of Use</label>
                  <input id="IUseDate" type="date" placeholder="Date of Use" />
                  

                  <span>
                    <label>From</label>
                    <input id="IFromTime" type="time" placeholder="From Time" />
                    <label>To</label>
                    <input id="ToTime" type="time" placeholder="To Time" />
                  </span>

                  <span>
                    <input 
                      id="ICategory" 
                      type="text" 
                      placeholder="Category" 
                      value={student.S_Category} // Populate category from the fetched data
                      className={styles.HasDataAlr}
                      readOnly 
                    />
                    <input 
                      id="ILevel" 
                      type="text" 
                      placeholder="Level" 
                      value={student.S_Level} // Populate level from the fetched data
                      className={styles.HasDataAlr}
                      readOnly 
                    />
                  </span>

                  <select placeholder="Requested By">
                    <option value="" disabled selected>Requested By</option>
                    {staffs.map((staff) => (
                      <option key={staff.T_id} value={staff.T_Fullname}>
                        {staff.T_Fullname}
                      </option>
                    ))}
                  </select>



                  
                  <textarea 
                    id="IPurpose" 
                    className={styles.messagetypebox} 
                    placeholder="Purpose" 
                  />
                                  
                  <div className={styles.qrOverlay}>
                    <button className={styles.closeBtn} onClick={toggleScan}>x</button>
                    <div className={styles.qrScanner}>
                      <QR_Login ScanningStatus={isScanning} onScanSuccess={handleScanSuccess} />
                    </div>
                  </div>
                </div>

              <div className={styles.ItemSelectionArea}>
                <span className={styles.FlexBetweeen}>
                  <label>Materials Needed</label>
                  <button className={styles.AddItemBtn} onClick={() => handleModalChange("ItemCategoryy")}>ADD ITEM +</button>
                </span>

                <textarea id="SelectedItems" type="text" placeholder="Press ADD ITEMS" readOnly/>

                <span className={styles.FlexBetweeen}>
                  <button className={styles.ScanQRBtn} onClick={toggleScan}>Scan Item To Add</button>
                  <button className={styles.WarningBtn} onClick={toggleScan}>3 Items are has conflict schedule!</button>
                </span>
 
              </div>
            </div>
            <button className={styles.SubmitBtn}>Submit</button>
          </div>
          )}

          {selectedPage === "AVRVENUE" && student && (
            <div className={styles.MAINAVRITEMSDIV}>
              <div className={styles.VenueInformationArea}>
                <div>
                  <input 
                    id="VFullName" 
                    type="text" 
                    placeholder="Full Name" 
                    value={student.S_Fullname} // Populate full name from the fetched data
                    className={styles.HasDataAlr}
                    readOnly 
                  />
                  
                  <label>Date & Time of Use</label>
                  <input id="VUseDate" type="date" placeholder="Date of Use" />
                  
                  <span>
                    <label>From</label>
                    <input id="VFromTime" type="time" placeholder="From Time" />
                    <label>To</label>
                    <input id="VToTime" type="time" placeholder="To Time" />
                  </span>

                  <span>
                    <input 
                      id="VCategory" 
                      type="text" 
                      placeholder="Category" 
                      value={student.S_Category} // Populate category from the fetched data
                      className={styles.HasDataAlr}
                      readOnly 
                    />
                    <input 
                      id="VLevel" 
                      type="text" 
                      placeholder="Level" 
                      value={student.S_Level} // Populate level from the fetched data
                      className={styles.HasDataAlr}
                      readOnly 
                    />
                  </span>

                  <select placeholder="Requested By">
                    <option value="" disabled selected>Requested By</option>
                    {staffs.map((staff) => (
                      <option key={staff.T_id} value={staff.T_Fullname}>
                        {staff.T_Fullname}
                      </option>
                    ))}
                  </select>


                  <textarea 
                    id="VPurpose" 
                    className={styles.messagetypebox} 
                    placeholder="Purpose" 
                  />
                                  
                  <div className={styles.qrOverlay}>
                    <button className={styles.closeBtn} onClick={toggleScan}>x</button>
                    <div className={styles.qrScanner}>
                      <QR_Login ScanningStatus={isScanning} onScanSuccess={handleScanSuccess} />
                    </div>
                  </div>
                </div>
              </div>
            <button className={styles.SubmitBtn}>Submit</button>
          </div>
          )}
        </div>
      </div>

      {SelectModall === "ItemCategoryy" && (
        <div className={styles.BlurryBackground}>
          <ItemCategory onClose={() => setSelectModall("")} />
        </div>
      )}
      

    </div>
  );
}
