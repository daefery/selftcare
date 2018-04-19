commonModule.factory('CaptchaVerificationService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/captchaverify', null, {
        save: {
            method: 'POST'
        }
    });
});