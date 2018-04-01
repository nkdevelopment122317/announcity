var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
var School = require("../models/school");
var Cluborg = require("../models/cluborg");
var Announcement = require("../models/announcement");
var Presentation = require("../models/presentation");
var request = require("request");

router.get("/", function(req, res) {
    res.render("landing");
});

router.get("/home", middleware.isLoggedIn, function(req, res) {
    User.findById(req.user._id)
        .populate("cluborgs")
        .populate("school")
        .populate("announcements")
        .exec(function(err, user) {
            if (err) {
                req.flash("error", "Something went wrong");
            } else {
                user.cluborgs.forEach(function(cluborg) {
                    Cluborg.findById(cluborg._id)
                        .populate("school")
                        .populate("announcement")
                        .exec(function(err, cluborg) {
                            if (err) {
                                req.flash("error", "Something went wrong");
                            } else {
                                // ***populate***
                            }
                        });
                });

                School.find({}, function(err, schools) {
                    if (err) {
                        req.flash("error", "Something went wrong");
                    } else {
                        user.announcements.forEach(function(announcement) {
                            Announcement.findById(announcement._id)
                                .populate("cluborg")
                                .exec(function(err, announcement) {
                                    if (err) {
                                        req.flash("error", "Something went wrong");
                                    } else {
                                        // ***populate***
                                    }
                                });
                        });
                        if (req.user.isAdmin) {
                            Presentation.find({"school": req.user.school._id}, function(err, presentations) {
                                if (err) {
                                    req.flash("error", err);
                                    res.redirect("back");
                                } else {
                                    res.render("home", {user: user, cluborgs: user.cluborgs, schools: schools, announcements: user.announcements, presentations: presentations});
                                }
                            });
                        } else {
                            res.render("home", {user: user, cluborgs: user.cluborgs, schools: schools, announcements: user.announcements});
                        }
                    }
                });
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
            var index = err.toString().indexOf(": ");
            req.flash("error", err.toString().substring(index + 2));
            return res.render("register");
        }

        School.find({"name": "Steinert High School"}, function(err, school) {
            user.school = school;
            user.save();
            console.log(user);
        });

        passport.authenticate("local")(req, res, function() {
            res.redirect("/home");
        });
    });
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

module.exports = router; //put this in EVERY single one of your routes file to get rid of router errors