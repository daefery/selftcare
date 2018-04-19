recoverPassword.controller("RecoverAgreementController", function ($scope, $rootScope, SecurityQuestionService, RecoverPasswordUtility, ErrorHandlerUtility,
                                                                            RecoverAgreementService) {
    //$rootScope.$on('sendUsername', function (event, res) {
    //    $scope.username = res;
    //});

    $scope.send = function () {

        var dat = {
            username: RecoverPasswordUtility.GetUsername()
        }
        RecoverAgreementService.save(dat, function (result) {
            if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                $("#verifyModal").modal("hide");
                $("#verifySuccessModal").modal("show");
            } else {
                $("#verifyModal").modal("hide");
                var message = ErrorHandlerUtility.GetErrorMessage(result);
                Notification.error({
                    message: '<span>' + message + '</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }

        });


    }
});