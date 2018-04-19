SelfCareContent.service('ManageDeviceCacheService', function ($q, SelfCareCache, ManageDeviceService, Notification) {
    var dataCache = SelfCareCache;
    return {
        getMultisubscription: function (customerId) {
            var deferred = $q.defer(),
                cacheKey = 'getMultisubscription-by' + customerId;
            var cacheVal = dataCache.get(cacheKey);
            if (cacheVal) {
                deferred.resolve(cacheVal);
            }
            else {
                ManageDeviceService.GetMultisubscription.get({ customerId: customerId }, function (result) {
                    CheckResultType(deferred, cacheKey, result);
                });
            };
            return deferred.promise;
        },
        getDummyMultuSubscription: function () {
            var deferred = $q.defer();
            var dataCache = SelfCareCache;
            if (dataCache.get('DummyDevices')) {
                deferred.resolve(dataCache.get('DummyDevices'));
            } else {
                var dummy = {
                    Subscription: [
                        { MSISDN: wrapper.activeDevice.Msisdn, STATUS: "ACTIVE", Type: "Single" },
                    ],
                    CustomerID: wrapper.customerInfo.CustomerID
                }
                dataCache.put('DummyDevices', dummy);
                deferred.resolve(dummy);
            }
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