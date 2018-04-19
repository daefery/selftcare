//Mahdi Badari 28.10.015
//This service is dedicated to user account detail. It will put the query data result to the cache. If the cache is empty, then it will request the data. If it isn't then it will access inside cache

CSRContent.service('CacheMyAccount', function ($q, $http, CSRCache, GetUserPropertiesService, GetUserCredentialService, ApiConnection, ErrorHandlerUtility, Notification) {
    return {
        getAccountProperties: function () {
            var deferred = $q.defer();
            var dataCache = CSRCache;
            if (dataCache.get('accountOverview')) {
                deferred.resolve(dataCache.get('accountOverview'));
            } else {
                GetUserPropertiesService.get(function (data) {
                    //TDO error handling is not finished
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        CSRCache.put('accountOverview', data);
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
        getAccountCredential: function () {
            var deferred = $q.defer();
            var dataCache = CSRCache;
            if (dataCache.get('accountCredential')) {
                deferred.resolve(dataCache.get('accountCredential'));
                //$("#listCustDetail").addClass("active");
                //$("#listDashboard").removeClass("active");
            } else {
                GetUserCredentialService.get(function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                    CSRCache.put('accountCredential', data);
                    deferred.resolve(data);
                    } else {
                        //$scope.ErrorMessage = ErrorHandlerUtility.GetErrorMessage(data);
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
        }
    };
});