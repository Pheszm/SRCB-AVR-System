import pool from '@/lib/db';  // This should now import the promise-based pool



export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            let query;
            // Check if qrcode is provided in the query params or request body
            if (req.query.qrcode) {
                // QR-based login, fetch user by qrcode
                query = `
                    (SELECT A_id AS id, "Admin" AS role FROM admin WHERE A_QRcode = ? AND A_Status = 'Active') 
                    UNION 
                    (SELECT S_id AS id, "Student" AS role FROM student WHERE S_QRcode = ? AND S_Status = 'Active') 
                    UNION 
                    (SELECT T_id AS id, "Staff" AS role FROM staff WHERE T_QRcode = ? AND T_Status = 'Active') 
                    UNION 
                    (SELECT C_id AS id, "Incharge" AS role FROM incharge WHERE C_QRcode = ? AND C_Status = 'Active')
                `;
                const [rows] = await pool.query(query, [req.query.qrcode, req.query.qrcode, req.query.qrcode, req.query.qrcode]);
                res.status(200).json({ users: rows });
            } else {
                // Fetch all users
                const [adminRows] = await pool.query(
                    'SELECT A_id AS id, A_Username AS username, A_Password AS password, "Admin" AS role FROM admin WHERE A_Status = "Active"'
                );
                const [studentRows] = await pool.query(
                    'SELECT S_id AS id, S_Username AS username, S_Password AS password, "Student" AS role FROM student WHERE S_Status = "Active"'
                );
                const [staffRows] = await pool.query(
                    'SELECT T_id AS id, T_Username AS username, T_Password AS password, "Staff" AS role FROM staff WHERE T_Status = "Active"'
                );
                const [inchargeRows] = await pool.query(
                    'SELECT C_id AS id, C_Username AS username, C_Password AS password, "Incharge" AS role FROM incharge WHERE C_Status = "Active"'
                );
                const allUsers = [...adminRows, ...studentRows, ...staffRows, ...inchargeRows];
                res.status(200).json({ users: allUsers });
            }
        } catch (error) {
            console.error("Error fetching data from database:", error);
            res.status(500).json({ message: 'Error retrieving data', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
