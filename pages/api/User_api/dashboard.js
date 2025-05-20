// api/user/dashboard.js
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Get reservation status counts
    const statusStats = await prisma.transactions.groupBy({
      by: ['reservation_status'],
      where: {
        OR: [
          { user_id: parseInt(user_id) },
          { requested_by_id: parseInt(user_id) }
        ]
      },
      _count: {
        transaction_id: true
      }
    });

    // Get timeline data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const timelineData = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM transactions
      WHERE (user_id = ${parseInt(user_id)} OR requested_by_id = ${parseInt(user_id)})
        AND created_at >= ${sixMonthsAgo}
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `;

    // Format the response
    const formattedStats = [
      { status: 'Pending', count: statusStats.find(s => s.reservation_status === 'Pending')?._count?.transaction_id || 0 },
      { status: 'Approved', count: statusStats.find(s => s.reservation_status === 'Approved')?._count?.transaction_id || 0 },
      { status: 'Rejected', count: statusStats.find(s => s.reservation_status === 'Rejected')?._count?.transaction_id || 0 },
      { status: 'Upcoming', count: 0 }, // Will be calculated separately
      { status: 'Completed', count: 0 }, // Will be calculated separately
      { status: 'Cancelled', count: statusStats.find(s => s.reservation_status === 'Cancelled')?._count?.transaction_id || 0 }
    ];

    // Get additional status counts
    const upcomingCount = await prisma.transactions.count({
      where: {
        OR: [
          { user_id: parseInt(user_id) },
          { requested_by_id: parseInt(user_id) }
        ],
        transaction_status: 'Upcoming',
        reservation_status: 'Approved'
      }
    });

    const completedCount = await prisma.transactions.count({
      where: {
        OR: [
          { user_id: parseInt(user_id) },
          { requested_by_id: parseInt(user_id) }
        ],
        transaction_status: { in: ['On_Time', 'Late'] }
      }
    });

    // Update the stats
    formattedStats.find(s => s.status === 'Upcoming').count = upcomingCount;
    formattedStats.find(s => s.status === 'Completed').count = completedCount;

    res.status(200).json({
      reservationStats: formattedStats,
      timelineData: timelineData.map(item => ({
        month: item.month,
        count: Number(item.count)
      }))
    });
  } catch (error) {
    console.error('Error fetching user dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
}