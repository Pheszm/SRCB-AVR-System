import styles from "@/styles/Incharge.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState } from 'react';
import BarChart from "./Forms/BarChartGenerateee";


export default function Incharge_Dashboard() {
    const today = new Date().toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' });
    return (
        <div className={styles.DashBodyArea}>

            <div className={styles.UpperSquares}>
                <div>
                    <span>
                        <AiIcons.AiOutlineCalendar size={30} /> 
                    </span>
                    <span>
                        <p>Pending Reservations</p>
                        <h4>5</h4>
                    </span>
                </div>

                <div>
                    <span>
                        <AiIcons.AiOutlineAppstore  size={30} /> 
                    </span>
                    <span>
                        <p>AVR Total Items</p>
                        <h4>20</h4>
                    </span>
                </div>

                <div>
                    <span>
                        <AiIcons.AiOutlineWallet size={30} /> 
                    </span>
                    <span>
                        <p>Transactions Today</p>
                        <h4>7</h4>
                    </span>
                </div>

                <div>
                    <span>
                        <AiIcons.AiOutlineClockCircle size={30} /> 
                    </span>
                    <span>
                        <p>Date Today</p>
                        <h4>{today}</h4>
                    </span>
                </div>
            </div>



            <div className={styles.LowerSquares}>

                <div className={styles.DashTableContainer}>
                    <h3>Transaction Today</h3>
                    <div className={styles.DashTableWrapper}>
                        <table className={styles.DashTable}>
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Date & Time</th>
                                    <th>Name</th>
                                    <th>Item/Venue</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Upcoming</td>
                                    <td>3/6/2025 (1:00PM to 4:00PM)</td>
                                    <td>Joshua B. Salan</td>
                                    <td>1 Microphone, 1 Speaker</td>
                                    <td>
                                        <button>View</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Ongoing</td>
                                    <td>3/6/2025 (1:00PM to 4:00PM)</td>
                                    <td>Carl Wyne S. Gallardo</td>
                                    <td>1 Projector</td>
                                    <td>
                                        <button>View</button>
                                        <button className={styles.SuccessBtnnn}>Returned</button>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>  
                <div className={styles.alignerforDIV}>   
                    <h3>Mostly Used Item in March 2025</h3>
                    <BarChart/>   
                </div>
    </div>
    
    </div>
    );
}
