/**
* User Controller
* @description The controller that is responsible of handling user's requests.
*/

var User = require('../models/User').User;

module.exports = {
    /**
     * A function to fetch all users
     * @param  {HTTP} req The request object
     * @param  {HTTP} res The response object
     */
    index: function(req, res) {
        /* get all users except the authenticated user */
        User.find({ _id: { $ne: req.user._id } }, function(err, users) {
            if (err) {
                res.status(500).json({
                    status: 'Failed',
                    message: 'Internal Server Error'
                });

                console.error(err);
                return;
            }

            /* return only the _id, the username, and the online status of the users found */
            var results = [];
            for(var i = 0; i < users.length; i++) {
                var current = users[i];

                results.push({
                    _id     : current._id,
                    username: current.username,
                    online  : current.online
                });
            }

            /* show online users before offline ones */
            results.sort(function(a, b) {
                return a.online ? -1 : 1;
            });

            res.status(200).json({
                status: 'Succeeded',
                users: results
            });
        });
    },
    /**
     * A function to update user's information in the database
     * @param  {HTTP} req The request object
     * @param  {HTTP} res The response object
     */
    update: function(req, res) {
        /* validating old_password input */
        req.checkBody('old_password', 'required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            res.status(400).json({
                status: 'Failed',
                errors: errors
            });

            return;
        }

        /* match the authenticated user's password with the provided one */
        if (req.user.validPassword(req.body.old_password)) {
            if (req.body.new_password) {
                req.user.password = req.body.new_password;
            }
            
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
                    status: 'Succeeded',
                    message: 'User updated successfully'
                });
            });
        }
        else {
            res.status(404).json({
                status: 'Failed',
                errors: [{
                    param: 'old_password',
                    msg  : 'invalid',
                    value: req.body.old_password
                }]
            });
        }
    }
};
