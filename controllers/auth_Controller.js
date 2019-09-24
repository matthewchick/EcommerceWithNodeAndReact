const User = require('../models/userModel');
// https://medium.com/swlh/a-practical-guide-for-jwt-authentication-using-nodejs-and-express-d48369e7e6d4
const jwt = require('jsonwebtoken');        //generate signed token
const expressJwt = require('express-jwt');  //authorization check
const {errorHandler} = require('../helpers/dbErrorHandler');

// create the middleware for isAdmin and isAuth
exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id  //profile id and auth have the same id
    if (!user) {
        return res.status(403).json({
            error: "Access denied"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json ({
            error: 'Admin resource! Access denied'
        });
    }
    next();
};

exports.requireSignin = expressJwt({   // must have cookie-parser
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({ message: "Signout successfully"});
};

exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;    //object destructing
    // https://mongoosejs.com/docs/queries.html
    User.findOne({ email }, ( err, user ) => {
        if ( err || !user ) {
            return res.status(400).json({
                error: "User with that email does not exist. Please signup"
            });
        }
        // if user is found make sure the email and passord match
        // create authenticate method in user model
        if (!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and password do not match"
            });
        }

        // generate a signed token with user id and secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, {expire: new Date() + 9999})
        // return response with user and token to frontend client
        const {_id, name, email, role} = user     //user coming from database
        return res.json({token, user: {_id, name, email, role}})
    });
};

// It is used to solve the email taken problem
exports.signup = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists)
        return res.status(403).json({
            error: 'The Email is already used!'
        });
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({ message: 'Signup success! Please login.' });
};
// exports.signup = (req, res) => {
//     console.log("req.body", req.body);
//     const user = new User(req.body)
//     user.save((err, user) => {
//         if (err){
//             return res.status(400).json({
//                 err: errorHandler(err)
//             });
//         }
//         // do not show salt and password 
//         user.salt = undefined;
//         user.hashed_password = undefined;
//         res.json({
//             user
//         });
//     });
// };
