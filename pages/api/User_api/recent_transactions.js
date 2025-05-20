import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { user_id } = req.query;

      const reservations = await prisma.transactions.findMany({
        where: {
          ...(user_id && { user_id: parseInt(user_id) }),
          reservation_status: 'Approved',
          transaction_status: {
            in: ['On_Time', 'Late', 'Expired'],
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
          users_transactions_approved_by_idTousers: true,
        },
        orderBy: {
          start_time: 'asc',
        },
      });

      const formatted = reservations.map(reservation => ({
        ...reservation,
        equipment: reservation.needed
          ? reservation.needed.map(n => ({
              ...n.equipment,
              equipment_health_afteruse: n.equipment_health_afteruse,
            }))
          : [],
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


  return res.status(405).json({ error: 'Method Not Allowed' });
}
