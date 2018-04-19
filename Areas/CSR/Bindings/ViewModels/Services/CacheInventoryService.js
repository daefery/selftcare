CSRContent.service('CacheInventoryOrderSearch', function ($q, $http, CSRCache, GetUserPropertiesService, GetUserCredentialService, ApiConnection, ErrorHandlerUtility, Notification, GetDevicesServiceByProductType, OrderGetInventoryProductDetailService,
    GetOrdersbyFilterService) {
    return {
        getOrderResult: function () {
            var deferred = $q.defer();
            var dataCache = CSRCache;
            if (dataCache.get('SearchOrderResult')) {
                deferred.resolve(dataCache.get('SearchOrderResult'));
            }
            return deferred.promise;
        },
        getOrderDetail: function () {
            var deferred = $q.defer();
            var dataCache = CSRCache;
            if (dataCache.get('OrderDetail')) {
                deferred.resolve(dataCache.get('OrderDetail'));
            }
            return deferred.promise;
        },
        getInventoryAll: function () {
            var deferred = $q.defer();
            var dataCache = CSRCache;
            if (dataCache.get('InventoryList')) {
                deferred.resolve(dataCache.get('InventoryList'));
            } else {
                OrderGetInventoryProductDetailService.query({
                    PageNumber: 1, RowPerPage: 10,
                    ProductId: null, ProductName: null, SKU: null, ModelNumber: null,
                    BeginQuantityFrom: null, BeginQuantityTo: null, AvailableQuantityFrom: null, AvailableQuantityTo: null
                }, function (data) {
                    //TDO error handling is not finished
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        CSRCache.put('InventoryList', data);
                        deferred.resolve(data);
                    } else {
                        // Get the error message from the body response
                        var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        // Set notification for error message
                        Notification.error({
                            message: '<span>' + msg + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000,
                            title: "<span ><h5 style='color: white;'>Data is not found!!!</h5></span>"
                        });
                    }
                });
            }
            return deferred.promise;
        },
        getOrdersbyFilter: function (object) {
            var deferred = $q.defer();
            var dataCache = CSRCache;
            var cacheKey = 'OrdersbyFilter';
            var cacheKeyParam = 'OrdersbyFilter_param';
            if (dataCache.get(cacheKey) && angular.equals(dataCache.get(cacheKeyParam), angular.copy(object))) {
                deferred.resolve(dataCache.get(cacheKey));
            } else {
                GetOrdersbyFilterService.query(object, function (result) {
                    var data = angular.copy(result);
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        CSRCache.put(cacheKey, data);
                        CSRCache.put(cacheKeyParam, angular.copy(object));
                        deferred.resolve(data);
                    } else {
                        // Get the error message from the body response
                        var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        // Set notification for error message
                        Notification.error({
                            message: '<span>' + msg + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000,
                            title: "<span ><h5 style='color: white;'>Data is not found!!!</h5></span>"
                        });
                    }
                });
            }
            return deferred.promise;
        },
    }
});