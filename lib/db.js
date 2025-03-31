// lib/db.js
import mysql from 'mysql2';

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'srcb_avr_system', // Your DB name
});

// Use promise() to get a promise-based API
const promisePool = pool.promise();

export default promisePool;
