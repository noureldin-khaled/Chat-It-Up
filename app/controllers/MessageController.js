/**
* Message Controller
* @description The controller that is responsible of handling requests dealing with messages.
*/

var Message = require('../models/Message').Message;
var User = require('../models/User').User;

module.exports = {
    /**
     * A function to store a message
     * @param  {HTTP} req The request object
     * @param  {HTTP} res The response object
     */
    store: function(req, res) {
        /* validating content input */
        req.checkBody('content', 'required').notEmpty();
        req.sanitizeBody('content').trim();

        /* validating recipient input */
        req.checkBody('recipient', 'required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            res.status(400).json({
                status: 'Failed',
                errors: errors
            });

            return;
        }

        /* check that the recipient exists in the database */
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
                /* create message instance */
                var message = new Message({
                    content: req.body.content,
                    sender: req.user._id,
                    recipient: req.body.recipient
                });

                /* save message instance */
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
                /* recipient doesn't exist */
                res.status(404).json({
                    status: 'Failed',
                    message: 'The requested route was not found.'
                });
            }
        });
    },
    /**
     * A function to mark messages from a certain user a seen
     * @param  {HTTP} req The request object
     * @param  {HTTP} res The response object
     */
    update: function(req, res) {
        /* validating sender input */
        req.checkBody('sender', 'required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            res.status(400).json({
                status: 'Failed',
                errors: errors
            });

            return;
        }

        /* mark messages from the sender to the authenticated user as seen */
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
    /**
     * A function to get all messages for the authenticated user
     * @param  {HTTP} req The request object
     * @param  {HTTP} res The response object
     */
    index: function(req, res) {
        /* fetch messages if the authenticated user is a sender or a recipient */
        Message.find({ $or: [{ sender: req.user._id }, { recipient: req.user._id }] }, function(err, messages) {
            if (err) {
                res.status(500).json({
                    status: 'Failed',
                    message: 'Internal Server Error'
                });

                console.error(err);
                return;
            }

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

                /* group every user with the messages between that user and the authenticated user */
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

                    /* sort messages by creation time */
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
