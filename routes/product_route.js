// Create express router
const express = require('express');
const router = express.Router();
const { create, productById, getProduct, removeProduct, updateProduct, listProducts, listRelated } = require('../controllers/product_Controller');   //destruct for functions
const { userSignupValidator } = require('../validator/validator');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth_Controller'); 
const { userById } = require('../controllers/user_Controller');  

// set the routes to the function inside the controller like php laravel or spring Boot getParam()
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);  //use userID to create product
router.get("/product/:productId", getProduct);  //use productID to get the product
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, removeProduct);
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, updateProduct);
router.get('/products', listProducts);
router.get('/products/related/:productId', listRelated);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;   // allow the other file to import