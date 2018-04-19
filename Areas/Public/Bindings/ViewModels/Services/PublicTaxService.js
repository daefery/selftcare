'use strict';

publicContent.factory('getSureTaxAmountService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/suretax/calculatetax');
});