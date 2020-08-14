$(document).ready(function(){

    // Hide tables and data until clicked in adminOrders
    $("#orders-table").hide();
    $("#total-revenue").hide();
    $("#search-by-num").hide();

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
            url: '/populateSearch',
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

});