// Create express router
const express = require('express');
const router = express.Router();
const { create, categoryById, getCategory, removeCategory, updateCategory, listCategories } = require('../controllers/category_Controller');   //destruct for functions
const { userSignupValidator } = require('../validator/validator');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth_Controller'); 
const { userById } = require('../controllers/user_Controller');  

// set the routes to the function inside the controller like php laravel or spring Boot getParam()
router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, create);  
router.get("/category/:categoryId", getCategory);  //use categoryID to get the category
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, removeCategory);
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, updateCategory);
router.get('/categories', listCategories);

router.param('userId', userById);
router.param('categoryId', categoryById);

module.exports = router;   // allow the other file to import