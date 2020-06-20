var express = require('express');
var router = express.Router();
var homeController = require('../controllers/homeController');

router.get('/home', homeController.renderHomePage);

module.exports = router;
