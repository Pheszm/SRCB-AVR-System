import React, { useEffect, useState } from 'react';
import styles from "@/styles/User.module.css";


const QR_Login = ({ ScanningStatus, onScanSuccess, CloseForm }) => {
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    if (window.Html5QrcodeScanner) {
      initializeScanner();
      return;
    }

    const script = document.createElement('script');
    script.src = './Assets/QR_Integration/QR_Scanner.js';
    script.async = true;
    script.onload = initializeScanner;
    script.onerror = (error) => console.error('Script load failed:', error);
    document.body.appendChild(script);

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error); 
      }
    };
  }, []);

  const initializeScanner = () => {
    const newScanner = new window.Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 }, false);
    setScanner(newScanner);
  };

  useEffect(() => {
    if (ScanningStatus && scanner) {
      const readerElement = document.getElementById('reader');
      if (readerElement) {
        scanner.render(onScanSuccess); // Start scanning with only the success handler
      } else {
        console.warn('QR scanner element is missing.');
      }
    } else if (!ScanningStatus && scanner) {
      const readerElement = document.getElementById('reader');
      if (readerElement) {
        scanner.clear().catch(console.error);
      } else {
        console.warn('QR scanner element is missing during clear operation.');
      }
    }
  }, [ScanningStatus, scanner, onScanSuccess]);

  return (
    <div className={styles.Formmm}>
      {/* Close button to stop scanning */}
      <span className={styles.SpanFlex}>
        <p/>
      <button className={styles.FormCloseButton} onClick={CloseForm}>X</button>
      </span>


      {/* QR Code Scanner */}
      <div id="reader" style={{ display: ScanningStatus ? 'block' : 'none' }}></div>
    </div>
  );
};

export { QR_Login };
