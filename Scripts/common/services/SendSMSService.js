commonModule.factory('SendSMSService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/selfcare/sendsms', {}, {
    });
});

commonModule.service('sendSMSFunction', function ($q, SendSMSService, ErrorHandlerUtility) {
    return {
        send: function (param) {
            var deferred = $q.defer();
            var data = {
                "MobileNumbers": param.msisdn,
                "DeliveryReport": true,
                "Priority": 1,
                "EmergentFlag": false,
                "Body": param.body,
            }

            SendSMSService.save(data, function (result) {
                if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                    deferred.resolve(true);
                } else {
                    deferred.resolve(true);
                }
            });
            return deferred.promise;
        }
    }
});