'use strict';
SelfCareContent.factory('SelfCareSecureSectionService', function ($resource, ApiConnection) {
    return {
        getByModuleId: $resource(ApiConnection + '/api/authorization/securesec/getbymodule?ModuleId=:ModuleId')
    }
});