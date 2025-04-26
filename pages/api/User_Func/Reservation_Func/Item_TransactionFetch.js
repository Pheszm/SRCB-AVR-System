// /pages/api/items.js

import pool from '@/lib/db'; // Assuming you're using a database pool

export default async function handler(req, res) {
  try {
    // Query the database to fetch items, properly using LEFT JOIN
    const [itemsData] = await pool.query(
      `SELECT 
    *,
    COALESCE(s.S_Fullname, st.T_Fullname) AS fullName
FROM Items_needed
LEFT JOIN Transaction t ON Items_needed.transac_id = t.transac_id
LEFT JOIN student s ON t.Usertype = 'Student' AND t.User_id = s.S_id
LEFT JOIN staff st ON t.Usertype = 'Staff' AND t.User_id = st.T_id
WHERE t.reservation_status = "Approved";
`
    );
    res.status(200).json(itemsData); // Return the fetched items as an array
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Venue' });
  }
}
