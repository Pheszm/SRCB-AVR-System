import pool from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { transac_id } = req.body;

    try {
        // Correct SQL syntax for updating the status
        const [checkResult] = await pool.query(
            `UPDATE Transaction SET transac_status = ? WHERE transac_id = ?`,
            ["Checked-Out", transac_id]
        );

        if (checkResult.affectedRows > 0) {
            return res.status(200).json({ message: 'Transaction marked as Checked-Out.' });
        } else {
            return res.status(404).json({ message: 'Transaction not found.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
}
