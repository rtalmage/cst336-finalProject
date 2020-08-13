const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "A@n3w1515",
    database: "final_project"
});

module.exports = pool;