$(document).ready(function() {
    fixButtonHeight();

    // loadTabs();

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
});

function fixButtonHeight() {
    var buttons = document.getElementsByClassName("more-info");
    var thumbnails = document.getElementsByClassName("thumbnail");
    var captions = document.getElementsByClassName("caption");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.height = thumbnails[i].offsetHeight - captions[i].offsetHeight + "px";
    }
}

function loadTabs() {
    var trigger = $(".tab");
    var container = $(".tab-container");

    // Fire on click
    trigger.on("click", function(){
        // Set $this for re-use. Set target from data attribute
        var $this = $(this);
        var target = $this.data("target");

        // Load target page into container
        container.load(target);

        // Stop normal link behavior
        return false;
    });
}