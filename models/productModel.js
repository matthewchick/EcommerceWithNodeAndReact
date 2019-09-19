const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;     //build relationship between product and category

// define the schema
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        description: {
            type: String,
            trim: true,
            required: true,
            maxlength: 200
        },
        price: {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32
        },
        category: {
            type: ObjectId,
            ref: 'Category',
            required: true
        },
        quantity: {
            type: Number,
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        shipping: {
            required: false,
            type: Boolean
        }
    }, 
    {timestamps: true}
);

//To use our schema definition, we need to convert our userSchema into a Model we can work with.
//https://mongoosejs.com/docs/guide.html
module.exports = mongoose.model("Product", productSchema);   //var User = mongoose.model('Product', productSchema)