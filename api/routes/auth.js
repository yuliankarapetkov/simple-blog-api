const express = require('express');
const router = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (error, hash) => {
       if (error) {
           res.status(500).json({
               error: error
           });
       } else {
           User.find({ email: req.body.email })
               .exec()
               .then(users => {
                   if (users.length > 0) {
                       res.status(409).json({
                           error: 'Email already exists'
                       });
                   } else {
                       const user = new User({
                           _id: new mongoose.Types.ObjectId(),
                           email: req.body.email,
                           password: hash
                       });

                       return user.save();
                   }
               })
               .then(user => {
                   res.status(201).json({
                       _id: user._id,
                       email: user.email
                   });
               })
               .catch(error => {
                   res.status(500).json({
                       error: error
                   });
               })
       }
    });
});

router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (!user) {
                res.status(401).json({
                    error: 'Auth Failed'
                });
            } else {
                bcrypt.compare(req.body.password, user.password, (error, result) => {
                   if (error || !result) {
                       res.status(401).json({
                           error: 'Auth Failed'
                       });
                   } else {
                       const token = jwt.sign(
                       {
                           _id: user._id,
                           email: user.email
                       },
                       process.env.JWT_KEY,
                       {
                           expiresIn: '1h'
                       });

                       res.status(200).json(token);
                   }
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        })
});

module.exports = router;