import prisma from '@/lib/prisma';
import { hashSync } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Check if an admin already exists
      const existingAdmin = await prisma.users.findFirst({
        where: {
          user_type: 'Admin'
        }
      });

      if (existingAdmin) {
        return res.status(200).json({ 
          message: 'Admin already exists', 
          admin: {
            user_id: existingAdmin.user_id,
            username: existingAdmin.username,
            email: existingAdmin.email
          }
        });
      }

      // Hash the password with bcryptjs
      const passwordHash = hashSync('admin123', 10);

      // Create new admin with all required fields
      const newAdmin = await prisma.users.create({
        data: {
          username: 'admin',
          password_hash: passwordHash,
          email: 'admin@example.com',
          first_name: 'System',
          last_name: 'Admin',
          status: 'Active',
          user_type: 'Admin',
          department: 'Administration',
          phone_number: '+1234567890',
          // created_at and updated_at will be automatically set by Prisma
        }
      });

      return res.status(201).json({ 
        message: 'Admin created successfully',
        admin: {
          user_id: newAdmin.user_id,
          username: newAdmin.username,
          email: newAdmin.email
        }
      });
    } catch (error) {
      console.error('Admin initialization error:', error);
      return res.status(500).json({ 
        error: 'Failed to initialize admin',
        details: error.message 
      });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}