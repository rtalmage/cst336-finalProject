const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "bbj31ma8tye2kagi.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "e4n3qqumdxsiey5f",
    password: "judeq9ub5ktakpju",
    database: "jk1gq92mkz0tngpk"
});

module.exports = pool;