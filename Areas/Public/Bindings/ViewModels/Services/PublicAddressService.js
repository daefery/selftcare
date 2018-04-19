'use strict';

publicContent.factory('addressRecord', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/sureaddress/addressrecord');
});

publicContent.factory('verifyAddress', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/sureaddress/verifyaddress');
});
publicContent.factory('getzipwithindistance', function ($resource, ApiConnection) {
    return $resource(ApiConnection + 'api/sureaddress/getzipwithindistance');
});