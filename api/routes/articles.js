const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Category = require('../models/category');
const Article = require('../models/article');

router.get('/', (req, res, next) => {
    Article.find()
        .select('-__v')
        .exec()
        .then(articles => {
            res.status(200).json(articles);
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    Article.findById(id)
        .select('-__v')
        .exec()
        .then(article => {
            if (article) {
                res.status(200).json(article);
            } else {
                res.status(404).json({
                    error: 'Article Not Found'
                });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.post('/', (req, res, next) => {
    const categoryid = req.body.categoryId;

    Category.findById(categoryid)
        .exec()
        .then(category => {
            if (category) {
                const article = new Article({
                    _id: new mongoose.Types.ObjectId(),
                    title: req.body.title,
                    content: req.body.content,
                    category: categoryid
                });

                return article.save();
            } else {
                return res.status(404).json({
                    error: 'Category Not Found'
                });
            }
        })
        .then(article => {
            res.status(201).json(article);
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

router.put('/:id', (req, res, next) => {
    const id = req.params.id;

    Article.update({ _id: id }, { $set: req.body })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;

    Article.findOneAndRemove({ _id: id })
        .exec()
        .then(article => {
            if (article) {
                res.status(200).json(article);
            } else {
                res.status(404).json({
                    error: 'Article Not Found'
                });
            }
        })
        .catch(error => {
            res.status(404).json({
                error: error
            });
        });
});

module.exports = router;