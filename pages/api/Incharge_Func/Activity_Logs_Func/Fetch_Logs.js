// API - Fetch_item_Func.js
import pool from '@/lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // SQL query to join Activity_Logs with Item and Incharge
            const query = `
                SELECT 
                    al.logs_id, 
                    al.DateTimeModified, 
                    al.Action, 
                    al.Record_Id, 
                    al.C_id, 
                    i.I_Name, 
                    c.C_Fullname
                FROM 
                    activity_logs al
                LEFT JOIN Item i ON al.Record_Id = i.I_id
                LEFT JOIN incharge c ON al.C_id = c.C_id
            `;
            
            // Execute query
            const [rows] = await pool.query(query);
            
            // Return the result in JSON format
            res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching logs:', error);
            res.status(500).json({ message: 'Error fetching logs' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
