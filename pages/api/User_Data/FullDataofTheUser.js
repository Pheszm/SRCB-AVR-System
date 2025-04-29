// pages/api/User_Data/FullDataofTheUser.js
import pool from '@/lib/db'; // Import the database pool

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userID, userRole } = req.body;

    if (!userID || !userRole) {
      return res.status(400).json({ error: 'UserID or UserRole is missing' });
    }

    let userData = null;
    
    try {
      if (userRole === 'Incharge') {
        // Fetch data for Incharge and rename fields
        const [rows] = await pool.execute(
          'SELECT C_Fullname AS Fullname, C_Username AS Username, C_Password AS Password FROM incharge WHERE C_id = ? AND C_Status = "Active"',
          [userID]
        );
        userData = rows;
      } else if (userRole === 'Staff') {
        // Fetch data for Staff and rename fields
        const [rows] = await pool.execute(
          'SELECT T_Fullname AS Fullname, T_Username AS Username, T_Password AS Password FROM staff WHERE T_id = ? AND T_Status = "Active"',
          [userID]
        );
        userData = rows;
      } else if (userRole === 'Student') {
        // Fetch data for Student and rename fields
        const [rows] = await pool.execute(
          'SELECT S_Fullname AS Fullname, S_Username AS Username, S_Password AS Password FROM student WHERE S_id = ? AND S_Status = "Active"',
          [userID]
        );
        userData = rows;
      }

      if (userData.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ user: userData[0] }); // Return the first user (assuming unique ID)
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}