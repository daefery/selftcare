'use strict';

CSRContent.factory('UpdateCustomerDetail', function($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/customers/datacustomers', {}, {
        update: {
            method: 'PUT'
        }
    });
});

CSRContent.factory('ValidateUser', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/accounts/uservalidation/:username', {}, {
        get: {
            method: 'GET'
        }
    });
});

CSRContent.factory('UpdateCustomerRemarks', function($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/customers/modifyremark', {}, {
        update: {
            method: 'PUT'
        }
    });
});



//The factory below called by CustomerActionController.js

CSRContent.factory('CustomerAction', function ($resource, ApiConnection) {
    return {
        ActivateCustomer: $resource(ApiConnection + '/api/csr/customers/activate', {}),
        DeleteCustomer: $resource(ApiConnection + '/api/csr/customers/delete', {}),
        SuspendCustomer: $resource(ApiConnection + '/api/csr/customers/suspend', {}),
        RestoreCustomer: $resource(ApiConnection + '/api/csr/customers/restore', {}),
        DeleteSubscription: $resource(ApiConnection + '/api/csr/subscription/delete', {}),  //subscription
        FreezeSubscription: $resource(ApiConnection + '/api/csr/subscription/suspend', {}),  //subscription
        UnFreezeSubscription: $resource(ApiConnection + '/api/csr/subscription/restore', {}),  //subscription
    }
});