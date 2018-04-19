CSRContent.factory('CSRNavigation', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/user/getrma/menucontent', {}, {
        get: {
            method: 'GET'
        }
    });
});

CSRContent.factory('CSRNavigationDefault', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/user/getrma/menucontentdefault', {}, {
        get: {
            method: 'GET'
        }
    });
});

CSRContent.factory('CSRUserPreference', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/userpref/save?inputData=:inputData', {inputData: '@inputData'}, {
        update: {
            method: 'PUT'
        }
    });
});

CSRContent.factory('CSRHotAction', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/user/getrma/hotaction', {}, {
        get: {
            method: 'GET',
            cache: true
        }
    });

});

CSRContent.factory('CSRSideBar', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/user/getrma/sidemenu?ModuleId=:ModuleId', { ModuleId: '@ModuleId' }, {
        get: {
            method: 'GET'
        }
    });
});

CSRContent.factory('CSRSecureSection', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/user/getrma/section?ModuleId=:ModuleId', { ModuleId: '@ModuleId' }, {
        get: {
            method: 'GET',
            isArray: true
        }
    });
});

CSRContent.factory('CSRModulePermission', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/module/userid/:userId', { userId: '@userId' }, {
        get: {
            method: 'GET',
            isArray: true,
            cache: true
        }
    });
});

CSRContent.factory('CSRSitemap', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/sitemap');
});