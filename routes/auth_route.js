// Create express router
const express = require('express');
const router = express.Router();
const { signup, signin, signout, requireSignin } = require('../controllers/auth_Controller');   //destruct for functions
const { userSignupValidator } = require('../validator/validator');

// set the routes to the function inside the controller like php laravel or spring Boot getParam()
router.post("/signup", userSignupValidator, signup);  
// Use JWT for sign in  
router.post("/signin", signin);
// Clear the cookie
router.get("/signout", signout);

// for testing purpose how to use middleware for requireSignin
// router.get("/hello", requireSignin, (req, res) => {
//     res.send("hello there");
// })

module.exports = router;   // allow the other file to import