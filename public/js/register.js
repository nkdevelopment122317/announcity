$(document).ready(function() {
    addEvents();
});

function addEvents() {
    //for role radio buttons
    $(".role-input").on("click", function() {
        var newPlaceholder = "Enter " + $(this).val().toLowerCase() + " code";
        $("#code-label").text(newPlaceholder);
    });

    $(".material-input").on("focus", function() {
        $(this).parent().parent().css("box-shadow", "0px 0px 23px 0px rgba(0,0,0,0.5)");
        $(this).parent().parent().css("-moz-box-shadow", "0px 0px 23px 0px rgba(0,0,0,0.5)");
        $(this).parent().parent().css("-webkit-box-shadow", "0px 0px 23px 0px rgba(0,0,0,0.5)");
    }).on("blur", function() {
        $(this).parent().parent().css("box-shadow", "none");
        $(this).parent().parent().css("-moz-box-shadow", "none");
        $(this).parent().parent().css("-webkit-box-shadow", "none");
    });

    $(".role-input").on("focus", function() {
        $(this).parent().parent().css("box-shadow", "0px 0px 23px 0px rgba(0,0,0,0.5)");
        $(this).parent().parent().css("-moz-box-shadow", "0px 0px 23px 0px rgba(0,0,0,0.5)");
        $(this).parent().parent().css("-webkit-box-shadow", "0px 0px 23px 0px rgba(0,0,0,0.5)");
        $(this).prop("checked", true);
    }).on("blur", function() {
        $(this).parent().parent().css("box-shadow", "none");
        $(this).parent().parent().css("-moz-box-shadow", "none");
        $(this).parent().parent().css("-webkit-box-shadow", "none");
    });
}