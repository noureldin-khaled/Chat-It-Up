/**
 * A controller for the main.html partial
 */
App.controller('MainCtrl', function(UserSrv, $interval, $location, $cookies) {
    var self = this;

    self.user = UserSrv.getUser();
    var recipients = [];
    self.selected = -1;
    self.displayMessages = [];
    self.users = [];
    self.message = "";

    /* function to logout the user */
    self.logout = function() {
        UserSrv.logout().then(function(res) {
            $cookies.remove('auth');
            $location.url('/login');
        }, function(err) {
            console.log(err);
        });
    };

    /* function to get the messages of the selected user */
    var getNewDisplayMessages = function() {
        var res = [];
        for (var i = 0; i < recipients.length; i++) {
            var current = recipients[i];
            if (current._id == self.selected) {
                res = current.messages;
                break;
            }
        }

        return res;
    };

    /* function to handle clicking on a user from the users list */
    self.choose = function(user) {
        self.selected = user._id;
        self.displayMessages = getNewDisplayMessages();
    };

    /* function to send a message to the backend using UserSrv */
    self.sendMessage = function() {
        if (self.message) {
            var message = self.message;
            self.message = "";

            UserSrv.send(message, self.selected).then(function(res) {

            }, function(err) {
                console.log(err);
            });
        }
    };

    /* function to count the number of unseen messages in a chat log */
    var countUnseen = function(i) {
        var unseen = 0;
        for (var j = 0; j < recipients[i].messages.length; j++) {
            var currentMessage = recipients[i].messages[j];
            if (currentMessage.recipient == self.user._id && currentMessage.seen === false) {
                unseen++;
            }
        }

        return unseen;
    };

    /* function to check if the list of users has been modified in the backend */
    var usersModified = function() {
        if (recipients.length != self.users.length) return true;
        for (var i = 0; i < recipients.length; i++) {
            if (!(recipients[i]._id == self.users[i]._id && recipients[i].username == self.users[i].username && recipients[i].online == self.users[i].online)) {
                return true;
            }

            var unseen = countUnseen(i);
            if (unseen != self.users[i].unseen) {
                return true;
            }
        }

        return false;
    };

    /* function to check if the messages have been modified in the backend */
    var messagesModified = function(messages) {
        if (messages.length != self.displayMessages.length) return true;
        for (var i = 0; i < messages.length; i++) {
            if (!(messages[i]._id == self.displayMessages[i]._id && messages[i].content == self.displayMessages[i].content && messages[i].sender == self.displayMessages[i].sender && messages[i].recipient == self.displayMessages[i].recipient && messages[i].seen == self.displayMessages[i].seen)) {
                return true;
            }
        }

        return false;
    };

    /* function to check if there are any unseen messages for the selected user */
    var hasUnseenMessages = function() {
        var idx = -1;
        for (var i = 0; i < self.users.length && idx == -1; i++) {
            if (self.users[i]._id == self.selected) {
                idx = i;
            }
        }

        if (idx == -1) {
            return false;
        }
        else {
            return self.users[idx].unseen > 0;
        }
    };

    /* fetch the messages with the corresponding users */
    UserSrv.getMessages().then(function(res) {
        recipients = res.data.result;
        if (usersModified()) {
            console.log('users modified');
            self.users = [];
            for (var i = 0; i < recipients.length; i++) {
                var unseen = countUnseen(i);
                self.users.push({
                    _id: recipients[i]._id,
                    username: recipients[i].username,
                    online: recipients[i].online,
                    unseen: unseen
                });
            }
        }
    }, function(err) {
        console.log(err);
    });

    /* every 500ms, fetch the messages with the corresponding users */
    $interval(function() {
        UserSrv.getMessages().then(function(res) {
            recipients = res.data.result;
            if (usersModified()) {
                console.log('users modified');
                self.users = [];
                for (var i = 0; i < recipients.length; i++) {
                    var unseen = 0;
                    for (var j = 0; j < recipients[i].messages.length; j++) {
                        var currentMessage = recipients[i].messages[j];
                        if (currentMessage.recipient == self.user._id && currentMessage.seen === false) {
                            unseen++;
                        }
                    }

                    self.users.push({
                        _id: recipients[i]._id,
                        username: recipients[i].username,
                        online: recipients[i].online,
                        unseen: unseen
                    });
                }
            }

            var messages = getNewDisplayMessages();
            if (messagesModified(messages)) {
                console.log('messages modified');
                self.displayMessages = messages;
            }

            if (hasUnseenMessages()) {
                console.log('updating seen');
                UserSrv.updateMessages(self.selected);
            }
        }, function(err) {
            console.log(err);
        });
    }, 500);

    /* handle the user closing the tab/browser */
    window.onbeforeunload = function () {
        if (UserSrv.getUser()) {
            UserSrv.logoutSync();
        }
    };
});
