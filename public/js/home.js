$(document).ready(function() {
    // fixButtonHeight();
    addEvents();
    adjustButtonPadding();

    fetchUserAnnouncements();
});

// function fixButtonHeight() {
//     var buttons = document.getElementsByClassName("more-info");
//     var thumbnails = document.getElementsByClassName("thumbnail");
//     var captions = document.getElementsByClassName("caption");

//     for (var i = 0; i < buttons.length; i++) {
//         buttons[i].style.height = thumbnails[i].offsetHeight - captions[i].offsetHeight + "px";
//     }
// }

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

    $(".favorite").on("click", function() {
        $(this).toggleClass("far");
        $(this).toggleClass("fas");
        $(this).toggleClass("favorited");

        updateStatus($(this).hasClass("favorited"), $(this).attr("data-pres-id"));
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

        confirmStudentAccount();

        setTimeout(function() {
            $(".loader").toggleClass("no-display");
            $(".no-code").toggleClass("no-display");
        }, 500);
    });

    $(".nav-tabs li").on("click", function() {
        $(".nav-tabs li").each(function() {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
            }
        });
        $(this).addClass("active");

        var attr = $(this).attr("data-tab");

        if ($(this).attr("data-tab") === attr) {
            $(".tab-content").each(function() {
                if ($(this).attr("data-tab") === attr) {
                    $(this).removeClass("no-display");
                } else {
                    $(this).addClass("no-display");
                }
            });
        }
    });

    $(".ah").on("click", function() {
        $.getJSON("/api/")
        .done(function(data) {
            $("body").append(JSON.stringify(data));
        });
    });

    // $.ajax({
    //     url: "/api/announcements/get",
    //     type: "GET",
    //     success: function(announcements) {
    //         console.log(announcements);
    //         $(".announcement-container").data("announcements", announcements.length + "");
    //     }
    // });

    $(".color-indicator").hover(function() {

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

function confirmStudentAccount() {
    $.ajax({
        url: "/api/accountType/student/confirm",
        type: "PUT",
        success: function(data) {
            if (data === "SUCCESS") {
                $(".no-code").text("Student account verified.");
            }
        }
    });
}

function updateStatus(favorited, id) {
    if (favorited) {
        $.ajax({
            url: "/api/presentations/" + id + "/updateStatus/favorite",
            type: "PUT",
            success: function(data) {

            }
        });
    } else {
        $.ajax({
            url: "/api/presentations/" + id + "/updateStatus/unfavorite",
            type: "PUT",
            success: function(data) {

            }
        });
    }
}

function adjustButtonPadding() {
    var button = $(".see-more");
    var thumbnail = $(".thumbnail");

    button.css("padding-top", (thumbnail.height() - button.height()) / 2);
    button.css("padding-bottom", (thumbnail.height() - button.height()) / 2);
    button.css("padding-right", (thumbnail.width() - button.width()) / 2);
    button.css("padding-left", (thumbnail.width() - button.width()) / 2);
}

function fetchUserAnnouncements() {
    var announcements = new Object();

    $(".user-cluborgs").children().each(function() {
        $.ajax({
            url: "/api/cluborgs/" + $(this).text() + "/get",
            type: "GET",
            success: function(cluborg) {
                var cluborgName = cluborg.name;
                announcements[cluborgName] = cluborg.announcements;
            }
        });
    });
    // $.each(announcements, function(cluborgName, cluborgAnns) {
        
    //     $(".my-announcement-container").append('<div class="panel panel-default"><div class="panel-heading"><h2 class="panel-title">' + cluborgName + '</h2></div><div class="panel-body"></div></div>');
    //     cluborgAnns.forEach(function(announcement) {
    //         $(".panel-body:contains('" + cluborgName + "')").append("<h4>" + announcement.title + "</h4><hr>");
    //     });
    // });
    var sortedKeys = Object.keys(announcements).sort();
    console.log(announcements);

    for (var cluborgName in announcements) {
        if (announcements.hasOwnProperty(cluborgName)) {
            console.log("e");
            $(".my-announcement-container").append('<div class="panel panel-default"><div class="panel-heading"><h2 class="panel-title">' + cluborgName + '</h2></div><div class="panel-body"></div></div>');
            announcements[cluborgName].forEach(function(announcement) {
                $(".panel-body:contains('" + cluborgName + "')").append("<h4>" + announcement.title + "</h4><hr>");
            }); 
        }
    }
}