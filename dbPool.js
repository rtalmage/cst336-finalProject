const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "wvulqmhjj9tbtc1w.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "abaz6kn5dcgh4pmj",
    password: "j3v861cd1y3dy05h",
    database: "be5hnzvy1459i4mr"
});

module.exports = pool;