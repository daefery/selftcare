recoverPassword.controller("RecoverPasswordController", function ($q, $rootScope, $scope, AuthUtilityCommon, AuthInstanceService,
                                                                     CommonEnum, Notification, vcRecaptchaService, CaptchaKey,
                                                                            $location, RecoverPasswordService, RecoverPasswordUtility, AuthUtilityCommon,
                                                                                ErrorHandlerUtility) {
   
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
        RecoverPasswordService.save({Username: data.username}, function (result) {
            var user = AuthUtilityCommon.GetUserType();
            if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                if (result.UserType === user.Selfcare) {
                    RecoverPasswordUtility.AddUsername(data.username);
                    var questionsArr = CommonEnum.getSecurityQuestions();
                    var i;
                    for (i = 0; i < questionsArr.length; i++) {
                        if (questionsArr[i].value === result.SecretQuestion) {
                            RecoverPasswordUtility.AddQuestion(questionsArr[i].name);
                            break;
                        }
                    }
                          
                    vcRecaptchaService.reload($scope.widgetId);
                    $location.path(Console.rootPath + 'Authorization/RecoverPassword/SecurityQuestion');
                } else if (result.UserType === user.CSR) {
                    RecoverPasswordUtility.AddUsername(data.username);
                    vcRecaptchaService.reload($scope.widgetId);
                    $("#verifyModal").modal("show");
                }
            } else {
                var message = ErrorHandlerUtility.GetErrorMessage(result);
                $scope.isFalse = true;
                $scope.warningRecoverPass = message;
                vcRecaptchaService.reload($scope.widgetId);
            }
        });
    }

});