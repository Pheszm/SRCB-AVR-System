// /pages/api/staff.js

import pool from '@/lib/db';

export default async function handler(req, res) {
  try {
    // Use pool.query() instead of db.query()
    const [staffData] = await pool.query('SELECT * FROM staff');
    res.status(200).json(staffData); // Return the staff data as an array
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff data' });
  }
}
