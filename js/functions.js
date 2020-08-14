$(document).ready(function(){

    $(".addcartbtn").on("click", function() {
        let index = $(this).attr("id"); // Index of product in object
        $(this).css("background-color", "grey")

        sendIndexToCart(index);
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

});