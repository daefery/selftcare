'use strict';

CSRVerification.factory('CSRVerifyCache', function ($cacheFactory) {
    return $cacheFactory('dataCache');
});

CSRVerification.factory('CSRResendKeyService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/accounts/ResendKey?Email=:email', {}, {});
});

CSRVerification.factory('CSRUserConfirmationService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/accounts/confirm', null,
    {
        confirm: { method: 'PUT' }
    });
});

CSRVerification.factory('CSRUserSetPasswordService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/accounts/setpassword', null,
    {
        update: {
            method: 'PUT'
        }
    });
});

CSRVerification.factory('CSRUserGetID', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/verify/getid?key=:key', { method: 'GET' });
});

CSRVerification.factory('CSRVerifyUtility', function () {
    var userName;
    var question;
    var confirmKey;
    var email;

    var addEmail = function (newObj) {
        email = null;
        email = newObj;
    };

    var getEmail = function () {
        return email;
    }

    var addUsername = function (newObj) {
        username = null;
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

    return {
        AddUsername: addUsername,
        GetUsername: getUsername,
        AddQuestion: addQuestion,
        GetQuestion: getQuestion,
        AddConfirmKey: addConfirmKey,
        GetConfirmKey: getConfirmKey,
        AddEmail: addEmail,
        GetEmail: getEmail        
    };
});