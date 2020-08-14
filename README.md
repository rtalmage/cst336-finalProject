# cst336-finalProject
Final Group Project - Shopping cart utilizing the Walmart API, Node.js, Express, EJS, JawsDB MySQL, javaScript Sessions

## Project Set Up
* $ npm init
    * Change 'entry point' to 'app.js'
* $ npm i express ejs request mysql

## SQL Database Set Up
* Run these queries to create tables in existing database:
CREATE TABLE `admin` (
  `userId` tinyint NOT NULL AUTO_INCREMENT,
  `username` varchar(8) DEFAULT NULL,
  `password` varchar(72) DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `orders` (
  `order_id` tinyint NOT NULL AUTO_INCREMENT,
  `order_amount` decimal(6,2) NOT NULL,
  `items` json NOT NULL,
  `date` date NOT NULL,
  `user_id` tinyint NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci