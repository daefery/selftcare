//Agung Meinastesi Caesar 16.10.2015
//This service is dedicated to the search customer. It will put the search data  result to the cache. If the cache is empty then it will request the data. If it isn't then it will access through cache

CSRContent.service('CacheSearch', function ($q, $timeout, $rootScope, $http, $location, CSRCache, SearchCustomerTroubleTicketsService, SearchPageService,
    SearchCustomerDetailService, ApiConnection, ErrorHandlerUtility, Notification, AdvanceSearchService, advancesearchelementService, dealerIdService,
    BrowseTTService, SupportRequestTTService, SearchTroubleTicketsByCustomerIdService, pagingSearchTroubleTicketByCustomerId, SupportRequestTTDetailService,
    WorkFlowConfigurationTTService, TroubleTicketFunctionService, GetMultiDevicebyParentService, SearchCustomerGeneralInfoService, GetCustomerIdByPhoneNumberService, CSRGetCustomerBalanceService,
    SearchMultiSubscriptionByCustomerIdService, SearchSubscriptionByMSISDNService, GetCustomerProductsByMSISDNService) {
    return {
        getMultiDevices: function (customerid) {
            var deferred = $q.defer();
            var dataCache = CSRCache;
            if (dataCache.get('resultviewmultidev')) {
                deferred.resolve(dataCache.get('resultviewmultidev'));
            } else {
                GetMultiDevicebyParentService.get({ parentId: customerid }, function (data) {
                    //TDO error handling is not finished
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        CSRCache.put('resultviewmultidev', data);
                        deferred.resolve(data);
                    } else {
                        // Get the error message from the body response
                        var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        deferred.resolve(data);
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
        getCustomerBalance: function (msisdn) {
            var deferred = $q.defer();
            var dataCache = CSRCache;

            var cacheKey = 'resultcustbalance';
            var cacheParamKey = 'resultcustbalance_msisdn';
            var object = msisdn;

            if (CSRCache.get(cacheKey)) {
                for (var i = 0; i < CSRCache.get(cacheKey).length; i++) {
                    compareObject = angular.equals(CSRCache.get(cacheKey)[i].keySearch, angular.copy(object));
                    if (compareObject == true) {
                        CSRCache.put(cacheParamKey, angular.copy(object));  //last search keySearch/pageNumber
                        deferred.resolve(CSRCache.get(cacheKey)[i].resultdata)
                        return deferred.promise;
                    }
                }
            }

            if (dataCache.get(cacheKey) && dataCache.get(cacheParamKey) == msisdn) {
                deferred.resolve(dataCache.get(cacheKey));
            } else {
                CSRGetCustomerBalanceService.get({ mobileNumber: msisdn }, function (data) {
                    //TDO error handling is not finished
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        var storedata = {
                            resultdata: data,
                            keySearch: angular.copy(object),
                        }
                        var storelistdata = [];
                        if (CSRCache.get(cacheKey) == undefined || CSRCache.get(cacheKey).length == 0) {
                            storelistdata.push(storedata);
                        } else {
                            storelistdata = CSRCache.get(cacheKey);
                            storelistdata.push(storedata);
                        }
                        CSRCache.put(cacheKey, storelistdata);
                        deferred.resolve(storedata.resultdata);
                        CSRCache.put(cacheParamKey, angular.copy(object));
                    } else {
                        // Get the error message from the body response
                        var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        deferred.resolve(data);
                        // Set notification for error message
                        Notification.error({
                            message: '<span>' + msg + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000,
                            title: "<span ><h5 style='color: white;'>Balance is not found!!!</h5></span>"
                        });
                    }
                });
            }
            return deferred.promise;
        },
        getCustomerProducts: function (MobileNumber) {
            var deferred = $q.defer();
            var dataCache = CSRCache;

            var cacheKey = 'resultCustomerProducts';
            var cacheParamKey = 'resultCustomerProducts_msisdn';
            var object = MobileNumber;

            if (CSRCache.get(cacheKey)) {
                for (var i = 0; i < CSRCache.get(cacheKey).length; i++) {
                    compareObject = angular.equals(CSRCache.get(cacheKey)[i].keySearch, angular.copy(object));
                    if (compareObject == true) {
                        CSRCache.put(cacheParamKey, angular.copy(object));  //last search keySearch/pageNumber
                        deferred.resolve(CSRCache.get(cacheKey)[i].resultdata)
                        return deferred.promise;
                    }
                }
            }

            if (dataCache.get(cacheKey) && dataCache.get(cacheParamKey) == MobileNumber) {
                deferred.resolve(dataCache.get(cacheKey));
            } else {
                GetCustomerProductsByMSISDNService.get({ MobileNumber: MobileNumber }, function (data) {
                    //TDO error handling is not finished
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        //process 
                        if (data !== undefined && data !== null) {
                            if (data.Plan !== undefined && data.Plan !== null) {
                                var PlanProducts = data.Plan;

                                PlanProducts.startDate = PlanProducts.StartDate != null ? moment(PlanProducts.StartDate).format(config.DateFormatMoment) : '';
                                PlanProducts.endDate = PlanProducts.EndDate != null ? moment(PlanProducts.EndDate).format(config.DateFormatMoment) : '';
                            }
                            if (data.Device !== undefined && data.Device !== null) {
                                var DeviceProducts = data.Device;

                                DeviceProducts.startDate = DeviceProducts.StartDate != null ? moment(DeviceProducts.StartDate).format(config.DateFormatMoment) : '';
                                DeviceProducts.endDate = DeviceProducts.EndDate != null ? moment(DeviceProducts.EndDate).format(config.DateFormatMoment) : '';
                            }
                            if (data.FeaturesAndPromotions !== undefined && data.FeaturesAndPromotions !== null) {
                                var FeaturesAndPromotions = data.FeaturesAndPromotions;

                                FeaturesAndPromotions.forEach(function (e) {
                                    e.startDate = e.StartDate != null ? moment(e.StartDate).format(config.DateFormatMoment) : '';
                                    e.endDate = e.EndDate != null ? moment(e.EndDate).format(config.DateFormatMoment) : '';
                                });
                            }

                            if (data.BucketInfo !== undefined && data.BucketInfo !== null) {
                                BucketsList = data.BucketInfo.BucketsList;
                            }
                        }

                        var storedata = {
                            resultdata: data,
                            keySearch: angular.copy(object),
                        }
                        var storelistdata = [];
                        if (CSRCache.get(cacheKey) == undefined || CSRCache.get(cacheKey).length == 0) {
                            storelistdata.push(storedata);
                        } else {
                            storelistdata = CSRCache.get(cacheKey);
                            storelistdata.push(storedata);
                        }
                        CSRCache.put(cacheKey, storelistdata);
                        deferred.resolve(storedata.resultdata);
                        CSRCache.put(cacheParamKey, angular.copy(object));
                    } else {
                        // Get the error message from the body response
                        var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        deferred.resolve(data);
                        // Set notification for error message
                        Notification.error({
                            message: '<span>' + msg + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000,
                            title: "<span ><h5 style='color: white;'>Customer Products is not found!!!</h5></span>"
                        });
                    }
                });
            }
            return deferred.promise;
        },
        getSearchCustomer: function () {
            var deferred = $q.defer();
            var dataCache = CSRCache;

            //Start checking update cust detail process
            var custUpdated = $rootScope.isUpdated;
            var performNewSearch;
            if (custUpdated === true) {
                performNewSearch = true;
            } else {
                performNewSearch = false;
            }
            //End checking update cust detail process

            if ((performNewSearch === false) && (dataCache.get('Search')) && (dataCache.get('temp') === temporarydata_CustomerId)) {
                deferred.resolve(dataCache.get('Search'));
            } else {
                //SearchPageService.query({ customerId: temporarydata_CustomerId, phoneNumber: temporarydata_Msisdn}, function (data) {
                SearchCustomerGeneralInfoService.get({ customerId: temporarydata_CustomerId }, function (data) {
                    // Handle result type is not 0
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        var arrayData = [];
                        arrayData.push(data);
                        CSRCache.put('Search', arrayData);
                        if (arrayData.length >= 1) {
                            if (arrayData[0].Customer !== undefined) {
                                if (arrayData[0].Customer.Status == undefined) {
                                    arrayData[0].Customer.Status = arrayData[0].Customer.CustomerStatus;
                                }
                                CSRCache.put('searchDetail', arrayData[0].Customer);
                            }
                        }

                        deferred.resolve(arrayData);
                        CSRCache.put('temp', temporarydata_CustomerId);
                    } else {
                        // Get the error message from the body response
                        var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        deferred.resolve(data);

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
        getSearchMultiSubscriptionByCustomerId: function (customerId, clearCache) {
            var deferred = $q.defer();
            var dataCache = CSRCache;
            var cacheKey = 'SearchMultiSubscriptionInfo';
            var cacheKeyParam = 'MultiSubscriptionParam';

            if (clearCache == true) {
                CSRCache.remove(cacheKey);
                CSRCache.remove(cacheKeyParam);
            }

            if (dataCache.get(cacheKey) && (dataCache.get(cacheKeyParam) === customerId)) {
                deferred.resolve(dataCache.get(cacheKey));
            } else {
                SearchMultiSubscriptionByCustomerIdService.get({ customerId: customerId }, function (data) {
                    // Handle result type is not 0
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        CSRCache.put(cacheKey, data);
                        CSRCache.put(cacheKeyParam, angular.copy(customerId));
                        deferred.resolve(data);
                    } else {
                        // Get the error message from the body response
                        var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        deferred.resolve(data);

                        // Set notification for error message
                        Notification.error({
                            message: '<span>' + msg + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000,
                            title: "<span ><h5 style='color: white;'>Subscriptions is not found!!!</h5></span>"
                        });
                    }
                });
            }
            return deferred.promise;
        },
        getSearchSubscriptionByMSISDN: function (MSISDN, clearCache) {
            var deferred = $q.defer();
            var dataCache = CSRCache;
            var cacheKey = 'SearchSubscriptionByMSISDN';
            var cacheParamKey = 'SubscriptionByMSISDNParam';

            if (clearCache == true) {
                CSRCache.remove(cacheKey);
                CSRCache.remove(cacheParamKey);
            }

            var compareObject = false;
            var object = MSISDN;
            if (CSRCache.get(cacheKey)) {
                for (var i = 0; i < CSRCache.get(cacheKey).length; i++) {
                    compareObject = angular.equals(CSRCache.get(cacheKey)[i].keySearch, angular.copy(object));
                    if (compareObject == true) {
                        CSRCache.put(cacheParamKey, angular.copy(object));  //last search keySearch/pageNumber
                        deferred.resolve(CSRCache.get(cacheKey)[i].resultdata)
                        return deferred.promise;
                    }
                }
            }

            if (compareObject == false) {
                SearchSubscriptionByMSISDNService.get({ MSISDN: MSISDN }, function (data) {
                    // Handle result type is not 0
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        var storedata = {
                            resultdata: data,
                            keySearch: angular.copy(object),
                        }
                        var storelistdata = [];
                        if (CSRCache.get(cacheKey) == undefined || CSRCache.get(cacheKey).length == 0) {
                            storelistdata.push(storedata);
                        } else {
                            storelistdata = CSRCache.get(cacheKey);
                            storelistdata.push(storedata);
                        }
                        CSRCache.put(cacheKey, storelistdata);
                        deferred.resolve(storedata.resultdata);
                        CSRCache.put(cacheParamKey, angular.copy(object));
                    } else {
                        // Get the error message from the body response
                        var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        deferred.resolve(data);

                        // Set notification for error message
                        Notification.error({
                            message: '<span>' + msg + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000,
                            title: "<span ><h5 style='color: white;'>Subscription is not found!!!</h5></span>"
                        });
                    }
                });
            }
            return deferred.promise;
        },

        getBrowseTTService: function (object) {
            var deferred = $q.defer();
            var dataCache = CSRCache;
            var cacheKey = 'SearchBrowseTT';
            var cacheParamKey = 'ParamBrowseTT';

            var compareObject = false;
            if (CSRCache.get(cacheKey)) {
                for (var i = 0; i < CSRCache.get(cacheKey).length; i++) {
                    compareObject = angular.equals(CSRCache.get(cacheKey)[i].keySearch, angular.copy(object));
                    if (compareObject == true) {
                        CSRCache.put(cacheParamKey, angular.copy(object));  //last search keySearch/pageNumber
                        deferred.resolve(CSRCache.get(cacheKey)[i].resultdata)
                        return deferred.promise;
                    }
                }
            }

            if (compareObject == false) {
                BrowseTTService.get({
                    DealerId: object.keyMVNO,
                    PageNumber: object.PageNumber,
                    PageSize: object.PageSize,
                    TicketNumber: object.keyID_Number,
                    TicketCode: object.keyTT_Code,
                    MSISDN: object.keyMSISDN,
                    From: object.keyFrom,
                    To: object.keyTo,
                    StatusId: object.keyStatus,
                    ClassId: object.keyClass,
                    Priority: object.keyPriority,
                    OrderBy: object.OrderBy,
                    OrderType: object.OrderType,
                }, function (data) {
                    // Handle result type is not 0
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        var storedata = {
                            resultdata: data,
                            keySearch: angular.copy(object),
                        }
                        var storelistdata = [];
                        if (CSRCache.get(cacheKey) == undefined || CSRCache.get(cacheKey).length == 0) {
                            storelistdata.push(storedata);
                        } else {
                            storelistdata = CSRCache.get(cacheKey);
                            storelistdata.push(storedata);
                        }
                        CSRCache.put(cacheKey, storelistdata);
                        deferred.resolve(storedata.resultdata);
                        CSRCache.put(cacheParamKey, angular.copy(object));  //last search keySearch/pageNumber
                    } else {
                        var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(data);
                        Notification.error({
                            message: '<span>getBrowseTTService ' + ErrorMessage + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000
                        });
                        deferred.resolve(data);
                    }
                });
            }
            return deferred.promise;
        },
        getSupportRequestTTDataService: function (object) {
            var deferred = $q.defer();
            var dataCache = CSRCache;
            var cacheKey = 'SearchSupportRequest';
            var cacheParamKey = 'ParamSupportRequest';

            var compareObject = false;
            if (CSRCache.get(cacheKey)) {
                for (var i = 0; i < CSRCache.get(cacheKey).length; i++) {
                    compareObject = angular.equals(CSRCache.get(cacheKey)[i].keySearch, angular.copy(object));
                    if (compareObject == true) {
                        CSRCache.put(cacheParamKey, angular.copy(object));  //last search keySearch/pageNumber
                        deferred.resolve(CSRCache.get(cacheKey)[i].resultdata)
                        return deferred.promise;
                    }
                }
            }

            if (compareObject == false) {
                SupportRequestTTService.get({
                    DealerId: object.keyMVNO,
                    PageNumber: object.PageNumber,
                    PageSize: object.PageSize,
                    TypeId: object.keyCategory,
                    Status: object.keyStatus,
                    MSISDN: object.keyMSISDN,
                    From: object.keyFrom,
                    To: object.keyTo,
                    StatusId: object.keyStatus,
                    OrderBy: object.OrderBy,
                    OrderType: object.OrderType,
                }, function (data) {
                    // Handle result type is not 0
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        var storedata = {
                            resultdata: data,
                            keySearch: angular.copy(object),
                        }
                        var storelistdata = [];
                        if (CSRCache.get(cacheKey) == undefined || CSRCache.get(cacheKey).length == 0) {
                            storelistdata.push(storedata);
                        } else {
                            storelistdata = CSRCache.get(cacheKey);
                            storelistdata.push(storedata);
                        }
                        CSRCache.put(cacheKey, storelistdata);
                        deferred.resolve(storedata.resultdata);
                        CSRCache.put(cacheParamKey, angular.copy(object));  //last search keySearch/pageNumber
                    } else {
                        var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(data);
                        Notification.error({
                            message: '<span>getSupportRequestTTDataService ' + ErrorMessage + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000
                        });
                        deferred.resolve(data);
                    }
                });
            }
            return deferred.promise;
        },
        getSupportRequestTTDetailService: function (object) {
            var deferred = $q.defer();
            var dataCache = CSRCache;

            SupportRequestTTDetailService.get({
                Id: object.Id
            }, function (data) {
                // Handle result type is not 0
                if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                    deferred.resolve(data);
                } else {
                    var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(data);
                    Notification.error({
                        message: '<span>getBrowseTTService ' + ErrorMessage + '</span>',
                        positionY: 'top',
                        positionX: 'center',
                        delay: 10000
                    });
                    deferred.resolve(data);
                }
            });

            return deferred.promise;
        },
        getWorkFlowConfigurationTTService: function (object, clearCache) {
            var deferred = $q.defer();
            var dataCache = CSRCache;

            var cacheKey = 'TTWorkFlow';

            var AdditionalKey = '_dealerId' + object.keyMVNO.toString();
            AdditionalKey += '_flowtypeId' + object.keyFlowType.toString();
            cacheKey += AdditionalKey;

            clearCache == true ? CSRCache.remove(cacheKey) : '';

            if (CSRCache.get(cacheKey)) {
                deferred.resolve(CSRCache.get(cacheKey));
            } else {
                WorkFlowConfigurationTTService.get({
                    dealerId: object.keyMVNO,
                    flowtypeId: object.keyFlowType,
                }, function (data) {
                    // Handle result type is not 0
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        CSRCache.put(cacheKey, data);
                        deferred.resolve(data);
                    } else {
                        var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(data);
                        Notification.error({
                            message: '<span>getWorkFlowConfigurationTTService ' + ErrorMessage + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000
                        });
                        deferred.resolve(data);
                    }
                });
            }
            return deferred.promise;
        },

        getCustomerIdByPhoneNumberService: function(phoneNumber){
            var deferred = $q.defer();
            var dataCache = CSRCache;
            var cacheKey = 'GETCustomerIdByPhoneNumber';

            GetCustomerIdByPhoneNumberService.get({
                phoneNumber: phoneNumber
            }, function (response) {
                if (ErrorHandlerUtility.IsResultTypeOK(response)) {
                    CSRCache.put(cacheKey, response);
                    deferred.resolve(response);
                } else {
                    var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(response);
                    Notification.error({
                        message: '<span>' + ErrorMessage + '</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        },

        getSearchDetailCustomer: function () {
            var deferred = $q.defer();
            var dataCache = CSRCache;

            //Start checking update cust detail process
            var custUpdated = $rootScope.isUpdated;
            var performNewSearch;
            if (custUpdated === true) {
                performNewSearch = true;
            } else {
                performNewSearch = false;
            }
            //End checking update cust detail process

            if ((performNewSearch === false) && (dataCache.get('temp') === temporarydata_CustomerId) && (dataCache.get('searchDetail') !== undefined)) {
                $timeout(function () {
                    deferred.resolve(dataCache.get('searchDetail'));
                }, 1000);
            } else {
                SearchCustomerDetailService.get({ customerIdtemp: customerId }, function (data) {
                    console.log(data);
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        CSRCache.put('searchDetail', data);
                        CSRCache.put('temp', angular.copy(temporarydata_CustomerId));
                        deferred.resolve(data);
                        $rootScope.isUpdated = false;
                    } else {
                        var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(data);
                        Notification.error({
                            message: '<span>' + ErrorMessage + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000
                        });
                        deferred.resolve(dataCache.get('searchDetail'));
                    }
                });
            }
            return deferred.promise;
        },

        getDataGeneral: function () {
            var deferred = $q.defer();
            var dataCache = CSRCache;

            if (dataCache.get('GeneralInfo')) {
                console.log(dataCache.get('GeneralInfo'));
                deferred.resolve(dataCache.get('GeneralInfo'));
            } else {
                SearchCustomerDetailService.get({ customerIdtemp: customerId }, function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        CSRCache.put('GeneralInfo', data);
                        deferred.resolve(data);
                    } else {
                        $scope.ErrorMessage = ErrorHandlerUtility.GetErrorMessage(data);
                    }
                    CSRCache.put('GeneralInfo', data);
                    deferred.resolve(data);
                });
            }
            return deferred.promise;
        },

        getAdvanceSearchCustomer: function () {
            var deferred = $q.defer();
            var dataCache = CSRCache;

            var element = advancesearchelementService.getElement();
            var PageNumber = element.PageNumber,
            RowsPerPage = element.RowsPerPage,
            OrderBy = element.OrderBy,
            SortBy = element.SortBy,
            CustomerId = element.CustomerId,
            SubscriptionId = element.SubscriptionId,
            IMSI = element.IMSI,
            CustomerName = element.CustomerName,
            MSISDN = element.MSISDN,
            ICCID = element.ICCID,
            IMEI = element.IMEI,
            IdNumber = element.IdNumber,
            Email = element.Email,
            FiscalUnitId = element.FiscalUnitId;

            if (typeof CustomerId === 'undefined') {
                CustomerId = ''
            };
            if (typeof SubscriptionId === 'undefined') {
                SubscriptionId = ''
            };
            if (typeof IMSI === 'undefined') {
                IMSI = ''
            };
            if (typeof CustomerName === 'undefined') {
                CustomerName = ''
            };
            if (typeof MSISDN === 'undefined') {
                MSISDN = ''
            };
            if (typeof ICCID === 'undefined') {
                ICCID = ''
            };
            if (typeof IMEI === 'undefined') {
                IMEI = ''
            };
            if (typeof IdNumber === 'undefined') {
                IdNumber = ''
            };
            if (typeof Email === 'undefined') {
                Email = ''
            };
            if (typeof FiscalUnitId === 'undefined') {
                FiscalUnitId = ''
            };

            var cacheKey = 'AdvanceSearch1' + PageNumber + '2' + RowsPerPage + '3' + OrderBy + '4' + SortBy + '5' + CustomerId + '6' + SubscriptionId + '7'
                + IMSI + '8' + CustomerName + '9' + MSISDN + '10' + ICCID + '11' + IMEI + '12' + IdNumber + '13' + Email + '14' + FiscalUnitId;

            if (dataCache.get(cacheKey)) {
                deferred.resolve(dataCache.get(cacheKey));
            } else {
                AdvanceSearchService.get({
                    PageNumber: PageNumber,
                    RowsPerPage: RowsPerPage,
                    OrderBy: OrderBy,
                    SortBy: SortBy,
                    CustomerId: CustomerId,
                    SubscriptionId: SubscriptionId,
                    IMSI: IMSI,
                    CustomerName: CustomerName,
                    MSISDN: MSISDN,
                    ICCID: ICCID,
                    IMEI: IMEI,
                    IdNumber: IdNumber,
                    Email: Email,
                    FiscalUnitId: FiscalUnitId

                }, function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        deferred.resolve(data);
                        CSRCache.put('temp', temporarydata_CustomerId);
                        CSRCache.put(cacheKey, data);
                    } else {
                        var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(data);
                        Notification.error({
                            message: '<span>' + ErrorMessage + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000
                        });
                    }
                    deferred.resolve(data);
                });
            }
            return deferred.promise;
        },


        //Search TT by customer id service
        //will return data from data base or cache
        //Your data = yourVariable.TTInfo
        getTroubleTicketsByCustomerId: function (customerIdTT, excludeClosedTicket) {
            var deferred = $q.defer(),
            dataCache = CSRCache,
            ServiceElement,
            pageNumber,
            pageSize;

            ServiceElement = pagingSearchTroubleTicketByCustomerId.getObject();
            pageNumber = ServiceElement.pageNumber;
            pageSize = ServiceElement.pageSize;
            excludeClosedTicket = excludeClosedTicket != true ? false : true;

            var cacheKey = 'searchTroubleTicketByCustomerId=' + customerIdTT,
            keyobject = [{
                name: 'PageNumber',
                value: pageNumber
            }, {
                name: 'PageSize',
                value: pageSize
            }]

            if (dataCache.get(cacheKey)) {
                var checkIfCached = TroubleTicketFunctionService.getCacheByProperties(cacheKey, keyobject)
                if (checkIfCached === -1) {
                    searchTroubleTicketsByCustomerId(deferred, dataCache, pageNumber, pageSize, cacheKey, customerIdTT, excludeClosedTicket);
                } else {
                    var data = checkIfCached
                    deferred.resolve(data);
                };
            } else {
                searchTroubleTicketsByCustomerId(deferred, dataCache, pageNumber, pageSize, cacheKey, customerIdTT, excludeClosedTicket);
            };
            return deferred.promise;
        },
    };

    //Get data from SearchTroubleTicketsByCustomerIdService
    //This function will resolve the promise or give the notification error
    function searchTroubleTicketsByCustomerId(defer, cache, pageNumber, pageSize, cacheKey, customerIdTT, excludeClosedTicket) {
        var deferred = defer,
            dataCache = cache
        cacheObject = [],
        cacheVal = {};

        SearchTroubleTicketsByCustomerIdService.get({
            customerId: customerIdTT,
            pageSize: pageSize,
            pageNumber: pageNumber,
            ExcludeClosedTicket: excludeClosedTicket
        }, function (data) {
            if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                cacheVal = {
                    PageNumber: pageNumber,
                    PageSize: pageSize,
                    Data: data
                }
                var getCacheVal = angular.copy(dataCache.get(cacheKey))
                if (typeof getCacheVal !== 'undefined') {
                    cacheObject = angular.copy(getCacheVal)
                };
                cacheObject.push(cacheVal)
                CSRCache.put(cacheKey, cacheObject);
                deferred.resolve(data);
            } else {
                var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(data);
                TroubleTicketFunctionService.showNotificationError(ErrorMessage)
            }
        });
    }

});