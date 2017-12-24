var middlewareObj = {};
var Announcement = require('../models/announcement');
var Cluborg = require('../models/cluborg');

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    
    res.redirect("login");
};

middlewareObj.checkAnnouncementOwnership = function(req, res, next) {
     //authorization (permissions)

    //is the user logged in?
    if (req.isAuthenticated()) {
        Announcement.findById(req.params.ann_id, function(err, foundAnnouncement) {
            if (err) {
                req.flash("error", "Announcement Not Found");
                res.redirect("/schools/:id/announcements");
            } else {
                //does the user own the campground?
                if (foundAnnouncement.author.id.equals(req.user._id)) { //use the equals() method because you can't triple equals an object id and a number
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back"); //takes the user back to the previous page they were on
    } 
};

middlewareObj.checkCluborgOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Cluborg.findById(req.params.club_id, function(err, foundCluborg) {
            if (err) {
                req.flash("error", "Club not found");
                res.redirect("/schools/:id/cluborgs");
            } else {
                if (foundCluborg.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

module.exports = middlewareObj;