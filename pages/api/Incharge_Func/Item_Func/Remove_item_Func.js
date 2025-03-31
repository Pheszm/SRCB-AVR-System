import pool from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { I_id, C_id } = req.body; // Expecting C_id (user's ID) and I_id (item's ID)

        // Ensure both I_id and C_id are provided
        if (!I_id || !C_id) {
            return res.status(400).json({ message: 'Missing required fields (I_id or C_id)' });
        }

        try {
            // Update the I_Status to 'Removed' for the given I_id
            await pool.query('UPDATE Item SET I_Status = ? WHERE I_id = ?', ['Removed', I_id]);

            // Insert activity log to record the removal action
            await pool.query(
                'INSERT INTO activity_logs (C_id, Action, Record_Id) VALUES (?, ?, ?)',
                [C_id, 'REMOVE', I_id]  // Log the user ID (C_id), action ('REMOVE'), and item ID (I_id)
            );

            res.status(200).json({ message: 'Item status updated to Removed' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating item status' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
