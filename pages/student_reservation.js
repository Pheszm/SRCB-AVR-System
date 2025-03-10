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

  const [isScanning, setIsScanning] = useState(false);
  const toggleScan = () => {
    setIsScanning(prev => !prev);
    document.querySelector(`.${styles.qrOverlay}`).style.display = isScanning ? 'none' : 'flex';
  };


  // QR Scanner Data Reciever
  const handleScanSuccess = (decodedText) => {
    console.log("QR Code Scanned:", decodedText);
    toggleScan();
  };

  function GoBackk(){
    router.push('/User');
}
  return (
    <div className={styles.Gen_Background}>
      <title>SRCB AVR | Student Reservation Form</title>



      <div className={styles.SecondBodyLayer}>
        <div className={styles.ItemReservationForm}>
          <button onClick={GoBackk} className={styles.ReturnBtnnnnn}><AiIcons.AiOutlineRollback size={20} />Return</button>
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
            <div className={styles.ItemInformationArea}>
              <div>
                <input id="IFullName" type="text" placeholder="Full Name" />
                  
                  <label>Date & Time of Use</label>
                  <input id="IUseDate" type="date" placeholder="Date of Use" />
                  
                  <span>
                    <label>From</label>
                    <input id="IFromTime" type="time" placeholder="From Time" />
                    <label>To</label>
                    <input id="ToTime" type="time" placeholder="To Time" />
                  </span>

                  <span>
                    <input id="ICategory" type="text" placeholder="Category" />
                    <input id="ILevel" type="text" placeholder="Level" />
                  </span>
                  <input id="IRequestedBy" type="text" placeholder="Requested By" />
                  
                  <textarea id="IPurpose" className={styles.messagetypebox} placeholder="Purpose" />
                                
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
            <button className={styles.SubmitBtn}>Submit</button>
            </div>
          )}
          
          {selectedPage === "AVRVENUE" && (
            <div className={styles.MAINAVRITEMSDIV}>
            <div className={styles.VenueInformationArea}>
              <div>
                <input id="VFullName" type="text" placeholder="Full Name" />
                  
                  <label>Date & Time of Use</label>
                  <input id="VUseDate" type="date" placeholder="Date of Use" />
                  
                  <span>
                    <label>From</label>
                    <input id="VFromTime" type="time" placeholder="From Time" />
                    <label>To</label>
                    <input id="VToTime" type="time" placeholder="To Time" />
                  </span>

                  <span>
                    <input id="VCategory" type="text" placeholder="Category" />
                    <input id="VLevel" type="text" placeholder="Level" />
                  </span>
                  <input id="VRequestedBy" type="text" placeholder="Requested By" />
                  
                  <textarea id="VPurpose" className={styles.messagetypebox} placeholder="Purpose" />
                                
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



    </div>
  );
}
