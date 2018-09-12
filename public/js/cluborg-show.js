$(document).ready(function() {
    addEvents();
});

function addEvents() {
    $(document).on("click", ".favorite", function() {
        $(this).toggleClass("far");
        $(this).toggleClass("fas");
        $(this).toggleClass("favorited");

        updateCluborgStatus($(this).hasClass("favorited"), $(this).data("cluborg-id"));
    });

    $(".danger").on("click", function() {
        $(".modal").css("display", "block");
        var cluborgName = $(this).parent().parent().parent().parent().children("h1").text();
        $(".modal-message").html("Are you sure you want to leave <span data-code='" + $("#myModal").data("code") + "'><strong>" + cluborgName + "</strong></span>?");
    });

    $(".close").on("click", function() {
        $(".modal").css("display", "none");
    });

    window.onclick = function(event) {
        if (event.target == document.getElementById('myModal')) {
            $(".modal").css("display", "none");
        }
    }

    $("#modal-button.red-button").on("click", function() {
        if ($(this).parent().parent().children(".modal-message").text() === "Are you sure you want to delete this announcement?") {
            var codeToSend = $(this).parent().parent().children(".modal-message").data("code");

            $.ajax({
                url: "/api/announcement/" + codeToSend + "/delete",
                type: "DELETE",
                success: function(response) {
                    if (response === "success") {
                        
                    }
                }
            });
        } else {
            var codeToSend = $(this).parent().parent().children(".modal-message").children("span").data("code");

            $.ajax({
                url: "/api/user/student/remove-cluborg/" + codeToSend,
                type: "PUT",
                success: function(response) {
                    window.location.href = "/home";
                }
            });
        }
    });

    $("#modal-button.green-button").on("click", function() {
        $(".modal").css("display", "none");
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

    $(".announcement-danger").on("click", function() {
        $(".modal").css("display", "block");
        var announcementID = $(".panel-body").data("code");
        $(".modal-message").html("Are you sure you want to delete this announcement?");
        $(".modal-message").data("code", announcementID);
    });
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