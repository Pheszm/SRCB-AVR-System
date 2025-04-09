// /pages/api/items.js

import pool from '@/lib/db'; // Assuming you're using a database pool

export default async function handler(req, res) {
  try {
    // Query the database to fetch items, properly using LEFT JOIN
    const [Venue_Transac] = await pool.query(
      `SELECT * FROM transaction WHERE Transac_Category = "AVRVENUE"`
    );
    res.status(200).json(Venue_Transac); // Return the fetched items as an array
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
}
