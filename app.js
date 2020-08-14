const express = require("express");
const app = express();
const request = require("request"); // Import request package
const conn = require("./dbPool.js"); // Import the DB File
const session = require("express-session");
const bcrypt = require("bcrypt");

app.set("view engine", "ejs");
app.use(express.static("public")); // Use public folder for all static files
app.use(express.urlencoded({extended:true})); // Middleware to be able to parse POST parameters

// Global object
let productObject; let cartObj = []; let total = 0;

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
    let filterSelection = req.query.filterSelection; // Obtain user's filter selection

    productObject = await getProducts(sportSelection); // Create and store object with API info
    productObject = await getProducts(sportSelection); // Create and store object with API info
    // Sort by user's filter selection
    if(filterSelection == "az") {
        productObject.sort((a, b) => (a.productName > b.productName) ? 1 : -1);
    }

    if(filterSelection == "price") {
        productObject.sort((a, b) => (a.productPrice > b.productPrice) ? 1 : -1);
    }

    res.render("sports", {"productObject": productObject, "sportSelection": sportSelection});

});

// Search Route
app.get("/search", async function(req, res){

    let itemSearch = req.query.itemSearch; // Obtain user's search string
    let filterSelection = req.query.filterSelection; // Obtain user's filter selection

    let productObject = await getProducts(itemSearch); // Create and store object with API info

    if(productObject == undefined){
        res.render("itemNotFound");
    }
    //Sort by user's filter selection
    if(filterSelection == "az") {
        productObject.sort((a, b) => (a.productName > b.productName) ? 1 : -1);
    }

    if(filterSelection == "price") {
        productObject.sort((a, b) => (a.productPrice > b.productPrice) ? 1 : -1);
    }

    res.render("sports", {"productObject": productObject, "itemSearch": itemSearch});
});

// Shopping Cart Route
app.get("/cart", function(req, res){

    let index = req.query.index; // Stores index of cart item selected
    let indexDel = req.query.indexDel;
    let qty = req.query.qty;
    total = 0;

    // If 'add to cart' btn triggered this route
    if(index){
        cartObj.push(
            {
                "productAmount": 1,
                "productName": productObject[index].productName,
                "productImagePath": productObject[index].productImagePath,
                "productPrice": productObject[index].productPrice
            }
        );
        // cartObj.length > 0 ? console.dir(cartObj) : console.log("Call Made, nothing received");
        // console.log("Object Length: " + cartObj.length);
    } 
    else if(indexDel) {
        cartObj.splice(indexDel,1);
    }
    
    else if(qty){
        cartObj[req.query.qtyIndex].productAmount = qty;
    }

    // Else, The user pressed the 'cart' btn in the header.ejs file
    else{
        for(let i = 0; i < cartObj.length; i++) {
            total += (cartObj[i].productPrice * cartObj[i].productAmount);
        }
        res.render("cart", {"cartObj": cartObj, "total": total});
    }

});

app.get("/cart/checkout", async function(req, res) {
    let username = req.body.username;
    console.log(username);
    let user_id = await createUser(username);
    console.log(user_id);
    placeOrder(total,  "2020-08-13", user_id);
    res.render("confirmation", {"cartObj": cartObj, "total": total});
    total = 0;
    cartObj = [];
});

// Admin Login Page
app.get("/login", function(req, res){
    res.render("adminLogin");
});

// Admin POST route, calls verifyAdmin()
app.post("/login", async function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    // res.send("Username: " + username + "<br/>Password: " + password);

    let authenticateUser = await verifyAdmin(username, password);

    if(authenticateUser){
        res.render("adminPortal", {"username": username});
    }
    else{
        res.send("Username or password is incorrect");
    }
});

/*
 * Get sport products from Walmart API.
 * @param {string} sport
 * @return {object} sport-object 
*/
function getProducts(sport){

    // Await expression waits for a promise, so a promise must be returned here
    return new Promise(function(resolve, reject){
        let requestUrl = `http://api.walmartlabs.com/v1/search?query=${sport}&format=json&apiKey=7eksjp57nqzw9hnb9hsudh93`;

        request(requestUrl, function(error, response, body){
            if(!error && response.statusCode == 200 && JSON.parse(body).items != undefined){
                let parsedData = JSON.parse(body);
                let productObject = []; // Declare Product Object

                // Current API call only retrieves 10 items
                let count = parsedData.items.length; // Constrain count if need +/- than 10

                // Fill object with Name, Price, and ImageUrl for first <= 10 results
                for(let i = 0; i < count; i++){
                    try {
                        productObject.push(
                            {
                                productName: parsedData.items[i].name,
                                productPrice: parsedData.items[i].salePrice,
                                productImagePath: parsedData.items[i].imageEntities[0].mediumImage
                            }
                        );
                    } catch(error){}
                }

                resolve(productObject); // Use resolve to return the productObject
            }
            else{
                console.log('error:', error);
                console.log('statusCode:', response && response.statusCode);
                reject(error); // Use reject to pass error value
            }
        });
    }).catch(function(error){});
}

/*
 * Checks if username and password match database entry.
 * @param {string} username
 * @param {string} password
 * @return {boolean} true if found, false otherwise
*/
function verifyAdmin(username, password){
    let sqlUsername = "SELECT * FROM users WHERE username =?";
    let authenticated;

    return new Promise(function(resolve, reject){
        conn.query(sqlUsername, [username], async function(err, rows, fields){
            if(err) throw err;

            // If username exists in database, call verifyPassword()
            if(rows.length > 0){
                // console.log(rows[0].username + ", " + rows[0].password);
                if(rows[0].username == username){
                    let passwordCheck = await verifyPassword(password, rows[0].password);
                    passwordCheck ? resolve(true) : resolve(false); // if match return true, false otherwise
                    // console.log("password check = " + passwordCheck);
                }
                else{
                    authenticated = false;
                }
            }

            resolve(authenticated);
        });//query
    });//promise
}

/*
 * Checks if user password matches the hashed password in the database.
 * Will only execute if the username is found.
 * @param {string} password
 * @param {string} hashedPassword
 * @return {boolean} true if found, false otherwise
*/
function verifyPassword(password, hashedPassword){
    return new Promise(function(resolve, reject){

        // Compare hashed password with users password
        bcrypt.compare(password, hashedPassword, function(err, result){
            // console.log("Result: " + result);
            if(err) throw err;
            resolve(result);
        });//bcrypt
    });//promise
}

function placeOrder(orderAmount, date, userID) {
    let sql = "INSERT INTO orders (order_amount, date, user_id) VALUES (?, ?, ?)";
       
    conn.query(sql, [orderAmount, date, userID], function(err, rows, fields){
        if(err) throw err;
    });
}

function createItem (id, name) {
    let sql = "INSERT INTO items (item_id, item_name) VALUES (?, ?)";
       
    conn.query(sql, [id, name], function(err, rows, fields) {
        if(err) throw err;
    }).catch();
}

function createUser(username){
    let sqlUsername = "SELECT * FROM user WHERE username =?";
    let sqlNewUser = "INSERT INTO user (username) VALUE (?)";
    let user_id = "";
    return new Promise(function(resolve, reject){
        conn.query(sqlUsername, [username], async function(err, rows, fields){
            if(err) throw err;

            if(rows.length > 0) {
                resolve(rows[0].user_id);
            }
            else {
                console.log("here");
                conn.query(sqlNewUser, [username], async function (err, rows, fields) {
                    if(err) throw err;

                    conn.query(sqlUsername, [username], async function (err, rows, fields){
                       if(err) throw err;
                        resolve(rows[0].user_id);
                    });
                });
            }
        });//query
    }).catch();
}

// Starting Server on local machine (For Dev)
app.listen("8080", "127.0.0.1", function(){
    console.log("Express server is running...");
});

// Starting Server for Web Hosting Environment 
// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("Express server is running...");
// });