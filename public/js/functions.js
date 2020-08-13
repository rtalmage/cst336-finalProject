$(document).ready(function(){

    // Add-to-cart onlcick listener
    $(".addcartbtn").on("click", function() {
        let index = $(this).attr("id"); // Index of product in object
        $(this).css("background-color", "grey")

        sendIndexToCart(index);
    });

    // View-all-orders onclick listener
    $("#viewAllOrders").click(function(){
        sendOrdersToView();
    });

    // View-total-revenue onclick listener
    $("#viewTotalRevenue").click(function(){

    });

    // Search-order-num onclick listener
    $("#searchOrderNum").click(function(){

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

    function sendOrdersToView(){
        $.ajax({ 
            method: 'GET', 
            url: '/adminOrders',
            success: function(data, status) {

                $("#orderTableContents").html("");
                let htmlString = "";
                data.forEach(function(row){
                    htmlString += "<tr><td><%= row.order_id %></td>";
                    htmlString += "<td><%= row.order_amount %></td>";
                    htmlString += "<td><%= row.order_items %></td>";
                    htmlString += "<td><%= row.date %></td>";
                    htmlString += "<td><%= row.user_id %></td></tr>";
                });
        
                $("#orderTableContents").append(htmlString);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("some error");
            }
        });
    }

});