import styles from "@/styles/ReservationPage.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState } from 'react';
import { QR_Login } from "../components/QR_Scanning";
import { useRouter } from "next/router"; 

export default function Home() {
  const router = useRouter(); 

  const [selectedPage, setSelectedPage] = useState("AVRITEMS");
  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  // Open or Close the QR Scanner
  const [isScanning, setIsScanning] = useState(false);
  const toggleScan = () => {
    setIsScanning(prev => !prev);
    document.querySelector(`.${styles.qrOverlay}`).style.display = isScanning ? 'none' : 'flex';
  };


  // QR Scanner Data Reciever
  const handleScanSuccess = (decodedText) => {
    console.log("QR Code Scanned:", decodedText);
    QRLoginProcess(decodedText);
    toggleScan();
  };


  const LoginProcess = () => {
    // Design Presentation Muna
    router.push('/Incharge');


    // If Deployed
    const username = document.getElementById("UserN").value;
    const password = document.getElementById("PassW").value;
    const user = Users.find((user) => user.username === username && user.password === password);
    if (user) {
      console.log("User found:", user);
      router.push('/Incharge');
    } else {
      console.log("User not found");
    }
  };

  return (
    <div className={styles.Gen_Background}>
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


        {selectedPage === "AVRITEMS" && (
          <div className={styles.MAINAVRITEMSDIV}>
          <div className={styles.InformationArea}>
            <div>
              <input id="FullName" type="text" placeholder="Full Name" />
                
                <label>Date & Time of Use</label>
                <input id="UseDate" type="date" placeholder="Date of Use" />
                
                <span>
                  <label>From</label>
                  <input id="FromTime" type="time" placeholder="From Time" />
                  <label>To</label>
                  <input id="ToTime" type="time" placeholder="To Time" />
                </span>
                
                <input id="Department" type="text" placeholder="Department" />
                <input id="RequestedBy" type="text" placeholder="Requested By" />
                
                <textarea id="Message" className={styles.messagetypebox} placeholder="Message" />
                              
                <div className={styles.qrOverlay}>
                  <button className={styles.closeBtn} onClick={toggleScan}>x</button>
                  <div className={styles.qrScanner}>
                    <QR_Login ScanningStatus={isScanning} onScanSuccess={handleScanSuccess} />
                  </div>
                </div>
              </div>

            <div className={styles.ItemSelectionArea}>
                <label>Materials Needed</label>
                <textarea id="SelectedItems" type="text" placeholder="Materials" />
                <button className={styles.ScanQRBtn} onClick={toggleScan}>Scan Item To Add</button>
            </div>
          </div>
          <button className={styles.SubmitBtn} onClick={LoginProcess}>Submit</button>
          </div>
        )}
        
      </div>
    </div>
  );
}
