import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const equipment = await prisma.equipment.findMany({
        where: {
          status: {
            not: 'Retired',
            not: 'Maintenance',
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
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
