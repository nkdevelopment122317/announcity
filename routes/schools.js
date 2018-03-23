var express = require('express');
var router = express.Router();
var School = require('../models/school');
var Cluborg = require ('../models/cluborg');
var middleware = require('../middleware');
var Announcement = require('../models/announcement');

//index
router.get("/", function(req, res) {
    School.find({}, function(err, allSchools) {
        if (err) {
            console.log(err);
        } else {
            res.render("schools/index", {schools: allSchools});
        }
    });
});

//new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("schools/new");
});

//create
router.post("/", middleware.isLoggedIn, function(req, res) {
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    var school = {
        name: req.body.school.name,
        location: req.body.school.location,
        author: author,
        schoolCode: req.body.school.code,
        advisorCode: generateCode(),
        adminCode: generateCode()
    };

    School.create(school, function(err, newlyCreated) {
        if (err) {
            console.log(err);
            console.log(newlyCreated);
            req.flash("error", "Something went wrong");
            res.redirect("/schools");
        } else {
            req.flash("success", "Successfully created " + newlyCreated.name);
            res.redirect("/schools");
        }
    });
});

//show
router.get("/:id", middleware.isLoggedIn, function(req, res) {
    School.findById(req.params.id)
        .populate("cluborgs")
        .exec(function(err, foundSchool) {
            if (err) {
                console.log(err);
            } else {
                res.render("schools/show", {school: foundSchool});
            }
    });
});

//edit
router.get("/:id/edit", middleware.checkSchoolOwnership, function(req, res) {
    School.findById(req.params.id, function(err, foundSchool) {
        if (err) {
            console.log(err);
        } else {
            res.render("schools/edit", {school: foundSchool});
        }
    });
});

//update
router.put("/:id", middleware.checkSchoolOwnership, function(req, res) {
    School.findByIdAndUpdate(req.params.id, req.body.school, function(err, updatedSchool) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Successfully updated school.");
            res.redirect("/schools/" + req.params.id);
        }
    });
});

//destroy
router.delete("/:id", middleware.checkSchoolOwnership, function(req, res) {
    var schoolName = "";

    School.findById(req.params.id)
        .populate("cluborgs")
        .exec(function(err, foundSchool) {
            if (err) {
                req.flash("error", "Something went wrong");
            } else {
                schoolName = foundSchool.name;
                foundSchool.cluborgs.forEach(function(cluborg) {
                    Cluborg.findById(cluborg._id)
                        .populate("announcements")
                        .exec(function(err, cluborg) {
                            cluborg.announcements.forEach(function(announcement) {
                                Announcement.findByIdAndRemove(announcement._id, function(err) {
                                    if (err) {
                                        res.redirect("/schools");
                                    } else {
                                        Cluborg.findByIdAndRemove(cluborg._id, function(err) {
                                            if (err) {
                                                res.redirect("/schools/" + req.params.id + "/cluborgs");
                                            } else {
                                                // nada
                                            }
                                        });
                                    }
                                });
                            });
                    });
                });

                School.findByIdAndRemove(req.params.id, function(err) {
                    if (err) {
                        res.redirect("/schools");
                    } else {
                        req.flash("success", schoolName + " and all its associated data have been deleted");
                        res.redirect("/schools");
                    }
                });
            }
        });

    // School.findByIdAndRemove(req.params.id, function(err) {
    //     if (err) {
    //         res.redirect("/schools");
    //     } else {
    //         req.flash("success", schoolName + " and all its associated data have been deleted");
    //         res.redirect("/schools");
    //     }
    // });


});

//join
router.put("/:id/join", middleware.isLoggedIn, function(req, res) {
    School.findById(req.params.id, function(err, foundSchool) {
        if (err) {
            req.flash("error", "Something went wrong");
        } else {
            foundSchool.members.push(req.user);
            foundSchool.save();

            req.user.school = foundSchool;
            req.user.save();

            req.flash("success", "You have successfully joined " + foundSchool.name);
            res.redirect("/schools/" + req.params.id + "/cluborgs");
        }
    });
});

function generateCode() {
    var code = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 7; i++) {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return code;
}

module.exports = router; //put this in EVERY single one of your routes file to get rid of router errors