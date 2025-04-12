// /pages/api/Incharge_Func/Reservation_Func/Check_Conflict.js
import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { dateofuse, fromtime, totime, items, transac_id } = req.body;

      // Extract only the time part (hh:mm)
      const fromTimeFormatted = fromtime.slice(0, 5); // Format to hh:mm
      const toTimeFormatted = totime.slice(0, 5);     // Format to hh:mm

      const [conflictResults] = await pool.query(`
        SELECT * 
        FROM Transaction t
        JOIN Items_needed i ON t.transac_id = i.transac_id
        WHERE (
          (t.dateofuse = ? AND t.fromtime < ? AND t.totime > ?)
          OR (t.dateofuse = ? AND t.fromtime < ? AND t.totime > ?)
        ) AND t.transac_status = 'Active' AND t.reservation_status != 'Cancelled'
      `, [dateofuse, fromTimeFormatted, toTimeFormatted, dateofuse, fromTimeFormatted, toTimeFormatted]);

      if (conflictResults.length > 0) {
        const conflicts = conflictResults.map(conflict => ({
          item: conflict.I_Name,
          conflictQuantity: conflict.Quantity,
          conflictDate: conflict.dateofuse,
          existingFromTime: conflict.fromtime,
          existingToTime: conflict.totime,
        }));
        return res.status(200).json({ conflicts });
      } else {
        return res.status(200).json({ conflicts: [] });
      }
    } catch (error) {
      console.error("Error checking conflicts:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
