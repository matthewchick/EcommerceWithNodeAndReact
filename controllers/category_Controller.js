const Category = require('../models/categoryModel');
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: "Category not found"
            });
        }
        req.category = category;
        next();
    })
};

exports.getCategory = (req, res) => {
    return res.json(req.category);
};

exports.updateCategory = (req, res) => {
    const category = req.category
    category.name = req.body.name
    
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

exports.removeCategory = (req, res) => {
    const category = req.category;
    category.remove((err, deletedCategory) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        
        res.json({
            //deletedCategory,
            message: "Category deleted successfully"
        });
    });
};

exports.listCategories = (req, res) => {
    Category.find().exec((err, category) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            category
        });
    })
};

exports.create = (req, res) => {
    console.log("req.body", req.body);        //from postman
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
