var express = require('express');
var router = express.Router();
var School = require('../models/school');
var middleware = require('../middleware');

module.exports = router; //put this in EVERY single one of your routes file to get rid of router errors