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
        setUser: function(user) {
            this.user = user;
        },
        getUser: function() {
            return this.user;
        }
    };
});
