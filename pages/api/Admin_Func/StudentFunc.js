// api/Admin_Func/StudentFunc.js

import pool from '@/lib/db';

export default async function handler(req, res) {

    if (req.method === 'GET') {
        // Fetch all students (if needed)
        const [rows] = await pool.query('SELECT * FROM student');
        res.status(200).json(rows);
    } 
    
    
    
    else if (req.method === 'POST') {
        const {
            S_Level,
            S_StudentID,
            S_Fullname,
            S_Category,
            S_Sex,
            S_Email,
            S_PhoneNo,
            S_Username,
            S_Password,
        } = req.body;
    
        // Generate a random alphanumeric QR code with 20 characters
        const generateQRCode = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < 20; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };
    
        const checkQRCodeExists = async (qrCode) => {
            // Check across all relevant tables: student, staff, incharge, and admin
            const [existingStudentQRCode] = await pool.query(
                'SELECT * FROM student WHERE S_QRcode = ?', [qrCode]
            );
            const [existingStaffQRCode] = await pool.query(
                'SELECT * FROM staff WHERE T_QRcode = ?', [qrCode]
            );
            const [existingInchargeQRCode] = await pool.query(
                'SELECT * FROM incharge WHERE C_QRcode = ?', [qrCode]
            );
            const [existingAdminQRCode] = await pool.query(
                'SELECT * FROM admin WHERE A_QRcode = ?', [qrCode]
            );
            
            // If any table has the QR code, it already exists
            return existingStudentQRCode.length > 0 || existingStaffQRCode.length > 0 || existingInchargeQRCode.length > 0 || existingAdminQRCode.length > 0;
        };
    
        let S_QRcode = generateQRCode();
    
        try {
            // Check if the username already exists in any of the tables
            const [existingStudent] = await pool.query(
                'SELECT * FROM student WHERE S_Username = ?', [S_Username]
            );
            
            const [existingStaff] = await pool.query(
                'SELECT * FROM staff WHERE T_Username = ?', [S_Username]
            );
            
            const [existingAdmin] = await pool.query(
                'SELECT * FROM admin WHERE A_Username = ?', [S_Username]
            );
    
            const [existingIncharge] = await pool.query(
                'SELECT * FROM incharge WHERE C_Username = ?', [S_Username]
            );
    
            // Check if any of the results contain an existing username
            if (existingStudent.length > 0 || existingStaff.length > 0 || existingAdmin.length > 0 || existingIncharge.length > 0) {
                return res.status(400).json({ message: 'Username already exists' });
            }
    
            // Ensure the QR code is unique across all tables (student, staff, incharge, admin)
            while (await checkQRCodeExists(S_QRcode)) {
                S_QRcode = generateQRCode();  // Generate a new QR code if there's a conflict
            }
    
            // Insert new student if username and QR code are unique
            await pool.query(
                'INSERT INTO student (S_Level, S_StudentID, S_Fullname, S_Category, S_Sex, S_Email, S_PhoneNo, S_Username, S_Password, S_QRcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [S_Level, S_StudentID, S_Fullname, S_Category, S_Sex, S_Email, S_PhoneNo, S_Username, S_Password, S_QRcode]
            );
            res.status(201).json({ message: 'Student added successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    
    
    
    
    else if (req.method === 'PUT') {
        const {
            S_id,
            S_Level,
            S_StudentID,
            S_Fullname,
            S_Category,
            S_Sex,
            S_Email,
            S_PhoneNo,
            S_Username,
            S_Password,
            S_Status,
        } = req.body;
    
        try {
            // First, check if the username has changed
            const [existingStudent] = await pool.query(
                'SELECT * FROM student WHERE S_id = ?', [S_id]
            );
            
            // If the username is unchanged, skip the duplicate check
            const currentUsername = existingStudent[0]?.S_Username;
            let usernameExists = false;

            if (currentUsername !== S_Username) {
                // Check if the new username exists in any other table
                const [existingOtherStudent] = await pool.query(
                    'SELECT * FROM student WHERE S_Username = ?', [S_Username]
                );

                const [existingStaff] = await pool.query(
                    'SELECT * FROM staff WHERE T_Username = ?', [S_Username]
                );

                const [existingAdmin] = await pool.query(
                    'SELECT * FROM admin WHERE A_Username = ?', [S_Username]
                );

                const [existingIncharge] = await pool.query(
                    'SELECT * FROM incharge WHERE C_Username = ?', [S_Username]
                );

                // If any result contains an existing username, mark it as duplicate
                if (existingOtherStudent.length > 0 || existingStaff.length > 0 || existingAdmin.length > 0 || existingIncharge.length > 0) {
                    usernameExists = true;
                }
            }

            if (usernameExists) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            // Update the student record
            await pool.query(
                'UPDATE student SET S_Level=?, S_StudentID=?, S_Fullname=?, S_Category=?, S_Sex=?, S_Email=?, S_PhoneNo=?, S_Username=?, S_Password=?, S_Status=? WHERE S_id=?',
                [S_Level, S_StudentID, S_Fullname, S_Category, S_Sex, S_Email, S_PhoneNo, S_Username, S_Password, S_Status, S_id]
            );
    
            res.status(200).json({ message: 'Student updated' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }        
    } else if (req.method === 'DELETE') {
        const { S_id } = req.body;
        await pool.query('DELETE FROM student WHERE S_id=?', [S_id]);
        res.status(200).json({ message: 'Student deleted' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
