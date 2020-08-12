const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "antonihoE1!",
    database: "finalproj"
});

module.exports = pool;