$(".favorite").on("click", function() {
    $(this).toggleClass("far");
    $(this).toggleClass("fas");
    $(this).toggleClass("favorited");

    updateStatus($(this).hasClass("favorited"), $(this).attr("data-pres-id"));
});

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