// Create express router
const express = require('express');
const router = express.Router();
const { create } = require('../controllers/product_Controller');   //destruct for functions
const { userSignupValidator } = require('../validator/validator');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth_Controller'); 
const { userById } = require('../controllers/user_Controller');  

// set the routes to the function inside the controller like php laravel or spring Boot getParam()
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);  

router.param('userId', userById);

module.exports = router;   // allow the other file to import