'use strict';

SelfCareNav.factory('SelfCareNavigation', function ($resource, ApiConnection) {
    //return $resource(ApiConnection + '/api/SelfNavigation');
    return $resource(ApiConnection + '/api/authorization/user/getrma/menucontent')
});

SelfCareNav.factory('SelfCareNavigationDefault', function ($resource, ApiConnection) {
    //return $resource(ApiConnection + '/api/SelfNavigation/Default');
    return $resource(ApiConnection + '/api/authorization/user/getrma/menucontentdefault');
});

SelfCareNav.factory('SelfCareUserPreference', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/userpref/save?inputData=:inputData', { inputData: '@inputData' }, {
        update: {
            method: 'PUT'
        }
    });
});

SelfCareNav.factory('SelfcareSecureSection', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/user/getrma/section?ModuleId=:ModuleId', { ModuleId: '@ModuleId' }, {
        get: {
            method: 'GET',
            isArray: true,
            cache: true
        }
    });
});