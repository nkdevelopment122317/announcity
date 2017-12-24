var express = require('express');
var router = express.Router({mergeParams: true});
var middleware = require('../middleware');

var Cluborg = require('../models/cluborg.js');

//get
router.get("/", function(req, res) {
    Cluborg.find({}, function(err, allCluborgs) {
        if (err) {
            console.log(err);
        } else {
            res.render("cluborgs/index", {cluborgs: allCluborgs});
        }
    });
});

//new
router.get("/new", function(req, res) {
    res.render("cluborgs/new");
});

//create
router.post("/", middleware.isLoggedIn, function(req, res) {
    Cluborg.create(req.body.cluborg, middleware.isLoggedIn, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/schools/:id/cluborgs");
        }
    });
});

//show
router.get("/:club_id", function(req, res) {
    Cluborg.findById(req.params.club_id)
        .populate("members")
        .populate("announcements")
        .exec(function(err, foundCluborg) {
            if (err) {
                console.log(err);
            } else {
                res.render("cluborgs/show", {cluborg: foundCluborg});
            }
    });
});

//edit
router.get("/:club_id/edit", middleware.checkCluborgOwnership, function(req, res) {
    Cluborg.findById(req.params.club_id, function(err, foundCluborg) {
        if (err) {
            console.log(err);
        } else {
            res.render("cluborgs/edit", {cluborg: foundCluborg});
        }
    });   
});

//update
router.put("/:club_id", middleware.checkCluborgOwnership, function(req, res) {
    Cluborg.findByIdAndUpdate(req.params.club_id, req.body.cluborg, function(err, updatedCluborg) {
        if (err) {
            res.redirect("/schools/:id/cluborgs");
        } else {
            req.flash("success", "Successfully updated.");
            res.redirect("/schools/:id/cluborgs/" + req.params.club_id);
        }
    });
});

//destroy
router.delete("/:club_id", middleware.checkCluborgOwnership, function(req, res) {
    Cluborg.findByIdAndRemove(req.params.club_id, function(err) {
        if (err) {
            res.redirect("/schools/:id/cluborgs");
        } else {
            res.redirect("/schools/:id/cluborgs");
        }
    });    
});

module.exports = router; //put this in EVERY single one of your routes file to get rid of router errors