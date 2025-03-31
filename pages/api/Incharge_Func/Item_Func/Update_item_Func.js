import pool from '@/lib/db';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

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

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading file' });
      }

      const { I_id, I_Name, I_Category, I_Quantity, I_Availability, I_Status } = fields;

      // Check if the item exists in the database
      const [existingItem] = await pool.query('SELECT * FROM Item WHERE I_id = ?', [I_id]);
      if (existingItem.length === 0) {
        return res.status(404).json({ message: 'Item not found' });
      }

      // If no new image was uploaded, keep the existing image
      let imagePath = files.C_Image ? path.basename(files.C_Image[0].filepath) : null;

      // If no new image, keep the existing image in the database
      if (!imagePath) {
        const [item] = await pool.query('SELECT C_Image FROM Item WHERE I_id = ?', [I_id]);
        imagePath = item[0].C_Image;
      } else {
        // If there's a new image, remove the old one (if exists)
        const oldImagePath = path.join(process.cwd(), 'public/uploads', existingItem[0].C_Image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Remove the old image from the server
        }
      }

      try {
        // Update the item details in the database
        await pool.query(
          'UPDATE Item SET I_Name = ?, I_Category = ?, I_Quantity = ?, I_Availability = ?, I_Status=?, C_Image = ? WHERE I_id = ?',
          [
            I_Name,
            I_Category,
            I_Quantity,
            I_Availability,
            I_Status,
            imagePath,  // Using the new or existing image path
            I_id,
          ]
        );

        // Log the update action in activity_logs
        await pool.query(
          'INSERT INTO activity_logs (C_id, Action, Record_Id) VALUES (?, ?, ?)',
          [fields.C_id, 'UPDATE', I_id]  // Log the user ID (C_id), action ('UPDATE'), and item ID (I_id)
        );

        res.status(200).json({ message: 'Item updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
