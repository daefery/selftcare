(function () {
    commonModule.directive('usSpinner', ['$http', '$rootScope', function ($http, $rootScope) {
        return {
            link: function (scope, elm, attrs) {
                $rootScope.spinnerActive = false;
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (loading) {
                    $rootScope.spinnerActive = loading;
                    if (loading) {
                        elm.removeClass('ng-hide');
                        $("#blur").addClass('blur');
                    } else {
                        elm.addClass('ng-hide');
                        $("#blur").removeClass();
                    }
                });
            }
        };

    }]);
}).call(this);