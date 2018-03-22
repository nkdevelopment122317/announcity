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

    $("#yes-for-code").on("click", function() {
        $(".submit-code").toggleClass("no-display");
        $(".asking-for-code").toggleClass("no-display");
    });

    $(".back-link").on("click", function() {
        $(".submit-code").toggleClass("no-display");
        $(".asking-for-code").toggleClass("no-display");
    });

    $(".submit-code-link").on("click", function() {
        $(".submit-code").toggleClass("no-display");
        $(".loader").toggleClass("no-display");

        sendCode();

        setTimeout(function() {
            $(".loader").toggleClass("no-display");
            $(".yes-code").toggleClass("no-display");
        }, 1000);
    });

    $("#no-for-code").on("click", function() {
        $(".asking-for-code").toggleClass("no-display");
        $(".loader").toggleClass("no-display");

        setTimeout(function() {
            $(".loader").toggleClass("no-display");
            $(".no-code").toggleClass("no-display");
        }, 500);
    });

    $(".ah").on("click", function() {
        $.getJSON("/api/")
        .done(function(data) {
            $("body").append(JSON.stringify(data));
        });
    });
}

function sendCode() {
    var code = $("#code-box").val();
    $.ajax({
        url: "/api/accountType/" + code + "/confirm",
        type: "PUT",
        success: function(data) {
            $(".yes-code").text(data);
        }
    });
}