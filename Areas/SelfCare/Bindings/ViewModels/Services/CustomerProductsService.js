SelfCareContent.factory("GetCustomerProducts", function ($resource, ApiConnection) {
    return {
        getProductByMobileNumber: $resource(ApiConnection + '/api/csr/customers/products?MobileNumber=:MobileNumber', {}, {}),
    }
});