const formidable = require('formidable');    //file upload
const _ = require('lodash');                 //Lodash contains tools to simplify programming with strings, numbers, arrays, functions and objects.
const fs = require('fs');
const Product = require('../models/productModel');
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "Product not found"
            });
        }
        req.product = product;
        next();
    })
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined;  // do not get photo
    return res.json(req.product);
};

exports.removeProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            // show deleted product info
            deletedProduct,
            message: "Product deleted successfully"
        });
    });
};

exports.updateProduct = (req, res) => {
    console.log("req.body", req.body);
    let form = new formidable.IncomingForm();    //
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err){
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        // check for all fields
        const {name, description, price, category, quantity, shipping} = fields
        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }
        let product = req.product;             //for update
        product = _.extend(product, fields);   //combine object product, fields into an object
        if (files.photo){
            console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save((err, result)=> {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }            
            res.json({
                result
            });
        });
    });
};

exports.create = (req, res) => {
    console.log("req.body", req.body);
    let form = new formidable.IncomingForm();    //
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err){
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        // check for all fields
        const {name, description, price, category, quantity, shipping} = fields

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }
        let product = new Product(fields);


        if (files.photo){
            console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result)=> {
            if (err){
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            
            res.json({
                result
            });
        });
    });

};

/* sell / arrival
   by sell = /products?sortBy=sold&order=desc&limit=4
   by arrival = /products?sortBy=createdAt&order=desc&limit=4
   if no params are sent, then all products are returned
*/

exports.listProducts = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    Product.find()
        .select("-photo")
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                products
            });
        })
};