recoverPassword.factory('RecoverPasswordService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/forgotpass/usernameverify', {}, {
        save: {
            method: 'POST'
        }
    });

});

recoverPassword.factory('RecoverAgreementService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/recover_password/csr_reset_password', {}, {
        save: {
            method: 'POST'
        }
    });

});

recoverPassword.factory('ChangePasswordService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/recover_password/change_password', {}, {
        save: {
            method: 'POST'
        }
    });

});

recoverPassword.factory('SetSecurityQuestionPassword', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/recover_password/set_security_question', {}, {
        save: {
            method: 'POST'
        }
    });

});

recoverPassword.factory('RecoverResendKeyService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/recover_password/resendkey', {}, {
        save: {
            method: 'POST'
        }
    });

});

recoverPassword.factory('RecoverPasswordUtility', function () {
    var userName;
    var question;
    var confirmKey;
    var secQuestionFlg;

    var addUsername = function (newObj) {
        userName = null;
        userName = newObj;
    };

    var getUsername = function () {
        return userName;
    };

    var addQuestion = function (newObj) {
        question = newObj;
    };

    var getQuestion = function () {
        var newquestion = question;
        question = null;
        return newquestion;
    };

    var addConfirmKey = function (newConfirmKey) {
        confirmKey = null;
        confirmKey = newConfirmKey;
    };

    var getConfirmKey = function () {
        return confirmKey;
    };

    var addSecQuestionFlg = function (newObj) {
        secQuestionFlg = null;
        secQuestionFlg = newObj;
    };

    var getSecQuestionFlg = function () {
        return secQuestionFlg;
    };

    return {
        AddUsername: addUsername,
        GetUsername: getUsername,
        AddQuestion: addQuestion,
        GetQuestion: getQuestion,
        AddConfirmKey: addConfirmKey,
        GetConfirmKey: getConfirmKey,
        AddSecQuestionFlg: addSecQuestionFlg,
        GetSecQuestionFlg: getSecQuestionFlg
    };
});