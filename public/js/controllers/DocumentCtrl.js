/**
 * A controller to handle redirecting to login page
 */
App.controller('DocumentCtrl', function($scope, $location) {
    /* whenver the user is not logged in redirect him/her to the login page */
    $scope.$on("$routeChangeError", function(evt, current, previous, rejection) {
        if(rejection == "not_logged_in"){
            $location.url('/login');
        }
    });
});
