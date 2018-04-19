publicContent.factory('GetProductsService', function ($resource, ApiConnection) {
    //return $resource(ApiConnection + '/api/csr/products?productTypeId=1020000669');
    return $resource(ApiConnection + '/api/csr/products');
});

publicContent.factory('GetPlanService', function ($resource, ApiConnection) {
    //return $resource(ApiConnection + '/api/csr/products?productTypeId=1020000669');
    //return $resource(ApiConnection + '/api/common/products?ProductType=1&IsActiveOnly=false&Channel=website');
    return $resource(ApiConnection + '/api/common/v2/products?Type=1');
});

publicContent.factory('GetPlanByodService', function($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/v2/products?Type=1&ProductOfferingId=:ProductOfferingId');
});

publicContent.factory('GetAllowanceCashCardService', function($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/v2/products?Type=6');
});
