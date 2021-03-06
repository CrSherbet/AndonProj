const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const User = require('../../models/User');

//register new user
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
  
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({ username: req.body.username })
    .then(user => {
        if(user){
            errors.username = 'This Username already exists';
            return res.status(400).json(errors);
        } else {
            const newUser = new User({
                username: req.body.username,
                password: req.body.password,
                gitURL: req.body.gitURL,
                imgURL: req.body.imgURL
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err,hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err))
                })
            })
        }
    })
});

//Login
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username })
        .then(user => {
            if(!user) {
                errors.username = 'Username not found'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        const payload = {id: user.id, username: user.username, gitURL: user.gitURL, imgURL: user.imgURL }
                        jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600 }, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token 
                            });
                        });
                    } else {
                        errors.password = 'Password incorrect'
                        return res.status(400).json(errors);
                    }
                });
        });
});


//Check current user
router.get('/current', passport.authenticate('jwt', {session: false}), 
(req, res) => {
    res.json({
        id: req.user.id,
        username: req.user.username,
        gitURL: req.user.gitURL
    });
});

router.get('/test', (req, res) => {
    return res.json("hi")
})


module.exports = router;
