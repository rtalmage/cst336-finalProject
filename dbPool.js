const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "Enter Host Here",
    user: "Enter User Here",
    password: "Enter Password Here",
    database: "Enter Database Name Here"
});

module.exports = pool;