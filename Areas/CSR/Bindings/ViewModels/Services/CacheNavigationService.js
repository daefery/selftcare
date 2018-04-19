CSRContent.service('CacheNavigationService', function ($q, $http, CSRCache, ApiConnection, ErrorHandlerUtility, Notification, CSRNavigation, CSRSideBar, CSRSecureSection) {
    //------------------------------------------------------------
    //Keys that used in this CacheNavigationService
    //------------------------------------------------------------
    var CSRNavigationKey = 'CSRNavigation';
    var CSRSidebarKey = 'CSRSidebar';
    var CSRSecureSectionKey = 'CSRSecureSection';
    //------------------------------------------------------------
    var dataCache = CSRCache;
    var cacheKeys = Object.create(null);
    return {
        getCSRNavigation: function () {
            cacheKeys[CSRNavigationKey] = CSRNavigationKey;
            var deferred = $q.defer();
            if (dataCache.get(CSRNavigationKey)) {
                deferred.resolve(dataCache.get(CSRNavigationKey));
            } else {
                CSRNavigation.get(function (data) {
                    if (data.$status == 200) {
                        CSRCache.put(CSRNavigationKey, data);
                        deferred.resolve(data);
                    } else {
                        Notification.error({
                            message: '<span>CSRNavigation data cannot be found!</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000,
                            title: "<span><h5 style='color: white;'>Data Not found</h5></span>"
                        });
                    }
                });
            }
            return deferred.promise;
        },        

        getSidebar: function (curModuleId) {
            var key = CSRSidebarKey + curModuleId;
            cacheKeys[key] = key;
            var deferred = $q.defer();
            if (dataCache.get(key)) {
                deferred.resolve(dataCache.get(key));
            } else {
                CSRSideBar.get({ ModuleId: curModuleId }, function (data) {
                    if (data.$status == 200) {
                        CSRCache.put(key, data);
                        deferred.resolve(data);
                    } else {
                        Notification.error({
                            message: '<span>Sidebar data cannot be found!</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000,
                            title: "<span><h5 style='color: white;'>Data Not found</h5></span>"
                        });
                    }
                });
            }
            return deferred.promise;
        },

        getSecureSection: function (curModuleId) {
            var key = CSRSecureSectionKey + curModuleId;
            cacheKeys[key] = key;
            var deferred = $q.defer();
            if (dataCache.get(key)) {
                deferred.resolve(dataCache.get(key));
            } else {
                CSRSecureSection.get({ ModuleId: curModuleId }, function (data) {
                    if (data.$status == 200) {
                        CSRCache.put(key, data);
                        deferred.resolve(data);
                    } else {
                        Notification.error({
                            message: '<span>Secure Section data cannot be found!</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000,
                            title: "<span><h5 style='color: white;'>Data Not found</h5></span>"
                        });
                    }
                });
            }
            return deferred.promise;
        },

        removeAllCSRNavigationKey: function () {
            Object.getOwnPropertyNames(cacheKeys).forEach(function (key) {
                if (key.indexOf(CSRNavigationKey) > -1) {
                    dataCache.remove(cacheKeys[key]);
                };
            });
        },

        removeAllSidebarKey: function () {
            Object.getOwnPropertyNames(cacheKeys).forEach(function (key) {
                if (key.indexOf(CSRSidebarKey) > -1) {
                    dataCache.remove(cacheKeys[key]);
                };
            });
        },

        removeAllSecureSectionKey: function () {
            Object.getOwnPropertyNames(cacheKeys).forEach(function (key) {
                if (key.indexOf(CSRSecureSectionKey) > -1) {
                    dataCache.remove(cacheKeys[key]);
                };
            });
        },

        removeAllKeys: function () {
            Object.getOwnPropertyNames(cacheKeys).forEach(function (key) {
                dataCache.remove(cacheKeys[key]);
            });
        }
    }
});