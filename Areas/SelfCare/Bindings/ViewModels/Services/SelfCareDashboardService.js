'use strict';

SelfCareNav.factory('SelfCareDashboard', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/SelfDashboard');
});

SelfCareNav.factory('SelfCareDashboardDefault', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/SelfDashboard/Default');
});