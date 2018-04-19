recoverPassword.controller("ChangePasswordController", function ($scope,$location, $rootScope, RecoverPasswordUtility, ErrorHandlerUtility, ChangePasswordService,
                                                                        AuthUtilityCommon) {
    $scope.recover = '';
    $scope.isNotConfirm = false;
    $scope.messageConfirm = '';
    $scope.check = function () {
        $scope.recover.ConfirmPassword = '';
    }
    $scope.$watch("recover.NewPassword", function () {
        $scope.recover.ConfirmPassword = '';
    });
   
    $scope.submit = function (data) {
        var dat;
        if (RecoverPasswordUtility.GetSecQuestionFlg() === true) {
            dat = {
                Password: data.NewPassword,
                ConfirmPassword: data.ConfirmPassword,
                IsPassSecQuestion: true,
                Username: RecoverPasswordUtility.GetUsername()
            };
        } else {
            dat = {
                Password: data.NewPassword,
                ConfirmPassword: data.ConfirmPassword,
                Key: RecoverPasswordUtility.GetConfirmKey(),
                IsPassSecQuestion: false
            };
        }
        ChangePasswordService.save(dat, function (result) {
            if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                var userType = AuthUtilityCommon.GetUserType();
                if (result.UserType === userType.Selfcare && result.IsHasSecurityQuestion === false) {
                    RecoverPasswordUtility.AddUsername(result.Username);
                    $location.path(Console.rootPath + 'Authorization/RecoverPassword/SetSecurityQuestion');
                } else {
                    $("#passwordSuccessModal").modal("show");
                }
            } else {
                var message = ErrorHandlerUtility.GetErrorMessage(result);
                if (message === "Invalid Key") {
                    $scope.messageConfirm = message + '. to get new confirmation key, please click <a href="/Authorization/RecoverPassword/ResendKey">here</a> to resend key';
                    $scope.isNotConfirm = true;
                } else {
                    $scope.isNotConfirm = true;
                    $scope.messageConfirm = message;
                }
                
            }
        });

    }
     
   
});