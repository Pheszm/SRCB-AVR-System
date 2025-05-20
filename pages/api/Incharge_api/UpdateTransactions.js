import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ 
      success: false,
      message: 'Only PUT requests are allowed' 
    });
  }

  try {
    const now = new Date();
    const currentDateTime = now;
    const currentDateOnly = new Date(now.toISOString().split('T')[0]); // Date without time

    // 1. Update to Ongoing status
    const ongoingUpdate = await prisma.transactions.updateMany({
      where: {
        date_of_use: {
          equals: currentDateOnly
        },
        start_time: {
          lte: currentDateTime
        },
        end_time: {
          gte: currentDateTime
        },
        transaction_status: 'Upcoming'
      },
      data: {
        transaction_status: 'Ongoing',
        notif_user: 'Unread',
        notif_incharge: 'Unread',
        updated_at: now
      }
    });

    // 2. Update to Expired status
    const expiredUpdate = await prisma.transactions.updateMany({
      where: {
        OR: [
          // Case 1: Date is in the past
          {
            date_of_use: {
              lt: currentDateOnly
            }
          },
          // Case 2: Today's date but end time has passed
          {
            AND: [
              {
                date_of_use: {
                  equals: currentDateOnly
                }
              },
              {
                end_time: {
                  lt: currentDateTime
                }
              }
            ]
          }
        ],
        transaction_status: {
          in: ['Upcoming', 'Ongoing']
        }
      },
      data: {
        transaction_status: 'Expired',
        notif_user: 'Unread',
        notif_incharge: 'Unread',
        updated_at: now
      }
    });

    return res.status(200).json({
      success: true,
      ongoingUpdated: ongoingUpdate.count,
      expiredUpdated: expiredUpdate.count
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Database update failed"
    });
  }
}