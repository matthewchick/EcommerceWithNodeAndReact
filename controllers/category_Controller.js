const User = require('../models/categoryModel');
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    console.log("req.body", req.body);
    const category = new Category(req.body)
    
    category.save((err, data) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        
        res.json({
            data
        });
    });
};