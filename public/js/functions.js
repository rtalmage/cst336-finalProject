$(document).ready(function(){

    $(".addcartbtn").on("click", function() {
        let index = $(this).attr("id"); // Index of product in object
        $(this).css("background-color", "grey");

        sendIndexToCart(index);
    });
    
    $(".deletecartbtn").on("click", function() {
        let indexDel = $(this).attr("id"); // Index of product in object
        $(this).css("background-color", "grey");

        sendDelIndexToCart(indexDel);
        
    });
    
    $(".qtyBox").on("change", function() {
        let indexDel = $(this).attr("id"); // Index of product in object
        let quantity = $(this).val();

        sendQtyIndexToCart(indexDel, quantity);
        
    });

    /*
     * Sends the index to the /cart route in the controller.
     * This index is used to populate the cart object data
     * @param {int} index
     * @return {object}
    */
    function sendIndexToCart(index) {

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
    
    function sendDelIndexToCart(index){

        $.ajax({ 
            method: 'GET', 
            url: '/cart',
            data: {
                "indexDel": index
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("some error");
            }
        });
    }
    
    function sendQtyIndexToCart(index, qty){

        $.ajax({ 
            method: 'GET', 
            url: '/cart',
            data: {
                "qtyIndex": index,
                "qty": qty
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("some error");
            }
        });
    }

});