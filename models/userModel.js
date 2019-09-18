const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

// define the schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength:32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique:32
    },
    hashed_password: {
        type: String,
        required: true
    },
    about: {
        type: String,
        trim: true,
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    }, 
    history: {
        type: Array,
        default: []
    }
    }, 
    {timestamps: true}
);

// virtual field - virtual properties don't get persisted in the database
// https://futurestud.io/tutorials/understanding-virtuals-in-mongoose
userSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = uuidv1()
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})

//instance method
userSchema.methods = {
    authenticate: function(plainText) {
        // === is a strict equality operator - have the same type and value
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex')
        } catch(err){
            return "";
        }
    }
}

//To use our schema definition, we need to convert our userSchema into a Model we can work with.
//https://mongoosejs.com/docs/guide.html
module.exports = mongoose.model("User", userSchema);   //var User = mongoose.model('User', userschema)