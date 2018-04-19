SelfCareRegister.factory('CustomerDetailByMsisdn', function ($resource, ApiConnection) {
    return {
        userverifybymsisdn: $resource(ApiConnection + '/api/selfcare/customers?msisdn=:msisdn', {}, {}),
    }
});

SelfCareRegister.factory('CustomerRegistration', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/selfcare/accounts/create', { msisdn: '@_msisdn' }, {
    });
});

SelfCareRegister.factory('UserAccountManagement', function ($resource, ApiConnection) {
    return {
        uservalidation: $resource(ApiConnection + '/api/accounts/uservalidation/:email', {}, {}),
    }
    
});