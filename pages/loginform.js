import styles from "@/styles/Loginpage.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState } from 'react';
import { QR_Login } from "../components/QR_Scanning";
import { useRouter } from "next/router"; 

export default function Home() {
  const [showPass, setShowPass] = useState(false);
  const router = useRouter(); 


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


  // QR Login Process
  function QRLoginProcess(ID) {
    const user = Users.find((user) => user.id === ID);
    if (user) {
      router.push('/Incharge');
    } else {
      console.log("User not found");
    }
  }

  // Sample Data for Logging-in
  const Users = [
    { id: "ID-C220023", username: "incharge", password: "incharge", role:"Incharge" },
    { id: "ID-C220228", username: "student", password: "student", role:"Student" },
    { id: "ID-C220023", username: "staff", password: "staff", role:"Staff" },
    { id: "ID-C220030", username: "admin", password: "admin", role:"Admin" },
  ];

  // Input Login Process
  const LoginProcess = () => {
    // Get user input values
  const username = document.getElementById("UserN").value;
  const password = document.getElementById("PassW").value;

  // Find the user matching the username and password
  const user = Users.find((user) => user.username === username && user.password === password);

  // If user is found
  if (user) {
    alert("User found: " + user.username);
    if (user.role === "Admin") {
      router.push('/Admin');
    } else if (user.role === "Incharge") {
        router.push('/Incharge');
    } else if (user.role === "Staff") {
      router.push('/User');
    } else if (user.role === "Student") {
      router.push('/User');
    }
  } else {
    alert("User not found");
  }
  };

  return (
    <div className={styles.Gen_Background}>
      <div className={styles.mainForm}>
        <div className={styles.mainLogo}>
          <img src="./Assets/Img/AVR_Logo_White.png" alt="Logo" />
          <h2>SRCB</h2>
        </div>
        <h4>AVR Reservation & Management</h4>
        <h3>Login Form</h3>
        <input id="UserN" type="text" placeholder="Username" />

        <div className={styles.passwordContainer}>
          <input id="PassW" type={showPass ? "text" : "password"} placeholder="Password" />
          <button type="button" onClick={() => setShowPass(!showPass)} className={styles.eyeIcon}>
            {showPass ? <AiIcons.AiFillEyeInvisible size={20} /> : <AiIcons.AiFillEye size={20} />}
          </button>
        </div>
        <button className={styles.Login_btn} onClick={LoginProcess}>Login</button>
        <button className={styles.loginwithQR} onClick={toggleScan}>Login using QR Code</button>
      </div>

      <div className={styles.qrOverlay}>
        <button className={styles.closeBtn} onClick={toggleScan}>x</button>
        <div className={styles.qrScanner}>
          <QR_Login ScanningStatus={isScanning} onScanSuccess={handleScanSuccess} />
        </div>
      </div>
    </div>
  );
}
