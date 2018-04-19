'use strict';
//api/csr/devices
//CSRContent.factory('GetDevicesService', function ($resource, ApiConnection) {
//    return $resource(ApiConnection + '/api/csr/products');
//});

//GET productsbyproducttype
CSRContent.factory('GetDevicesServiceByProductType', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/products?productTypeId=:productTypeId', {}, {
        query: {
            method: 'GET'
        }
    });
});

CSRContent.factory('OrderGetInventoryProductDetailService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/productsinventory/pagination?PageNumber=:PageNumber&RowPerPage=:RowPerPage&ProductId=:ProductId&ProductName=:ProductName&SKU=:SKU&ModelNumber=:ModelNumber&BeginQuantityFrom=:BeginQuantityFrom&BeginQuantityTo=:BeginQuantityTo&AvailableQuantityFrom=:AvailableQuantityFrom&AvailableQuantityTo=:AvailableQuantityTo', {}, {
        query: {
            method: 'GET'
        }
    });
});

//GET phoneimagebyurl
CSRContent.factory('GetPhoneImage', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/inventory/image?url=:url', {}, {
        query: {
            method: 'GET'
        }
    });
});

CSRContent.factory('PostPhoneImage', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/inventory/image', {}, {
        upload: {
            method: 'POST'
        }
    });
});

//PUT updateproductspecification
CSRContent.factory('UpdateProductSpecification', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/products', {}, {
        update: {
            method: 'PUT'
        }
    });
});

//get PageNumber={PageNumber}&PageSize={PageSize}&OrderNumber={OrderNumber}&CustomerId={CustomerId}&FromDate={FromDate}&ToDate={ToDate}&Status={Status}
CSRContent.factory('GetOrdersbyFilterService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/orders?PageNumber=:PageNumber&PageSize=:PageSize&OrderNumber=:OrderNumber&CustomerId=:CustomerId&FromDate=:FromDate&ToDate=:ToDate&Status=:Status&MvnoId=:MvnoId', {}, {
        query: {
            method: 'GET'
        }
    });
});

//POST api/csr/orders
//CSRContent.factory('CreateCustomerOrderService', function ($resource, ApiConnection) {
//    return $resource(ApiConnection + '/api/csr/orders');
//});

CSRContent.factory('GetOrderbyOrderIdService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/orders/:orderNumber');
});

//PUT api/csr/orders/{id}
CSRContent.factory('UpdateOrderService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/orders', {}, {
        update: {
            method: 'PUT'
        }
    });
});

//PATCH api/csr/orders/{id}?status={status}
CSRContent.factory('UpdateOrderStatusService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/csr/orders/:id?status=:status', {}, {
        update: {
            method: 'PATCH'
        }
    });
});

CSRContent.factory('CancelOrderService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/orders', {}, {
        update: {
            method: 'DELETE'
        }
    });
});

//GET api/csr/orders/ship
CSRContent.factory('GetShippingMethodService', function($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/common/orders/ship');
});

CSRContent.factory('DeviceManagementUtility', function () {
    var userName;
    var question;
    var confirmKey;
    var email;
    var mvno;
    var orderstatus;
    var bool;

    var addBool = function (newObj) {
        bool = null;
        bool = newObj;
    };

    var getBool = function () {
        return bool;
    };

    var addOrderStatus = function (newObj) {
        orderstatus = null;
        orderstatus = newObj;
    };

    var getOrderStatus = function () {
        return orderstatus;
    }

    var addMvno = function (newObj) {
        mvno = null;
        mvno = newObj;
    };

    var getMvno = function () {
        return mvno;
    }

    var addEmail = function (newObj) {
        email = null;
        email = newObj;
    };

    var getEmail = function () {
        return email;
    }

    var addUsername = function (newObj) {
        userName = null;
        userName = newObj;
    };

    var getUsername = function () {
        return userName;
    };

    var addQuestion = function (newObj) {
        question = newObj;
    };

    var getQuestion = function () {
        var newquestion = question;
        question = null;
        return newquestion;
    };

    var addConfirmKey = function (newConfirmKey) {
        confirmKey = null;
        confirmKey = newConfirmKey;
    };

    var getConfirmKey = function () {
        return confirmKey;
    };

    return {
        AddMvno: addMvno,
        GetMvno: getMvno,
        AddBool: addBool,
        GetBool: getBool,
        AddOrderStatus: addOrderStatus,
        GetOrderStatus: getOrderStatus,
        AddUsername: addUsername,
        GetUsername: getUsername,
        AddQuestion: addQuestion,
        GetQuestion: getQuestion,
        AddConfirmKey: addConfirmKey,
        GetConfirmKey: getConfirmKey,
        AddEmail: addEmail,
        GetEmail: getEmail
    };
});

//POST api/devicevalidation/devicevalidation
//CSRContent.factory('DeviceValidationService', function($resource,ApiConnection) {
//    return $resource(ApiConnection + '/api/devicevalidation/devicevalidation');
//});
