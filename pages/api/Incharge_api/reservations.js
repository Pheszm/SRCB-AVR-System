import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const reservations = await prisma.transactions.findMany({
        where: {
          approved_by_id: null,
          reservation_status: 'Pending',
          transaction_status: {
            not: 'Cancelled',
          },
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
      console.error('[GET reservations] Error:', error.message);
      return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }

  if (req.method === 'PUT') {
    const { transaction_id, action, approved_by_id, comments_after_use } = req.body;

    try {
      const data = {
        approved_by_id: parseInt(approved_by_id),
        managed_at: new Date(),
        notif_user: 'Unread',
        reservation_status: action === 'approve' ? 'Approved' : 'Rejected',
      };

      if (action === 'reject') {
        data.comments_after_use = comments_after_use;
      }

      await prisma.transactions.update({
        where: { transaction_id: parseInt(transaction_id) },
        data,
      });

      return res.status(200).json({ message: 'Reservation updated successfully' });
    } catch (error) {
      console.error('[PUT reservations] Error:', error.message);
      return res.status(500).json({ error: 'Failed to update reservation' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
