var Message = require('../models/Message').Message;
var User = require('../models/User').User;

module.exports = {
    store: function(req, res) {
        req.checkBody('content', 'required').notEmpty();
        req.sanitizeBody('content').trim();

        req.checkBody('recipient', 'required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            res.status(400).json({
                status: 'Failed',
                errors: errors
            });

            return;
        }

        User.findById(req.body.recipient, function(err, user) {
            if (err) {
                res.status(500).json({
                    status: 'Failed',
                    message: 'Internal Server Error'
                });

                console.error(err);
                return;
            }

            if (user) {
                var message = new Message({
                    content: req.body.content,
                    sender: req.user._id,
                    recipient: req.body.recipient
                });

                message.save(function(err) {
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
                        message: 'Message Created Successfully'
                    });
                });
            }
            else {
                res.status(404).json({
                    status: 'Failed',
                    message: 'The requested route was not found.'
                });
            }
        });
    },
    update: function(req, res) {
        req.checkBody('sender', 'required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            res.status(400).json({
                status: 'Failed',
                errors: errors
            });

            return;
        }

        Message.update({ $and: [{ sender: req.body.sender }, { recipient: req.user._id }] }, { $set: { seen: true }}, { multi: true }, function(err) {
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
                message: 'Message Updated Successfully'
            });
        });
    },
    index: function(req, res) {
        Message.find({ $or: [{ sender: req.user._id }, { recipient: req.user._id }] }, function(err, messages) {
            if (err) {
                res.status(500).json({
                    status: 'Failed',
                    message: 'Internal Server Error'
                });

                console.error(err);
                return;
            }

            User.find({ _id: { $ne: req.user._id } }, function(err, users) {
                if (err) {
                    res.status(500).json({
                        status: 'Failed',
                        message: 'Internal Server Error'
                    });

                    console.error(err);
                    return;
                }

                var result = [];

                for (var i = 0; i < users.length; i++) {
                    var currentUser = users[i];
                    var currentMessages = [];

                    for (var j = 0; j < messages.length; j++) {
                        var currentMessage = messages[j];
                        if (currentMessage.sender.equals(currentUser._id) || currentMessage.recipient.equals(currentUser._id)) {
                            currentMessages.push(currentMessage);
                        }
                    }

                    currentMessages.sort(function(a, b) {
                        return a.created_at - b.created_at;
                    });

                    result.push({
                        _id: currentUser._id,
                        username: currentUser.username,
                        online: currentUser.online,
                        messages: currentMessages
                    });
                }

                result.sort(function(a, b) {
                    return a.online ? -1 : 1;
                });

                res.status(200).json({
                    status: 'Succeeded',
                    result: result
                });
            });
        });
    }
};
