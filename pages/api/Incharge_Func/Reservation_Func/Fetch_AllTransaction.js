import pool from '@/lib/db';

export default async function handler(req, res) {
    try {
        const query = `
            SELECT 
                t.transac_id, 
                t.DateTimeFiled,
                t.Usertype, 
                t.User_id, 
                t.requestedby_id, 
                t.approvedby_id, 
                t.reservation_status, 
                t.transac_status, 
                t.transac_reason, 
                t.Transac_Category, 
                t.dateofuse, 
                t.fromtime, 
                t.totime, 
                t.returnedtime, 
                t.comments_afteruse, 
                t.notif_status,

                COALESCE(s.S_Fullname, st.T_Fullname) AS fullName,
                rb.T_Fullname AS requestedby_fullname,

                i.I_id, 
                i.I_Name, 
                i.I_Category, 
                i.I_Quantity, 
                i.I_Availability,
                ineed.Quantity 

            FROM 
                Transaction t
            LEFT JOIN 
                Items_needed ineed ON t.transac_id = ineed.transac_id
            LEFT JOIN 
                Item i ON ineed.I_id = i.I_id
            LEFT JOIN 
                student s ON t.Usertype = 'Student' AND t.User_id = s.S_id
            LEFT JOIN 
                staff st ON t.Usertype = 'Staff' AND t.User_id = st.T_id
            LEFT JOIN 
                staff rb ON t.requestedby_id = rb.T_id
            ORDER BY 
                t.DateTimeFiled DESC;
        `;

        const [rows] = await pool.query(query);

        const transactions = rows.reduce((acc, row) => {
            const existing = acc.find(item => item.transac_id === row.transac_id);

            const item = {
                I_id: row.I_id,
                I_Name: row.I_Name,
                I_Category: row.I_Category,
                I_Quantity: row.I_Quantity,
                I_Availability: row.I_Availability,
                Quantity: row.Quantity,
            };

            if (existing) {
                existing.items.push(item);
            } else {
                acc.push({
                    transac_id: row.transac_id, 
                    DateFiled: row.DateTimeFiled,
                    Usertype: row.Usertype,
                    User_id: row.User_id,
                    requestedby_id: row.requestedby_id,
                    requestedby_fullname: row.requestedby_fullname,
                    approvedby_id: row.approvedby_id,
                    reservation_status: row.reservation_status,
                    transac_status: row.transac_status,
                    transac_reason: row.transac_reason,
                    Transac_Category: row.Transac_Category,
                    dateofuse: row.dateofuse,
                    fromtime: row.fromtime,
                    totime: row.totime,
                    returnedtime: row.returnedtime,
                    comments_afteruse: row.comments_afteruse,
                    notif_status: row.notif_status,
                    fullName: row.fullName,
                    items: [item]
                });
            }

            return acc;
        }, []);

        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching data: ", error);
        res.status(500).json({ error: "Failed to fetch transaction data" });
    }
}
