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
    Presentation.find({}, function(err, presentations) {
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
router.get(":/pres_id/play", middleware.isAdmin, function(req, res) {
    Presentation.findById(req.params.pres_id, function(err, presentation) {
        if (err) {
            req.flash("error", err);
            res.redirect("back");
        } else {
            res.render("presentations/play", {presentation: presentation});
        }
    });
});

//edit
router.get("/:pres_id/edit", middleware.isAdmin, function(req, res) {
    Presentation.findById(req.params.pres_id, function(err, presentation) {
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

            Presentation.findByIdAndRemove(req.parans.pres_id, function(err) {
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