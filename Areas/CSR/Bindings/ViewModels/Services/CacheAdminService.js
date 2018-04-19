CSRContent.service('CacheAdmin', function ($q, $http, CSRCache, GetAllMVNOService, ApiConnection, ErrorHandlerUtility, Notification, CSRSitemap) {
    return {
        getallMvno: function () {
            var deferred = $q.defer();
            var dataCache = CSRCache;
            if (dataCache.get('allmvno')) {
                deferred.resolve(dataCache.get('allmvno'));
            } else {
                GetAllMVNOService.query(function (data) {
                    //TDO error handling is not finished
                    if (data.$status == 200) {
                        CSRCache.put('allmvno', data);
                        deferred.resolve(data);
                    } else {
                        // Get the error message from the body response
                        //var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        // Set notification for error message
                        Notification.error({
                            message: '<span>Data cannot be found</span>',
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

        getSitemap: function () {
        var deferred = $q.defer();
        var dataCache = CSRCache;
        if (dataCache.get('sitemap')) {
            deferred.resolve(dataCache.get('sitemap'));
        } else {
            CSRSitemap.query(function (data) {
                //TDO error handling is not finished
                if (data.$status == 200) {
                    CSRCache.put('sitemap', data);
                    deferred.resolve(data);
                } else {
                    // Get the error message from the body response
                    //var msg = ErrorHandlerUtility.GetErrorMessage(data);
                    // Set notification for error message
                    Notification.error({
                        message: '<span>Data cannot be found</span>',
                        positionY: 'top',
                        positionX: 'center',
                        delay: 10000,
                        title: "<span ><h5 style='color: white;'>Data is not found!!!</h5></span>"
                    });
                }
            });
        }
        return deferred.promise;
    }
    }
});