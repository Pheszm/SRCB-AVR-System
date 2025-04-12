import pool from "@/lib/db";

export default async function handler(req, res) {
    try {
        const { Usertype, User_id } = req.query;

        let query = '';
        let values = [];

        if (Usertype === "Staff") {
            query = `SELECT T_id AS id, T_Fullname AS fullName, T_Email AS email, T_PhoneNo AS phone, T_Sex AS sex FROM staff WHERE T_id = ? LIMIT 1`;
            values = [User_id];
        } else if (Usertype === "Student") {
            query = `SELECT S_id AS id, S_Fullname AS fullName, S_Email AS email, S_PhoneNo AS phone, S_Sex AS sex FROM student WHERE S_id = ? LIMIT 1`;
            values = [User_id];
        } else {
            return res.status(400).json({ error: "Invalid user type" });
        }

        const [rows] = await pool.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(rows[0]); // Respond with the user data
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
