'use strict';
//api/csr/devices
publicContent.factory('GetDevicesService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/products');
});

//get PageNumber={PageNumber}&PageSize={PageSize}&OrderNumber={OrderNumber}&CustomerId={CustomerId}&FromDate={FromDate}&ToDate={ToDate}&Status={Status}
//publicContent.factory('GetOrdersbyFilterService', function ($resource, ApiConnection) {
//    return $resource(ApiConnection + '/api/csr/orders?PageNumber=:PageNumber&PageSize=:PageSize&OrderNumber=:OrderNumber&CustomerId=:CustomerId&FromDate=:FromDate&ToDate=:ToDate&Status=:Status', {}, {
//        query: {
//            method: 'GET'
//        }
//    });
//});

//POST api/csr/orders
publicContent.factory('CreateCustomerOrderService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/orders');
});

//publicContent.factory('GetOrderbyOrderIdService', function ($resource, ApiConnection) {
//    return $resource(ApiConnection + '/api/common/orders/:orderNumber');
//});

//PUT api/csr/orders/{id}
//publicContent.factory('UpdateOrderService', function ($resource, ApiConnection) {
//    return $resource(ApiConnection + '/api/csr/orders/update', {}, {
//        update: {
//            method: 'PUT'
//        }
//    });
//});

//PATCH api/csr/orders/{id}?status={status}
//publicContent.factory('UpdateOrderStatusService', function ($resource, ApiConnection) {
//    return $resource(ApiConnection + '/api/csr/orders/:id?status=:status', {}, {
//        update: {
//            method: 'PATCH'
//        }
//    });
//});

//publicContent.factory('CancelOrderService', function ($resource, ApiConnection) {
//    return $resource(ApiConnection + '/api/csr/orders', {}, {
//        update: {
//            method: 'PUT'
//        }
//    });
//});

//GET api/csr/orders/ship
publicContent.factory('GetShippingMethodService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/orders/ship');
})

//publicContent.factory('DeviceManagementUtility', function () {
//    var userName;
//    var question;
//    var confirmKey;
//    var email;
//    var mvno;
//    var orderstatus;

//    var addOrderStatus = function (newObj) {
//        orderstatus = null;
//        orderstatus = newObj;
//    };

//    var getOrderStatus = function () {
//        return orderstatus;
//    }

//    var addMvno = function (newObj) {
//        mvno = null;
//        mvno = newObj;
//    };

//    var getMvno = function () {
//        return mvno;
//    }

//    var addEmail = function (newObj) {
//        email = null;
//        email = newObj;
//    };

//    var getEmail = function () {
//        return email;
//    }

//    var addUsername = function (newObj) {
//        userName = null;
//        userName = newObj;
//    };

//    var getUsername = function () {
//        return userName;
//    };

//    var addQuestion = function (newObj) {
//        question = newObj;
//    };

//    var getQuestion = function () {
//        var newquestion = question;
//        question = null;
//        return newquestion;
//    };

//    var addConfirmKey = function (newConfirmKey) {
//        confirmKey = null;
//        confirmKey = newConfirmKey;
//    };

//    var getConfirmKey = function () {
//        return confirmKey;
//    };

//    return {
//        AddMvno: addMvno,
//        GetMvno: getMvno,
//        AddOrderStatus: addOrderStatus,
//        GetOrderStatus: getOrderStatus,
//        AddUsername: addUsername,
//        GetUsername: getUsername,
//        AddQuestion: addQuestion,
//        GetQuestion: getQuestion,
//        AddConfirmKey: addConfirmKey,
//        GetConfirmKey: getConfirmKey,
//        AddEmail: addEmail,
//        GetEmail: getEmail
//    };
//});

//POST api/devicevalidation/devicevalidation
publicContent.factory('DeviceValidationService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/devicevalidation/devicevalidation');
});

//GET base 64 file for device image
publicContent.factory('GetDeviceImageService', function($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/inventory/image?url=:url');
});