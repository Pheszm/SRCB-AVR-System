import prisma from '@/lib/prisma';
import { hashSync } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const students = await prisma.users.findMany({
        where: {
          user_type: 'Student',
          status: {
            not: 'Deleted'
          }
        }
      });
      return res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch students',
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
        student_id, 
        department, 
        phone_number,
        sex
      } = req.body;

      // Validate required fields
      if (!username || !password || !email || !first_name || !last_name || !student_id) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if username or email already exists
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

      // Hash the password
      const passwordHash = hashSync(password, 10);

      const newStudent = await prisma.users.create({
        data: {
          username,
          password_hash: passwordHash,
          email,
          first_name,
          last_name,
          status: 'Active',
          user_type: 'Student',
          department: department || null,
          student_id,
          phone_number: phone_number || null,
          sex
        }
      });

      // Return the student data without the password hash
      const { password_hash, ...studentData } = newStudent;
      return res.status(201).json(studentData);
    } catch (error) {
      console.error('Error creating student:', error);
      return res.status(500).json({ 
        error: 'Failed to create student',
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
      student_id, 
      department, 
      phone_number,
      sex,
      status
    } = req.body;

    // Validate required fields
    if (!user_id || !username || !email || !first_name || !last_name || !student_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if username or email already exists for another user
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

    const updatedStudent = await prisma.users.update({
      where: {
        user_id: parseInt(user_id)
      },
      data: {
        username,
        email,
        first_name,
        last_name,
        department: department || null,
        student_id,
        phone_number: phone_number || null,
        sex,
        status: status || 'Active',
        updated_at: new Date()
      }
    });

    // Return the student data without the password hash
    const { password_hash, ...studentData } = updatedStudent;
    return res.status(200).json(studentData);
  } catch (error) {
    console.error('Error updating student:', error);
    return res.status(500).json({ 
      error: 'Failed to update student',
      details: error.message 
    });
  }
}
// Add this to your existing API route handler
else if (req.method === 'DELETE') {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Soft delete by updating status to "Deleted"
    const deletedStudent = await prisma.users.update({
      where: {
        user_id: parseInt(user_id)
      },
      data: {
        status: 'Deleted',
        updated_at: new Date()
      }
    });

    // Return the student data without the password hash
    const { password_hash, ...studentData } = deletedStudent;
    return res.status(200).json(studentData);
  } catch (error) {
    console.error('Error deleting student:', error);
    return res.status(500).json({ 
      error: 'Failed to delete student',
      details: error.message 
    });
  }
}
else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}