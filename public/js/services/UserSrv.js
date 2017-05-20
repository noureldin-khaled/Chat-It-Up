/**
 * A service to handle user requests
 */
App.factory('UserSrv', function($http) {
    return {
        register: function(user) {
            return $http({
                method: 'POST',
                url: '/api/register',
                data: user
            });
        },
        login: function(user) {
            return $http({
                method: 'POST',
                url: '/api/login',
                data: user
            });
        },
        getMessages: function(user) {
            return $http({
                method: 'GET',
                url: '/api/message',
                headers: {
                    Authorization: this.user.token
                }
            });
        },
        logout: function() {
            return $http({
                method: 'GET',
                url: '/api/logout',
                headers: {
                    Authorization: this.user.token
                }
            });
        },
        logoutSync: function() {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "/api/logout", false);
            xmlhttp.setRequestHeader("Authorization", this.user.token);
            xmlhttp.send(null);
        },
        send: function(message, recipient) {
            return $http({
                method: 'POST',
                url: '/api/message',
                headers: {
                    Authorization: this.user.token
                },
                data: {
                    content: message,
                    recipient: recipient
                }
            });
        },
        updateMessages: function(sender) {
            return $http({
                method: 'PUT',
                url: '/api/message',
                headers: {
                    Authorization: this.user.token
                },
                data: {
                    sender: sender
                }
            });
        },
        setUser: function(user) {
            this.user = user;
        },
        getUser: function() {
            return this.user;
        }
    };
});
