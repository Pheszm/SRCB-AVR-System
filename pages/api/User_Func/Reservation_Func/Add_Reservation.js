import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Destructure the incoming data from the request body
    const {
      Usertype,
      User_id,
      requestedby_id,
      approvedby_id,
      transac_reason,
      Transac_Category,
      Items_Needed,
      dateofuse,
      fromtime,
      totime,
      returnedtime,
      comments_afteruse,
    } = req.body;

    // Validate required fields
    if (!Usertype || !User_id || !requestedby_id || !dateofuse || !fromtime || !totime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO Transaction (
          Usertype, 
          User_id, 
          requestedby_id, 
          approvedby_id, 
          transac_reason, 
          Transac_Category, 
          dateofuse, 
          fromtime, 
          totime, 
          returnedtime, 
          comments_afteruse
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          Usertype,
          User_id,
          requestedby_id,
          approvedby_id || null,  
          transac_reason,
          Transac_Category,
          dateofuse,
          fromtime,
          totime,
          returnedtime || null, 
          comments_afteruse || null,
        ]
      );
      
      const transac_id = result.insertId; // Adjust for MySQL2 response format

      if (Items_Needed && Items_Needed.length > 0) {
        const itemInsertPromises = Items_Needed.map(item => {
          const itemQuery = `
            INSERT INTO Items_needed (transac_id, I_id, Quantity)
            VALUES (?, ?, ?)
          `;
          return pool.query(itemQuery, [transac_id, item.I_id, item.quantity]);
        });

        // Wait for all item inserts to finish
        await Promise.all(itemInsertPromises);
      }

      // Respond with success
      res.status(200).json({
        message: 'Transaction and items inserted successfully',
        transac_id: transac_id,
      });

    } catch (error) {
      console.error('Error inserting transaction:', error);
      res.status(500).json({ error: 'Error inserting transaction' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
