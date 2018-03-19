var express = require('express');
var router = express.Router({mergeParams: true});
var middleware = require('../middleware');
var School = require('../models/school');
var User = require("../models/user");
var Cluborg = require('../models/cluborg');
var Announcement = require('../models/announcement');
var Presentation = require('../models/presentation');

//index
router.get("/", middleware.isInSchool, function(req, res) {

});

//new
router.get("/new", middleware.isAdmin, function(req, res){

});

//create
router.post("/", middleware.isLoggedIn, function(req, res) {

});

//show
//runs the presentation
router.get("/:pres_id", middleware.isInSchool, function(req, res) {

});

//edit
router.get("/edit", middleware.isAdmin, function(req, res) {

});

//update
router.put("/:pres_id", middleware.isLoggedIn, function(req, res) {

});

//destroy
router.delete("/", middleware.isAdmin, function(req, res) {

});

module.exports = router;