SelfCareContent.service('SupportCache', function ($q, $http, SelfCareCache, GetTroubleTicket, ErrorHandlerUtility, Notification) {
    return {
        getTroubleTicket: function (param) {
            var deferred = $q.defer();
            var dataCache = SelfCareCache;

            if (dataCache.get('getTT')) {
                deferred.resolve(dataCache.get('getTT'));
            } else {
                GetTroubleTicket.get(param, function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        dataCache.put('getTT', data);
                        deferred.resolve(data);
                    } else {
                        Notification.error({
                            message: '<strong>Oopps!</strong> <span>' + data.message[0] + '</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                        dataCache.put('getTT', data);
                        deferred.resolve(data);
                    }
                });
            }
            return deferred.promise;
        }
    };
});