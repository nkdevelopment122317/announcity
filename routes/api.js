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
    console.log(req.params.code);
    res.send("You are a club advisor or an administrator.");
});

module.exports = router;