accountConfirm.controller("AccountConfirmationController", function ($scope, Notification, AccountConfirmation, CaptchaKey, CaptchaVerificationService, vcRecaptchaService,
    CommonEnum, sendSMSFunction) {
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

    $scope.doConfirm = function (data) {
        $scope.isNotConfirm = false;
        $scope.messageConfirm = '';
        AccountConfirmation.confirm({ Key: data.key }, function (result) {
            if (result.ResultType == 0) {

                //send sms
                var tmplt = CommonEnum.getSMSTemplates();
                var smsData = {
                    msisdn: 32165498701,
                    body: tmplt.selfcareConfirmationAccount
                }

                var promise = sendSMSFunction.send(smsData);
                promise.then(function (promiseResult) {
                    if (promiseResult) {
                        Notification.success({
                            message: '<span>Thank you for confirmation your account. please login in our site with your phone and password</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                        setTimeout(function () {
                            window.location.href = '/Authorization/Login';
                        }, 1500);
                    }
                });
            } else {
                $scope.messageConfirm = result.Messages[0] + '. to get new activation key, please click <a href="/Authorization/ResendKey" target="_self">here</a> to resend key';
                $scope.isNotConfirm = true;
                vcRecaptchaService.reload($scope.widgetId);
            }
        });
    }

    
});