import pool from '@/lib/db';  

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { transac_id } = req.body;  

        if (!transac_id) {
            return res.status(400).json({ message: 'Transaction ID is required' });
        }

        try {
            const [result] = await pool.query( 
                'UPDATE transaction SET notif_status = ? WHERE transac_id = ?',
                ['Read', transac_id]
            );

            if (result.affectedRows > 0) {
                return res.status(200).json({ message: 'Transaction marked as read' });
            } else {
                return res.status(404).json({ message: 'Transaction not found' });
            }
        } catch (error) {
            console.error('Error marking transaction as read:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
