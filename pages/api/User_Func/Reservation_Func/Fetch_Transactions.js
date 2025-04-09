import pool from '@/lib/db'; // Assuming pool is configured to interact with your database

export default async function handler(req, res) {
    try {
        // Query to get all the transactions with items details
        const query = `
            SELECT 
                t.transac_id, 
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
            ORDER BY 
                t.DateTimeFiled DESC;
        `;

        // Execute the query
        const [rows] = await pool.query(query);

        // Group the results by transac_id to handle multiple items in one transaction
        const transactions = rows.reduce((acc, row) => {
            // Find if transaction already exists
            const transacIndex = acc.findIndex(item => item.transac_id === row.transac_id);

            // If the transaction exists, add the item to it
            if (transacIndex > -1) {
                acc[transacIndex].items.push({
                    I_id: row.I_id,
                    I_Name: row.I_Name,
                    I_Category: row.I_Category,
                    I_Quantity: row.I_Quantity,
                    I_Availability: row.I_Availability,
                    Quantity: row.Quantity,
                });
            } else {
                // If it's a new transaction, create a new entry
                acc.push({
                    transac_id: row.transac_id,
                    Usertype: row.Usertype,
                    User_id: row.User_id,
                    requestedby_id: row.requestedby_id,
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
                    // Add the first item for this transaction
                    items: [{
                        I_id: row.I_id,
                        I_Name: row.I_Name,
                        I_Category: row.I_Category,
                        I_Quantity: row.I_Quantity,
                        I_Availability: row.I_Availability,
                        Quantity: row.Quantity,
                    }]
                });
            }

            return acc;
        }, []);

        // Send the response with transaction data
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching data: ", error);
        res.status(500).json({ error: "Failed to fetch transaction data" });
    }
}
