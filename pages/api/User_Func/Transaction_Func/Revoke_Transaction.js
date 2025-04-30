import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { transac_id, transac_reason } = req.body;

  if (!transac_id || !transac_reason) {
    return res.status(400).json({ success: false, message: 'Missing transaction ID or reason' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE transaction 
       SET reservation_status = ?, 
           transac_status = ?, 
           transac_reason = ?
       WHERE transac_id = ?`,
      ['Unsuccessful', 'Cancelled', transac_reason, transac_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    return res.status(200).json({ success: true, message: 'Transaction revoked' });

  } catch (error) {
    console.error('Error updating transaction:', error);
    return res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
}
