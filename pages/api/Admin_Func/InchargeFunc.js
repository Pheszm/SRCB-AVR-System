// api/Admin_Func/InchargeFunc.js

import pool from '@/lib/db';

export default async function handler(req, res) {

    if (req.method === 'GET') {
        // Fetch all incharge members
        const [rows] = await pool.query('SELECT * FROM incharge');
        res.status(200).json(rows);
    } 
    
    
    
    
    else if (req.method === 'POST') {
        const {
            C_Username,
            C_Password,
            C_Email,
            C_PhoneNo,
            C_Sex,
            C_Fullname
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
    
        // Generate initial QR code for the incharge
        let C_QRcode = generateQRCode();
    
        try {
            // Check if the username already exists in any of the tables
            const [existingStudent] = await pool.query(
                'SELECT * FROM student WHERE S_Username = ?', [C_Username]
            );
            
            const [existingStaff] = await pool.query(
                'SELECT * FROM staff WHERE T_Username = ?', [C_Username]
            );
            
            const [existingAdmin] = await pool.query(
                'SELECT * FROM admin WHERE A_Username = ?', [C_Username]
            );
    
            const [existingIncharge] = await pool.query(
                'SELECT * FROM incharge WHERE C_Username = ?', [C_Username]
            );
    
            // Check if any of the results contain an existing username
            if (existingStudent.length > 0 || existingStaff.length > 0 || existingAdmin.length > 0 || existingIncharge.length > 0) {
                return res.status(400).json({ message: 'Username already exists' });
            }
    
            // Ensure the QR code is unique across all tables (student, staff, incharge, admin)
            while (await checkQRCodeExists(C_QRcode)) {
                C_QRcode = generateQRCode();  // Generate a new QR code if there's a conflict
            }
    
            // Insert new incharge member if username and QR code are unique
            await pool.query(
                'INSERT INTO incharge (C_Username, C_Password, C_Email, C_PhoneNo, C_Sex, C_Fullname, C_QRcode) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                [C_Username, C_Password, C_Email, C_PhoneNo, C_Sex, C_Fullname, C_QRcode]
            );
            res.status(201).json({ message: 'Incharge added successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    
    
    
    
    else if (req.method === 'PUT') {
        const {
            C_id,
            C_Username,
            C_Password,
            C_Email,
            C_PhoneNo,
            C_Sex,
            C_Fullname,
            C_Status
        } = req.body;
    
        try {
            // First, check if the username has changed
            const [existingIncharge] = await pool.query(
                'SELECT * FROM incharge WHERE C_id = ?', [C_id]
            );
            
            // If the username is unchanged, skip the duplicate check
            const currentUsername = existingIncharge[0]?.C_Username;
            let usernameExists = false;

            if (currentUsername !== C_Username) {
                // Check if the new username exists in any other table
                const [existingStudent] = await pool.query(
                    'SELECT * FROM student WHERE S_Username = ?', [C_Username]
                );

                const [existingStaff] = await pool.query(
                    'SELECT * FROM staff WHERE T_Username = ?', [C_Username]
                );

                const [existingAdmin] = await pool.query(
                    'SELECT * FROM admin WHERE A_Username = ?', [C_Username]
                );

                const [existingInchargeCheck] = await pool.query(
                    'SELECT * FROM incharge WHERE C_Username = ?', [C_Username]
                );

                if (existingStudent.length > 0 || existingStaff.length > 0 || existingAdmin.length > 0 || existingInchargeCheck.length > 0) {
                    usernameExists = true;
                }
            }

            if (usernameExists) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            // Update the incharge record
            await pool.query(
                'UPDATE incharge SET C_Username=?, C_Password=?, C_Email=?, C_PhoneNo=?, C_Sex=?, C_Fullname=?, C_Status=? WHERE C_id=?',
                [C_Username, C_Password, C_Email, C_PhoneNo, C_Sex, C_Fullname, C_Status, C_id]
            );
    
            res.status(200).json({ message: 'Incharge updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }        
    } else if (req.method === 'DELETE') {
        const { C_id } = req.body;
        await pool.query('DELETE FROM incharge WHERE C_id=?', [C_id]);
        res.status(200).json({ message: 'Incharge deleted successfully' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
