resendKey.controller("ResendKeyProcessController", function ($scope, Notification, ResendKeyApiService) {
    $scope.resendKey = function (data) {
        ResendKeyApiService.get({ email: data }, function (result) {
            if (result.ResultType == 0) {
                Notification.success({
                    message: '<span>Thank you, your activation key already sent to your email. please check in your inbox and confirmation your account</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                setTimeout(function () {
                    window.location.href = '/Authorization/Login';
                }, 1500);
            } else {
                Notification.error({
                    message: '<span>' + result.Messages[0] + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
        });
    }
});