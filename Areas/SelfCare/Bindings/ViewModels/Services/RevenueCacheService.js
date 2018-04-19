SelfCareContent.service('RevenueCache', function ($q, $http, SelfCareCache, ErrorHandlerUtility, Notification, RevenueService) {
    var dataCache = SelfCareCache;
    return {
        getBuckets: function (mobileNumber, balanceType, sweepOn) {
            var deferred = $q.defer(),
                cacheKey = 'getBuckets-by' + mobileNumber + balanceType + sweepOn;
            var cacheVal = dataCache.get(cacheKey);
            if (cacheVal) {
                deferred.resolve(cacheVal);
            }
            else {
                RevenueService.getBuckets.get({ mobileNumber: mobileNumber, balanceType: balanceType, sweepOn: sweepOn }, function (result) {
                    CheckResultType(deferred, cacheKey, result);
                });
            };
            return deferred.promise;
        }
    };

    function CheckResultType(defer, cacheKey, data) {
        var deferred = defer;
        //if (ErrorHandlerUtility.IsResultTypeOK(data)) {
        if (data.ResultType === 0 && data.ResultCode === 0) {
            dataCache.put(cacheKey, data);
            deferred.resolve(data);
        } else {
            NotificationError(data);
        }
    };
    function NotificationError(data) {
        //var errorMessage = ErrorHandlerUtility.GetErrorMessage(data);
        var errorMessage = data.Messages;
        return Notification.error({
            message: '<span>' + errorMessage + '</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 10000
        });
    };
});