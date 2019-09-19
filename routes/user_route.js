const express = require('express');
const router = express.Router();
const { userById } = require('../controllers/user_Controller');   //destruct for functions
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth_Controller'); 

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res)=> {
    res.json({
        user: req.profile
    });
});
router.param('userId', userById);

module.exports = router;   // allow the other file to import