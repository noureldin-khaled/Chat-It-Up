App.controller('DocumentCtrl', function($scope, $location) {
    $scope.$on("$routeChangeError", function(evt, current, previous, rejection) {
        if(rejection == "not_logged_in"){
            $location.url('/login');
        }
    });
});
