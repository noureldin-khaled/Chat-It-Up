App = angular.module('App', ['ngMaterial', 'ngMessages', 'ngRoute']);

App.config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    $routeProvider
        .when('/', {
            templateUrl: 'partials/main.html',
            controller: 'MainCtrl',
            controllerAs: 'c'
        })

        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'c'
        })

        .otherwise({
            redirectTo: '/'
        });

     $locationProvider.html5Mode(true);
});
