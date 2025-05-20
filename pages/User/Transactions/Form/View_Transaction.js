import * as MdIcons from 'react-icons/md';
import styles from "@/styles/Modals.module.css";

export default function ViewTransaction({ onClose, transaction }) {
    const {
        users_transactions_user_idTousers,
        users_transactions_approved_by_idTousers,
        users_transactions_requested_by_idTousers,
        transaction_category,
        date_of_use,
        start_time,
        end_time,
        equipment,
        reservation_status,
        transaction_status,
        managed_at,
        transaction_reason,
        comments_after_use
    } = transaction;

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
                <div className="flex flex-col gap-1 max-h-32 overflow-y-auto border border-gray-300 p-2 rounded-md">
                    {equipment.length > 0 ? (
                        equipment.map((eq) => (
                            <div key={eq.equipment_id} className="text-sm text-gray-700 flex gap-3 items-center">
                                • {eq.name} <p className='text-red-300 text-xs'> {eq.equipment_health_afteruse !== 'None' ? eq.equipment_health_afteruse : ''}
                                </p> 
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500 italic">AVR Venue</div>
                    )}
                </div>

                {/* Status */}
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex flex-col w-full">
                        <label className={styles.InputTitle}>Approved By</label>
                        <input
                            className={styles.TypableInput}
                            type="text"
                            value={`${users_transactions_approved_by_idTousers?.first_name || ''} ${users_transactions_approved_by_idTousers?.last_name || ''}`}
                            disabled
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className={styles.InputTitle}>Approved At</label>
                        <input
                            className={styles.TypableInput}
                            type="text"
                            value={new Date(managed_at).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                                })}
                            disabled
                        />
                    </div>
                </div>

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
