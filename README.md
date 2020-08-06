# cst336-finalProject
Final Group Project - Shopping cart utilizing the Walmart API, Node.js, Express, EJS, JawsDB MySQL, javaScript Sessions

## Project Set Up
* $ npm init
    * Change 'entry point' to 'app.js'
* $ npm i express ejs request mysql

## SQL Database Set Up
* Create a new schema
* Run this query:
CREATE TABLE `users` (
    `userId` tinyint NOT NULL AUTO_INCREMENT,
    `username` varchar(8) DEFAULT NULL,
    `password` varchar(72) DEFAULT NULL,
    PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci