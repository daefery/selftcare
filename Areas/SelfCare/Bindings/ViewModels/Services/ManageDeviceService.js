SelfCareContent.factory("ManageDeviceService", function ($resource, ApiConnection) {
    return {
        GetMultisubscription: $resource(ApiConnection + '/api/common/customers/parentchild?customerId=:customerId&msisdn=', {}, {})
    };
});