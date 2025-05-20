import prisma from '@/lib/prisma';

const generateUniqueQRCode = async () => {
  let qr_code;
  let exists;

  do {
    qr_code = Math.random().toString(36).substr(2, 20); // Generate a 20-character alphanumeric string
    exists = await prisma.equipment.findFirst({
      where: {
        qr_code: qr_code, // Check if this QR code already exists
      }
    });
  } while (exists); // If it exists, generate a new one

  return qr_code;
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const equipment = await prisma.equipment.findMany({
        where: {
          status: {
            not: 'Retired',
          },
        },
        include: {
          users: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
        },
      });
      return res.status(200).json(equipment);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      return res.status(500).json({
        error: 'Failed to fetch equipment',
        details: error.message,
      });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        name,
        description,
        category,
        status,
        health,
        created_by,
      } = req.body;

      // Validate required fields
      if (!name || !category || !created_by) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate created_by (Ensure the user exists)
      const user = await prisma.users.findUnique({
        where: { user_id: parseInt(created_by) },
      });
      if (!user) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      // Validate status (Check if it's a valid enum)
      const validStatuses = ['Available', 'Checked_Out', 'Maintenance', 'Retired'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      // Validate health (Check if it's a valid enum)
      const validHealths = ['New', 'Excellent', 'Good', 'Fair', 'Poor', 'Broken'];
      if (health && !validHealths.includes(health)) {
        return res.status(400).json({ error: 'Invalid health value' });
      }

      // Generate a unique QR Code for the new equipment
      const qr_code = await generateUniqueQRCode();

      // Create new equipment record
      const newEquipment = await prisma.equipment.create({
        data: {
          qr_code,
          name,
          description,
          category,
          status: status || 'Available', // Default to Available if not provided
          health: health || 'Good', // Default to Good if not provided
          created_by: parseInt(created_by), // Ensure created_by is a number
        },
      });

      return res.status(201).json({
        message: 'Equipment added successfully',
        equipment: newEquipment,
      });
    } catch (error) {
      console.error('Error adding equipment:', error);
      return res.status(500).json({
        error: 'Failed to add equipment',
        details: error.message,
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        equipment_id,
        qr_code,
        name,
        description,
        category,
        status,
        health,
      } = req.body;

      if (!equipment_id || !qr_code || !name || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const updatedEquipment = await prisma.equipment.update({
        where: {
          equipment_id: parseInt(equipment_id),
        },
        data: {
          qr_code,
          name,
          description,
          category,
          status: status || 'Available',
          health: health || 'Good',
          updated_at: new Date(),
        },
      });

      return res.status(200).json({
        message: 'Equipment updated successfully',
        equipment: updatedEquipment,
      });
    } catch (error) {
      console.error('Error updating equipment:', error);
      return res.status(500).json({
        error: 'Failed to update equipment',
        details: error.message,
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { equipment_id } = req.body;

      if (!equipment_id) {
        return res.status(400).json({ error: 'Equipment ID is required' });
      }

      const deletedEquipment = await prisma.equipment.update({
        where: {
          equipment_id: parseInt(equipment_id),
        },
        data: {
          status: 'Retired', // Assuming we mark the equipment as retired instead of deleting it
          updated_at: new Date(),
        },
      });

      return res.status(200).json({
        message: 'Equipment retired successfully',
        equipment: deletedEquipment,
      });
    } catch (error) {
      console.error('Error deleting equipment:', error);
      return res.status(500).json({
        error: 'Failed to delete equipment',
        details: error.message,
      });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
