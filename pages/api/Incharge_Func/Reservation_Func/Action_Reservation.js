import pool from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { transac_id, action, comment } = req.body;

    try {
        const status = action === "approve" ? "Approved" : "Declined";
        const finalComment = action === "approve" ? null : comment;

        const [result] = await pool.query(
            `UPDATE Transaction SET reservation_status = ?, comments_afteruse = ? WHERE transac_id = ?`,
            [status, finalComment, transac_id]
        );

        return res.status(200).json({ message: `Reservation ${status.toLowerCase()} successfully.` });
    } catch (error) {
        console.error("Error updating reservation:", error);
        return res.status(500).json({ message: "Failed to update reservation." });
    }
}
