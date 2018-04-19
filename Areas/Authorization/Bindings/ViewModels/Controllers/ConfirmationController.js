recoverPassword.controller("ConfirmationController", function ($q, $rootScope, $scope, AuthUtilityCommon, AuthInstanceService,
                                                                     CommonEnum, Notification, vcRecaptchaService, CaptchaKey,
                                                                            $location, RecoverPasswordUtility) {

    //captcha
    $scope.response = null;
    $scope.widgetId = null;

    $scope.model = {
        key: CaptchaKey
    };
    $scope.captchaProcess = function (type, param) {
        switch (type) {
            case 'create':
                $scope.widgetId = param;
                break;
            case 'success':
                $scope.response = param;
                $scope.captcha = true;
                break;
            case 'expired':
                vcRecaptchaService.reload($scope.widgetId);
                $scope.response = null;
                $scope.captcha = '';
                break;
        }
    }
    //end of captcha

    $scope.isFalse = false;

    $scope.doConfirm = function (data) {
        RecoverPasswordUtility.AddConfirmKey(data.key);
        vcRecaptchaService.reload($scope.widgetId);
        $location.path(Console.rootPath + 'Authorization/RecoverPassword/ChangePassword'); 
    }

});