var User = require('../models/User').User;

module.exports = {
    index: function(req, res) {
        User.find({ _id: { $ne: req.user._id } }, function(err, users) {
            if (err) {
                res.status(500).json({
                    status: 'Failed',
                    message: 'Internal Server Error'
                });

                console.error(err);
                return;
            }

            var results = [];
            for(var i = 0; i < users.length; i++) {
                var current = users[i];

                results.push({
                    _id     : current._id,
                    username: current.username,
                    online  : current.online
                });
            }

            results.sort(function(a, b) {
                return a.online ? -1 : 1;
            });

            res.status(200).json({
                status: 'Succeeded',
                users: results
            });
        });
    },
    update: function(req, res) {
        req.checkBody('old_password', 'required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            res.status(400).json({
                status: 'Failed',
                errors: errors
            });

            return;
        }

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
