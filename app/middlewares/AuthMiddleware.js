module.exports = function(req, res, next) {
    var jwt = require('jsonwebtoken');
    var User = require('../models/User').User;

    var token = req.headers.authorization;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                res.status(403).json({
                    status: 'Failed',
                    message: 'Authentication Error, token not valid'
                });

                return;
            }

            var id = decoded.userId;
            User.findOne({ _id: id }, function(err, user) {
                if (err) {
                    res.status(500).json({
                        status: 'Failed',
                        message: 'Internal Server Error'
                    });

                    console.error(err);
                    return;
                }

                if (user) {
                    req.user = user;
                    next();
                }
                else {
                    res.status(403).json({
                        status: 'Failed',
                        message: 'Authentication Error, token not valid'
                    });
                }
            });
        });
    }
    else {
        res.status(403).json({
            status: 'Failed',
            message: 'Authentication Error, token not provided'
        });
    }
};
