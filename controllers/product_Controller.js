const formidable = require('formidable');    //file upload
const _ = require('lodash');                 //Lodash contains tools to simplify programming with strings, numbers, arrays, functions and objects.
const fs = require('fs');
const Product = require('../models/productModel');
const {errorHandler} = require('../helpers/dbErrorHandler');

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
