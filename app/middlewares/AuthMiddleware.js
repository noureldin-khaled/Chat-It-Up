/**
 * This middleware is responsible for authenticating the user requesting the route.
 * @param  {HTTP}     req  The request object
 * @param  {HTTP}     res  The response object
 * @param  {Function} next The next function of Javascript
 */
module.exports = function(req, res, next) {
    var jwt = require('jsonwebtoken');
    var User = require('../models/User').User;

    /* getting the token from the request headers */
    var token = req.headers.authorization;

    if (token) {
        /* validating the token */
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                /* token is not valid */
                res.status(403).json({
                    status: 'Failed',
                    message: 'Authentication Error, token not valid'
                });

                return;
            }

            /* check that the token belongs to a user in the database */
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
                    /* token is valid, allow the user to continue */
                    req.user = user;
                    next();
                }
                else {
                    /* token doesn't belong to anyone in the database */
                    res.status(403).json({
                        status: 'Failed',
                        message: 'Authentication Error, token not valid'
                    });
                }
            });
        });
    }
    else {
        /* token is not provided */
        res.status(403).json({
            status: 'Failed',
            message: 'Authentication Error, token not provided'
        });
    }
};
