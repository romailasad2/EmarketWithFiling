const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'e-market',
    password: 'romimalik574'
});

module.exports = pool.promise();