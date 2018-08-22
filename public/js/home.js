$(document).ready(function() {
    // fixButtonHeight();
    addEvents();
    adjustButtonPadding();

    fetchUserAnnouncements(); 
    orderAnnouncements();

    setTimeout(function() {
        $(".loader").addClass("no-display");
        $(".my-announcements").removeClass("no-display");
    }, 750);
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

    $(document).on("click", ".favorite", function() {
        $(this).toggleClass("far");
        $(this).toggleClass("fas");
        $(this).toggleClass("favorited");

        if ($(this).hasClass("favorite-cluborg")) {
            
            updateCluborgStatus($(this).hasClass("favorited"), $(this).attr("data-cluborg"));
        } else {
            updatePresentationStatus($(this).hasClass("favorited"), $(this).attr("data-pres-id"));
        }
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

function updatePresentationStatus(favorited, id) {
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

function updateCluborgStatus(favorited, id) {
    if (favorited) {
        $.ajax({
            url: "/api/cluborgs/" + id + "/updateStatus/favorite",
            type: "PUT",
            success: function(data) {

            }
        });
    } else {
        $.ajax({
            url: "/api/cluborgs/" + id + "/updateStatus/unfavorite",
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
    var i = 0;
    var announcements = {};
    var cluborgIDs = {};
    var schoolID = "";

    $(".user-cluborgs").children().each(function() {
        $.ajax({
            url: "/api/cluborgs/" + $(this).text() + "/get",
            type: "GET",
            success: function(cluborg) {
                i++;
                announcements[cluborg.name] = cluborg.announcements;
                cluborgIDs[cluborg.name] = cluborg._id;
                schoolID = cluborg.school;

                if (i == $(".user-cluborgs").children().length) {
                    populateHomepage(announcements, cluborgIDs, schoolID);
                }
            }
        });
    });

    // console.log($(".panel-heading"));

    // $(".panel-heading").each(function() {
    //     if ($(this).children().text() != "No announcements") {
    //         var cluborgName = $(this).children(".panel-title").text();
    //         var cluborgID = $(this).parent().children(".panel-body").children("h4").data("id").split("+")[0];
    //         var schoolID = $(this).parent().children(".panel-body").children("h4").data("id").split("+")[1];
    //         $(this).append("<a href='/schools/" + schoolID + "/cluborgs/" + cluborgID + "'>@" + cluborgName.replace(" ", "").toLowerCase() + "</a>");
    //     }
    // });
}

function populateHomepage(announcements, cluborgIDs, schoolID) {
    var i = 0;
    Object.keys(announcements).forEach(function(cluborgName) {
        i++;

        if (announcements.hasOwnProperty(cluborgName)) {
            if (announcements[cluborgName].length === 0) {
                $(".my-announcements").append('<div class="panel panel-default announcement-panel"><div class="panel-heading cluborg-panel"><i class="favorite favorite-cluborg far fa-star" data-cluborg="' + cluborgIDs[cluborgName] + '"></i><h2 class="panel-title">' + cluborgName + '</h2> <a class="shorthand-cluborg-link" href="/schools/' + schoolID + '/cluborgs/' + cluborgIDs[cluborgName] + '">@' + cluborgName.replace(" ", "").toLowerCase() + '</a></div><div class="panel-body" data-cluborg="' + cluborgName + '"></div></div>');
                $(".panel-body[data-cluborg='" + cluborgName + "'").append("<h4>No announcements</h4>");
            } else {
                $(".my-announcements").append('<div class="panel panel-default announcement-panel"><div class="panel-heading cluborg-panel"><i class="favorite favorite-cluborg far fa-star" data-cluborg="' + cluborgIDs[cluborgName] + '"></i><h2 class="panel-title">' + cluborgName + '</h2> <a class="shorthand-cluborg-link" href="/schools/' + announcements[cluborgName][0].school + '/cluborgs/' + announcements[cluborgName][0].cluborg.id + '">@' + cluborgName.replace(" ", "").toLowerCase() + '</a></div><div class="panel-body" data-cluborg="' + cluborgName + '"></div></div>');
                announcements[cluborgName].forEach(function(announcement) {
                    $(".panel-body[data-cluborg='" + cluborgName + "'").append("<h4 data-id='" + announcement.cluborg.id + "+" + announcement.school + "'>" + announcement.title + "</h4><p>" + announcement.text + "</p><hr>");
                });
            }
        }
    });
}

function orderAnnouncements() {

}