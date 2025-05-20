// pages/api/authentication.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, password, qr } = req.body;

  try {
    let user;

    if (qr) {
      // QR login: remove "ID-" prefix
      const QrCode = qr.replace(/^ID-/, '');

      user = await prisma.users.findFirst({
        where: {
          status: 'Active',
          OR: [
            { student_id: QrCode },
            { staff_id: QrCode }
          ]
        },
      });

      if (!user) return res.status(401).json({ error: 'QR Code not recognized' });

    } else {
      // Manual login
      user = await prisma.users.findUnique({
        where: { username },
      });

      if (!user) return res.status(401).json({ error: 'Invalid username or password' });

      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) return res.status(401).json({ error: 'Invalid username or password' });
    }

    
    // Optional: update last login
    await prisma.users.update({
      where: { user_id: user.user_id },
      data: { last_login: new Date() },
    });

    return res.status(200).json({
      id: user.user_id,
      role: user.user_type,
      full_name: `${user.first_name} ${user.last_name}`
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}
