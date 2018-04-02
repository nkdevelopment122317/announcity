var express = require('express');
var router = express.Router({mergeParams: true});
var middleware = require('../middleware');
var School = require('../models/school');
var User = require("../models/user");
var Cluborg = require('../models/cluborg');
var Announcement = require('../models/announcement');
var Presentation = require('../models/presentation');

router.get("/", middleware.isLoggedIn, function(req, res) {
    Announcement.find({}).lean().exec(function(err, announcements) {
        return res.end(JSON.stringify(announcements));
    });
});

//gets the code from the user and confirms account type
router.put("/accountType/:code/confirm", function(req, res) {
    User.findById(req.user._id)
        .populate("school")
        .exec(function(err, user) {
            if (err) {
                res.send(err);
            } else {
                if (req.params.code === "student") {
                    user.isStudent = true;
                    user.isFaculty = false;
                    user.isAdmin = false;
                    user.save();
                } else if (req.params.code === user.school.advisorCode) {
                    user.isStudent = false;
                    user.isFaculty = true;
                    user.isAdmin = false;
                    user.save();
                    res.send("Club Advisor account verified.");
                } else if (req.params.code === user.school.adminCode) {
                    user.isStudent = false;
                    user.isFaculty = false;
                    user.isAdmin = true;
                    user.save();
                    res.send("Administrator account verified.");
                } else {
                    res.send("Invalid code.");
                }
            }
        });
});

router.put("/presentations/:id/updateStatus/:status", function(req, res) {
    Presentation.findById(req.params.id, function(err, presentation) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        } else {
            if (req.params.status === "favorite") {
                presentation.favorite = true;
                presentation.save();
                res.send("Presentation favorited");
            } else if (req.params.status === "unfavorite") {
                presentation.favorite = false;
                presentation.save();
                res.send("Presentation unfavorited");
            }
        }
    });
});

//returns all cluborg data at a school
router.get("/cluborgs/get", function(req, res) {
    Cluborg.find({}, function(err, cluborgs) {
        res.send(cluborgs);
    });
});

module.exports = router;