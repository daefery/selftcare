commonModule.factory('WebConfigService', function ($resource, ApiConnection) {
    return {
        getConfig: $resource(ApiConnection + '/api/webclientconfig/getconfig', null, {})
    }
});
commonModule.factory('CheckAuthorizedPageResource', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/api/authorization/module/authorize', { userid: '@userid', url: '@url' }, { method: 'POST', isArray: true });
});

commonModule.factory('CheckAuthorizedPageService', function ($rootScope, $location, $q, CheckAuthorizedPageResource, WebConfigService, ErrorHandlerUtility) {
    return {
       
        CheckAuthorizedPageHandler: function (isCSR) {
            var deferred = $q.defer();
            var uid = JSON.parse(localStorage.AuthData).uid;
            var notFoundUrl =  Console.rootPath + 'CSR/Customer/App/NotFound';
            if (!isCSR) {
                notFoundUrl = Console.rootPath + 'Selfcare/Customer/App/NotFound';
            }
            var currUrl = $location.path();
            if (currUrl !== notFoundUrl) {
                CheckAuthorizedPageResource.save({ userid: uid, url: currUrl }).$promise.then(function (response) {
                    if (response.IsAuthorized == false) {
                        $location.path(notFoundUrl).replace();
                        $rootScope.$on('$locationChangeSuccess', function (next, current) {
                            deferred.resolve();
                        });
                    } else {
                        deferred.resolve();
                    }
                });
            }
            return deferred.promise;
                
        }
    }
});
commonModule.factory('StartingPageService', function ($q, WebConfigService, ErrorHandlerUtility) {
    return {
        StartingPageHandler: function () {
            var deferred = $q.defer();
            if (sessionStorage.webConfig == undefined) {
                WebConfigService.getConfig.get(function(result) {
                    if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                        var t_authdata = localStorage.AuthData != undefined ? JSON.parse(localStorage.AuthData) : undefined;
                        var dID = t_authdata != undefined ? t_authdata.uDealerId : 0;
                        sessionStorage.webConfig = JSON.stringify({
                            MvnoId: result.MvnoId,
                            DealerId: dID,
                            ETOrgId: result.ETOrgId,
                            TemplateCode: result.TemplateCode,
                            FirstDisplayPasswordExpiryNotice: result.FirstDisplayPasswordExpiryNotice,
                            SecondDisplayPasswordExpiryNotice: result.SecondDisplayPasswordExpiryNotice,
                            IdleTimeOut: result.IdleTimeOut,
                            IdleSecondsCounter: result.IdleSecondsCounter,
                            DateFormat: result.DateFormat.toLowerCase(),
                            DateFormatMoment: result.DateFormat.toUpperCase(),
                            DateFormatCore: "yyyy-MM-dd HH:mm:ss",
                            isMultisubscription: result.isMultisubscription
                        });
                        config = sessionStorage.webConfig != undefined ? JSON.parse(sessionStorage.webConfig) : {};
                        datepicker = function () {
                            $(function () {
                                $('.input-group.date').datepicker({
                                    format: config.DateFormat,
                                    todayBtn: "linked",
                                    autoclose: true
                                });
                            });
                        }
                        deferred.resolve(true);
                    } else {
                        Notification.error({
                            message: '<strong>' + result.Messages[0] + '</strong>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                        config = sessionStorage.webConfig != undefined ? JSON.parse(sessionStorage.webConfig) : {};
                        deferred.resolve(false);
                    }
                });
            } else {
                config = sessionStorage.webConfig != undefined ? JSON.parse(sessionStorage.webConfig) : {};
                datepicker = function () {
                    $(function () {
                        $('.input-group.date').datepicker({
                            format: config.DateFormat,
                            todayBtn: "linked",
                            autoclose: true
                        });
                    });
                }
                deferred.resolve(true);
            }
            return deferred.promise;
        }
}
});
