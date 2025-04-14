import pool from '@/lib/db'; // Import the database connection pool

export default async function handler(req, res) {
    try {
        // Log the incoming request for debugging
        console.log("Received request:", req.query);

        // Get current date in Philippines timezone (Asia/Manila)
        const now = new Date();
        const philippinesTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));

        // Calculate the start of the current month (1st day of the month)
        const startOfMonth = new Date(philippinesTime.getFullYear(), philippinesTime.getMonth(), 1);

        // Calculate the end of the current month (last day of the month)
        const endOfMonth = new Date(philippinesTime.getFullYear(), philippinesTime.getMonth() + 1, 0);

        // Format dates to 'YYYY-MM-DD' for MySQL compatibility
        const formattedStart = startOfMonth.toISOString().slice(0, 10); // '2025-04-01'
        const formattedEnd = endOfMonth.toISOString().slice(0, 10); // '2025-04-30'

        // Query to fetch transactions for the current month and join both student and staff tables
        const query = `
            SELECT 
                t.*,  -- Select all columns from the Transaction table
                IFNULL(s.S_Fullname, st.T_Fullname) AS fullName, -- Use IFNULL to get either student or staff name
                rb.T_Fullname AS requestedby_fullname  -- Requestedby Fullname (staff)
            FROM 
                Transaction t
            LEFT JOIN 
                student s ON t.Usertype = 'Student' AND t.User_id = s.S_id  -- Join with student table
            LEFT JOIN 
                staff st ON t.Usertype = 'Staff' AND t.User_id = st.T_id  -- Join with staff table
            LEFT JOIN 
                staff rb ON t.requestedby_id = rb.T_id  -- Join with staff for requestedby details
            WHERE 
                t.dateofuse BETWEEN ? AND ?  -- Filter by the current month
            ORDER BY 
                t.DateTimeFiled DESC
        `;

        // Log the query to check for issues
        console.log("Executing query:", query);

        // Execute the query using the pool with the start and end dates as parameters
        const [rows] = await pool.query(query, [formattedStart, formattedEnd]);

        // Check if there are results
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No transactions found for the current month.' });
        }

        // Return the result (transactions)
        return res.status(200).json(rows);

    } catch (error) {
        // Log error details to the console for debugging
        console.error("Error fetching data: ", error);

        // Return a more detailed error message to the client
        return res.status(500).json({ error: error.message || "Failed to fetch transaction data" });
    }
}
