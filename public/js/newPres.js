var previousHeight = 0;
var currentHeight = 0;
var i = 0;

addEvents();

function addEvents() {
    $(document).ready(function() {
        $(".search-results").css("width", $("form input").width() + (parseInt($("form input").css("border-left-width"), 10) * 2));
    });

    $(".search-results").on("click", "p label", function() {
        if ((i++ % 2 === 0)) {
            if (!$(this).children("input").prop("checked")) {
                $(".label-small").children("input").prop("checked", false);
                $("#all-cluborgs-pill").remove();
                $(".cluborg-list").append("<span class='cluborg-name-pill'>" + $(this).text() + " <i class='far fa-times-circle'></i></span>");
            } else {
                var searchResult = $(this).text();

                $(".cluborg-list").children().each(function() {
                    if ($(this).text() === searchResult + " ") {
                        $(this).remove();
                    }
                });
            }
        }
    });

    $("body").on("click", ".far.fa-times-circle", function() {
        var pillText = $(this).parent().text()
        if (pillText !== "All ") {
            $(".search-results p").children().each(function() {
                if ($(this).text() + " " === pillText) {
                    $(this).children("input").remove();
                }
            });
        } else {
            $(".label-small").children("input").prop("checked", false);
        }

        $(this).parent().remove();
    });

    $(".label-small").on("click", function() {
        if ($(this).children("input").prop("checked")) {
            $(".cluborg-list").empty();
            $(".cluborg-list").append("<span class='cluborg-name-pill' id='all-cluborgs-pill'>All <i class='far fa-times-circle'></i></span>");
        } else {
            $(".cluborg-list").empty();
            $(".search-results").empty();
        }
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
        $(".search-results").children("p").each(function() {
            $(this).addClass("no-display");
        });

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

                if (results.length !== 0) {
                    $(".search-results").append("<p><label><input type='checkbox' name='" + results[0]._id + "' value='" + results[0]._id + "'><span class='checkmark'></span>" +  results[0].name + "</label></p>");
                }

                // results.forEach(function(result) {
                //     cluborgNames.push(result.name);
                //     $(".search-results").append("<p><label><input type='checkbox' name='" + result._id + "' value='" + result._id + "'><span class='checkmark'></span>" +  result.name + "</label></p>");
                // });

                currentHeight = $(".search-results").height();

                $(".search-results").css("transform", "translateY(" + (-1 * (currentHeight - previousHeight)) + "px)");
            }
        });

        $(".search-results").removeClass("no-display");
        previousHeight = $(".search-results").height();
    }
}