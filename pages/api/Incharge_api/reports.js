import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { type, from, to } = req.body;

  try {
    if (type === 'top-users') {
      const whereClause = {
        ...(from && to && {
          date_of_use: {
            gte: new Date(from),
            lte: new Date(to),
          },
        }),
        user_id: { not: null },
        users_transactions_user_idTousers: {
          user_type: 'Student',
        },
      };

      const topUserTransactions = await prisma.transactions.groupBy({
        by: ['user_id'],
        _count: { user_id: true },
        where: whereClause,
        orderBy: {
          _count: {
            user_id: 'desc',
          },
        },
        take: 10,
      });

      const topUsers = await Promise.all(
        topUserTransactions.map(async (entry) => {
          const user = await prisma.users.findUnique({
            where: { user_id: entry.user_id },
          });

          return {
            id: user.user_id,
            name: `${user.first_name} ${user.last_name}`,
            count: entry._count.user_id,
          };
        })
      );

      return res.status(200).json({ topUsers });
    }

    if (type === 'mostly-used-items') {
      const whereClause = {
        ...(from && to && {
          transactions: {
            date_of_use: {
              gte: new Date(from),
              lte: new Date(to),
            },
          },
        }),
      };

      const mostlyUsedEquipment = await prisma.needed.groupBy({
        by: ['equipment_id'],
        _count: { equipment_id: true },
        where: whereClause,
        orderBy: {
          _count: {
            equipment_id: 'desc',
          },
        },
        take: 10,
      });

      const mostlyUsedWithDetails = await Promise.all(
        mostlyUsedEquipment.map(async (entry) => {
          const equipment = await prisma.equipment.findUnique({
            where: { equipment_id: entry.equipment_id },
          });

          return {
            id: equipment.equipment_id,
            name: equipment.name,
            count: entry._count.equipment_id,
          };
        })
      );

      return res.status(200).json({ mostlyUsedItems: mostlyUsedWithDetails });
    }

    return res.status(400).json({ error: 'Invalid type' });
  } catch (error) {
    console.error('Error fetching report:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
