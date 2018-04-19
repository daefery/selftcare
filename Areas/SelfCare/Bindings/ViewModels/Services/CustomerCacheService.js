SelfCareContent.service('CustomerCache', function ($q, $http, SelfCareCache, CustomerSummary, CustomerInfo, ErrorHandlerUtility, Notification) {
    return {
        getDataSummary: function (param) {
            var deferred = $q.defer();
            var dataCache = SelfCareCache;
            if (dataCache.get('summary')) {
                deferred.resolve(dataCache.get('summary'));
            } else {
                CustomerSummary.get(param ,function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        dataCache.put('summary', data);
						deferred.resolve(data);
                    } else {
                        Notification.error({
                            message: '<strong>Oopps!</strong> <span>'+data.message[0]+'</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                        dataCache.put('summary', data);
                        deferred.resolve(data);
                    }
                });
            }
            return deferred.promise;
        },
        getDataGeneral: function (param) {
            var deferred = $q.defer();
            var dataCache = SelfCareCache;
            if (dataCache.get('GeneralInfo')) {
                deferred.resolve(dataCache.get('GeneralInfo'));
            } else {
                CustomerInfo.getcustomerinfo.get(param ,function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        dataCache.put('GeneralInfo', data);
						deferred.resolve(data);
                    } else {
                        Notification.error({
                            message: '<strong>Oopps!</strong> <span>' + data.Messages[0] + '</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
					    dataCache.put('GeneralInfo', data);
					    deferred.resolve(data);
					}
                });
            }
            return deferred.promise;
        },
        getUsageDetail: function (params) {
            var deferred = $q.defer();
            var dataCache = SelfCareCache;
            if (dataCache.get('UsageDetails')) {
                deferred.resolve(dataCache.get('UsageDetails'));
            } else {
                CustomerInfo.getusageET.get(params, function (data) {

                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        dataCache.put('UsageDetails', data);
                        deferred.resolve(data);
                    } else {
                        Notification.error({
                            message: '<strong>Oopps!</strong> <span>' + data.message[0] + '</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                        dataCache.put('UsageDetails', data);
                        deferred.resolve(data);
                    }
                });
            }
            return deferred.promise;
        },
        getBalanceETNA: function (params) {
            var deferred = $q.defer();
            var dataCache = SelfCareCache;
            if (dataCache.get('querybalance')) {
                deferred.resolve(dataCache.get('querybalance'));
            } else {
                CustomerInfo.getbalanceETNA.get(params, function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        dataCache.put('querybalance', data);
                        deferred.resolve(data);
                    } else {
                        Notification.error({
                            message: '<strong>Oopps!</strong> <span>' + data.Messages[0] + '</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                        dataCache.put('querybalance', data);
                        deferred.resolve(data);
                    }
                });
            }
            return deferred.promise;
        },
        getBalanceET: function (params) {
            var deferred = $q.defer();
            var dataCache = SelfCareCache;
            if (dataCache.get('querybalance')) {
                deferred.resolve(dataCache.get('querybalance'));
            } else {
                CustomerInfo.getbalanceET.get(params, function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        dataCache.put('querybalance', data);
                        deferred.resolve(data);
                    } else {
                        Notification.error({
                            message: '<strong>Oopps!</strong> <span>' + data.message[0] + '</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                        dataCache.put('querybalance', data);
                        deferred.resolve(data);
                    }
                });
            }
            return deferred.promise;
        },
        getBalanceCommon: function (params) {
            var deferred = $q.defer();
            var dataCache = SelfCareCache;
            if (dataCache.get('querybalance')) {
                deferred.resolve(dataCache.get('querybalance'));
            } else {
                CustomerInfo.getbalanceCommon.get(params, function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        dataCache.put('querybalance', data);
                        deferred.resolve(data);
                    } else {
                        Notification.error({
                            message: '<strong>Oopps!</strong> <span>' + data.Messages[0] + '</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                        dataCache.put('querybalance', data);
                        deferred.resolve(data);
                    }
                });
            }
            return deferred.promise;
        },
        getRmPromotion: function (params) {
            var deferred = $q.defer();
            var dataCache = SelfCareCache;
            if (dataCache.get('rmPromotion')) {
                deferred.resolve(dataCache.get('rmPromotion'));
            } else {
                CustomerInfo.getRmPromotionUsage.get(params, function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        dataCache.put('rmPromotion', data);
                        deferred.resolve(data);
                    } else {
                        Notification.error({
                            message: '<strong>Oopps!</strong> <span>' + data.message[0] + '</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                        dataCache.put('rmPromotion', data);
                        deferred.resolve(data);
                    }
                });
            }
            return deferred.promise;
        },
    };
});