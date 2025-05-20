import * as MdIcons from 'react-icons/md';
import styles from "@/styles/Modals.module.css";
import { useState, useEffect } from 'react';

export default function ViewReservation({ onClose, reservation }) {
    const {
        users_transactions_user_idTousers,
        users_transactions_requested_by_idTousers,
        transaction_category,
        date_of_use,
        start_time,
        end_time,
        equipment,
        reservation_status,
        transaction_status,
        transaction_reason,
        comments_after_use
    } = reservation;

    const [conflictingItems, setConflictingItems] = useState([]);
    const [showConflictDropdown, setShowConflictDropdown] = useState(false);

    useEffect(() => {
        const fetchConflictingItems = async () => {
            try {
                const response = await fetch('/api/User_api/checkConflicts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        date_of_use: date_of_use,
                        start_time: new Date(start_time),
                        end_time: new Date(end_time),
                        reservationType: transaction_category === 'AVR_Venue' ? 'venue' : 'equipment',
                        selectedItems: transaction_category === 'AVR_Venue' ? [] : equipment.map(item => item.equipment_id)
                    }),
                });
                
                const data = await response.json();
                if (response.ok) {
                    setConflictingItems(data.conflicts || []);
                } else {
                    console.error('Error fetching conflicts:', data.error);
                    setConflictingItems([]);
                }
            } catch (error) {
                console.error('Failed to fetch conflicts:', error);
                setConflictingItems([]);
            }
        };

        fetchConflictingItems();
    }, [date_of_use, start_time, end_time, equipment, transaction_category]);

    const toggleConflictDropdown = () => {
        setShowConflictDropdown(!showConflictDropdown);
    };

    return (
        <div className={styles.ModalMainBody}>
            <div className={styles.FormBody}>
                <span className={styles.HeaderTitleArea}>
                    <h2>Reservation Details</h2>
                    <MdIcons.MdEventAvailable size={30} />
                </span>

                {/* Reserver Info */}
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex flex-col w-full">
                        <label className={styles.InputTitle}>Reserver Name</label>
                        <input
                            className={styles.TypableInput}
                            type="text"
                            value={`${users_transactions_user_idTousers?.first_name || ''} ${users_transactions_user_idTousers?.last_name || ''}`}
                            disabled
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className={styles.InputTitle}>Category</label>
                        <input
                            className={styles.TypableInput}
                            type="text"
                            value={transaction_category === 'AVR_Venue' ? 'AVR Venue' : transaction_category}
                            disabled
                        />
                    </div>
                </div>

                {/* Time Info */}
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex flex-col w-full">
                        <label className={styles.InputTitle}>Date of Use</label>
                        <input
                            className={styles.TypableInput}
                            type="text"
                            value={new Date(date_of_use).toLocaleDateString()}
                            disabled
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className={styles.InputTitle}>Time of Use</label>
                        <input
                            className={styles.TypableInput}
                            type="text"
                            value={`${new Date(start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - ${new Date(end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`}
                            disabled
                        />
                    </div>
                </div>
                {(users_transactions_requested_by_idTousers?.first_name || users_transactions_requested_by_idTousers?.last_name) && (
                <div className="flex flex-col w-full">
                    <label className={styles.InputTitle}>Requested By</label>
                    <input
                        className={styles.TypableInput}
                        type="text"
                        value={`${users_transactions_requested_by_idTousers?.first_name || ''} ${users_transactions_requested_by_idTousers?.last_name || ''}`}
                        disabled
                    />
                </div>
                )}
                {/* Equipment */}
                <label className={styles.InputTitle}>Needed</label>
                <div className="flex flex-col gap-1 mb-1 max-h-32 overflow-y-auto border border-gray-300 p-2 rounded-md">
                    {equipment.length > 0 ? (
                        equipment.map((eq) => (
                            <div key={eq.equipment_id} className="text-sm text-gray-700">
                                • {eq.name}
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500 italic">AVR Venue</div>
                    )}
                </div>

                {/* Conflict Warning */}
                {conflictingItems.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 relative">
                        <div 
                            className="flex items-center text-yellow-600 text-xs sm:text-sm font-medium cursor-pointer"
                            onClick={toggleConflictDropdown}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Warning: {conflictingItems.length} items have conflicts
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ml-2 transition-transform duration-200 ${showConflictDropdown ? "rotate-180" : ""}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        
                        {/* Conflict dropdown */}
                        {showConflictDropdown && (
                            <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-md border border-gray-200 py-1">
                                <div className="max-h-60 overflow-y-auto">
                                    {conflictingItems.map((item) => (
                                        <div key={`${item.id}-${item.time}`} className="px-4 py-2 hover:bg-gray-50">
                                            <div className="text-sm font-medium text-gray-900">
                                                By: {item.user} 
                                            </div>
                                            <div className="text-sm font-medium text-yellow-700">
                                                Conflict: {item.itemName} 
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {item.date} • {item.time}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Reason / Comments */}
                {transaction_reason && (
                    <>
                        <label className={styles.InputTitle}>Reason for Reservation</label>
                        <textarea
                            className={styles.TypableInput}
                            rows="3"
                            value={transaction_reason}
                            disabled
                        />
                    </>
                )}

                {comments_after_use && (
                    <>
                        <label className={styles.InputTitle}>Comments</label>
                        <textarea
                            className={styles.TypableInput}
                            rows="3"
                            value={comments_after_use}
                            disabled
                        />
                    </>
                )}

                {/* Close */}
                <div className="flex justify-end mt-4">
                    <button className={styles.CancelBtn} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}