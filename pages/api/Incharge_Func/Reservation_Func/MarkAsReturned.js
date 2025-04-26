import pool from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { transac_id, comments_afteruse } = req.body;

    try {
        // First verify the transaction exists and is in correct state
        const [checkResult] = await pool.query(
            `SELECT reservation_status FROM Transaction WHERE transac_id = ?`,
            [transac_id]
        );

        if (checkResult.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (checkResult[0].reservation_status !== 'Approved') {
            return res.status(400).json({ 
                message: 'Only approved transactions can be marked as returned',
                currentStatus: checkResult[0].reservation_status
            });
        }

        // Update the transaction
        const [updateResult] = await pool.query(
            `UPDATE Transaction 
             SET reservation_status = 'Success',
                 returnedtime = NOW(),
                 comments_afteruse = ?
             WHERE transac_id = ?`,
            [comments_afteruse, transac_id]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(400).json({ message: 'No changes were made' });
        }

        return res.status(200).json({ 
            message: 'Item successfully marked as returned',
            returnedTime: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error marking as returned:", error);
        return res.status(500).json({ 
            message: 'Failed to mark as returned',
            error: error.message 
        });
    }
}