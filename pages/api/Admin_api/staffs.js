import prisma from '@/lib/prisma';
import { hashSync } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const staff = await prisma.users.findMany({
        where: {
          user_type: 'Staff',
          status: {
            not: 'Deleted'
          }
        }
      });
      return res.status(200).json(staff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch staff',
        details: error.message 
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { 
        username, 
        password, 
        email, 
        first_name, 
        last_name, 
        staff_id, 
        department, 
        phone_number,
        sex
      } = req.body;

      
      if (!username || !password || !email || !first_name || !last_name || !staff_id) {
        return res.status(400).json({ error: 'Missing required fields' });
      }


      const existingUser = await prisma.users.findFirst({
        where: {
          OR: [
            { username },
            { email }
          ]
        }
      });

      if (existingUser) {
        return res.status(409).json({ 
          error: 'User already exists',
          conflict: existingUser.username === username ? 'username' : 'email'
        });
      }


      const passwordHash = hashSync(password, 10);

      const newStaff = await prisma.users.create({
        data: {
          username,
          password_hash: passwordHash,
          email,
          first_name,
          last_name,
          status: 'Active',
          user_type: 'Staff',
          department: department || null,
          staff_id,
          phone_number: phone_number || null,
          sex
        }
      });


      const { password_hash, ...staffData } = newStaff;
      return res.status(201).json(staffData);
    } catch (error) {
      console.error('Error creating staff:', error);
      return res.status(500).json({ 
        error: 'Failed to create staff',
        details: error.message 
      });
    }
  } 
  else if (req.method === 'PUT') {
    try {
      const { 
        user_id,
        username, 
        email, 
        first_name, 
        last_name, 
        staff_id, 
        department, 
        phone_number,
        sex,
        status
      } = req.body;


      if (!user_id || !username || !email || !first_name || !last_name || !staff_id) {
        return res.status(400).json({ error: 'Missing required fields' });
      }


      const existingUser = await prisma.users.findFirst({
        where: {
          AND: [
            {
              NOT: {
                user_id: parseInt(user_id)
              }
            },
            {
              OR: [
                { username },
                { email }
              ]
            }
          ]
        }
      });

      if (existingUser) {
        return res.status(409).json({ 
          error: 'Username or email already exists for another user',
          conflict: existingUser.username === username ? 'username' : 'email'
        });
      }

      const updatedStaff = await prisma.users.update({
        where: {
          user_id: parseInt(user_id)
        },
        data: {
          username,
          email,
          first_name,
          last_name,
          department: department || null,
          staff_id,
          phone_number: phone_number || null,
          sex,
          status: status || 'Active',
          updated_at: new Date()
        }
      });


      const { password_hash, ...staffData } = updatedStaff;
      return res.status(200).json(staffData);
    } catch (error) {
      console.error('Error updating staff:', error);
      return res.status(500).json({ 
        error: 'Failed to update staff',
        details: error.message 
      });
    }
  }

  else if (req.method === 'DELETE') {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
      }


      const deletedStaff = await prisma.users.update({
        where: {
          user_id: parseInt(user_id)
        },
        data: {
          status: 'Deleted',
          updated_at: new Date()
        }
      });


      const { password_hash, ...staffData } = deletedStaff;
      return res.status(200).json(staffData);
    } catch (error) {
      console.error('Error deleting staff:', error);
      return res.status(500).json({ 
        error: 'Failed to delete staff',
        details: error.message 
      });
    }
  }
  else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
