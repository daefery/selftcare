SelfCareContent.service('NavigationMenuCache', function ($q, $http, SelfCareCache, SelfCareDashboard, SelfCareNavigation) {
    return {
        getDataDynamic: function () {
            var deferred = $q.defer();
            var dataCache = SelfCareCache;

            // Now that control of inserting/removing from the cache is in our hands,
            // we can interact with the data in "dataCache" outside of this context,
            // e.g. Modify the data after it has been returned from the server and
            // save those modifications to the cache.
            if (dataCache.get('DynamicMenu')) {
                deferred.resolve(dataCache.get('DynamicMenu'));
            } else {

                SelfCareDashboard.get(function (data) {
                    SelfCareCache.put('DynamicMenu', data);
                    deferred.resolve(data);
                });
            }
            return deferred.promise;
        },
        getDataNavMenu: function () {
            var deferred = $q.defer();
            var dataCache = SelfCareCache;

            // Now that control of inserting/removing from the cache is in our hands,
            // we can interact with the data in "dataCache" outside of this context,
            // e.g. Modify the data after it has been returned from the server and
            // save those modifications to the cache.
            if (dataCache.get('NavMenu')) {
                deferred.resolve(dataCache.get('NavMenu'));
            } else {

                SelfCareNavigation.get(function (data) {
                    SelfCareCache.put('NavMenu', data);
                    deferred.resolve(data);
                });
            }
            return deferred.promise;
        }
    };
});