CSRContent.service('CacheSearch', function ($q, $rootScope, $http, $location, CSRCache, GetUserDetail, ApiConnection, ErrorHandlerUtility, Notification, UserDetailUtility) {
    return {
        getUserDetails: function () {
            var deferred = $q.defer();
            var dataCache = CSRCache;
            GetUserDetail.query({email : emailuser}, function (data) {
                //TDO error handling is not finished
                if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                    //CSRCache.put('accountOverview', data);
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

            return deferred.promise;
        }
    }
});