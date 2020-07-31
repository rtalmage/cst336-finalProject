const express = require("express");
const app = express();
const request = require("request"); // Import request package
const pool = require("./dbPool.js"); // Import the DB File

app.set("view engine", "ejs");
app.use(express.static("public")); // Use public folder for all static files

// Landing Page Route
app.get("/", function(req, res){

    res.render("index");
});

// About Page Route
app.get("/about", function(req, res){

    res.render("about");
});

// Dynamic Sports Route
app.get("/sport", function(req, res){

    let sportSelection = req.query.sportSelection;

    res.render("sports", {"sportSelection": sportSelection});

    // // Dynamically populate the sports page with Walmart API,
    // // based off the user's selection from drop down
    // switch (sportSelection){
    //     case "baseball":
    //         // Render baseball products from Walmart API
    //         break;
    //     case "cycling":
    //         // Render cycling products from Walmart API
    //         break;
    //     case "fitness":
    //         // Render fitness products from Walmart API
    //         break;
    //     case "football":
    //         // Render football products from Walmart API
    //         break;
    //     case "soccer":
    //         // Render soccer products from Walmart API
    //         break;
    // }

});

// Search Route
app.get("/search", function(req, res){

    let itemSearch = req.query.itemSearch;
    res.render("results", {"itemSearch": itemSearch});
});

// Shopping Cart Route
app.get("/cart", function(req, res){

    res.render("cart");
});

// Starting Server on local machine (For Dev)
app.listen("8080", "127.0.0.1", function(){
    console.log("Express server is running...");
});

// Starting Server for Web Hosting Environment 
// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("Express server is running...");
// });