import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { date_of_use, start_time, end_time, reservationType, selectedItems } = req.body;

    let conflicts = [];

    if (reservationType === 'equipment' && selectedItems && selectedItems.length > 0) {
      // Check conflicts for each selected item individually
      for (const itemId of selectedItems) {
        const itemConflicts = await prisma.transactions.findMany({
          where: {
            reservation_status: 'Approved',
            transaction_category: 'Equipment',
            date_of_use: new Date(date_of_use),
            OR: [
              {
                AND: [
                  { start_time: { lte: new Date(end_time) } },
                  { end_time: { gte: new Date(start_time) } },
                ],
              },
            ],
            needed: {
              some: {
                equipment_id: itemId,
              },
            },
          },
          include: {
            users_transactions_user_idTousers: true,
            needed: {
              where: {
                equipment_id: itemId,
              },
              include: {
                equipment: true,
              },
            },
          },
        });

        // Only include the specific item in conflicts
        itemConflicts.forEach(transaction => {
          transaction.needed.forEach(item => {
            conflicts.push({
              id: item.equipment_id,
              itemName: item.equipment.name,
              date: new Date(date_of_use).toLocaleString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }),
              time: `${formatTime(transaction.start_time)} - ${formatTime(transaction.end_time)}`,
              user: `${transaction.users_transactions_user_idTousers?.first_name} ${transaction.users_transactions_user_idTousers?.last_name}`,
            });
          });
        });
      }
    } else if (reservationType === 'venue') {
      // Venue conflict check remains the same
      const venueConflicts = await prisma.transactions.findMany({
        where: {
          reservation_status: 'Approved',
          transaction_category: 'AVR_Venue',
          date_of_use: new Date(date_of_use),
          OR: [
            {
              AND: [
                { start_time: { lte: new Date(end_time) } },
                { end_time: { gte: new Date(start_time) } },
              ],
            },
          ],
        },
        include: {
            users_transactions_user_idTousers: true,
          },
      });

      conflicts = venueConflicts.map(transaction => ({
        id: transaction.transaction_id,
        itemName: 'AVR Venue',
        date: new Date(date_of_use).toLocaleString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
        time: `${formatTime(transaction.start_time)} - ${formatTime(transaction.end_time)}`,
        user: `${transaction.users_transactions_user_idTousers?.first_name} ${transaction.users_transactions_user_idTousers?.last_name}`,
      }));
    }

    // Remove duplicates
    conflicts = conflicts.filter((conflict, index, self) =>
      index === self.findIndex(c => 
        c.id === conflict.id && 
        c.time === conflict.time
      )
    );

    return res.status(200).json({ conflicts });
  } catch (error) {
    console.error('Error checking conflicts:', error);
    return res.status(500).json({ error: 'Failed to check conflicts' });
  }
}

function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}