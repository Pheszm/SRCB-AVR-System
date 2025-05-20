import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { type } = req.query;

    try {
      if (type === 'staff') {
        // Get all users where user_type is "Staff" and status is "Active"
        const staff = await prisma.users.findMany({
          where: {
            user_type: 'Staff',
            status: 'Active',
          },
          select: {
            user_id: true,
            first_name: true,
            last_name: true,
            staff_id: true,
          },
          orderBy: {
            first_name: 'asc',
          },
        });

        return res.status(200).json(staff);
      }

      if (type === 'student') {
        const students = await prisma.users.findMany({
          where: {
            user_type: 'Student',
            status: 'Active',
          },
        });

        return res.status(200).json(students);
      }

      // If no type is provided, or it's unknown
      return res.status(400).json({ error: 'Invalid or missing user type in query param.' });

    } catch (error) {
      console.error('[users.js] GET error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        user_id: parseInt(user_id),
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('[users.js] POST error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
