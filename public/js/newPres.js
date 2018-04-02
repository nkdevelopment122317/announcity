$("body").css("background", "#109cef");

var previousHeight = 0;
var currentHeight = 0;

addEvents();

function addEvents() {
    $(document).ready(function() {
        $(".search-results").css("width", $("form input").width() + (parseInt($("form input").css("border-left-width"), 10) * 2));
    });

    $(".search-results p input").on("click", function() {
        console.log(34);
        $(".cluborg-list").append("<span class='cluborg-name-pill'>" + $(this).text() + "</span>");
    });

    $("#search").keypress(function() {
        updateSearchResults();
    });

    $("#search").keydown(function(e) {
        if (e.keyCode === 8) {
            updateSearchResults();
        }
    });
}

function updateSearchResults() {
    if ($("#search").val() === "") {
        $(".search-results").addClass("no-display");
    } else {
        $(".search-results").empty();

        var cluborgNames = [];

        var options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "name"
            ]
        };

        $.ajax({
            url: "/api/cluborgs/get",
            type: "GET",
            success: function(cluborgs) {

                var fuse = new Fuse(cluborgs, options);

                var results = fuse.search($("#search").val());

                results.forEach(function(result) {
                    cluborgNames.push(result.name);
                    $(".search-results").append("<p><label><input type='checkbox'><span class='checkmark' value='" + result._id + "'></span>" +  result.name + "</label></p>");
                });

                currentHeight = $(".search-results").height();

                $(".search-results").css("transform", "translateY(" + (-1 * (currentHeight - previousHeight)) + "px)");
            }
        });

        $(".search-results").removeClass("no-display");
        previousHeight = $(".search-results").height();
    }
}