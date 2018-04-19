//Cache service for Trouble ticket
//Using CSRCache for Caching, Location: /Areas/CSR/Bindings/ViewModels/Services/CSRCacheServices.js
//Using ErrorHandlerUtility for error handling, Location: Scripts/common/services/ErrorHandlingService.js
//Using Notification for compile notification html and show to interface, Location: Scripts/custom/angular-ui-notification.min.js
//Using TTCommonService for calling the API, Location: /Areas/CSR/Bindings/ViewModels/Services/CacheTroubleTicketService.js

//TO DO - move trouble ticket from CacheSearchService that involved with trouble ticket to this file

'use strict';

//For Common Trouble Ticket API
CSRContent.service('CacheTroubleTicketService', function ($q, $timeout, $rootScope, $http, $location, CSRCache, ErrorHandlerUtility, Notification, TTCommonService, TTEnumService,
    TypeConfigurationService, SubTypeConfigurationService, QuestionCodeConfigurationService, QuestionConfigurationService, KPIConfigurationService,
    StatusConfigurationService, PriorityConfigurationService, ClassConfigurationService, FlowRuleConfigurationService, StatisticsConfigurationService,
    WorkFlowGetDepartmentMappingService) {
    var dataCache = CSRCache;
    return {
        getTicketType: function (mvnoId, clearCache) {
            var deferred = $q.defer();

            var cacheKey = 'TypeByQuestionLib';
            var objectParam = angular.copy(mvnoId);

            if (clearCache == true) {
                CSRCache.remove(cacheKey);
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
                TTCommonService.TTGetType.get({ MvnoId: mvnoId }, function (data) {

                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        StoreCacheArray(cacheKey, data, objectParam)
                        deferred.resolve(data);
                    } else {
                        var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(data);
                        Notification.error({
                            message: '<span>getTicketType ' + ErrorMessage + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000
                        });
                        deferred.resolve(data);
                    }
                });
            };

            return deferred.promise;
        },
        getTicketSubtype: function (mvnoId, ticketTypeId, clearCache) {
            var deferred = $q.defer();

            var cacheKey = 'SubTypeByQuestionLib';
            var objectParam = angular.copy({
                MvnoId: mvnoId,
                TypeId: ticketTypeId
            });

            if (clearCache == true) {
                CSRCache.remove(cacheKey);
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
                TTCommonService.TTGetSubtype.get({
                    MvnoId: mvnoId,
                    TypeId: ticketTypeId
                }, function (data) {

                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        StoreCacheArray(cacheKey, data, objectParam)
                        deferred.resolve(data);
                    } else {
                        var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(data);
                        Notification.error({
                            message: '<span>getTicketSubtype ' + ErrorMessage + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000
                        });
                        deferred.resolve(data);
                    }
                });
            };

            return deferred.promise;
        },
        getTicketQuestion: function (mvnoId, ticketTypeId, ticketSubtypeId, clearCache) {
            var deferred = $q.defer();

            var cacheKey = 'QuestionCodeByQuestionLib';
            var objectParam = angular.copy({
                MvnoId: mvnoId,
                TypeId: ticketTypeId,
                SubtypeId: ticketSubtypeId
            });

            if (clearCache == true) {
                CSRCache.remove(cacheKey);
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
                TTCommonService.TTGetQuestion.get({
                    MvnoId: mvnoId,
                    TypeId: ticketTypeId,
                    SubtypeId: ticketSubtypeId
                }, function (data) {

                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        StoreCacheArray(cacheKey, data, objectParam)
                        deferred.resolve(data);
                    } else {
                        var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(data);
                        Notification.error({
                            message: '<span>getTicketQuestion ' + ErrorMessage + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000
                        });
                        deferred.resolve(data);
                    }
                });
            };

            return deferred.promise;
        },
        getTicketDetail: function (id) {
            var deferred = $q.defer(),
                cacheKey = 'DetailByTicketId' + id;
            var cacheVal = dataCache.get(cacheKey);

            if (cacheVal) {
                deferred.resolve(cacheVal);
            }
            else {
                TTCommonService.TTGetDetail.get({ Id: id }, function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        //dataCache.put(cacheKey, data);
                        deferred.resolve(data);
                    } else {
                        NotificationError(data);
                    }
                });
            };

            return deferred.promise;
        },
        getAnswer: function (ticketNo) {
            var deferred = $q.defer(),
                cacheKey = 'AnswerByTicketNo' + ticketNo;
            var cacheVal = dataCache.get(cacheKey);

            if (cacheVal) {
                deferred.resolve(cacheVal);
            }
            else {
                TTCommonService.TTGetAnswer.get({ TicketNo: ticketNo }, function (data) {
                    CheckResultType(deferred, cacheKey, data);
                });
            };

            return deferred.promise;
        },
        getClassAndPriority: function (dealerId, clearCache) {
            var deferred = $q.defer(),
                cacheKey = 'ClassAndPriorityByDealerId' + dealerId;
            clearCache == true ? dataCache.remove(cacheKey) : '';
            var cacheVal = dataCache.get(cacheKey);

            if (cacheVal) {
                deferred.resolve(cacheVal);
            }
            else {
                TTEnumService.TTClassandPriority.get({ dealerId: dealerId }, function (data) {
                    CheckResultType(deferred, cacheKey, data);
                });
            };

            return deferred.promise;
        },
        getAllType: function (clearCache) {
            var deferred = $q.defer(),
                cacheKey = 'AllType';
            clearCache == true ? dataCache.remove(cacheKey) : '';
            var cacheVal = dataCache.get(cacheKey);

            if (cacheVal) {
                deferred.resolve(cacheVal);
            }
            else {
                TypeConfigurationService.TTTypeGetAll.get({
                }, function (data) {
                    CheckResultType(deferred, cacheKey, data);
                });
            };
            return deferred.promise;
        },
        getAllTypeInFlowRule: function (clearCache) {
            var deferred = $q.defer();

            var cacheKey = 'AllTypeInFlowRule';
            var objectParam = angular.copy(null);

            if (clearCache == true) {
                CSRCache.remove(cacheKey);
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
                TypeConfigurationService.TTTypeInFlowRule.get({
                }, function (data) {

                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        StoreCacheArray(cacheKey, data, objectParam)
                        deferred.resolve(data);
                    } else {
                        var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(data);
                        Notification.error({
                            message: '<span>getAllTypeInFlowRule ' + ErrorMessage + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000
                        });
                        deferred.resolve(data);
                    }
                });
            };

            return deferred.promise;
        },
        getAllSubtype: function (clearCache) {
            var deferred = $q.defer(),
                cacheKey = 'AllSubType';
            clearCache == true ? dataCache.remove(cacheKey) : '';
            var cacheVal = dataCache.get(cacheKey);

            if (cacheVal) {
                deferred.resolve(cacheVal);
            }
            else {
                SubTypeConfigurationService.TTSubTypeGetAll.get({
                }, function (data) {
                    CheckResultType(deferred, cacheKey, data);
                });
            };
            return deferred.promise;
        },
        getAllSubtypeInFlowRule: function (clearCache, TypeId) {
            var deferred = $q.defer();

            var cacheKey = 'AllSubTypeInFlowRule';
            var objectParam = angular.copy(TypeId);

            if (clearCache == true) {
                CSRCache.remove(cacheKey);
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
                SubTypeConfigurationService.TTSubTypeInFlowRule.get({
                    TypeId: TypeId
                }, function (data) {

                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        StoreCacheArray(cacheKey, data, objectParam)
                        deferred.resolve(data);
                    } else {
                        var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(data);
                        Notification.error({
                            message: '<span>getAllSubtypeInFlowRule ' + ErrorMessage + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000
                        });
                        deferred.resolve(data);
                    }
                });
            };
            return deferred.promise;
        },
        getAllQuestionCode: function (clearCache) {
            var deferred = $q.defer(),
                cacheKey = 'AllQuestionCode';
            clearCache == true ? dataCache.remove(cacheKey) : '';
            var cacheVal = dataCache.get(cacheKey);

            if (cacheVal) {
                deferred.resolve(cacheVal);
            }
            else {
                QuestionCodeConfigurationService.TTQuestionCodeGetAll.get({
                }, function (data) {
                    CheckResultType(deferred, cacheKey, data);
                });
            };
            return deferred.promise;
        },
        getAllQuestion: function (object, clearCache) {
            var deferred = $q.defer();

            var cacheKey = 'AllQuestion';
            var objectParam = angular.copy(object.keyMVNO.toString());

            if (clearCache == true) {
                CSRCache.remove(cacheKey);
                CSRCache.remove('TypeByQuestionLib');   //remove cache for getTicketType
                CSRCache.remove('SubTypeByQuestionLib');   //remove cache for getTicketSubtype
                CSRCache.remove('QuestionCodeByQuestionLib');   //remove cache for getTicketQuestion
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

                QuestionConfigurationService.TTQuestionGetAll.get({
                    MvnoId: object.keyMVNO
                }, function (data) {

                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        StoreCacheArray(cacheKey, data, objectParam)
                        deferred.resolve(data);
                    } else {
                        var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(data);
                        Notification.error({
                            message: '<span>getAllQuestion ' + ErrorMessage + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000
                        });
                        deferred.resolve(data);
                    }
                });
            };
            return deferred.promise;
        },
        getAllKPI: function (object, clearCache) {
            var deferred = $q.defer(),
                cacheKey = 'AllKPI';
            cacheKey += object.keyMVNO.toString();

            clearCache == true ? dataCache.remove(cacheKey) : '';
            var cacheVal = dataCache.get(cacheKey);

            if (cacheVal) {
                deferred.resolve(cacheVal);
            }
            else {
                KPIConfigurationService.TTKPIGetAll.get({
                    dealerid: object.keyMVNO
                }, function (data) {
                    CheckResultType(deferred, cacheKey, data);
                });
            };
            return deferred.promise;
        },
        getFlowRule: function (object, clearCache) {
            var deferred = $q.defer();

            var cacheKey = 'FlowRule';
            var objectParam = angular.copy(object.keyFlowType.toString());

            if (clearCache == true) {
                CSRCache.remove(cacheKey);
                CSRCache.remove('AllTypeInFlowRule');   //remove cache for getAllTypeInFlowRule
                CSRCache.remove('AllSubTypeInFlowRule');   //remove cache for getAllSubtypeInFlowRule
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
                FlowRuleConfigurationService.TTFlowRuleGetAll.get({
                    FlowTypeId: object.keyFlowType
                }, function (data) {

                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        StoreCacheArray(cacheKey, data, objectParam)
                        deferred.resolve(data);
                    } else {
                        var ErrorMessage = ErrorHandlerUtility.GetErrorMessage(data);
                        Notification.error({
                            message: '<span>getFlowRule ' + ErrorMessage + '</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000
                        });
                        deferred.resolve(data);
                    }
                });
            };
            return deferred.promise;
        },
        getStatisticsData: function (object, clearCache) {
            var deferred = $q.defer(),
                cacheKey = 'StatisticsData';
            cacheKey += object.MvnoId.toString();

            clearCache == true ? dataCache.remove(cacheKey) : '';
            var cacheVal = dataCache.get(cacheKey);

            if (cacheVal) {
                deferred.resolve(cacheVal);
            }
            else {
                StatisticsConfigurationService.TTStatisticsGetAll.get({
                    MvnoId: object.MvnoId
                }, function (data) {
                    CheckResultType(deferred, cacheKey, data);
                });
            };
            return deferred.promise;
        },
        getWorkFlowDepartmentMapping: function (object, clearCache) {
            var deferred = $q.defer(),
                cacheKey = 'WorkFlowDepartmentMapping';
            cacheKey += object.FlowTypeId.toString();

            clearCache == true ? dataCache.remove(cacheKey) : '';
            var cacheVal = dataCache.get(cacheKey);

            if (cacheVal) {
                deferred.resolve(cacheVal);
            }
            else {
                WorkFlowGetDepartmentMappingService.get({
                    FlowTypeId: object.FlowTypeId
                }, function (data) {
                    CheckResultType(deferred, cacheKey, data);
                });
            };
            return deferred.promise;
        },
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
        var errorMessage = ErrorHandlerUtility.GetErrorMessage(data);
        return Notification.error({
            message: '<span>' + errorMessage + '</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 10000
        });
    };

    function CheckCacheArray(cacheKey, objectParam) {
        var cacheParamKey = cacheKey + 'Param';
        var compareObject = false;
        var cacheItem = null;
        if (CSRCache.get(cacheKey)) {
            for (var i = 0; i < CSRCache.get(cacheKey).length; i++) {
                compareObject = angular.equals(CSRCache.get(cacheKey)[i].keySearch, angular.copy(objectParam));
                if (compareObject == true) {
                    CSRCache.put(cacheParamKey, angular.copy(objectParam));  //last search
                    cacheItem = CSRCache.get(cacheKey)[i].resultdata;
                    return cacheItem;
                }
            }
        }
        return cacheItem;
    }

    function StoreCacheArray(cacheKey, data, objectParam) {
        var cacheParamKey = cacheKey + 'Param';
        var storedata = {
            resultdata: data,
            keySearch: angular.copy(objectParam),
        }
        var storelistdata = [];
        if (CSRCache.get(cacheKey) == undefined || CSRCache.get(cacheKey).length == 0) {
            storelistdata.push(storedata);
        } else {
            storelistdata = CSRCache.get(cacheKey);
            storelistdata.push(storedata);
        }
        CSRCache.put(cacheKey, storelistdata);
        CSRCache.put(cacheParamKey, angular.copy(objectParam));
    };
});