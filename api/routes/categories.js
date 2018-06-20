const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Category = require('../models/category');

router.get('/', (req, res, next) => {
    Category.find()
        .select('-__v')
        .exec()
        .then(categories => {
            res.status(200).json(categories);
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Category.findById(id)
        .select('-__v')
        .exec()
        .then(category => {
            if (category) {
                res.status(200).json(category);
            } else {
                res.status(404).json({
                    error: 'Category Not Found'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
});

router.post('/', (req, res, next) => {
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description
    });

    category.save()
        .then(savedCategory => {
            res.status(201).json(savedCategory);
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

router.put('/:id', (req, res, next) => {
    const id = req.params.id;
    Category.update({ _id: id }, { $set: req.body })
        .then(() => {
            res.status(200).send();
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Category.findOneAndRemove({ _id: id })
        .exec()
        .then(category => {
            res.status(200).json(category);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

module.exports = router;