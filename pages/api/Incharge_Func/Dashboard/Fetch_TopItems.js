import pool from '@/lib/db';

export default async function handler(req, res) {
  try {
    const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
    const currentYear = new Date().getFullYear();  // Get current year (yyyy)

    // SQL query to get item usage data for the current month
    const query = `
      SELECT 
        i.I_Name, 
        SUM(ineed.Quantity) AS usageCount
      FROM 
        Items_needed ineed
      JOIN 
        Item i ON i.I_id = ineed.I_id
      JOIN 
        Transaction t ON t.transac_id = ineed.transac_id
      WHERE 
        MONTH(t.DateTimeFiled) = ? 
        AND YEAR(t.DateTimeFiled) = ?
      GROUP BY 
        i.I_Name
      ORDER BY 
        usageCount DESC;
    `;

    const [rows] = await pool.query(query, [currentMonth, currentYear]);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching item usage data:", error);
    res.status(500).json({ error: "Failed to fetch item usage data" });
  }
}
