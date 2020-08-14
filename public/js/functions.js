$(document).ready(function(){

    // Hide tables and data until clicked in adminOrders
    $("#orders-table").hide();
    $("#total-revenue").hide();
    $("#search-by-num").hide();

    // Hide tables and data until clicked in adminUsers
    $("#users-table").hide();
    $("#search-by-user").hide();

    // Hide tables and data until clicked in adminViewAdmins
    $("#search-by-admin").hide();
    $("#admin-table").hide();

    // Add-to-cart onlcick listener
    $(".addcartbtn").on("click", function() {
        let index = $(this).attr("id"); // Index of product in object
        $(this).css("background-color", "grey")

        sendIndexToCart(index);
    });

    // View-all-orders onclick listener
    $("#viewAllOrders").click(function(){
        $("#orders-table").show();
        $("#total-revenue").hide();
        $("#search-by-num").hide();
        sendOrdersToView();
    });

    // View-total-revenue onclick listener
    $("#viewTotalRevenue").click(function(){
        $("#total-revenue").show();
        $("#orders-table").hide();
        $("#search-by-num").hide();
        sendRevenueToView();
    });

    // Search-order-num onclick listener
    $("#searchOrderNum").click(function(){
        $("#search-by-num").show();
        $("#orders-table").hide();
        $("#total-revenue").hide();

        $("#admin-search-btn").click(function(){
            let searchVal = $("#ordersSearch").val();
            sendSearchToView(searchVal);
        });
    });

    // View all user onclick listener
    $("#viewAllUsers").click(function(){
        $("#users-table").show();
        $("#search-by-user").hide();
        sendUsersToView();
    });

    // Search by username onclick listener
    $("#searchByUsername").click(function(){
        $("#search-by-user").show();
        $("#users-table").hide();
        
        $("#admin-search-user-btn").click(function(){
            let searchVal = $("#userSearch").val();
            sendSearchUsersToView(searchVal);
        });
    });

    // View all user onclick listener
    $("#viewAllAdmins").click(function(){
        $("#admin-table").show();
        $("#search-by-admin").hide();
        sendAdminsToView();
    });

    // Search by username onclick listener
    $("#searchByAdminUsername").click(function(){
        $("#search-by-admin").show();
        $("#admin-table").hide();
        
        $("#admin-search-admin-btn").click(function(){
            let searchVal = $("#adminSearch").val();
            sendSearchAdminsToView(searchVal);
        });
    });

    /*
     * Sends the index to the /cart route in the controller.
     * This index is used to populate the cart object data
     * @param {int} index
     * @return {object}
    */
    function sendIndexToCart(index){

        $.ajax({ 
            method: 'GET', 
            url: '/cart',
            data: {
                "index": index
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("some error");
            }
        });
    }

    /*
     * Retrieves all orders from the database.
     * Inserts order data to view with bootstrap table styling.
    */
    function sendOrdersToView(){
        $.ajax({ 
            method: 'GET', 
            url: '/populateOrders',
            success: function(data, status) {
                $("#orderTableContents").html("");
                let htmlString = "";

                // If no orders exist in the DB
                if(data.length < 1){
                    htmlString += "<tr><td>There are no orders to show</td>";
                    $("#orderTableContents").append(htmlString);
                    $("#orderTableContents").css("color", "red");
                }

                // Else, orders exist. Display the resulting table
                else{
                    data.forEach(function(row){
                        htmlString += "<tr><td>" + row.order_id + "</td>";
                        htmlString += "<td>$" + row.order_amount + "</td>";
                        htmlString += "<td>" + row.date + "</td>";
                        htmlString += "<td>" + row.user_id + "</td></tr>";
                    });
            
                    $("#orderTableContents").append(htmlString);
                    $("#orderTableContents").css("color", "black");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("some error");
            }
        });
    }

    /*
     * Retrieves total revenue from database and sends it to the view.
    */
    function sendRevenueToView(){
        $.ajax({ 
            method: 'GET', 
            url: '/populateRevenue',
            success: function(data, status) {
                $("#total-revenue").html("");
                let htmlString = "";

                // If there are no orders in DB, there is no revenue either
                if(data.length < 1){
                    htmlString += "<h6>There is no revenue to report</h6>";
                    $("#total-revenue").append(htmlString);
                    $("#total-revenue").css("color", "red");
                }

                // Else, an order exists. Display the total revenue
                else{
                    data.forEach(function(row){
                        htmlString += "<h6>Total Revenue To Date: $" + row.totalRev + "</h6>";
                    });
            
                    $("#total-revenue").append(htmlString);
                    $("#total-revenue").css("color", "black");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("some error");
            }
        });
    }

    /*
    * Searches for matching order_id in the orders table.
    */
    function sendSearchToView(searchVal){
        $.ajax({ 
            method: 'GET', 
            url: '/populateSearchOrders',
            data: {
                "searchVal": searchVal
            },
            success: function(data, status) {
                $("#searchTableContents").html("");
                let htmlString = "";

                // If search does not find matching Id
                if(data.length < 1){
                    htmlString += "<tr><td>Order Id does not exist. Please enter a valid Id.</td></tr>";
                    $("#searchTableContents").append(htmlString);
                    $("#searchTableContents").css("color", "red");
                }

                // Else, a successful search. Return results
                else{
                    data.forEach(function(row){
                        htmlString += "<tr><td>" + row.order_id + "</td>";
                        htmlString += "<td>$" + row.order_amount + "</td>";
                        htmlString += "<td>" + row.date + "</td>";
                        htmlString += "<td>" + row.user_id + "</td></tr>";
                    });
            
                    $("#searchTableContents").append(htmlString);
                    $("#searchTableContents").css("color", "black");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("some error");
            }
        });
    }

    /*
    * Sends all existing users in DB to the view.
    */
    function sendUsersToView(){
        $.ajax({ 
            method: 'GET', 
            url: '/populateUsers',

            success: function(data, status) {
                $("#userTableContents").html("");
                let htmlString = "";

                // If users dont exist
                if(data.length < 1){
                    htmlString += "<tr><td>No Users Found</td></tr>";
                    $("#userTableContents").append(htmlString);
                    $("#userTableContents").css("color", "red");
                }

                // Else, return all users
                else{
                    data.forEach(function(row){
                        htmlString += "<tr><td>" + row.user_id + "</td>";
                        htmlString += "<td>" + row.username + "</td></tr>";
                    });
            
                    $("#userTableContents").append(htmlString);
                    $("#userTableContents").css("color", "black");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("some error");
            }
        });
    }

    /*
    * Searches for matching order_id in the orders table.
    */
    function sendSearchUsersToView(searchVal){
        $.ajax({ 
            method: 'GET', 
            url: '/populateSearchUsers',
            data: {
                "searchVal": searchVal
            },
            success: function(data, status) {
                $("#searchUserContents").html("");
                let htmlString = "";

                // If search does not find matching Id
                if(data.length < 1){
                    htmlString += "<tr><td>Username Does Not Exist!</td></tr>";
                    $("#searchUserContents").append(htmlString);
                    $("#searchUserContents").css("color", "red");
                }

                // Else, a successful search. Return results
                else{
                    data.forEach(function(row){
                        htmlString += "<tr><td>" + row.user_id + "</td>";
                        htmlString += "<td>" + row.username + "</td></tr>";
                    });
            
                    $("#searchUserContents").append(htmlString);
                    $("#searchUserContents").css("color", "black");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("some error");
            }
        });
    }

    /*
    * Sends all existing admins in DB to the view.
    */
    function sendAdminsToView(){
        $.ajax({ 
            method: 'GET', 
            url: '/populateAdmins',

            success: function(data, status) {
                $("#adminTableContents").html("");
                let htmlString = "";

                // If users dont exist
                if(data.length < 1){
                    htmlString += "<tr><td>No Admins Found</td></tr>";
                    $("#adminTableContents").append(htmlString);
                    $("#adminTableContents").css("color", "red");
                }

                // Else, return all users
                else{
                    data.forEach(function(row){
                        htmlString += "<tr><td>" + row.admin_id + "</td>";
                        htmlString += "<td>" + row.username + "</td></tr>";
                    });
            
                    $("#adminTableContents").append(htmlString);
                    $("#adminTableContents").css("color", "black");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("some error");
            }
        });
    }

    /*
    * Searches for matching order_id in the orders table.
    */
    function sendSearchAdminsToView(searchVal){
        $.ajax({ 
            method: 'GET', 
            url: '/populateSearchAdmins',
            data: {
                "searchVal": searchVal
            },
            success: function(data, status) {
                $("#searchAdminContents").html("");
                let htmlString = "";

                // If search does not find matching Id
                if(data.length < 1){
                    htmlString += "<tr><td>Username Does Not Exist!</td></tr>";
                    $("#searchAdminContents").append(htmlString);
                    $("#searchAdminContents").css("color", "red");
                }

                // Else, a successful search. Return results
                else{
                    data.forEach(function(row){
                        htmlString += "<tr><td>" + row.admin_id + "</td>";
                        htmlString += "<td>" + row.username + "</td></tr>";
                    });
            
                    $("#searchAdminContents").append(htmlString);
                    $("#searchAdminContents").css("color", "black");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("some error");
            }
        });
    }

});