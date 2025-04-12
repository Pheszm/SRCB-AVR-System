// /pages/api/items.js

import pool from '@/lib/db'; // Assuming you're using a database pool

export default async function handler(req, res) {
  try {
    // Query the database to fetch items, properly using LEFT JOIN
    const [itemsData] = await pool.query(
      `SELECT * FROM Items_needed
       LEFT JOIN Transaction ON Items_needed.transac_id = Transaction.transac_id
       WHERE Transaction.reservation_status = "Approved"`
    );
    res.status(200).json(itemsData); // Return the fetched items as an array
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Venue' });
  }
}
