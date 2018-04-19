commonModule.factory('MultiSubscriptionsCache', function ($cacheFactory) {
    return $cacheFactory('multisubsCache');
})

commonModule.service('MultiSubscriptionsCacheService', function ($q, $timeout, $filter, Notification, ErrorHandlerUtility, MultiSubscriptionsCache,
    MultiSubscriptionsResource, OrderSubscriptionsCacheService, CommonEnum) {
    var dataCache = MultiSubscriptionsCache;

    var MappingEnumForSubscription = function (SubscriptionInfo) {

        var Subscription = SubscriptionInfo.Subscription;
        if (Subscription != undefined && Subscription != null) {
            Subscription.subscriptionType = CommonEnum.convertMultiSubscriptionType(Subscription.PaymentType).name;
            Subscription.subscriptionCategory = CommonEnum.convertCustomerBusinessType(Subscription.SubscriptionCategory).name;
            Subscription.subscriptionStatus = CommonEnum.convertSubscriptionStatus(Subscription.SubscriptionStatus);
            Subscription.createdDate = Subscription.CreateDate != null && Subscription.CreateDate != undefined ?
                moment(Subscription.CreateDate).format(config.DateFormatMoment) : null;
            Subscription.firstUsed = Subscription.FirstUsed != null && Subscription.FirstUsed != undefined ?
                moment(Subscription.FirstUsed).format(config.DateFormatMoment) : null;

            Subscription.SubscriptionId = SubscriptionInfo.UserIdentifier;  //fast handling for name changing !!
        }

        var SimCard = SubscriptionInfo.SimCardInfo;
        if (SimCard != undefined && SimCard != null) {
            SimCard.simStatus = CommonEnum.convertSimStatus(SimCard.Status);
        }
        return SubscriptionInfo;
    }

    return {
        //get subscription list
        //if there is not actived subscription, get order list
        getSubscriptionsList: function (customerId, clearCache) {

            var deferred = $q.defer();

            var cacheKey = 'SubscriptionsListByCustomerId';
            var objectParam = angular.copy(customerId);

            if (clearCache == true) {
                dataCache.remove(cacheKey);
                dataCache.remove('OrderBySubscriptionIdentifier');
            }

            var compareObject = false;
            var cacheResult = CheckCacheArray(cacheKey, objectParam);
            if (cacheResult != null) {
                compareObject = true;
                $timeout(function () {
                    deferred.resolve(cacheResult);
                }, 1000);
            }

            if (compareObject == false) {
                MultiSubscriptionsResource.getSubscriptionsList.get({ customerId: customerId }, function (result) {

                    if (ErrorHandlerUtility.IsResultTypeOK(result)) {

                        var SubscriptionList = result.Subscriptions;
                        var OrderPromises = [];
                        for (var i = 0; i < SubscriptionList.length; i++) {
                            var SubscriptionInfo = SubscriptionList[i];
                            //mapping Enum begin
                            SubscriptionInfo = MappingEnumForSubscription(SubscriptionInfo);
                            //mapping Enum end

                            var subsidentifier = SubscriptionInfo.Subscription.SubscriptionId;

                            //if there is not actived subscription, get order list
                            SubscriptionInfo.OrderInfo = null;
                            //if (SubscriptionInfo.Subscription.SubscriptionStatus == 8) // Init
                            {
                                var OrderPromise = OrderSubscriptionsCacheService.getOrderBySubscriptionIdentifier(subsidentifier, clearCache)
                                    .then(function (result) {
                                        var SubscriptionIdentifier = result.SubscriptionIdentifier; //hardcode for SubscriptionList (*1)
                                        if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                                            var SubscriptionInfo = $filter('filter')(SubscriptionList, {
                                                Subscription: {
                                                    SubscriptionId: SubscriptionIdentifier
                                                }
                                            })[0];
                                            if (SubscriptionInfo != null) {
                                                SubscriptionInfo.OrderInfo = result.Order;
                                            }
                                        }
                                    });
                                OrderPromises.push(OrderPromise);
                            }
                            SubscriptionInfo.SimCard = SubscriptionInfo.SimCardInfo;
                        }
                        $q.all(OrderPromises).then(function (results) {
                            StoreCacheArray(cacheKey, result, objectParam);
                            deferred.resolve(result);
                        })
                    } else {
                        var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(result);
                        Notification.error({
                            message: '<span>SubscriptionsListByCustomerId ' + ErrorMessage + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000
                        });
                        deferred.resolve(result);
                    }
                });

            };
            return deferred.promise;
        },
    };

    function CheckCacheArray(cacheKey, objectParam) {
        var dataCache = MultiSubscriptionsCache;
        var cacheParamKey = cacheKey + 'Param';
        var compareObject = false;
        var cacheItem = null;
        if (dataCache.get(cacheKey)) {
            for (var i = 0; i < dataCache.get(cacheKey).length; i++) {
                compareObject = angular.equals(dataCache.get(cacheKey)[i].keySearch, angular.copy(objectParam));
                if (compareObject == true) {
                    dataCache.put(cacheParamKey, angular.copy(objectParam));  //last search
                    cacheItem = dataCache.get(cacheKey)[i].resultdata;
                    return cacheItem;
                }
            }
        }
        return cacheItem;
    }

    function StoreCacheArray(cacheKey, data, objectParam) {
        var dataCache = MultiSubscriptionsCache;
        var cacheParamKey = cacheKey + 'Param';
        var storedata = {
            resultdata: data,
            keySearch: angular.copy(objectParam),
        }
        var storelistdata = [];
        if (dataCache.get(cacheKey) == undefined || dataCache.get(cacheKey).length == 0) {
            storelistdata.push(storedata);
        } else {
            storelistdata = dataCache.get(cacheKey);
            storelistdata.push(storedata);
        }
        dataCache.put(cacheKey, storelistdata);
        dataCache.put(cacheParamKey, angular.copy(objectParam));
    };
});


commonModule.service('OrderSubscriptionsCacheService', function ($q, $timeout, MultiSubscriptionsCache, MultiSubscriptionsResource, Notification, ErrorHandlerUtility) {
    var dataCache = MultiSubscriptionsCache;

    return {
        getOrderBySubscriptionIdentifier: function (subsidentifier, clearCache) {

            var deferred = $q.defer();

            var cacheKey = 'OrderBySubscriptionIdentifier';
            var objectParam = angular.copy(subsidentifier);

            if (clearCache == true) {
                dataCache.remove(cacheKey);
            }

            var compareObject = false;
            var cacheResult = CheckCacheArray(cacheKey, objectParam);
            if (cacheResult != null) {
                compareObject = true;
                $timeout(function () {
                    deferred.resolve(cacheResult);
                }, 1000);
            }

            if (compareObject == false) {
                MultiSubscriptionsResource.getOrderItem.get({ subsidentifier: subsidentifier }, function (result) {
                    result.SubscriptionIdentifier = subsidentifier; //hardcode for SubscriptionList (*1)
                    if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                        StoreCacheArray(cacheKey, result, objectParam);
                        deferred.resolve(result);
                    } else {
                        var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(result);
                        Notification.error({
                            message: '<span>OrderBySubscriptionIdentifier ' + ErrorMessage + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000
                        });
                        deferred.resolve(result);
                    }
                });

            };
            return deferred.promise;
        }
    };

    function CheckCacheArray(cacheKey, objectParam) {
        var dataCache = MultiSubscriptionsCache;
        var cacheParamKey = cacheKey + 'Param';
        var compareObject = false;
        var cacheItem = null;
        if (dataCache.get(cacheKey)) {
            for (var i = 0; i < dataCache.get(cacheKey).length; i++) {
                compareObject = angular.equals(dataCache.get(cacheKey)[i].keySearch, angular.copy(objectParam));
                if (compareObject == true) {
                    dataCache.put(cacheParamKey, angular.copy(objectParam));  //last search
                    cacheItem = dataCache.get(cacheKey)[i].resultdata;
                    return cacheItem;
                }
            }
        }
        return cacheItem;
    }

    function StoreCacheArray(cacheKey, data, objectParam) {
        var dataCache = MultiSubscriptionsCache;
        var cacheParamKey = cacheKey + 'Param';
        var storedata = {
            resultdata: data,
            keySearch: angular.copy(objectParam),
        }
        var storelistdata = [];
        if (dataCache.get(cacheKey) == undefined || dataCache.get(cacheKey).length == 0) {
            storelistdata.push(storedata);
        } else {
            storelistdata = dataCache.get(cacheKey);
            storelistdata.push(storedata);
        }
        dataCache.put(cacheKey, storelistdata);
        dataCache.put(cacheParamKey, angular.copy(objectParam));
    };
});