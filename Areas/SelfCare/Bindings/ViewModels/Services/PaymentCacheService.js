SelfCareContent.service('PaymentCache', function ($q, $http, SelfCareCache, ErrorHandlerUtility, Notification, PaymentService) {
    var dataCache = SelfCareCache;
    return {
        getBuckets: function (customerId) {
            var deferred = $q.defer(),
                cacheKey = 'getPaymentMeans-by' + customerId;
            var cacheVal = dataCache.get(cacheKey);
            if (cacheVal) {
                deferred.resolve(cacheVal);
            }
            else {
                PaymentService.GetPaymentMeans.get({ customerid: customerId }, function (result) {
                    CheckResultType(deferred, cacheKey, result);

                });
            };
            return deferred.promise;
        }
    };

    function CheckResultType(defer, cacheKey, data) {
        var deferred = defer;
        if (ErrorHandlerUtility.IsResultTypeOK(data)) {
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