recoverPassword.factory('SecurityQuestionService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/recover_password/security_question', {}, {
        save: {
            method: 'POST'
        }
    });

});

recoverPassword.factory('DirectSendEmailService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/recover_password/direct_reset_password', {}, {
        save: {
            method: 'POST'
        }
    });

});