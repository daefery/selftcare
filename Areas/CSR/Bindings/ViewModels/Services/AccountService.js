'use strict';

CSRContent.factory('GetUserPropertiesService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/accounts/properties', null, {
    });
});

CSRContent.factory('GetUserPermission', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/customers/:customerIdtemp', { method: 'GET' });
});

CSRContent.factory('GetUserCredentialService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/accounts/credentials', null, {
    });
});

CSRContent.factory('ChangeUserPasswordService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/accounts/updatepassword', {}, {
        update: {
            method: 'PUT'
        }
    });
});

CSRContent.factory('ChangeUserPropertiesService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/accounts/updatedetails', {}, {
        update: {
            method: 'PUT'
        }
    });
});

CSRContent.factory('RequestUserPermission', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '', { method: 'PUT' });
});

CSRContent.factory('ChangeUserPersonalSetting', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '', { method: 'PUT' });
});