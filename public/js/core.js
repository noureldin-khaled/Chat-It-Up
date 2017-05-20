App = angular.module('App', ['ngRoute', 'ngMessages', 'ngCookies']);

/* App configuration */
App.config(function($routeProvider, $locationProvider) {
    /* remove any hash prefixes in the URL */
    $locationProvider.hashPrefix('');

    $routeProvider
    .when('/', {
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl',
        controllerAs: 'c',
        resolve: {
            load: function($q, UserSrv, $cookies){
                var defer = $q.defer();
                
                var auth = $cookies.get('auth');
                if (auth) {
                    auth = JSON.parse(auth);
                    UserSrv.setUser(auth);
                }

                if(UserSrv.getUser()){
                    defer.resolve();
                } else {
                    defer.reject("not_logged_in");
                }

                return defer.promise;
            }
        }
    })

    .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'c'
    })

    .otherwise({
        redirectTo: '/'
    });

    /* remove the '#' from the URL */
    $locationProvider.html5Mode(true);
});
