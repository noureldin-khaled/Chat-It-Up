/**
 * A directive to handle auto scrolling to the bottom of the list whenever the ng-repeat finishes
 */
App.directive('scrollBottom', function ($timeout) {
    return {
        scope: {
            scrollBottom: "="
        },
        link: function (scope, element) {
            scope.$watchCollection('scrollBottom', function (newValue) {
                if (newValue) {
                    $timeout(function(){
                        $(element).scrollTop($(element)[0].scrollHeight);
                    }, 0);
                }
            });
        }
    };
});
