var express = require('express');
var middleware = require('../middleware');
var School = require('../models/school');
var User = require("../models/user");
var Cluborg = require('../models/cluborg');
var Announcement = require('../models/announcement');
var Presentation = require('../models/presentation');
var router = express.Router({mergeParams: true});

//index
router.get("/", middleware.isAdmin, function(req, res) {
    Presentation.find({})
        .populate("cluborgs")
        .exec(function(err, presentations) {
            res.render("presentations/index", {presentations: presentations});
        });
});

//new
router.get("/new", middleware.isAdmin, function(req, res) {
    res.render("presentations/new");
});

//create
router.post("/", middleware.isAdmin, function(req, res) {
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    var presentation = {
        author: author,
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
    };

    Presentation.create(presentation, function(err, newlyCreated) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        } else {
            School.findById(req.params.id, function(err, school) {
                if (err) {
                    req.flash("error", err);
                    res.redirect("back");
                } else {
                    school.presentations.push(newlyCreated);
                    school.save();

                    if (req.body.allCluborgs) {
                        newlyCreated.linkAllClubs = true;
                        newlyCreated.save();

                        Cluborg.find({}, function(err, foundCluborgs) {
                            if (err) {
                                req.flash("error", err);
                                res.redirect("back");
                            } else {
                                foundCluborgs.forEach(function(cluborg) {
                                    newlyCreated.cluborgs.push(cluborg);
                                });

                                newlyCreated.save(); //OUTSIDE OF LOOP
                            }
                        });
                    } else {
                        console.log(req.body);
                        Cluborg.find({}, function(err, cluborgs) {
                            if (err) {
                                req.flash("error", err);
                                res.redirect("back");
                            } else {
                                cluborgs.forEach(function(cluborg) {
                                    if (req.body[cluborg._id] != undefined) {
                                        newlyCreated.cluborgs.push(cluborg);
                                    }
                                });

                                newlyCreated.save(); //OUTSIDE OF LOOP
                            }
                        });
                    }

                    req.flash("success", "Successfully created");
                    res.redirect("/schools/" + school._id + "/presentations");
                }
            });
        }
    });
});

//show: runs the presentation
router.get("/:pres_id", middleware.isAdmin, function(req, res) {
    Presentation.findById(req.params.pres_id, function(err, presentation) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        } else {
            res.render("presentations/show", {presentation: presentation});
        }
    });
});

//plays the presentation
router.get("/:pres_id/play", middleware.isAdmin, function(req, res) {
    Presentation.findById(req.params.pres_id, function(err, presentation) {
        if (err) {
            req.flash("error", err)
            res.redirect("back");
        } else {
            res.render("presentations/play", {presentation: presentation});
        }
    });
});

//edit
router.get("/:pres_id/edit", middleware.isAdmin, function(req, res) {
    Presentation.findById(req.params.pres_id)
        .populate("cluborgs")
        .exec(function(err, presentation) {
            if (err) {
                req.flash("error", err)
                res.redirect("back");
            } else {
                res.render("presentations/edit", {presentation: presentation});
            }
        });
});

//update
router.put("/:pres_id", middleware.isAdmin, function(req, res) {
    Presentation.findById(req.params.pres_id, function(err, presentation) {
        if (err) {
            req.flash("eror", err);
            res.redirect("back");
        } else {
            presentation.name = req.body.name;
            presentation.save();

            presentation.description = req.body.description;
            presentation.save();

            presentation.image = req.body.image;
            presentation.save();

            presentation.cluborgs = [];

            School.findById(req.params.id, function(err, school) {
                if (err) {
                    req.flash("error", err);
                    res.redirect("back");
                } else {
                    school.presentations.push(presentation);
                    school.save();

                    if (req.body.allCluborgs) {
                        presentation.linkAllClubs = true;
                        presentation.save();

                        Cluborg.find({}, function(err, foundCluborgs) {
                            if (err) {
                                req.flash("error", err);
                                res.redirect("back");
                            } else {
                                foundCluborgs.forEach(function(cluborg) {
                                    presentation.cluborgs.push(cluborg);
                                });

                                presentation.save(); //OUTSIDE OF LOOP
                            }
                        });
                    } else {
                        presentation.linkAllClubs = false;
                        presentation.save();

                        Cluborg.find({}, function(err, cluborgs) {
                            if (err) {
                                req.flash("error", err);
                                res.redirect("back");
                            } else {
                                cluborgs.forEach(function(cluborg) {
                                    if (req.body[cluborg._id] != undefined) {
                                        presentation.cluborgs.push(cluborg);
                                    }
                                });

                                presentation.save(); //OUTSIDE OF LOOP
                            }
                        });
                    }
                }
            });

            req.flash("success", "Presentation saved");
            res.redirect("/schools/" + req.user.school + "/presentations");
        }
    });
});

//destroy
router.delete("/:pres_id", middleware.isAdmin, function(req, res) {
    School.findById(req.user.school, function(err, school) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        } else {
            var index = school.presentations.indexOf(req.params.pres_id);
            school.presentations.splice(index, 1);
            school.save();

            Presentation.findByIdAndRemove(req.params.pres_id, function(err) {
                if (err) {
                    req.flash("error", err);
                    res.redirect("back");
                } else {
                    req.flash("success", "Presentation deleted");
                    res.redirect("/schools/" + req.user.school + "/presentations");
                }
            })
        }
    })
});

module.exports = router;