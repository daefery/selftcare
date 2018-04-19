SelfCareContent.service('BuyMoreCacheService', function ($q, $http, $timeout, SelfCareCache, BuyMoreService) {
    return {
        getProduct: function (param) {
            var deferred = $q.defer();
            var dataCache = SelfCareCache;

            if (dataCache.get('productService')) {
                deferred.resolve(dataCache.get('productService'));
            } else {
                BuyMoreService.getProduct.get(param, function (data) {
                    dataCache.put('productService', data);
                    deferred.resolve(data);
                });
            }
            return deferred.promise;
        },
    };
});