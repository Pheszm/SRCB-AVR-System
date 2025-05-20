import React, { useEffect, useState } from 'react';
import styles from "@/styles/Scanner.module.css";

const QR_Login = ({ ScanningStatus, onScanSuccess, CloseForm }) => {
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    if (window.Html5QrcodeScanner) {
      initializeScanner();
      return;
    }

    const script = document.createElement('script');
    script.src = './QR_Integration/QR_Scanner.js';
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

  const handleScanSuccess = (decodedText, decodedResult) => {
    if (scanner) {
      scanner.clear().catch(console.error);
    }
    onScanSuccess(decodedText, decodedResult);
  };

  useEffect(() => {
    if (ScanningStatus && scanner) {
      const readerElement = document.getElementById('reader');
      if (readerElement) {
        scanner.render(handleScanSuccess);
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
  }, [ScanningStatus, scanner]);

  // Close the form and stop the scanner when closing
  const handleClose = () => {
    if (scanner) {
      scanner.clear().catch(console.error);  // Stop the scanner and cleanup resources
    }
    CloseForm();  // Close the form
  };

  return (
    <div className="relative w-full max-w-md mx-auto mt-8 bg-white shadow-lg rounded-lg p-4">

      <div className="flex justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Quick Response(QR) Scan</h2>

        <button
          className="text-white bg-red-700 hover:bg-red-800 rounded-md w-8 h-8 flex items-center justify-center mb-3"
          onClick={handleClose}
        >
          &times;
        </button>
      </div>


      <div className={styles.ScannerDiv} id="reader" style={{ display: ScanningStatus ? 'block' : 'none' }}></div>
    </div>
  );
};

export { QR_Login };