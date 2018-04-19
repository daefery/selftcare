'use strict';
SelfCareContent.factory('SelfCareActivationService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/customers/activate');
});