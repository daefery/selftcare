CSRContent.service('CacheEnumService', function ($q, $timeout, CSRCache, TTEnumService, ErrorHandlerUtility, Notification, LocalStorageProvider) {
    return {
        getTTStatus: function (clearCache) {
            var deferred = $q.defer();
            var cacheKey = 'TTStatus';

            clearCache == true ? CSRCache.remove(cacheKey) : '';

            if (CSRCache.get(cacheKey)) {
                deferred.resolve(CSRCache.get(cacheKey));
            } else {

                TTEnumService.TTStatus.get(function (data) {
                    //TDO error handling is not finished
                    if (data.$status == 200) {
                        CSRCache.put(cacheKey, data);
                        deferred.resolve(data);
                    } else {
                        // Get the error message from the body response
                        //var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        // Set notification for error message
                        Notification.error({
                            message: '<span>Data ' + cacheKey + ' cannot be found</span>',
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
        getTTClassandPriority: function (object, clearCache) {
            var deferred = $q.defer();

            var dealerid = object.dealerId;
            var cacheKey = 'TTClassandPriority_' + dealerid.toString();
            var cacheKey_dealerId = cacheKey + '_dealerid';

            clearCache == true ? CSRCache.remove(cacheKey) : '';

            if (CSRCache.get(cacheKey) && CSRCache.get(cacheKey_dealerId) == dealerid) {
                deferred.resolve(CSRCache.get(cacheKey));
            } else {
                TTEnumService.TTClassandPriority.get({
                    dealerId: dealerid
                }, function (data) {
                    //TDO error handling is not finished
                    if (data.$status == 200) {
                        CSRCache.put(cacheKey, data);
                        CSRCache.put(cacheKey_dealerId, dealerid);
                        deferred.resolve(data);
                    } else {
                        // Get the error message from the body response
                        //var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        // Set notification for error message
                        Notification.error({
                            message: '<span>Data ' + cacheKey + ' cannot be found</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000,
                            title: "<span ><h5 style='color: white;'>Data " + cacheKey + " is not found!!!</h5></span>"
                        });
                    }
                });
            }
            return deferred.promise;
        },
        getTTMVNO: function (clearCache) {
            var deferred = $q.defer();
            var cacheKey = 'allmvno';

            clearCache == true ? CSRCache.remove(cacheKey) : '';

            if (CSRCache.get(cacheKey)) {
                deferred.resolve(CSRCache.get(cacheKey));
            } else {
                var load_From_LocalStorageProvider = false;
                var isETAKUser = false;
                isETAKUser = LocalStorageProvider.isETAKUser();
                if (isETAKUser == false) {
                    var dealerid = LocalStorageProvider.getDealerId();
                    if (dealerid != null) {
                        var orgid = LocalStorageProvider.getMvnoid();
                        var mvnoname = LocalStorageProvider.getTemplateCode();
                        var data = [{
                            dealerid: dealerid,
                            orgid: orgid,
                            mvnoname: mvnoname,
                        }]

                        $timeout(function () {
                            CSRCache.put(cacheKey, data);
                            deferred.resolve(data);
                        }, 100);
                        load_From_LocalStorageProvider = true;
                    } else {
                        load_From_LocalStorageProvider = false;
                    }
                }
                if (load_From_LocalStorageProvider == false) {
                    TTEnumService.TTMVNO.query(function (data) {
                        //TDO error handling is not finished
                        if (data.$status == 200) {
                            CSRCache.put(cacheKey, data);
                            deferred.resolve(data);
                        } else {
                            // Get the error message from the body response
                            //var msg = ErrorHandlerUtility.GetErrorMessage(data);
                            // Set notification for error message
                            Notification.error({
                                message: '<span>Data ' + cacheKey + ' cannot be found</span>',
                                positionY: 'top',
                                positionX: 'center',
                                delay: 10000,
                                title: "<span ><h5 style='color: white;'>Data is not found!!!</h5></span>"
                            });
                        }
                    });
                }
            }
            return deferred.promise;
        },
        getTTFlowType: function (clearCache) {
            var deferred = $q.defer();
            var cacheKey = 'TTFlowType';

            clearCache == true ? CSRCache.remove(cacheKey) : '';

            if (CSRCache.get(cacheKey)) {
                deferred.resolve(CSRCache.get(cacheKey));
            } else {
                TTEnumService.TTFlowType.get(function (data) {
                    //TDO error handling is not finished
                    if (data.$status == 200) {
                        CSRCache.put(cacheKey, data);
                        deferred.resolve(data);
                    } else {
                        // Get the error message from the body response
                        //var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        // Set notification for error message
                        Notification.error({
                            message: '<span>Data  ' + cacheKey + ' cannot be found</span>',
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
        getTTFlowTypeFromTemplate: function (clearCache) {
            var deferred = $q.defer();
            var cacheKey = 'TTFlowTypeFromTemplate';

            clearCache == true ? CSRCache.remove(cacheKey) : '';

            if (CSRCache.get(cacheKey)) {
                deferred.resolve(CSRCache.get(cacheKey));
            } else {
                TTEnumService.TTFlowTypeFromTemplate.get(function (data) {
                    //TDO error handling is not finished
                    if (data.$status == 200) {
                        CSRCache.put(cacheKey, data);
                        deferred.resolve(data);
                    } else {
                        // Get the error message from the body response
                        //var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        // Set notification for error message
                        Notification.error({
                            message: '<span>Data ' + cacheKey + ' cannot be found</span>',
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
        getTTOperationType: function (clearCache) {
            var deferred = $q.defer();
            var cacheKey = 'TTOperationType';

            clearCache == true ? CSRCache.remove(cacheKey) : '';

            if (CSRCache.get(cacheKey)) {
                deferred.resolve(CSRCache.get(cacheKey));
            } else {
                TTEnumService.TTOperationType.get(function (data) {
                    //TDO error handling is not finished
                    if (data.$status == 200) {
                        CSRCache.put(cacheKey, data);
                        deferred.resolve(data);
                    } else {
                        // Get the error message from the body response
                        //var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        // Set notification for error message
                        Notification.error({
                            message: '<span>Data  ' + cacheKey + ' cannot be found</span>',
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
        getTTGetDepartment: function (dealerId, clearCache) {
            var deferred = $q.defer();
            var cacheKey = 'TTGetDepartment_' + dealerId.toString();

            clearCache == true ? CSRCache.remove(cacheKey) : '';

            if (CSRCache.get(cacheKey)) {
                deferred.resolve(CSRCache.get(cacheKey));
            } else {
                TTEnumService.TTGetDepartment.get({ dealerId: dealerId }, function (data) {
                    //TDO error handling is not finished
                    if (data.$status == 200) {
                        CSRCache.put(cacheKey, data);
                        deferred.resolve(data);
                    } else {
                        // Get the error message from the body response
                        //var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        // Set notification for error message
                        Notification.error({
                            message: '<span>Data ' + cacheKey + ' cannot be found</span>',
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
        getTTGetDepartmentForWorkflow: function (dealerId, clearCache) {
            var deferred = $q.defer();
            var cacheKey = 'TTGetDepartmentForWorkflow_' + dealerId.toString();

            clearCache == true ? CSRCache.remove(cacheKey) : '';

            if (CSRCache.get(cacheKey)) {
                deferred.resolve(CSRCache.get(cacheKey));
            } else {
                TTEnumService.TTGetDepartmentForWorkflow.get({ dealerId: dealerId }, function (data) {
                    //TDO error handling is not finished
                    if (data.$status == 200) {
                        CSRCache.put(cacheKey, data);
                        deferred.resolve(data);
                    } else {
                        // Get the error message from the body response
                        //var msg = ErrorHandlerUtility.GetErrorMessage(data);
                        // Set notification for error message
                        Notification.error({
                            message: '<span>Data ' + cacheKey + ' cannot be found</span>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 10000,
                            title: "<span ><h5 style='color: white;'>Data is not found!!!</h5></span>"
                        });
                    }
                });
            }
            return deferred.promise;
        }
    };
})