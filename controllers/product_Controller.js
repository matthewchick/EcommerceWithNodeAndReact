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
        let product = new Product(fields);

        if (files.photo){
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
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
