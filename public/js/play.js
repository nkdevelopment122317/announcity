$(".navbar-fixed-top").addClass("no-display");
$("body").css("margin-top", "0");
$("body").css("background", "#2a5d4e");
$("body").css("color", "#ffffff");
$(".flash-container").addClass("no-display");

grabAnnouncements();

$(".carousel-indicators li").on("mouseover", function() {
    // do later
});

function grabAnnouncements() {
    $(".no").addClass("no-display");

    var presID = $("#pres-carousel-container").data("pres");

    $.ajax({
        url: "/api/presentations/" + presID + "/get",
        type: "GET",
        success: function(presentation) {


            // $(".container").removeClass("no-display");
            var i = 0;

            presentation.cluborgs.forEach(function(cluborg) {
                $.ajax({
                    url: "/api/cluborgs/" + cluborg._id + "/get",
                    type: "GET",
                    success: function(cluborg) {
                        cluborg.announcements.forEach(function(announcement) {
                            if (i == 0) {
                                $(".carousel-indicators").append("<li data-target='#pres-carousel' data-slide-to='0' class='active'></li>");
                                $(".carousel-inner").append("<div class='item active'><h1>" + cluborg.name  + "</h1><h3>" + announcement.title  + "</h3><h4>" + announcement.text  + "</h4></div>");
                            } else {
                                $(".carousel-indicators").append("<li data-target='#pres-carousel' data-slide-to='" + i + "'></li>");
                                $(".carousel-inner").append("<div class='item'><h1>" + cluborg.name  + "</h1><h3>" + announcement.title  + "</h3><h4>" + announcement.text  + "</h4></div>");
                            }

                            i++;
                        });
                        $(".no").append(JSON.stringify(cluborg.name));
                    }
                });
            });

            $(".no").removeClass("no-display");

            setTimeout(function() {
                $(".wrapper-full").addClass("no-display");
            }, 1000);

            $("#pres-carousel-container").removeClass("no-display");

        }
    })
}