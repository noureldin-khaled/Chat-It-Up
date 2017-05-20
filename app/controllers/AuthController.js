var User = require('../models/User').User;

module.exports = {
    register: function(req, res) {
        req.checkBody('username', 'required').notEmpty();
        req.sanitizeBody('username').trim();

        req.checkBody('password', 'required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            res.status(400).json({
                status: 'Failed',
                errors: errors
            });

            return;
        }

        var user = new User({
            username: req.body.username,
            password: req.body.password
        });

        user.save(function(err) {
            if (err) {
                if (err.code == 11000) {
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
    login: function(req, res) {
        req.checkBody('username', 'required').notEmpty();
        req.sanitizeBody('username').trim();

        req.checkBody('password', 'required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            res.status(400).json({
                status: 'Failed',
                errors: errors
            });

            return;
        }

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
                if (user.validPassword(req.body.password)) {
                    if (user.online) {
                        res.status(403).json({
                            status: 'Failed',
                            message: 'The user is already logged in'
                        });
                        
                        return;
                    }

                    var jwt = require('jsonwebtoken');
                    var token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                        expiresIn: 60*60*24
                    });

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
    logout: function(req, res) {
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
