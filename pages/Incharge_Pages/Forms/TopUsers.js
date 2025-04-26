// components/TopUsers.js
import styles from "@/styles/Incharge.module.css";
import React, { useState, useEffect } from 'react';

export default function TopUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/Incharge_Func/Dashboard/Fetch_TopUsers');
        const data = await response.json();

        // Log the response to see its structure
        console.log('API Response:', data);

        if (response.ok) {
          // Count the number of transactions per user
          const userTransactions = data.reduce((acc, transaction) => {
            const fullName = transaction.fullName;
            
            // If the user's name is already in the accumulator, increase the count
            if (acc[fullName]) {
              acc[fullName].reservations += 1;
            } else {
              // Otherwise, add the user's name with a reservation count of 1
              acc[fullName] = {
                name: fullName,
                reservations: 1
              };
            }

            return acc;
          }, {});

          // Convert the object to an array for easier rendering
          // Sort the users by reservations in descending order
          const sortedUsers = Object.values(userTransactions).sort((a, b) => b.reservations - a.reservations);
          
          setUsers(sortedUsers);
        } else {
          setError('Error fetching users: ' + data.message);
        }
      } catch (error) {
        setError('Error fetching users: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className={styles.MainAreaDiv}>
      <h3>Top Users<br/> in the Current Month</h3>
      <div className={styles.ScrollAreaHere}>
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p>{error}</p> // Display the error message if there's an issue
        ) : (
          <ul>
            {users.length > 0 ? (
              users.map((user, index) => (
                <li key={index} className={styles.userCard}>
                  <p><strong>Top No. {index+1}</strong></p>
                  <p>{user.name}</p>
                  <p><em>Transactions: {user.reservations}</em></p>
                </li>
              ))
            ) : (
              <p>No users found for the current month.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
