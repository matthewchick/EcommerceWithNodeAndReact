const mongoose = require('mongoose');

// define the schema
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength:32
        },
   
    }, 
    {timestamps: true}
);

//To use our schema definition, we need to convert our userSchema into a Model we can work with.
//https://mongoosejs.com/docs/guide.html
module.exports = mongoose.model("Category", categorySchema);   //var User = mongoose.model('Category', categorySchema)