publicContent.factory('SelfPublicCache', function ($cacheFactory) {
    return $cacheFactory('PublicCache');
});
publicContent.service('SelfActivationCache', function ($q, $http, SelfActivationResource, SelfPublicCache, CommonEnum) {
    return {
        getCustomerOrder: function (params) {
            var deferred = $q.defer();
            var dataCache = SelfPublicCache;
            if (dataCache.get('order_detail')) {
                deferred.resolve(dataCache.get('order_detail'));
            } else {
                SelfActivationResource.getOrderDetail.get(params, function (data) {
                    var datadummy = angular.copy(data);
                    SelfPublicCache.put('order_detail', datadummy);
                    deferred.resolve(datadummy);
                });
            }
            return deferred.promise;
        },
    };
});