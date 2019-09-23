const express = require('express');
const mongoose = require('mongoose');
// morgan is a middleware that allows us to easily log requests, errors, and more to the console.
const morgan = require('morgan');
// parsing middleware for incoming request
const bodyParser = require('body-parser');
// parsing cookies attached to the client request object
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

require('dotenv').config();

// import routes
const authRoutes = require('./routes/auth_route');
const userRoutes = require('./routes/user_route');
const categoryRoutes = require('./routes/category_route');
const productRoutes = require('./routes/product_route');

// app
const app = express();

// db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(()=> console.log('DB Connected'));

mongoose.connection.on("error", err => {
    //using template string in ES6
    console.log(`DB connection error: ${err.message}`);
}); 

// middlewares as php laravel
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

// routes middleware
app.use("/api", authRoutes);   //use middleware, router instead of the following codes like springBoot @restcontroller
app.use("/api", userRoutes); 
app.use("/api", categoryRoutes); 
app.use("/api", productRoutes); 

/*
app.get("/", (req, res) => {
    res.send("hello from node");
})*/

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`A nodejs server is listening on port: ${port}`)
});