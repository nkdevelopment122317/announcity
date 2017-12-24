var express = require('express');
var Announcement = require('../models/announcement');
var Cluborg = require('../models/cluborg');
var middleware = require('../middleware');
var router = express.Router({mergeParams: true});

//new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Cluborg.findById(req.params.club_id, function(err, cluborg) {
        if (err) {
            console.log(err);
        } else {
            res.render("announcements/new", {cluborg: cluborg});
        }
    });
});

//create
router.post("/", middleware.isLoggedIn, function(req, res) {
    Cluborg.findById(req.params.club_id, function(err, cluborg) {
        if (err) {
            console.log(err);
            res.redirect("/schools/" + req.params.id + "/cluborgs" + req.params.club_id);
        } else {
            Announcement.create(req.body.announcement, function(err, announcement) {
                if (err) {
                    req.flash("error", "Something went wrong");
                } else {
                    announcement.author.id = req.user._id;
                    announcement.author.username = req.user.username;
                    announcement.save();
                    
                    cluborg.announcements.push(announcement);
                    cluborg.save();
                    
                    req.flash("success", "Successfully created announcement");
                    res.redirect("/schools/" + req.params.id + "/announcements");
                }
            });
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
            req.flash("error", "Something went wrong");
            res.redirect("schools/" + req.params.id + "/announcements");
        } else {
            req.flash("success", "Announcement successfully updated.");
            res.redirect("/schools/" + req.params.id + "/announcements/" + req.params.ann_id);
        }
    });    
});

//destroy
router.delete("/:ann_id", middleware.checkAnnouncementOwnership, function(req, res) {
    Announcement.findByIdAndRemove(req.params.ann_id, function(err) {
        if (err) {
            res.redirect("/schools/" + req.params.id + "/announcements");
        } else {
            res.redirect("/schools/" + req.params.id + "/announcements");
        }
    });
});

module.exports = router; //put this in EVERY single one of your routes file to get rid of router errors