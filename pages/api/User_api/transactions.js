import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { user_id } = req.query;
      const whereClause = {
        reservation_status: 'Approved',
        transaction_status: {
          in: ['Upcoming', 'Check_Out', 'Ongoing', 'Ready_for_Pickup'],
        }
      };
      
      if (user_id) {
        whereClause.user_id = parseInt(user_id);
      }

      const reservations = await prisma.transactions.findMany({
        where: whereClause,
        include: {
          needed: {
            include: {
              equipment: true,
            },
          },
          users_transactions_user_idTousers: true,
          users_transactions_requested_by_idTousers: true,
          users_transactions_approved_by_idTousers: true,
        },
        orderBy: {
          start_time: 'asc',
        },
      });

      const formatted = reservations.map(reservation => ({
        ...reservation,
        equipment: reservation.needed ? reservation.needed.map(n => n.equipment) : [],
        reserver_name: reservation.users_transactions_user_idTousers
          ? `${reservation.users_transactions_user_idTousers.first_name} ${reservation.users_transactions_user_idTousers.last_name}`
          : 'Unknown Reserver',
      }));

      return res.status(200).json(formatted);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    const { transaction_id } = req.body;

    if (!transaction_id) {
      return res.status(400).json({ error: 'Transaction ID required' });
    }

    try {
      await prisma.transactions.update({
        where: { transaction_id },
        data: {
          transaction_status: 'Cancelled',
          managed_at: new Date()
        }
      });
      return res.status(200).json({ message: 'Transaction cancelled' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to cancel transaction' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}