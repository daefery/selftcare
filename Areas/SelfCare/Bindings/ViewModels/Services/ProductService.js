SelfCareContent.factory("ProductService", function ($resource, ApiConnection) {
    return {
        getProductOffering: $resource(ApiConnection + '/api/common/products/offering', {}, {}),
    }
});