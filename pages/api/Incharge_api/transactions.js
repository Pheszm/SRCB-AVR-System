import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const reservations = await prisma.transactions.findMany({
        where: {
          reservation_status: 'Approved',
          transaction_status: {
            in: ['Upcoming', 'Check_Out', 'Ongoing', 'Ready_for_Pickup'],
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

  // ✅ Handle PUT requests: Checkout and Return
  if (req.method === 'PUT') {
    const { transaction_id, action } = req.body;

    if (!transaction_id || !['checkout', 'return'].includes(action)) {
      return res.status(400).json({ error: 'Missing or invalid data' });
    }

    try {
      if (action === 'checkout') {
        // Update transaction to Check_Out
        const transaction = await prisma.transactions.update({
          where: { transaction_id },
          data: {
            transaction_status: 'Check_Out',
            updated_at: new Date(),
          },
          include: {
            needed: true,
          },
        });

        const equipmentIds = transaction.needed.map(n => n.equipment_id).filter(Boolean);

        if (equipmentIds.length > 0) {
          await prisma.equipment.updateMany({
            where: { equipment_id: { in: equipmentIds } },
            data: {
              status: 'Checked_Out',
              updated_at: new Date(),
            },
          });
        }

        return res.status(200).json({ message: 'Checkout successful' });
      }

if (action === 'return') {
  const { evaluations = [] } = req.body;

  const transaction = await prisma.transactions.findUnique({
    where: { transaction_id },
  });

  const now = new Date();
  const isLate =
    new Date(transaction.end_time) < now &&
    new Date(transaction.date_of_use).toDateString() !== now.toDateString();

  const newStatus = isLate ? 'Late' : 'On_Time';

  const updatedTransaction = await prisma.transactions.update({
    where: { transaction_id },
    data: {
      transaction_status: newStatus,
      returned_at: now,
      updated_at: now,
    },
    include: {
      needed: true,
    },
  });

  for (const evalItem of evaluations) {
    const { needed_id, equipment_id, condition } = evalItem;

    if (!needed_id || !equipment_id || !condition) continue;

    await prisma.needed.update({
      where: {
        needed_id,
      },
      data: {
        equipment_health_afteruse: condition,
      },
    });

    await prisma.equipment.update({
      where: { equipment_id },
      data: {
        status: condition === 'Lost' ? 'Lost' : 'Available',
        updated_at: new Date(),
      },
    });
  }

  return res.status(200).json({ message: 'Return evaluation completed' });
}




    } catch (error) {
      console.error(`[PUT ${action}] Error:`, error.message);
      return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
