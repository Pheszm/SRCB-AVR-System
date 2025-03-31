// /pages/api/items.js

import pool from '@/lib/db'; // Assuming you're using a database pool

export default async function handler(req, res) {
  try {
    // Query the database to fetch items
    const [itemsData] = await pool.query('SELECT * FROM Item WHERE I_Status = "Active"');
    res.status(200).json(itemsData); // Return the fetched items as an array
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
}
