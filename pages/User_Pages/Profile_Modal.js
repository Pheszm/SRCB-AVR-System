import React, { useState, useEffect } from 'react';
import styles from "@/styles/User.module.css";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie'; 
import { useRouter } from "next/router";
import * as AiIcons from "react-icons/ai";

export default function EditUserProfile({ onClose }) {
  const router = useRouter();
  const [userFullData, setUserFullData] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    Username: '',
    Password: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data
  const fetchUserData = async () => {
    const storedUserId = Cookies.get('userID');
    const storedUserRole = Cookies.get('userRole');
    
    if (!storedUserId || !storedUserRole) {
      console.error('User ID or Role is missing');
      return;
    }
    
    try {
      const response = await fetch('/api/User_Data/FullDataofTheUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: storedUserId,
          userRole: storedUserRole,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      setUserFullData(data.user);
      
      // Initialize updatedData with the current username
      setUpdatedData({
        Username: data.user.Username || '',
        Password: ''
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [router]);

  const handleChange = (e) => {
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    const storedUserId = Cookies.get('userID');
    const storedUserRole = Cookies.get('userRole');
    
    if (!updatedData || !storedUserId || !storedUserRole) return;

    try {
      const response = await fetch('/api/User_Data/EditUserData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: storedUserId,
          userRole: storedUserRole,
          updatedData: {
            Username: updatedData.Username,
            Password: updatedData.Password
          }
        }),
      });

      if (response.ok) {
        Swal.fire('Success', 'Profile updated successfully', 'success');
        fetchUserData(); // Refresh the data
        setIsEditing(false); // Exit edit mode after save
      } else {
        Swal.fire('Error', 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!userFullData) return <div>Loading...</div>;

  return (
    <div className={styles.AddItemForm}>
      <form className={styles.Formmmm222}>
        <span className={styles.ProfileAreaHeader}>
          <h2></h2>
          <button onClick={onClose} className={styles.FormCloseButton2}>X</button>
          <span className={styles.ProfileImg}><img src="./Assets/Img/UnknownProfile.jpg" /></span>
        </span>
        <h5 className={styles.FullnameArea}>{userFullData.Fullname}</h5>

        <br />

        <h3 className={styles.Titleee}>Credentials</h3>
        <div className={styles.FormInput}>
          <label>Username</label>
          {isEditing ? (
            <input
              type="text"
              name="Username"
              value={updatedData.Username}
              onChange={handleChange}
            />
          ) : (
            <p>{userFullData.Username}</p>
          )}
        </div>

        <div className={styles.FormInput}>
          <label>Password</label>
          {isEditing ? (
            <input
              type="password"
              name="Password"
              value={updatedData.Password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          ) : (
            <p>***********</p>
          )}
        </div>

        {!isEditing ? (
          <button 
            type="button" 
            onClick={() => setIsEditing(true)} 
            className={styles.FormEditButton}>
            <AiIcons.AiOutlineEdit size={40} /> 
          </button>
        ) : (
          <>
          <span className={styles.SpanFlexer}>
          <span 
                onClick={handleSave} 
                className={styles.FormSubmitButton}>
                Save
                </span>
            <span 
                onClick={() => {
                    setIsEditing(false);
                    fetchUserData(); // Reset changes
                }} 
                className={styles.FormCancelButton}>
                Cancel
            </span>
               
          </span>
            
          </>
        )}
      </form>
    </div>
  );
}