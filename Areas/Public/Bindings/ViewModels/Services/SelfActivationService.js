publicContent.factory('SelfActivationResource', function ($resource, ApiConnection) {
    return {
        getOrderDetail: $resource(ApiConnection + '/api/common/orders/:OrderNumber', {}, {}),
        getCustomerInfo: $resource(ApiConnection + '/api/common/customers/info/:customerid', {}, {}),
        activate: $resource(ApiConnection + '/api/csr/customers/activate', {}, {}),
    } 
});