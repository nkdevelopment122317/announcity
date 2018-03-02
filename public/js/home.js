$(document).ready(function() {
    fixButtonHeight();
    addEvents();
});

function fixButtonHeight() {
    var buttons = document.getElementsByClassName("more-info");
    var thumbnails = document.getElementsByClassName("thumbnail");
    var captions = document.getElementsByClassName("caption");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.height = thumbnails[i].offsetHeight - captions[i].offsetHeight + "px";
    }
}

function addEvents() {
    //for tabs
    $("#profileTab").on("click", function() {
        $(".profile-container").removeClass("no-display");
        $(".content-container").addClass("no-display");
        $("#contentTab").removeClass("clicked");
        $("#profileTab").addClass("clicked");
    });

    $("#contentTab").on("click", function() {
        $(".profile-container").addClass("no-display");
        $(".content-container").removeClass("no-display");
        $("#contentTab").addClass("clicked");
        $("#profileTab").removeClass("clicked");
    });

    $(".favorite-announcement").on("click", function() {
        $(this).toggleClass("far");
        $(this).toggleClass("fas");
        $(this).toggleClass("favorited");
    });
}