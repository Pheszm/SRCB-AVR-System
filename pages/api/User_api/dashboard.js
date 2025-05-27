import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Get reservation status breakdown
    const statusStats = await prisma.transactions.groupBy({
      by: ['reservation_status', 'transaction_status'],
      where: {
        OR: [
          { user_id: parseInt(user_id) },
          { requested_by_id: parseInt(user_id) }
        ]
      },
      _count: true
    });

    // Transform status stats into the format expected by the frontend
    const reservationStats = [];
    
    // Count different statuses
    const statusCounts = {
      Pending: 0,
      Approved: 0,
      Rejected: 0,
      Upcoming: 0,
      Completed: 0,
      Cancelled: 0
    };

    statusStats.forEach(stat => {
      if (stat.reservation_status === 'Pending') {
        statusCounts.Pending += stat._count;
      } else if (stat.reservation_status === 'Approved') {
        if (stat.transaction_status === 'Upcoming') {
          statusCounts.Upcoming += stat._count;
        } else if (['On_Time', 'Late'].includes(stat.transaction_status)) {
          statusCounts.Completed += stat._count;
        } else {
          statusCounts.Approved += stat._count;
        }
      } else if (stat.reservation_status === 'Rejected') {
        statusCounts.Rejected += stat._count;
      } else if (stat.transaction_status === 'Cancelled') {
        statusCounts.Cancelled += stat._count;
      }
    });

    // Convert to array format expected by frontend
    for (const [status, count] of Object.entries(statusCounts)) {
      if (count > 0) {
        reservationStats.push({ status, count });
      }
    }

    // Get timeline data (reservations by month)
    const timelineData = await prisma.$queryRaw`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        COUNT(*) as count
      FROM transactions
      WHERE user_id = ${parseInt(user_id)} OR requested_by_id = ${parseInt(user_id)}
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month
    `;

    // Format timeline data for Chart.js
    const formattedTimelineData = timelineData.map(item => ({
      month: item.month,
      count: Number(item.count)
    }));

    return res.status(200).json({
      reservationStats,
      timelineData: formattedTimelineData
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}