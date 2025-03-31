import pool from '@/lib/db';
import formidable from 'formidable';
import path from 'path';

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize formidable to handle file uploads
const form = formidable({
  uploadDir: path.join(process.cwd(), 'public/uploads'),
  keepExtensions: true,
  multiples: false,
  filename: (name, ext, part, form) => `${Date.now()}${ext}`,
});

// Function to generate QR code
const generateQRCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Check if QR code exists
const checkQRCodeExists = async (qrCode) => {
  const [existingItemQRCode] = await pool.query('SELECT * FROM Item WHERE I_QRcode = ?', [qrCode]);
  return existingItemQRCode.length > 0;
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(400).json({ message: 'Error parsing form' });
      }

      const { I_Name, I_Category, I_Quantity, I_Availability, C_id } = fields;

      // Ensure required fields are provided
      if (!I_Name || !I_Category || !I_Quantity || !I_Availability || !C_id) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Generate QR code for the item
      let I_QRcode = generateQRCode();

      try {
        // Ensure QR code is unique
        while (await checkQRCodeExists(I_QRcode)) {
          I_QRcode = generateQRCode();
        }

        // Get image file path
        const imagePath = files.C_Image ? path.basename(files.C_Image[0].filepath) : null;

        // Insert new item with C_id into the database
        const [result] = await pool.query(
          'INSERT INTO Item (I_QRcode, I_Name, I_Category, I_Quantity, I_Availability, C_Image, C_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            I_QRcode,
            I_Name,
            I_Category,
            I_Quantity,
            I_Availability,
            imagePath,
            C_id, // Use C_id from the form data
          ]
        );

        // Get the I_id (Item ID) of the newly inserted record
        const I_id = result.insertId;

        // Insert activity log after item insertion
        await pool.query(
          'INSERT INTO activity_logs (C_id, Action, Record_Id) VALUES (?, ?, ?)',
          [
            C_id,
            'ADD', // Action type
            I_id,  // The ID of the newly added item
          ]
        );

        res.status(201).json({ message: 'Item added successfully' });

      } catch (error) {
        console.error("Error during item insertion or activity log insertion:", error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
