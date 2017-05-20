App = angular.module('App', ['ngRoute', 'ngMessages']);

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
            load: function($q, UserSrv){
                var defer = $q.defer();
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
