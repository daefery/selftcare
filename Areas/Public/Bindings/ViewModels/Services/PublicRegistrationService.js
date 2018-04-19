'use strict';

publicContent.factory('queryAvailableMSISDN', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/getmsisdn?CategoryId=:CategoryId&Quantity=:Quantity', { isArray: true });
});

publicContent.factory('queryAvailablePromotions', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/public/products/promotionplan/:dealerId');
});

publicContent.factory('queryPackageInfo', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/public/products/packageinfo/:dealerId');
});

publicContent.factory('createNewCustomer', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/public/customers/create');
});

publicContent.factory('registerNewCustomer', function($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/customers/register');
});

publicContent.factory('CustomerInfoService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/customers/info/:customerid');
});

publicContent.factory('CarrierListService', function($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/carriers');
});

//GET api/csr/orders/ship
publicContent.factory('GetShippingMethodService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/orders/ship');
})