publicContent.service('RegistrationCache', function ($q, $http, ApiConnection, SelfPublicCache,
                                                    queryAvailablePromotions, queryAvailableMSISDN, queryPackageInfo, createNewCustomer,GetDevicesService,GetShippingMethodService,getPaymentMethodsService,
                                                    ErrorHandlerUtility, Notification,GetProductsService,GetPlanService,
                                                    dealerIdService, queryMsisdnElementService, CustomerInfoService, GetDeviceImageService, CarrierListService, GetPlanByodService,
                                                    GetAllowanceCashCardService) {
    return {
        getAvailablePromotions: function() {
            var param = dealerIdService.getDealerId();
            var deferred = $q.defer();
            var dataCache = SelfPublicCache;
            if ((dataCache.get('dealerId' === param)) && (dataCache.get('queryPromotions'))) {
                deferred.resolve(dataCache.get('queryPromotions'));
            } else {
                queryAvailablePromotions.get({ dealerId: param }, function(data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        SelfPublicCache.put('queryPromotions', data);
                        SelfPublicCache.put('dealerId', param);
                        deferred.resolve(data);
                    } else {
                        var msg = ErrorHandlerUtility.GetErrorMessage(data);

                        Notification.error({
                            message: '<span>' + msg + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000,
                            title: "<span><h5 style='color:white;'>Data is not found!!!</h5></span>"
                        });
                        deferred.resolve(dataCache.get('queryPromotions'));

                    }
                });
            };
            return deferred.promise;
        },
        getAvailableMsisdns: function() {
            var queryElement = queryMsisdnElementService.getQueryElement();
            var categoryId = queryElement.categoryId;
            var quantity = queryElement.quantity;
            var deferred = $q.defer();
            var dataCache = SelfPublicCache;
            if ((dataCache.get('categoryId') === categoryId) && (dataCache.get('queryAvailableMsisdn'))) {
                deferred.resolve(dataCache.get('queryAvailableMsisdn'));
            } else {
                queryAvailableMSISDN.get({ CategoryId: categoryId, Quantity: quantity }, function(data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        SelfPublicCache.put('queryAvailableMsisdn', data);
                        SelfPublicCache.put('categoryId', categoryId);
                        deferred.resolve(data);
                    } else {
                        var msg = ErrorHandlerUtility.GetErrorMessage(data);

                        Notification.error({
                            message: '<span>' + msg + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000,
                            title: "<span><h5 style='color:white;'>Data is not found!!!</h5></span>"
                        });
                        deferred.resolve(dataCache.get('queryAvailableMsisdn'));
                    }
                });
            }
            return deferred.promise;
        },
        getAvailablePackage: function() {
            var param = dealerIdService.getDealerId();
            var deferred = $q.defer();
            var dataCache = SelfPublicCache;
            if ((dataCache.get('dealerId' === param)) && (dataCache.get('queryPackages'))) {
                deferred.resolve(dataCache.get('queryPackages'));
            } else {
                queryPackageInfo.get({ dealerId: param }, function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        SelfPublicCache.put('queryPackages', data);
                        SelfPublicCache.put('dealerId', param);
                        deferred.resolve(data);
                    } else {
                        var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        Notification.error({
                            message: '<span>' + msg + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000,
                            title: "<span><h5 style='color:white;'>Data is not found!!!</h5></span>"
                        });
                        deferred.resolve(dataCache.get('queryPackages'));

                    }
                });
            };
            return deferred.promise;
        },
        getAvailableShippingMethod: function () {
            var deferred = $q.defer();
            var dataCache = SelfPublicCache;
            if (dataCache.get('queryShipMethod')) {
                deferred.resolve(dataCache.get('queryShipMethod'));
            } else {
                GetShippingMethodService.get(function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        SelfPublicCache.put('queryShipMethod', data);
                        deferred.resolve(data);
                    } else {
                        var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        Notification.error({
                            message: '<span>' + msg + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000,
                            title: "<span><h5 style='color:white;'>Shipping Method Data is not found!!!</h5></span>"
                        });
                        deferred.resolve(dataCache.get('queryShipMethod'));
                    }
                });
            }
            return deferred.promise;
        },
        getListPaymentMethod: function() {
            var deferred = $q.defer();
            var dataCache = SelfPublicCache;
            if (dataCache.get('queryPaymentMethod')) {
                deferred.resolve(dataCache.get('queryPaymentMethod'));
            } else {
                getPaymentMethodsService.get(function (data) {
                    if (data.resultCode === 0) {
                        SelfPublicCache.put('queryPaymentMethod', data);
                        deferred.resolve(data);
                    } else {
                        var msg = data.messages[0];
                        Notification.error({
                            message: '<span>' + msg + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 1000,
                            title: "<span><h5 style='color:white;'>Payment Method is not found!!!</h5></span>"
                        });
                        deferred.resolve(dataCache.get('queryPaymentMethod'));
                    }
                    //if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                    //    SelfPublicCache.put('queryPaymentMethod', data);
                    //    deferred.resolve(data);
                    //} else {
                    //    var msg = ErrorHandlerUtility.GetErrorMessage(data);
                    //    Notification.error({
                    //        message: '<span>' + msg + '</span>',
                    //        positionY: 'top',
                    //        positionX: 'center',
                    //        delay: 1000,
                    //        title: "<span><h5 style='color:white;'>Payment Method is not found!!!</h5></span>"
                    //    });
                    //    deferred.resolve(dataCache.get('queryPaymentMethod'));
                    //}
                });
            }
            return deferred.promise;
        }, getPlan: function () {
            var deferred = $q.defer();
            var dataCache = SelfPublicCache;
            if (dataCache.get('queryPlan')) {
                deferred.resolve(dataCache.get('queryPlan'));
            } else {
                GetPlanService.get(function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        SelfPublicCache.put('queryPlan', data);
                        deferred.resolve(data);
                    } else {
                        var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        Notification.error({
                            message: '<span>' + msg + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000,
                            title: "<span><h5 style='color:white;'>Plan is not found!!!</h5></span>"
                        });
                        deferred.resolve(dataCache.get('queryPlan'));
                    }
                });
            }
            return deferred.promise;
        },
        getCustomerInfo: function (param) {
            var deferred = $q.defer();
            var dataCache = SelfPublicCache;
            if (dataCache.get('CustomerInfo')) {
                deferred.resolve(dataCache.get('CustomerInfo'));
            } else {
                CustomerInfoService.get(param, function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        dataCache.put('CustomerInfo', data);
                        deferred.resolve(data);
                    } else {
                        Notification.error({
                            message: '<strong>Oopps!</strong> <span>' + data.Messages[0] + '</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                        dataCache.put('CustomerInfo', data);
                        deferred.resolve(data);
                    }
                });
            }
            return deferred.promise;
        },
        getDeviceImage: function(imageUrl,deviceId) {
            var deferred = $q.defer();
            var dataCache = SelfPublicCache;
            if (dataCache.get('deviceImage' + deviceId)) {
                deferred.resolve(dataCache.get('deviceImage' + deviceId));
            } else {
                GetDeviceImageService.get({url:imageUrl}, function(data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        dataCache.put('deviceImage' + deviceId, data);
                        deferred.resolve(data);
                    } else {
                        Notification.error({
                            message: '<strong>Oopps!</strong> <span>' + data.Messages[0] + '</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                        dataCache.put('deviceImage' + deviceId, data);
                        deferred.resolve(data);
                    }
                });
            }
            return deferred.promise;
        },
        getCarrierList: function() {
            var deferred = $q.defer();
            var dataCache = SelfPublicCache;
            if (dataCache.get('carrierList')) {
                deferred.resolve(dataCache.get('carrierList'));
            } else {
                CarrierListService.get(function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        dataCache.put('carrierList', data);
                        deferred.resolve(data);
                    } else {
                        Notification.error({
                            message: '<strong>Oopps!</strong> <span>' + data.Messages[0] + '</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                        dataCache.put('carrierList', data);
                        deferred.resolve(data);
                    }
                });
            }
            return deferred.promise;
        },
        getPlanByod: function(param) {
            var deferred = $q.defer();
            var dataCache = SelfPublicCache;
            if (dataCache.get('planByod'+param)) {
                deferred.resolve(dataCache.get('planByod'+param));
            } else {
                GetPlanByodService.get({ProductOfferingId:param},function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        dataCache.put('planByod'+param, data);
                        deferred.resolve(data);
                    } else {
                        Notification.error({
                            message: '<strong>Oopps!</strong> <span>' + data.Messages[0] + '</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                        deferred.resolve(data);
                    }
                });
            }
            return deferred.promise;
        },
        getAllowanceCashCard: function() {
            var deferred = $q.defer();
            var dataCache = SelfPublicCache;
            if (dataCache.get('allowanceCashCard')) {
                deferred.resolve(dataCache.get('allowanceCashCard'));
            } else {
                GetAllowanceCashCardService.get(function(data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        dataCache.put('allowanceCashCard', data);
                        deferred.resolve(data);
                    } else {
                        Notification.error({
                            message: '<strong>Oopps!</strong> <span>' + data.Messages[0] + '</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                        deferred.resolve(data);
                    }
                });
            }
            return deferred.promise;
        }
}
});

