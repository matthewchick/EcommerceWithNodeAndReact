// Create express router
const express = require('express');
const router = express.Router();
const { create } = require('../controllers/category_Controller');   //destruct for functions
const { userSignupValidator } = require('../validator/validator');

// set the routes to the function inside the controller like php laravel or spring Boot getParam()
router.post("/category/create", create);  


module.exports = router;   // allow the other file to import