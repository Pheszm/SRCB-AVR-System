import styles from "@/styles/Loginpage.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState, useEffect } from 'react';
import { QR_Login } from "../components/QR_Scanning";
import { useRouter } from "next/router"; 
import Swal from 'sweetalert2';  // Import SweetAlert2
import Cookie from 'js-cookie';


export default function LoginForm() {
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);  // Track loading state
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
  const QRLoginProcess = async (qrcode) => {
    try {
      const response = await fetch(`/api/Login_Process/LoginProcess?qrcode=${qrcode}`, {
        method: 'GET',
      });
      const data = await response.json();

      if (data.users.length > 0) {
        await navigateUser(data.users[0]);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid QR Code',
          text: 'The QR Code you provided is Invalid.',
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'An error occurred',
        text: 'There was an issue fetching the user data. Please try again later.',
      });
    }
  };







  // Input Login Process
  const LoginProcess = async () => {
    const username = document.getElementById("UserN").value;
    const password = document.getElementById("PassW").value;
  
    // Validate username and password fields
    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Input required',
        text: 'Please enter both username and password.',
      });
      return;
    }
  
    // Call the backend to authenticate the user
    try {
      setLoading(true);
      const response = await fetch('/api/Login_Process/LoginProcess');
      
      // Check if the response is valid
      if (!response.ok) {
        console.error('Failed to fetch users from API');
        Swal.fire({
          icon: 'error',
          title: 'An error occurred',
          text: 'There was an issue with the login process. Please try again later.',
        });
        return;
      }
  
      const data = await response.json();
  
      // Check if users array exists and is valid
      if (data && Array.isArray(data.users)) {
        const user = data.users.find((user) => user.username === username && user.password === password);
  
        if (user) {
          await navigateUser(user); // Wait for SweetAlert confirmation before proceeding
        } else {
          Swal.fire({
            icon: 'error',
            title: 'User not found',
            text: 'Invalid Username or Password.',
          });
        }
      } else {
        console.error('Invalid response format:', data);
        Swal.fire({
          icon: 'error',
          title: 'An error occurred',
          text: 'There was an issue while processing your login data.',
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire({
        icon: 'error',
        title: 'An error occurred',
        text: 'There was an issue during login. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Navigate user based on role and store ID and role in session
  const navigateUser = async (user) => {
    // Store the user ID and role in sessionStorage

    document.cookie = `userID=${user.id}; path=/`;
    document.cookie = `userRole=${user.role}; path=/`;


    Swal.fire({
      icon: 'success', 
      title: 'Login Successful!', 
      text: `You have successfully logged in as ${user.role}.`,
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false
    });

    if (user.role === "Admin") {
      router.push('/Admin');
    } 
    else if (user.role === "Incharge") {
      router.push('/Incharge');
    } 
    else if (user.role === "Student") {
      router.push('/User');
    } 
    else if (user.role === "Staff") {
      router.push('/User');
    }
    else {
      router.push('/Home');  // Default redirect if role is not found
    }
  };

  return (
    <div className={styles.Gen_Background}>
      <div className={styles.secondLayer}>
      <div className={styles.mainForm}>
        <div className={styles.mainLogo}>
          <img src="./Assets/Img/AVR_Logo_White.png" alt="Logo" />
          <h2>SRCB</h2>
        </div>
        <h4>AVR Reservation & Inventory</h4>
        <h3>Login</h3>
        <input id="UserN" type="text" placeholder="Username" />

        <div className={styles.passwordContainer}>
          <input id="PassW" type={showPass ? "text" : "password"} placeholder="Password" />
          <button type="button" onClick={() => setShowPass(!showPass)} className={styles.eyeIcon}>
            {showPass ? <AiIcons.AiFillEyeInvisible size={20} /> : <AiIcons.AiFillEye size={20} />}
          </button>
        </div>

        <button 
          className={styles.Login_btn} 
          onClick={LoginProcess}
          disabled={loading}  // Disable the button when loading
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <button className={styles.loginwithQR} onClick={toggleScan}>Login using QR Code</button>
      </div>

      {/* QR Scanner Overlay */}
        <div className={styles.qrOverlay}>
            <QR_Login ScanningStatus={isScanning} onScanSuccess={handleScanSuccess} CloseForm={toggleScan}/>
        </div>

      </div>
    </div>
  );
}
