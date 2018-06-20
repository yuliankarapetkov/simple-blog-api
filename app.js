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

// Routing Config
app.use('/categories', categoriesRoute);
app.use('/articles', articlesRoute);

module.exports = app;