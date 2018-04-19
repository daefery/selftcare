recoverPassword.controller("SetSecurityQuestionController", function ($scope, $rootScope, RecoverPasswordUtility, ErrorHandlerUtility, SetSecurityQuestionPassword) {
    $scope.data = {};
    $scope.isFalse = false;
    $scope.submit = function (data) {
        var obj = angular.copy(data);
        var SecurityQuestion = {};
        SecurityQuestion.Question = obj.SecurityQuestion.Question.value;
        SecurityQuestion.Answer = obj.SecurityQuestion.Answer;
        var dat = {
            SecurityQuestion: SecurityQuestion,
            username: RecoverPasswordUtility.GetUsername()
        }
        SetSecurityQuestionPassword.save(dat, function (result) {
            if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                $("#passwordSuccessModal").modal("show");
            } else {
                var message = ErrorHandlerUtility.GetErrorMessage(result);
                $scope.isFalse = true;
                $scope.warningRecoverPass = message;
            }
        });


    }
});