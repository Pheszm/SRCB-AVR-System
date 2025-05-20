import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id in query' });
    }

    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const reservations = await prisma.transactions.findMany({
        where: {
          user_id: parseInt(user_id),
          OR: [
            {
              // Today's events that haven't started yet or are ongoing
              date_of_use: today,
              start_time: { gt: now }, // Future events today
            },
            {
              // Today's events that are currently ongoing
              date_of_use: today,
              start_time: { lte: now }, // Started already
              end_time: { gt: now },    // Not ended yet
            },
            {
              // Future dates
              date_of_use: { gt: today }
            }
          ],
        },
        include: {
          needed: {
            include: {
              equipment: true,
            },
          },
          users_transactions_user_idTousers: true,
          users_transactions_requested_by_idTousers: true,
        },
        orderBy: {
          date_of_use: 'asc',
        },
      });

      // Flatten data to include equipment directly
      const formatted = reservations.map(res => ({
        ...res,
        equipment: res.needed.map(n => n.equipment)
      }));

      return res.status(200).json(formatted);
    } catch (error) {
      console.error('[GET reservations] Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        user_id,
        requested_by_id,
        reservationType,
        date_of_use,
        start_time,
        end_time,
        purpose,
        selectedItems,
      } = req.body;

      if (!user_id || !date_of_use || !start_time || !end_time || !purpose) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const transaction = await prisma.transactions.create({
        data: {
          user_id: parseInt(user_id),
          requested_by_id: requested_by_id ? parseInt(requested_by_id) : null,
          transaction_category: reservationType === 'equipment' ? 'Equipment' : 'AVR_Venue',
          date_of_use: new Date(date_of_use),
          start_time: new Date(`${date_of_use}T${start_time}`),
          end_time: new Date(`${date_of_use}T${end_time}`),
          transaction_reason: purpose,
          reservation_status: 'Pending',
          transaction_status: 'Upcoming',
        }
      });

      if (reservationType === 'equipment' && selectedItems?.length) {
        await prisma.needed.createMany({
          data: selectedItems.map(item => ({
            transaction_id: transaction.transaction_id,
            equipment_id: item.equipment_id,
          }))
        });
      }

      return res.status(201).json({ success: true, transaction_id: transaction.transaction_id });

    } catch (error) {
      console.error('[POST reservations] Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
