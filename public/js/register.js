$(document).ready(function() {
    addEvents();

    // $("input[type='text']::placeholder").attr("line-height", $(this).innerHeight() + "px");
});

function addEvents() {
    //for role radio buttons
    $(".role-input").on("click", function() {
        var newPlaceholder = "Enter " + $(this).val().toLowerCase() + " code";
        $(".textbox").removeClass("no-display");
        $(".textbox").attr("placeholder", newPlaceholder);
    });

    $(".textbox").keypress(function() {
        $(".submit").removeClass("no-display");
    });
}