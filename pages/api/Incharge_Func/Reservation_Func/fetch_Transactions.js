// API - Fetch_item_Func.js
import pool from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const [rows] = await pool.query('SELECT * FROM Transaction');
            res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching items:', error);
            res.status(500).json({ message: 'Error fetching items' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
