SelfCareRegister.factory('SelfCareRegistrationCache', function ($cacheFactory) {
    return $cacheFactory('RegisterCache');
})
SelfCareRegister.service('CustomerRegistrationCache', function ($q, $http, SelfCareRegistrationCache, CustomerDetailByMsisdn, ErrorHandlerUtility) {
    return {
        getUserbyMsisdn: function (params) {
            var deferred = $q.defer();
            var dataCache = SelfCareRegistrationCache;
            if (dataCache.get('CustomerByMsisd')) {
                deferred.resolve(dataCache.get('CustomerByMsisd'));
            } else {
                CustomerDetailByMsisdn.userverifybymsisdn.get(params, function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        dataCache.put('CustomerByMsisd', data);
                        deferred.resolve(data);
                    } else {
                        dataCache.put('CustomerByMsisd', data);
                        deferred.resolve(data);
                    }
                });
            }
            return deferred.promise;
        }
    };
});