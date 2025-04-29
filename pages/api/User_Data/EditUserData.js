// pages/api/User_Data/EditUserData.js
import pool from '@/lib/db'; // Import the database pool

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userID, userRole, updatedData } = req.body;

    if (!userID || !userRole || !updatedData) {
      return res.status(400).json({ error: 'UserID, UserRole, or updatedData is missing' });
    }

    try {
      let updateQuery = '';
      let updateValues = [];
      
      if (userRole === 'Incharge') {
        updateQuery = `
          UPDATE incharge
          SET C_Username = ?, C_Password = ?
          WHERE C_id = ? AND C_Status = 'Active'
        `;
        updateValues = [
          updatedData.Username,
          updatedData.Password,
          userID
        ];
      } else if (userRole === 'Staff') {
        updateQuery = `
          UPDATE staff
          SET T_Username = ?, T_Password = ?
          WHERE T_id = ? AND T_Status = 'Active'
        `;
        updateValues = [
          updatedData.Username,
          updatedData.Password,
          userID
        ];
      } else if (userRole === 'Student') {
        updateQuery = `
          UPDATE student
          SET S_Username = ?, S_Password = ?
          WHERE S_id = ? AND S_Status = 'Active'
        `;
        updateValues = [
          updatedData.Username,
          updatedData.Password, 
          userID
        ];
      }

      const [result] = await pool.execute(updateQuery, updateValues);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found or no changes made' });
      }

      res.status(200).json({ message: 'User data updated successfully' });
    } catch (error) {
      console.error('Error updating user data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
