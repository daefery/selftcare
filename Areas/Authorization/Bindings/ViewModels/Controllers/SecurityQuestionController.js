recoverPassword.controller("SecurityQuestionController", function ($scope, $rootScope, SecurityQuestionService, RecoverPasswordUtility,
                                                                    $location,ErrorHandlerUtility) {
    //$rootScope.$on('sendUsername', function (event, res) {
    //    $scope.username = res;
    //});
    
    $scope.submit = function (data) {
        
                var dat = {
                    answer: data.answer,
                    username: RecoverPasswordUtility.GetUsername()
                }
                SecurityQuestionService.save(dat, function (result) {
                    if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                        RecoverPasswordUtility.AddSecQuestionFlg(true);
                        RecoverPasswordUtility.AddUsername(dat.username);
                        $location.path(Console.rootPath + 'Authorization/RecoverPassword/ChangePassword');
                    } else {
                        $("#secFailedModal").modal("show");
                    }
                });
            
       
    }
});

recoverPassword.controller("DirectSendEmailController", function ($scope, $rootScope, DirectSendEmailService, RecoverPasswordUtility, ErrorHandlerUtility,
                                                                        Notification) {

    $scope.send = function () {

        var dat = {
            username: RecoverPasswordUtility.GetUsername()
        }
        DirectSendEmailService.save(dat, function (result) {
            if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                $("#secFailedModal").modal("hide");
                $("#secSuccessModal").modal("show"); 
            } else {
                $("#secFailedModal").modal("hide");
                var message = ErrorHandlerUtility.GetErrorMessage(result);
                Notification.error({
                    message: '<span>' + message + '</span>',
                    positionY: 'bottom',
                    positionX: 'center'
                });
            }

        });


    }
});