var express = require('express');
var router = express.Router();
var School = require('../models/school');
var middleware = require('../middleware');

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
        code: req.body.school.code
    };
    
    console.log(school);
    
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
            res.render("schools/edit", {schools: foundSchool});
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
    School.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/schools");
        } else {
            res.redirect("/schools");
        }
    });
});

module.exports = router; //put this in EVERY single one of your routes file to get rid of router errors