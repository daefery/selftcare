'use strict';

publicContent.factory('portabilityRequestService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/customers/portin');
});

publicContent.factory('portInValidationService', function($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/customers/portinvalidation');
});