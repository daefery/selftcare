authorization.controller("AuthorizationViewModel", function ($scope, $http, $window, $location) {
    $scope.$on('$viewContentLoaded', function () {
        $location.replace(); //clear last history route
    });
});


authorization.controller("LoginController", function ($q,$rootScope, $scope, AuthUtilityCommon, AuthInstanceService, CommonEnum) {
   
    $scope.submit = function (data) {
            var obj = "grant_type=password&username="+data.username+"&password="+data.password;
            
            AuthInstanceService.post({}, obj, function (resp) {
                try {
                    AuthUtilityCommon.AuthSuccessHandler(resp,true);
                    $scope.isFalse = false;
                } catch (err) {
                    var msg = CommonEnum.getErrorResponseMessage();
                    $scope.warningLogin = msg.AuthInternalServerError;
                    $scope.isFalse = true;
                }
            }, function (error) {
                $("p.ng-binding").html(AuthUtilityCommon.AuthErrorHandler(error));
                $scope.isFalse = true;
            });
        };

});



//Start : Rico - add forgot password controller
authorization.controller("ForgotPassword", function ($scope, $http) {

});
//End : Rico - add forgot password controller

