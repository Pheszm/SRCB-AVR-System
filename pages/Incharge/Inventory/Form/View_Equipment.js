import * as MdIcons from 'react-icons/md';
import styles from "@/styles/Modals.module.css";
import { QR_Maker } from '@/components/QR_Maker';
import { useState, useRef } from 'react';

export default function ViewEquipment({ onClose, equipment }) {
    const [showQRCode, setShowQRCode] = useState(false); // State to toggle QR code visibility
    const qrRef = useRef(null); // Create a reference to the QR_Maker div

    // Function to print the content
    const printContent = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Equipment Details</title></head><body style="text-align: center; margin: 0; padding: 0;">');
    
    // Equipment name with center alignment
    printWindow.document.write(`<p style="font-size: 10px; font-weight: bold; line-height: 0; margin-top: 30px;">${equipment.name}</p>`);

    if (showQRCode) {
        // Capture QR_Maker's output and inject the image URL
        const qrElement = qrRef.current; // Get the QR_Maker div
        const qrImage = qrElement ? qrElement.querySelector('img') : null; // Find the <img> tag inside the QR_Maker component
        
        if (qrImage) {
            const qrImageUrl = qrImage.src; // Get the source URL of the QR image
            printWindow.document.write(`<div style="display: flex; justify-content: center; align-items: center;">`);
            printWindow.document.write(`<img src="${qrImageUrl}" alt="QR Code" style="width:150px;height:150px;" />`);
            printWindow.document.write(`</div>`);
        }
    }

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
};

    return (
        <div className={styles.ModalMainBody}>
            <div className={styles.FormBody}>
                <span className={styles.HeaderTitleArea}>
                    <h2>Equipment Details</h2>
                    <MdIcons.MdDevices size={30} />
                </span>

                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex flex-col w-full">
                        <label className={styles.InputTitle}>Equipment Name</label>
                        <input
                            className={styles.TypableInput}
                            type="text"
                            value={equipment.name}
                            disabled
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className={styles.InputTitle}>Category</label>
                        <input
                            className={styles.TypableInput}
                            type="text"
                            value={equipment.category}
                            disabled
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex flex-col w-full">
                        <label className={styles.InputTitle}>Status</label>
                        <input
                            className={styles.TypableInput}
                            type="text"
                            value={equipment.status}
                            disabled
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className={styles.InputTitle}>Health</label>
                        <input
                            className={styles.TypableInput}
                            type="text"
                            value={equipment.health}
                            disabled
                        />
                    </div>
                </div>

                <label className={styles.InputTitle}>Created By</label>
                <input
                    className={styles.TypableInput}
                    type="text"
                    value={`${equipment.users.first_name} ${equipment.users.last_name}`}
                    disabled
                />

                <label className={styles.InputTitle}>Description</label>
                <textarea
                    className={styles.TypableInput}
                    rows="4"
                    value={equipment.description || ''}
                    disabled
                />

                <span className={styles.SpanFlex}>
                    <button
                        onClick={() => setShowQRCode(prev => !prev)}
                        className={styles.CancelBtn}
                    >
                        {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
                    </button>

                    <button className={styles.CancelBtn} onClick={onClose}>Close</button>
                </span>

                {showQRCode && (
                    <div className="absolute bg-white shadow-md bottom-16 p-4 border-gray-300 border rounded-lg">
                        <div className="flex flex-col items-center justify-center">
                            <label className="font-bold font-size-10 bottom-16 pb-2 text-lg">{equipment.name}</label>
                            
                            {/* Attach ref to QR_Maker */}
                            <div ref={qrRef}>
                                <QR_Maker value={equipment.qr_code} size={150} />
                            </div>
                            
                            <button
                                onClick={printContent}
                                className="bg-blue-500 text-white font-semibold mt-4 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
                            >
                                Print QR
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
