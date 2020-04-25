const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const randomString = require('randomstring');
require('dotenv').config();

const User = require('../models/user');

var client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


router.post('/signup', (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User created',
                        result: result
                    })
                })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/verify', (req, res, next) => {

    client.verify.services(process.env.TWILIO_AUTH_SERVICE_SID)
        .verifications
        .create({to: '+12106835672', channel: 'sms'})
        .then(verification => {
        if (!verification) {
            return res.status(404).json({
                messasge: '🍋 Something went wrong. Messasge not deleivered'
            })
        }
        
        console.log(verification.sid);
        res.status(200).json({
            message: '🕴 Success!',
            verification: verification
        })

        });
});

router.post('/login', (req, res, next) => {
    let fetchedUser;

    // find user in DB
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: '🐬 Auth failed'
                });
            } 
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: '🌓 Auth failed',
                    error: err
                })
            }
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                'this_is_my_secret',
                { expiresIn: '1h' }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            })
        })
        .catch(err => {
            return res.status(401).json({
                message:  '🍿 Auth failed',
                error: err
            })
        })
});


module.exports = router;