var express = require('express');
var mongoose = require('mongoose');
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

router.put("/cluborgs/:id/updateStatus/:status", function(req, res) {
    User.findById(req.user._id, function(err, user) {
        if (err) {
            res.send("failure");
        } else {
            Cluborg.findById(req.params.id, function(err, cluborg) {
                if (err) {
                    res.send("failure");
                } else {
                    if (req.params.status === "favorite") {
                        user.favoriteCluborgs.push(cluborg);
                        user.save();
                    } else if (req.params.status === "unfavorite") {
                        var i = user.favoriteCluborgs.indexOf(cluborg._id);

                        while (i > -1) {
                            user.favoriteCluborgs.splice(i, 1);
                            user.save();
                            i = user.favoriteCluborgs.indexOf(cluborg._id);
                        }
                    }
                }
            });
        }
    });
});

//returns all cluborg data at a school
router.get("/cluborgs/get", function(req, res) {
    Cluborg.find({}, function(err, cluborgs) {
        res.send(cluborgs);
    });
});

router.get("/cluborgs/:id/get", function(req, res) {
    Cluborg.findById(req.params.id)
        .populate("announcements")
        .exec(function(err, cluborg) {
            if (err) {
                req.flash("error", err);
                res.redirect("back");
            } else {
                res.send(cluborg);
            }
        });
});

router.get("/cluborgs/:name/get", function(req, res) {
    console.log("hi");
    Cluborg.findOne({"name": toTitleCase(req.name.replace("_", " "))}).lean().exec(function(err, cluborg) {
        return res.end(JSON.stringify(cluborg));
    });
});

router.get("/presentations/:id/get", function(req, res) {
    Presentation.findById(req.params.id)
        .populate("cluborgs")
        .exec(function(err, presentation) {
            if (err) {
                req.flash("error", err);
                res.redirect("back");
            } else {
                res.send(presentation);
            }
        });
});

router.get("/announcements/get", function(req, res) {
    Announcement.find({}, function(err, announcements) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        } else {
            res.send(announcements);
        }
    });
});

router.put("/user/student/add-cluborgs/:codes", function(req, res) {
    var codes = req.params.codes.trim().replace("_", "");
    var codesArray = codes.split("-");
    codesArray.splice(codesArray.length - 1, 1);

    for (var i in codesArray) {
        Cluborg.find({"_id": codesArray[i].toString()}, function(err, cluborg) {
            if (err) {
                console.log(err);
                res.send("failure");
                return;
            } else {
                console.log(cluborg);
                req.user.cluborgs.push(cluborg[0]);
                req.user.save();
            }
        });  
    }
    res.send("success");
});

router.put("/user/student/remove-cluborg/:code", function(req, res) {
    User.findById(req.user._id, function(err, user) {
        if (err) {
            console.log(err);
            res.send("failure");
        } else {
            user.cluborgs.splice(user.cluborgs.indexOf(req.params.code), 1);
            user.save();

            if (user.favoriteCluborgs.indexOf(req.params.code) !== -1) {
                user.favoriteCluborgs.splice(user.favoriteCluborgs.indexOf(req.params.code), 1);
                user.save();
            }

            res.send("success");
        }
    });
});

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

module.exports = router;