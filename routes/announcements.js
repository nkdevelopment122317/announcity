var express = require('express');
var Announcement = require('../models/announcement');
var middleware = require('../middleware');
var router = express.Router();

//index
router.get("/", function(req, res) {
    Announcement.find({}, function(err, allAnnouncements) {
        if (err) {
            console.log(err);
        } else {
            res.render("announcements/index", {announcements: allAnnouncements});
        }
    });
});

//new
router.get("/new", function(req, res) {
    res.render("announcements/new") ;
});

//create
router.post("/", middleware.isLoggedIn, function(req, res) {
    var date = req.body.date;
    var title = req.body.title;
    var text = req.body.text;
    var cluborg = req.body.cluborg;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newAnnouncement = {
        author:author, 
        date:date, 
        title:title, 
        text:text,
        cluborg:cluborg
    };
    
    Announcement.create(newAnnouncement, function(err, newlyCreatedAnnouncement) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/schools/:id/announcements");
        }
    });
});

//show
router.get("/:ann_id", function(req, res) {
    Announcement.findById(req.params.ann_id, function(err, foundAnnouncement) {
         if (err) {
             console.log(err);
         } else {
             res.render("announcements/show", {announcement: foundAnnouncement});
         }
    });
});

//edit
router.get("/:ann_id/edit", middleware.checkAnnouncementOwnership, function(req, res) {
    Announcement.findById(req.params.ann_id, function(err, foundAnnouncement) {
        if (err) {
            console.log(err);
        } else {
            res.render("announcements/edit", {announcement: foundAnnouncement});
        }
    });
});

//update
router.put("/:ann_id", middleware.checkAnnouncementOwnership, function(req, res) {
    Announcement.findByIdAndUpdate(req.params.ann_id, req.body.announcement, function(err, updatedCampground) {
        if (err) {
            res.redirect("schools/:id/announcements");
        } else {
            req.flash("success", "Announcement successfully updated.");
            res.redirect("/schools/:id/announcements/" + req.params.ann_id);
        }
    });    
});

//destroy
router.delete("/:ann_id", middleware.checkAnnouncementOwnership, function(req, res) {
    Announcement.findByIdAndRemove(req.params.ann_id, function(err) {
        if (err) {
            res.redirect("/schools/:id/announcements");
        } else {
            res.redirect("/schools/:id/announcements");
        }
    });
});

module.exports = router; //put this in EVERY single one of your routes file to get rid of router errors