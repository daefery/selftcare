recoverPassword.controller("RecoverResendKeyController", function ($scope, Notification, RecoverResendKeyService, RecoverPasswordUtility,
                                                                            ErrorHandlerUtility) {
    $scope.isFalse = false;

    $scope.resendKey = function (data) {
        var dat = {
            Email: data
        }
        RecoverResendKeyService.save(dat, function (result) {
            if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                Notification.success({
                    message: '<span>Thank you, your activation key already sent to your email. please check in your inbox and confirmation your account</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                setTimeout(function () {
                    window.location.href = '/Authorization/Login';
                }, 3000);
            } else {
                var message = ErrorHandlerUtility.GetErrorMessage(result);
                $scope.isFalse = true;
                $scope.warningRecoverPass = message;
            }
        });
    }
});