var express = require('express');
var router = express.Router({mergeParams: true});
var middleware = require('../middleware');
var School = require('../models/school');
var User = require("../models/user");
var Cluborg = require('../models/cluborg');
var Announcement = require('../models/announcement');
var Presentation = require('../models/presentation');

//index
router.get("/", function(req, res) {
    var showAccountTypeMessage = false;

    Cluborg.find({}, function(err, allCluborgs) {
        if (err) {
            console.log(err);
        } else {
            if (req.user.confirmationTolerance === 1) {
                showAccountTypeMessage = true;
                req.user.confirmationTolerance += 1;
                req.user.save();
            } else {
                showAccountTypeMessage = false;
                req.user.confirmationTolerance += 1;
                req.user.save();
            }

            Presentation.find({})
                .populate("cluborgs")
                .exec(function(err, presentations) {
                    if (err) {
                        console.log(err);
                    } else {
                        
                        res.render("cluborgs/index", {cluborgs: allCluborgs, school_id: req.params.id, showAccountTypeMessage: showAccountTypeMessage, presentations: presentations});
                    }
            });
        }
    });
});

//new
router.get("/new", middleware.isAdminOrAdvisor, function(req, res) {
    School.findById(req.params.id, function(err, school) {
        if (err) {
            req.flash("error", "School not found");
            res.redirect("/home");
        } else {
            res.render("cluborgs/new", {school_id: req.params.id});
        }
    });
});

//create
router.post("/", middleware.isAdminOrAdvisor, function(req, res) {
    School.findById(req.params.id, function(err, school) {
        if (err) {
            req.flash("error", "School not found");
            res.redirect("/home");
        } else {
            Cluborg.create(req.body.cluborg, function(err, cluborg) {
                if (err) {
                    console.log(err);
                    req.flash("error", "Something went wrong");
                    res.redirect("/schools/" + req.params.id + "/cluborgs");
                } else {
                    cluborg.author.id = req.user._id;
                    cluborg.author.username = req.user.username;
                    cluborg.save();

                    school.cluborgs.push(cluborg);
                    school.save();

                    cluborg.school = school;
                    cluborg.save();

                    req.flash("success", "Successfully created club");
                    res.redirect("/schools/" + req.params.id + "/cluborgs/" + cluborg._id);
                }
            });
        }
    });
});

//show
router.get("/:club_id", middleware.isLoggedIn, function(req, res) {
    var ownsClub = false;
    var isInClub = false;

    Cluborg.findById(req.params.club_id)
        .populate("members")
        .populate("announcements")
        .exec(function(err, foundCluborg) {
            if (err) {
                req.flash("error", "Something went wrong");
                res.redirect("/schools/" + req.params.id + "/cluborgs/new");
            } else {
                if (req.user._id.equals(foundCluborg.author.id)) {
                    ownsClub = true;
                } else {
                    while (!isInClub) {
                        foundCluborg.members.forEach(function(member) {
                            if (member._id.equals(req.user._id)) {
                                isInClub = true;
                            }
                        });
                        break;
                    }
                    console.log(3);
                }
                console.log(ownsClub);
                console.log(isInClub);
                res.render("cluborgs/show", {cluborg: foundCluborg, school_id: req.params.id, ownsClub: ownsClub, isInClub: isInClub});
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
    // Cluborg.findByIdAndRemove(req.params.club_id, function(err) {
    //     if (err) {
    //         res.redirect("/schools/" + req.params.id + "/cluborgs");
    //     } else {
    //         res.redirect("/schools/" + req.params.id + "/cluborgs");
    //     }
    // });

    Cluborg.findById(req.params.club_id)
        .populate("announcements")
        .exec(function(err, cluborg) {
            cluborg.announcements.forEach(function(announcement) {
                Announcement.findByIdAndRemove(announcement._id, function(err) {
                    if (err) {
                        res.redirect("/schools/" + req.params.id + "/cluborgs");
                    } else {
                        // nada
                    }
                })
            });

            Cluborg.findByIdAndRemove(req.params.club_id, function(err) {
                if (err) {
                    res.redirect("/schools/" + req.params.id + "/cluborgs");
                } else {
                    res.redirect("/schools/" + req.params.id + "/cluborgs");
                }
            });
    });
});

//join a club
router.put("/:club_id/join", middleware.isInSchool, function(req, res) {
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