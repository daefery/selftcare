'use strict';

SelfCareContent.factory('CustomerSummary', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/selfcare/customer/summary/:customerid', {}, {});
});