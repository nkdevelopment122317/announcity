$(document).ready(function() {
    addEvents();
});

function addEvents() {
    $(".material-input").on("focus", function() {
        $(this).parent().parent().css("box-shadow", "0px 0px 23px 0px rgba(0,0,0,0.5)");
        $(this).parent().parent().css("-moz-box-shadow", "0px 0px 23px 0px rgba(0,0,0,0.5)");
        $(this).parent().parent().css("-webkit-box-shadow", "0px 0px 23px 0px rgba(0,0,0,0.5)");
    }).on("blur", function() {
        $(this).parent().parent().css("box-shadow", "none");
        $(this).parent().parent().css("-moz-box-shadow", "none");
        $(this).parent().parent().css("-webkit-box-shadow", "none");
    });
}