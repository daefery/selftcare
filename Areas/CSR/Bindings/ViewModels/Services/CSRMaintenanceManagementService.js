'use strict';


//Create Maintenanceplan
CSRContent.factory('CreateMaintenancePlan', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/maintenance/plan');
});

//GET maintenanceplan
CSRContent.factory('GetMaintenancePlan', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/maintenance/plan', {}, {
        query: {
            method: 'GET'
        }
    });
});

CSRContent.factory('GetAllMaintenancePlan', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/maintenance/plan/all', {}, {
        query: {
            method: 'GET'
        }
    });
});

//UPDATE
CSRContent.factory('UpdateMaintenancePlan', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/maintenance/plan/:maintenanceId');
});


//DELETE
CSRContent.factory('RemoveMaintenancePlan', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/maintenance/plan/:maintenanceId');
});



//GET UpdateHistory
CSRContent.factory('GetUpdateHistory', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/maintenance/updatehistory', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
});

//GET AllUpdateHistory
CSRContent.factory('GetAllUpdateHistory', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/maintenance/updatehistory/all', {}, {
        query: {
            method: 'GET'
        }
    });
});

//POST AddUpdateHistory
CSRContent.factory('CreateUpdateHistory', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/maintenance/updatehistory', {}, {
        add: {
            method: 'POST'
        }
    });
});

//PUT ModifyUpdateHistory
CSRContent.factory('EditUpdateHistory', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/maintenance/updatehistory/update', {}, {
        edit: {
            method: 'PUT'
        }
    });
});

//DELETE RemoveUpdateHistory
CSRContent.factory('RemoveUpdateHistory', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/maintenance/updatehistory/delete/:MaintenanceInfoID', null, {
    });
});
