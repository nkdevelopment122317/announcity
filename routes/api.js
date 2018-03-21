var express = require('express');
var router = express.Router({mergeParams: true});
var middleware = require('../middleware');
var School = require('../models/school');
var User = require("../models/user");
var Cluborg = require('../models/cluborg');
var Announcement = require('../models/announcement');
var Presentation = require('../models/presentation');