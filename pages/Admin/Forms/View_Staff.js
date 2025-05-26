import { useState } from 'react';
import * as MdIcons from 'react-icons/md';
import styles from "@/styles/Modals.module.css";


export default function ViewProgram({ onClose, staff }) {

        if (!staff) {
        return null;
    }

    return (
        <div className={styles.ModalMainBody}>

            <div className={styles.FormBody}>
                <span className={styles.HeaderTitleArea}>
                    <h2>Staff Information</h2>
                    <MdIcons.MdSchool size={30}/>
                </span> 
                
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex flex-col w-full">
                        <label className={styles.InputTitle}>First Name</label>
                        <input 
                            className={styles.TypableInput} 
                            type="text" 
                            name="first_name"
                            value={staff.first_name}
                            disabled
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className={styles.InputTitle}>Last Name</label>
                        <input 
                            className={styles.TypableInput} 
                                type="text" 
                                name="last_name"
                                value={staff.last_name}
                                disabled
                            />
                        </div>
                    </div>


                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex flex-col w-full">
                        <label className={styles.InputTitle}>Staff ID</label>
                        <input 
                            className={styles.TypableInput} 
                            type="text" 
                            name="staff_id"
                            value={staff.staff_id}
                            disabled
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className={styles.InputTitle}>Sex</label>
                        <input 
                            className={styles.TypableInput} 
                            type="text"
                            value={staff.sex}
                            disabled
                        />
                    </div>
                </div>

                <label className={styles.InputTitle}>Phone Number</label>
                <input 
                    className={styles.TypableInput} 
                    type="text"
                    value={staff.phone_number}
                    disabled
                />

                <label className={styles.InputTitle}>Email</label>
                <input 
                    className={styles.TypableInput} 
                    type="text" 
                    name="first_name"
                    value={staff.email}
                    disabled
                />

                <label className={styles.InputTitle}>Username</label>
                <input 
                    className={styles.TypableInput} 
                    type="text" 
                    name="first_name"
                    value={staff.username}
                    disabled
                />

                <span className={styles.SpanFlex}>
                    <p/>
                    <button className={styles.CancelBtn} onClick={onClose}>Close</button>
                </span>
            </div>


        </div>
    );
};


