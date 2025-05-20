import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { transaction_id, message } = req.body;

        if (!transaction_id) {
            return res.status(400).json({ error: 'Transaction ID required' });
        }

        try {
            await prisma.transactions.update({
                where: { transaction_id },
                data: {
                    transaction_status: 'Cancelled',
                    comments_after_use: message,
                    managed_at: new Date()
                }
            });
            return res.status(200).json({ message: 'Transaction cancelled' });
        } catch (error) {
            console.error('Cancellation error:', error);
            return res.status(500).json({ error: 'Failed to cancel transaction' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}