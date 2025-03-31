// pages/api/fetchStudentData.js
import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query; // Get userId from query params

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    try {
      const [rows] = await pool.query('SELECT * FROM student WHERE S_id = ? AND S_Status = "Active"', [userId]);
      
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.status(200).json(rows[0]); // Return the first student found
    } catch (error) {
      console.error('Error fetching student data:', error);
      res.status(500).json({ message: 'Error fetching student data' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
