const express = require('express');
const app = express();

// Dependencies
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Routes
const categoriesRoute = require('./api/routes/categories');
const articlesRoute = require('./api/routes/articles');

// Mongoose Config
mongoose.connect(`mongodb://admin:${process.env.MONGO_ATLAS_PW}@simple-blog-shard-00-00-mjjjq.mongodb.net:27017,simple-blog-shard-00-01-mjjjq.mongodb.net:27017,simple-blog-shard-00-02-mjjjq.mongodb.net:27017/test?ssl=true&replicaSet=simple-blog-shard-0&authSource=admin&retryWrites=true`);
mongoose.Promise = global.Promise; // avoid deprecation warning

// Config
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

// Routing Config
app.use('/categories', categoriesRoute);
app.use('/articles', articlesRoute);

// If none of the above routes match
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// Global Error Handling
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    });
});

module.exports = app;