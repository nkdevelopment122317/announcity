var cluborgCount = 0;
var cluborgCode = "";
var cluborgName = "";

$(".fas.fa-plus-circle").on("click", function() {
	var runCode = true;

	cluborgCode = $(this).parent().children(".caption").children(".caption-top").data("code");
	cluborgName = $(this).parent().children(".caption").children(".caption-top").children("h3").text();

	$(".cluborg-list").children().each(function() {
		if (cluborgName === $(this).text().trim()) {
			runCode = false;
			return false;
		}
	});
	if (runCode) {
		$(".no-cluborgs").addClass("no-display");

		if (++cluborgCount === 1) {

			$(".cluborg-cart").css("bottom", "0");

			// $("#cluborg-list").append('<p class="cluborg-name-cart" data-code="' + cluborgCode + '">' + cluborgName + ' <i class="far fa-times-circle"></i></p>')
			$(".cluborg-list").prepend('<span class="cluborg-name-pill" data-code="' + cluborgCode +'">' + cluborgName + ' <i class="far fa-times-circle"></i></span>');

			$(this).removeClass("fas fa-plus-circle add-cluborg").addClass("fas fa-check").attr("id", "green-check");
		} else {

			// $("#cluborg-list").append('<p class="cluborg-name-cart" data-code="' + cluborgCode + '">' + cluborgName + ' <i class="far fa-times-circle"></i></p>')
			$(".cluborg-list").prepend('<span class="cluborg-name-pill" data-code="' + cluborgCode +'">' + cluborgName + ' <i class="far fa-times-circle"></i></span>');

			$(this).removeClass("fas fa-plus-circle add-cluborg").addClass("fas fa-check").attr("id", "green-check");
		}
	}
	
});

$("body").on("click", ".far.fa-times-circle", function() {
	var thisCode = $(this).parent().data("code");

	$(".fas.fa-check").each(function() {
		if (thisCode === $(this).parent().children(".caption").children(".caption-top").data("code")) {
			$(this).removeClass("fas fa-check").removeAttr("id", "green-check").addClass("fas fa-plus-circle add-cluborg");
		}
	});
	$(this).parent().remove();

	if ($(".cluborg-list").children().length === 0) {
		$(".cluborg-cart").css("bottom", "-50%");
	}
});

$("body").on("click", ".fas.fa-times-circle", function() {
	$(this).parent().css("bottom", "-50%");
	$(this).parent().children(".cluborg-list").empty();
	cluborgCount = 0;

	$(".fas.fa-check").each(function() {
		if ($(this).data("remove") == 1) {
			$(this).removeClass("fas fa-check").removeAttr("id", "green-check").addClass("fas fa-plus-circle add-cluborg");
		}
	});
});

$("#cluborg-cart-button").on("click", function() {
	var stringToSend = "_";
	$(".cluborg-list").children().each(function() {
		stringToSend += $(this).data("code") + "-";
	});

	$.ajax({
		url: "/api/user/student/add-cluborgs/" + stringToSend,
        type: "PUT",
        success: function(response) {
        	$(".cluborg-list").empty();
			cluborgCount = 0;

			$(".fas.fa-check").each(function() {
				$(this).removeClass("fas fa-check").removeAttr("id", "green-check").addClass("fas fa-plus-circle add-cluborg");
			});

			$(".material-button").html('<div class="loader loader-cart"></div>');

			setTimeout(function() {
				$(".material-button").html('Join Clubs');
				$(".cluborg-list").html('<p>Success! You will now be redirected.</p>');
			}, 750);

			setTimeout(function() {
				window.location.href = "/home";
			}, 1750);
        }
	});
});

$(".danger").on("click", function() {
	$(".modal").css("display", "block");
	var cluborgName = $(this).parent().parent().parent().parent().children(".caption-top").children("h3").text();
	$(".modal-message").html("Are you sure you want to leave <span data-code='" + $(this).parent().parent().parent().parent().children(".caption-top").data("code") + "'><strong>" + cluborgName + "</strong></span>?");
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
	var codeToSend = $(this).parent().parent().children(".modal-message").children("span").data("code");

	$.ajax({
		url: "/api/user/student/remove-cluborg/" + codeToSend,
		type: "PUT",
		success: function(response) {
			window.location.href = "/home";
		}
	});
});

$("#modal-button.green-button").on("click", function() {
	$(".modal").css("display", "none");
});