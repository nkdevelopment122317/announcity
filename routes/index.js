var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
var School = require("../models/school");
var Cluborg = require("../models/cluborg");

router.get("/", function(req, res) {
    res.render("landing");
});

router.get("/home", middleware.isLoggedIn, function(req, res) {
    User.findById(req.user._id).populate("cluborgs").exec(function(err, user) {
        if (err) {
            req.flash("error", "Something went wrong");
        } else {
<<<<<<< HEAD
            console.log(user.cluborgs);
            res.render("home", {user: user, cluborgs: user.cluborgs});
=======
            console.log(user.school);
            res.render("home", {user: user});
>>>>>>> 3c25aa06352e79df03106ce3109c4a82004ed4c2
        }
    });
});

<<<<<<< HEAD
=======
router.get("/profile", middleware.isLoggedIn, function(req, res) {
    res.render("profile", {user: req.user});
});

>>>>>>> 3c25aa06352e79df03106ce3109c4a82004ed4c2
router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({
<<<<<<< HEAD
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    });

=======
        username: req.body.username, 
        firstName: req.body.firstName, 
        lastName: req.body.lastName,
        email: req.body.email
    });
        
>>>>>>> 3c25aa06352e79df03106ce3109c4a82004ed4c2
    //add to update profile
    // if (req.body.adminCode === "codjcxb4745") {
    //     newUser.isAdmin = true;
    // }
<<<<<<< HEAD

    // if (req.body.facultyCode === "idbrh4746") {
    //     newUser.isFaculty = true;
    // }

    // eval(require("locus"));

=======
        
    // if (req.body.facultyCode === "idbrh4746") {
    //     newUser.isFaculty = true;
    // }
        
    // eval(require("locus"));
        
>>>>>>> 3c25aa06352e79df03106ce3109c4a82004ed4c2
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
<<<<<<< HEAD

=======
            
>>>>>>> 3c25aa06352e79df03106ce3109c4a82004ed4c2
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

<<<<<<< HEAD
//join a club
=======
>>>>>>> 3c25aa06352e79df03106ce3109c4a82004ed4c2
router.put("/schools/:id/cluborgs/:club_id/join", middleware.isLoggedIn, function(req, res) {
    Cluborg.findById(req.params.club_id, function(err, cluborg) {
        if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("/schools/" + req.params.id + "/cluborgs/" + req.params.club_id);
        } else {
            cluborg.members.push(req.user);
            cluborg.save();
<<<<<<< HEAD

            req.user.cluborgs.push(cluborg);
            req.user.save();

            res.redirect("/home");
        }
    });
=======
            
            req.user.cluborgs.push(cluborg);
            req.user.save();
            
            res.redirect("/home");
        }
    }); 
>>>>>>> 3c25aa06352e79df03106ce3109c4a82004ed4c2
});

module.exports = router; //put this in EVERY single one of your routes file to get rid of router errors