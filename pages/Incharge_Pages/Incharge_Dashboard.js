import styles from "@/styles/Incharge.module.css";
import * as AiIcons from "react-icons/ai";
import React, { useState, useEffect } from 'react';
import BarChart from "./Forms/BarChartGenerateee";
import TodayTransactions from "./Forms/Today_Transactions";
import TopUsers from "./Forms/TopUsers";

export default function Incharge_Dashboard() {
    const today = new Date().toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' });

    useEffect(() => {
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
                <div className={styles.DIVwithTabless}>
                    <h3>Upcomming Transaction</h3>
                    <TodayTransactions/>
                </div>  
                
                <div className={styles.alignerforDIV}>         
                    <h3>Mostly Used Item<br/> in the Current Month</h3>
                    <BarChart/>   
                </div>

                <div className={styles.alignerforDIV2}>   
                    <TopUsers/>   
                </div>
            </div>
    
    </div>
    );
}
