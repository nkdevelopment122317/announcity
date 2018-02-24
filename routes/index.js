var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
var School = require("../models/school");
var Cluborg = require("../models/cluborg");
var request = require("request");

router.get("/", function(req, res) {
    res.render("landing");
});

router.get("/home", middleware.isLoggedIn, function(req, res) {
    User.findById(req.user._id)
    .populate("cluborgs")
    .populate("school")
    .exec(function(err, user) {
        if (err) {
            req.flash("error", "Something went wrong");
        } else {
            user.cluborgs.forEach(function(cluborg) {
                Cluborg.findById(cluborg._id).populate("school").exec(function(err, cluborg) {
                    if (err) {
                        req.flash("error", "Something went wrong");
                    } else {
                        // ***populate***
                    }
                });
            });
            res.render("home", {user: user, cluborgs: user.cluborgs});
        }
    });
});

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });
    console.log(1);
    //add to update profile
    // if (req.body.adminCode === "codjcxb4745") {
    //     newUser.isAdmin = true;
    // }

    // if (req.body.facultyCode === "idbrh4746") {
    //     newUser.isFaculty = true;
    // }

    // eval(require("locus"));


    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
            console.log(2);
        }
        console.log(3);

        passport.authenticate("local")(req, res, function() {
            console.log(4);
            res.redirect("/register/results");
        });
    });
});

router.get("/register/results", function(req, res) {
    console.log(5);
    var schoolName = req.body.schoolName;
    var state = req.body.state;
    console.log(state);
    console.log(schoolName);
    console.log(6);

    var url = "https://api.schooldigger.com/v1.1/schools?st=" + state + "&q=" + schoolName + "&appID=c55a0c06&appKey=ade9eeaa9708f525d57b4e5cde3056a2";
    console.log(7);
    request(url, function(error, response, body) {
        console.log(8);
        if (!error && response.statusCode == 200) {
            console.log(9);
            var data = JSON.parse(body);
            console.log(10);
            res.render("schools/results", {data: data});
            console.log(11);
        } else {
            console.log(response.statusCode);
            console.log(14);
            console.log(error);
        }
        console.log(12);
    });
    console.log(13);
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    successFlash: "Successfully logged in",
    failureFlash: true
}), function(req, res, next) {
    //nada
});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

//join a club
router.put("/schools/:id/cluborgs/:club_id/join", middleware.isLoggedIn, function(req, res) {
    Cluborg.findById(req.params.club_id, function(err, cluborg) {
        if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("/schools/" + req.params.id + "/cluborgs/" + req.params.club_id);
        } else {
            cluborg.members.push(req.user);
            cluborg.save();

            req.user.cluborgs.push(cluborg);
            req.user.save();

            res.redirect("/home");
        }
    });
});

module.exports = router; //put this in EVERY single one of your routes file to get rid of router errors