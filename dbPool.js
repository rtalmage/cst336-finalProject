const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "starwars1",
    database: "final_project"
});

module.exports = pool;