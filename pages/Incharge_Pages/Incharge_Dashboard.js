import styles from "@/styles/Incharge.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState, useEffect } from 'react';
import BarChart from "./Forms/BarChartGenerateee";


export default function Incharge_Dashboard() {
    const today = new Date().toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' });

    const [users, setUsers] = useState([]);
    useEffect(() => {
        // Simulate fetching static data for multiple users
        const staticUsers = [
          { name: "John Doe", reservations: 15, itemsCheckedOut: 8 },
          { name: "Jane Smith", reservations: 20, itemsCheckedOut: 12 },
          { name: "Mark Taylor", reservations: 10, itemsCheckedOut: 5 },
          { name: "Emily Davis", reservations: 18, itemsCheckedOut: 10 },
          { name: "Chris Johnson", reservations: 12, itemsCheckedOut: 6 },
        ];
        
        setUsers(staticUsers);
        FetchTransactionData();
        FetchAllItems();
      }, []);
    

      const [AllItems, setAllItems] = useState([]);
      const FetchAllItems = async () => {
          try {
              const response = await fetch('/api/Incharge_Func/Item_Func/Fetch_item_Func');
              const itemsdata = await response.json();
              setAllItems(itemsdata); 
          } catch (error) {
              console.error("Error fetching transaction data: ", error);
          }
      };

        const [AllTransactions, setAllTransactions] = useState([]);
        const FetchTransactionData = async () => {
            try {
                const response = await fetch('/api/Incharge_Func/Reservation_Func/fetch_Transactions');
                const Transacdata = await response.json();
                setAllTransactions(Transacdata); 
            } catch (error) {
                console.error("Error fetching transaction data: ", error);
            }
        };

    return (
        <div className={styles.DashBodyArea}>

            <div className={styles.UpperSquares}>
                <div>
                    <span>
                        <AiIcons.AiOutlineCalendar size={30} /> 
                    </span>
                    <span>
                        <p>Pending Reservations</p>
                        <h4>
                            {AllTransactions.reduce((count, transaction) => {
                                if (transaction.reservation_status === "Pending") {
                                count += 1;
                                }
                                return count;
                            }, 0)}
                        </h4>
                    </span>
                </div>

                <div>
                    <span>
                        <AiIcons.AiOutlineAppstore  size={30} /> 
                    </span>
                    <span>
                        <p>AVR Total Items</p>
                        <h4>{AllItems.length}</h4>
                    </span>
                </div>

                <div>
                    <span>
                        <AiIcons.AiOutlineWallet size={30} /> 
                    </span>
                    <span>
                        <p>Transactions Today</p>
                        <h4>
                        {
                                    AllTransactions.filter(transaction => {
                                        const transactionDate = new Date(transaction.dateofuse);
                                        if (isNaN(transactionDate)) return false;

                                        const formattedTransactionDate = `${(transactionDate.getMonth() + 1).toString().padStart(2, '0')}/${transactionDate.getDate().toString().padStart(2, '0')}/${transactionDate.getFullYear()}`;

                                        const manilaNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
                                        const formattedToday = `${(manilaNow.getMonth() + 1).toString().padStart(2, '0')}/${manilaNow.getDate().toString().padStart(2, '0')}/${manilaNow.getFullYear()}`;

                                        return (
                                            transaction.reservation_status != "Pending" &&
                                            formattedTransactionDate === formattedToday
                                        );
                                    }).length
                                }
                        </h4>
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
                    <h3>Mostly Used Item<br/> in March 2025</h3>
                    <BarChart/>   
                </div>

                <div className={styles.alignerforDIV2}>   
                    <h3>Top Users<br/> in March 2025</h3>
                    <div className={styles.ScrollAreaHere}>
                    {users.length > 0 ? (
        <ul>
          {users.map((user, index) => (
            <li key={index} className={styles.userCard}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Reservations Made:</strong> {user.reservations}</p>
              <p><strong>Items Checked Out:</strong> {user.itemsCheckedOut}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading users...</p>
      )} 
                    </div>
                
                </div>
    </div>
    
    </div>
    );
}
