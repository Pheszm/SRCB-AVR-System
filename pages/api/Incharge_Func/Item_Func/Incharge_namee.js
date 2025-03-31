import pool from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { C_id } = req.query;
        if (!C_id) return res.status(400).json({ error: 'C_id is required' });

        const [rows] = await pool.query('SELECT C_Fullname FROM incharge WHERE C_id = ?', [C_id]);
        if (rows.length) return res.json({ C_Fullname: rows[0].C_Fullname });

        res.status(404).json({ message: 'Incharge not found' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
