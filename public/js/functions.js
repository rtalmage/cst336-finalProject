$(document).ready(function(){
    
    var cartObj = [];
    
    $(".addcartbtn").on("click", function() {
        var index = $(".addcartbtn").index(this);
        console.log(index);
        cartObj.push(productObject[index]);
    });
    
   
   $("#cartbtn").on("click", function() {
    $.ajax({ 
      method: 'GET', 
      url: '/cart', 
      data: { "productName": cartObj[0].productName, "productImagePath": cartObj[0].productImagePath, "productPrice": cartObj[0].productPrice}, 
      //dataType: 'json',
      success: function (data) { 
            console.log(data);
        },
         error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert("some error");
        }
        });
   });

});