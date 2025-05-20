// /pages/api/equipment-overview.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    // Group by health and count how many equipment per health status
    const healthCounts = await prisma.equipment.groupBy({
      by: ['health'],
      _count: {
        health: true,
      },
      where: {
        status: { not: 'Deleted' }, // exclude deleted equipment
      },
    });

    // Group by category and count how many equipment per category
    const categoryCounts = await prisma.equipment.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
      where: {
        status: { not: 'Deleted' },
      },
    });

    // Format response to match frontend structure
    const equipmentHealth = healthCounts.map((item, idx) => ({
      id: idx + 1,
      status: item.health,
      count: item._count.health,
    }));

    const equipmentCategories = categoryCounts.map((item, idx) => ({
      id: idx + 1,
      category: item.category,
      count: item._count.category,
    }));

    res.status(200).json({ equipmentHealth, equipmentCategories });
  } catch (error) {
    console.error('Error fetching equipment data:', error);
    res.status(500).json({ error: 'Failed to fetch equipment data' });
  }
}
