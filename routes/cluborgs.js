var express = require('express');
var router = express.Router({mergeParams: true});
var middleware = require('../middleware');
var School = require('../models/school');
var User = require("../models/user");

var Cluborg = require('../models/cluborg');

//index
router.get("/", function(req, res) {
    // Cluborg.find({}, function(err, allCluborgs) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.render("cluborgs/index", {cluborgs: allCluborgs, school_id: req.params.id});
    //     }
    // });
    
    School.findById(req.params.id).populate("cluborgs").exec(function(err, school) { //populate() gets the cluborgs from its ids and attaches them to the school
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/schools/" + school._id);
        } else {
            User.findById(req.user._id).populate("cluborgs").exec(function(err, user) {
                if (err) {
                    req.flash("error", "Something went wrong");
                } else {
                    res.render("cluborgs/index", {userCluborgs: user.cluborgs, schoolCluborgs: school.cluborgs, school_id: req.params.id, user: user});
                }
            });
        }
    });
});

//new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    School.findById(req.params.id, function(err, school) {
        if (err) {
            req.flash("error", "Club not found");
            res.redirect("/schools/" + req.params.id + "/cluborgs");
        } else {
            res.render("cluborgs/new", {school_id: req.params.id});
        }
    });
});

//create
router.post("/", middleware.isLoggedIn, function(req, res) {
    School.findById(req.params.id).populate("cluborgs").exec(function(err, school) {
        if (err) {
            req.flash("error", "School not found");
            res.redirect("/schools/" + req.params.id + "/cluborgs");
        } else {
            var author = {
                id: req.user._id,
                username: req.user.username
            };
            
            var newCluborg = {
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                author: author
            };
            
            Cluborg.create(newCluborg, middleware.isLoggedIn, function(err, cluborg) {
                if (err) {
                    console.log(err);
                    req.flash("error", "Something went wrong");
                    res.redirect("/schools/" + req.params.id + "/cluborgs");
                } else {
                    school.cluborgs.push(cluborg);
                    school.save();
                    
                    req.flash("success", "Successfully created club");
                    res.redirect("/schools/" + req.params.id + "/cluborgs/" + cluborg._id);
                }
            });
        }
    });
});

//show
router.get("/:club_id", middleware.isLoggedIn, function(req, res) {
    Cluborg.findById(req.params.club_id)
        .populate("members")
        .populate("announcements")
        .exec(function(err, foundCluborg) {
            if (err) {
                console.log(err);
            } else {
                res.render("cluborgs/show", {cluborg: foundCluborg, school_id: req.params.id});
            }
    });
});

//edit
router.get("/:club_id/edit", middleware.checkCluborgOwnership, function(req, res) {
    Cluborg.findById(req.params.club_id, function(err, foundCluborg) {
        if (err) {
            console.log(err);
        } else {
            res.render("cluborgs/edit", {school_id: req.params.id, cluborg: foundCluborg});
        }
    });   
});

//update
router.put("/:club_id", middleware.checkCluborgOwnership, function(req, res) {
    Cluborg.findByIdAndUpdate(req.params.club_id, req.body.cluborg, function(err, updatedCluborg) {
        if (err) {
            res.redirect("/schools/" + req.params.id + "/cluborgs");
        } else {
            req.flash("success", "Successfully updated.");
            res.redirect("/schools/" + req.params.id + "/cluborgs/" + req.params.club_id);
        }
    });
});

//destroy
router.delete("/:club_id", middleware.checkCluborgOwnership, function(req, res) {
    Cluborg.findByIdAndRemove(req.params.club_id, function(err) {
        if (err) {
            res.redirect("/schools/" + req.params.id + "/cluborgs");
        } else {
            res.redirect("/schools/" + req.params.id + "/cluborgs");
        }
    });    
});

module.exports = router; //put this in EVERY single one of your routes file to get rid of router errors