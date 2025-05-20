import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    // Dashboard data
    const totalStudents = await prisma.users.count({
      where: { user_type: 'Student', status: { not: 'Deleted' }},
    });

    const activeStudents = await prisma.users.count({
      where: { user_type: 'Student', status: 'Active', status: { not: 'Deleted' }},
    });

    const totalStaff = await prisma.users.count({
      where: { user_type: 'Staff', status: { not: 'Deleted' }},
    });

    const activeStaff = await prisma.users.count({
      where: { user_type: 'Staff', status: 'Active', status: { not: 'Deleted' }},
    });

    const totalIncharge = await prisma.users.count({
      where: { user_type: 'Incharge', status: { not: 'Deleted' }},
    });

    const activeIncharge = await prisma.users.count({
      where: { user_type: 'Incharge', status: 'Active', status: { not: 'Deleted' }},
    });

    // Recent Activities
    const recentUsers = await prisma.users.findMany({
      orderBy: { updated_at: 'desc' },
      take: 5,
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        user_type: true,
        updated_at: true,
        created_at: true, // Corrected this to created_at
        last_login: true,
      },
    });

    const recentEquipment = await prisma.equipment.findMany({
      orderBy: { updated_at: 'desc' },
      take: 5,
      select: {
        equipment_id: true,
        name: true,
        updated_at: true,
        status: true,
        health: true,
      },
    });

    const activities = [];

    // Add user-related activities
    recentUsers.forEach((user) => {
      activities.push({
        id: `user-${user.user_id}`,
        action: `${user.user_type} ${user.first_name} ${user.last_name} was updated`,
        time: user.updated_at,
      });

      // Corrected to use created_at here
      activities.push({
        id: `user-${user.user_id}`,
        action: `${user.user_type} ${user.first_name} ${user.last_name} was created`,
        time: user.created_at,
      });

      if (user.last_login) {
        activities.push({
          id: `login-${user.user_id}`,
          action: `${user.first_name} ${user.last_name} logged in`,
          time: user.last_login,
        });
      }
    });

    // Add equipment-related activities
    recentEquipment.forEach((equip) => {
      activities.push({
        id: `equip-${equip.equipment_id}`,
        action: `Equipment "${equip.name}" status updated to ${equip.status}`,
        time: equip.updated_at,
      });
    });

    // Sort by time descending
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Format time as relative time string
    const now = new Date();
    const formattedActivities = activities
      .filter(activity => {
        const diff = (now - new Date(activity.time)) / 1000; // in seconds
        return diff >= 0; // Keep only past activities
      })
      .slice(0, 5)
      .map((activity, index) => {
        const diff = Math.floor((now - new Date(activity.time)) / 1000); // seconds
        let relative = '';

        if (diff < 60) relative = `${diff} secs ago`;
        else if (diff < 3600) relative = `${Math.floor(diff / 60)} mins ago`;
        else if (diff < 86400) relative = `${Math.floor(diff / 3600)} hours ago`;
        else relative = `${Math.floor(diff / 86400)} days ago`;

        return {
          id: index + 1,
          action: activity.action,
          time: relative,
        };
      });

    // Send both the dashboard data and recent activities in one response
    res.status(200).json({
      dashboardData: {
        totalStudents,
        activeStudents,
        totalStaff,
        activeStaff,
        totalIncharge,
        activeIncharge,
      },
      recentActivities: formattedActivities,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
