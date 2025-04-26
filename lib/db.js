import mysql from 'mysql2';

const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'srcb_avr_system', });

const promisePool = pool.promise();

export default promisePool;
