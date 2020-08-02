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
app.get("/sport", async function(req, res){

    let sportSelection = req.query.sportSelection; // Obtain user's selection from Navbar

    let productObject = await getProducts(sportSelection); // Create and store object with API info

    res.render("sports", {"productObject": productObject});

});

// Search Route
app.get("/search", async function(req, res){

    let itemSearch = req.query.itemSearch; // Obtain user's search string

    let productObject = await getProducts(itemSearch); // Create and store object with API info

    res.render("sports", {"productObject": productObject});
});

// Shopping Cart Route
app.get("/cart", function(req, res){

    res.render("cart");
});

// Get sport products from Walmart API
function getProducts(sport){

    // Await expression waits for a promise, so a promise must be returned here
    return new Promise(function(resolve, reject){
        let requestUrl = `http://api.walmartlabs.com/v1/search?query=${sport}&format=json&apiKey=7eksjp57nqzw9hnb9hsudh93`;

        request(requestUrl, function(error, response, body){
            if(!error && response.statusCode == 200){
                let parsedData = JSON.parse(body);
                let productObject = []; // Declare Product Object

                // Current API call only retrieves 10 items
                let count = parsedData.items.length; // Constrain count if need +/- than 10

                // Fill object with Name, Price, and ImageUrl for first <= 10 results
                for(let i = 0; i < count; i++){
                    productObject.push(
                        {
                            productName: parsedData.items[i].name,
                            productPrice: parsedData.items[i].salePrice,
                            productImagePath: parsedData.items[i].imageEntities[0].mediumImage
                        }
                    );
                }

                resolve(productObject); // Use resolve to return the productObject
            }
            else{
                console.log('error:', error);
                console.log('statusCode:', response && response.statusCode);
                reject(error); // Use reject to pass error value
            }
        });
    });
}

// Starting Server on local machine (For Dev)
app.listen("8080", "127.0.0.1", function(){
    console.log("Express server is running...");
});

// Starting Server for Web Hosting Environment 
// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("Express server is running...");
// });