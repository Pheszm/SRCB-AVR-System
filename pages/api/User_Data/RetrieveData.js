import pool from '@/lib/db';  // This should now import the promise-based pool

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { userId, userRole } = req.query; // Destructure userId and userRole from query params
      
      if (!userId || !userRole) {
        return res.status(400).json({ message: 'userId and userRole are required' });
      }

      let query;
      if (userRole === 'Admin') {
        query = `SELECT A_id AS id, "Admin" AS role, A_Username AS fullname FROM admin WHERE A_id = ?`;
      } else if (userRole === 'Student') {
        query = `SELECT S_id AS id, "Student" AS role, S_Fullname AS fullname FROM student WHERE S_id = ?`;
      } else if (userRole === 'Staff') {
        query = `SELECT T_id AS id, "Staff" AS role, T_Fullname AS fullname FROM staff WHERE T_id = ?`;
      } else if (userRole === 'Incharge') {
        query = `SELECT C_id AS id, "Incharge" AS role, C_Fullname AS fullname FROM incharge WHERE C_id = ?`;
      } else {
        return res.status(400).json({ message: 'Invalid userRole provided' });
      }

      // Query the database for the specific user by their ID and role
      const [rows] = await pool.query(query, [userId]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user: rows[0] });

    } catch (error) {
      console.error("Error fetching data from database:", error);
      res.status(500).json({ message: 'Error retrieving data', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
