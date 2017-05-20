/**
* Auth Controller
* @description The controller that is responsible of handling requests that deals with authentication.
*/

var User = require('../models/User').User;

module.exports = {
    /**
     * A function to register the user
     * @param  {HTTP} req The request object
     * @param  {HTTP} res The response object
     */
    register: function(req, res) {
        /* validate username input */
        req.checkBody('username', 'required').notEmpty();
        req.sanitizeBody('username').trim();

        /* validate password input */
        req.checkBody('password', 'required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            res.status(400).json({
                status: 'Failed',
                errors: errors
            });

            return;
        }

        /* create user instance */
        var user = new User({
            username: req.body.username,
            password: req.body.password
        });

        /* save the user instance */
        user.save(function(err) {
            if (err) {
                if (err.code == 11000) {
                    /* the user entered an already taken username */
                    res.status(400).json({
                        status: 'Failed',
                        errors: [{
                            param: 'username',
                            msg  : 'unique violation',
                            value: req.body.username
                        }]
                    });
                }
                else {
                    res.status(500).json({
                        status: 'Failed',
                        message: 'Internal Server Error'
                    });

                    console.error(err);
                }

                return;
            }

            res.status(200).json({
                status: 'Succeeded',
                message: 'User Created Successfully'
            });
        });
    },
    /**
     * A function to login the user
     * @param  {HTTP} req The request object
     * @param  {HTTP} res The response object
     */
    login: function(req, res) {
        /* validate username input */
        req.checkBody('username', 'required').notEmpty();
        req.sanitizeBody('username').trim();

        /* validate password input */
        req.checkBody('password', 'required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            res.status(400).json({
                status: 'Failed',
                errors: errors
            });

            return;
        }

        /* find a user with the provided username */
        User.findOne({ username: req.body.username }, function(err, user) {
            if (err) {
                res.status(500).json({
                    status: 'Failed',
                    message: 'Internal Server Error'
                });

                console.error(err);
                return;
            }

            if (!user) {
                res.status(404).json({
                    status: 'Failed',
                    message: 'The requested route was not found'
                });
            }
            else {
                /* match the found user's password with the provided password  */
                if (user.validPassword(req.body.password)) {
                    if (user.online) {
                        res.status(403).json({
                            status: 'Failed',
                            message: 'The user is already logged in'
                        });

                        return;
                    }

                    /* create an authentication token */
                    var jwt = require('jsonwebtoken');
                    var token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

                    /* update the online status of the user */
                    user.online = true;
                    user.save(function(err) {
                        if (err) {
                            res.status(500).json({
                                status: 'Failed',
                                message: 'Internal Server Error'
                            });

                            console.error(err);
                            return;
                        }

                        res.status(200).json({
                            status: 'Succeeded',
                            user: {
                                _id: user._id,
                                username: user.username,
                                token: token
                            }
                        });
                    });
                }
                else {
                    res.status(404).json({
                        status: 'Failed',
                        message: 'The requested route was not found'
                    });
                }
            }
        });
    },
    /**
     * A function to logout the user
     * @param  {HTTP} req The request object
     * @param  {HTTP} res The response object
     */
    logout: function(req, res) {
        /* update the online status of the user */
        req.user.online = false;
        req.user.save(function(err) {
            if (err) {
                res.status(500).json({
                    status: 'Failed',
                    message: 'Internal Server Error'
                });

                console.error(err);
                return;
            }

            res.status(200).json({
                status: 'Succeeded'
            });
        });
    }
};
