var express = require("express");
var router = express.Router();
var passport = require('passport');
var User = require("../models/user");
var middleware = require("../middleware");

router.get("/", function(req, res) {
    res.render("landing");
});

router.get("/home", middleware.isLoggedIn, function(req, res) {
   res.render("home");
});

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        
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