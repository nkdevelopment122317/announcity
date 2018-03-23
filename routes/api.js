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
    console.log(req.user);
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
                    res.send("Adminstrator account verified.");
                } else {
                    res.send("Invalid code.");
                }
            }
        });
});

module.exports = router;