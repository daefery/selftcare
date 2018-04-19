SelfCareContent.controller("ChangePasswordCustomerController", function ($scope, $http, $window, $location, UpdatePassword, Notification, ErrorHandlerUtility) {
    $scope.sameLastFivePasswordMessage = "";
    $scope.isFalse = false;
    $scope.chPass = '';
    $scope.check = function () {
        $scope.chPass.ConfirmPassword = '';
    }

    $scope.$watch("chPass.NewPassword", function () {
        $scope.chPass.ConfirmPassword = '';
    });

    var notvalid = "";
    $scope.saveChangesPassword = function (data) {
        var formData = {
            OldPassword: data.OldPassword,
            NewPassword: data.NewPassword
        };
        if (formData.OldPassword != notvalid && formData.NewPassword != notvalid) {
            UpdatePassword.update(formData, function(result) {

                if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Your profile has been updated, <br />You will be redirect to login page in 10 second and please re-login using a new password </span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    ClearCommonSession();
                    setTimeout(function() {
                        window.location.href = '../Authorization/Login';
                    }, 10000);
                    $scope.isFalse = false;
                }
                else
                    $scope.sameLastFivePasswordMessage = '<strong>Failed!</strong> <span>' + result.Messages + '</span>';
                $scope.isFalse = true;
            });
        } else {
            Notification.error({
                message: '<strong>Failed!</strong> <span>' + 'Invalid Password' + '.</span>',
                positionY: 'top',
                positionX: 'center'
            });
            return false;
        }
    }
});