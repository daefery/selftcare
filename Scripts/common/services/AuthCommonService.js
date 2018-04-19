commonModule.factory('AuthUtilityCommon', function (CommonEnum, Notification, MultiSubsModelBuilder, MultiSubscriptionsCacheService, SelfcareMultiSubscriptionCheckerService, ErrorHandlerUtility) {
    var userType = {
        CSR: "csr",
        Selfcare: "selfcare"
    };
    return {
        clearSession: function () {
            localStorage.removeItem("AuthData");
            localStorage.removeItem("self_scope");
            localStorage.removeItem("shoppingcart");
        },
        AuthSuccessHandler: function (resp, isAuthLogin) {
            // get suer type
            var site = this.GetUserType();
            // checking response
            if (resp != null && resp.user_type != null) {
                // checking userType on response
                if (resp.user_type != undefined || resp.user_type !== "undefined") {
                    // make site flag lower case
                    var siteFlg = resp.user_type.replace(/ /g, '').toLowerCase();
                    // whether selfcare
                    if (siteFlg === site.Selfcare) {
                        var redirectToSelfCareStart = "/SelfCare/Customer/App/Start";
                        var redirectToSelfCareDashboard = "/SelfCare/Customer/App";
                        this.SetSession(site.Selfcare, resp);
                        if (isAuthLogin && config.isMultisubscription) {
                            var obj = JSON.parse(localStorage.AuthData);
                            //TO DO if user does not have any actived subscription, we must make new pages for view init device (if there are), user profile, edit profile and buy more service and then direct the page to your new page.
                            SelfcareMultiSubscriptionCheckerService.getuserproperty.get({ username: obj.email }, function (resource) {
                                if (ErrorHandlerUtility.IsResultTypeOK(resource)) {
                                    localStorage.userproperties = JSON.stringify(resource)
                                    MultiSubscriptionsCacheService.getSubscriptionsList(resource.UserProperty.CustomerID).then(function (result) {
                                        if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                                            MultiSubsModelBuilder.getConverterResult(result, resource);
                                            if (result.Subscriptions && result.Subscriptions != null) {
                                                var totalActiveSubscription = [];
                                                angular.forEach(result.Subscriptions, function (value, key) {
                                                    if (result.Subscriptions[key].SubscriptionStatus === 1) {
                                                        totalActiveSubscription.push(result.Subscriptions[key]);
                                                    };
                                                });
                                                if (totalActiveSubscription.length >= 0) {
                                                    window.location.href = redirectToSelfCareStart;
                                                };
                                            } else {
                                                window.location.href = redirectToSelfCareStart;
                                            };
                                        } else {
                                            window.location.href = redirectToSelfCareDashboard;
                                        };
                                    });
                                } else {
                                    window.location.href = redirectToSelfCareDashboard;
                                };
                            });
                        } else {
                            window.location.href = redirectToSelfCareDashboard;
                        };
                    } else if (siteFlg === site.CSR) { // whether csr
                        this.SetSession(site.CSR, resp);
                        if (isAuthLogin) {
                            window.location.href = "/CSR/Customer/App";
                        }
                    } else {
                        throw "Failed on site flag comparison";
                    }
                } else {
                    throw "Failed on site flag comparison";
                }
            } else {
                throw "Failed on site flag comparison";
            }
        }, AuthErrorHandler: function (errorObj) {
            // get response code
            var responseCode = CommonEnum.getResponseCode();
            // get response message
            var errorResponseMessage = CommonEnum.getErrorResponseMessage();
            if (errorObj.status === responseCode.BadRequest) {
                var authErrCode = CommonEnum.getAuthErrorCode();
                switch (errorObj.data.error) {
                    case authErrCode.WrongUsernameOrPassword:
                        return errorResponseMessage.WrongUsernameOrPassword;
                    case authErrCode.FailedLoginAttemptsExceeded:
                        return errorResponseMessage.FailedLoginAttemptsExceeded;
                    case authErrCode.AccountClosed:
                        return errorResponseMessage.AccountClosed;
                    case authErrCode.AccountNotVerified:
                        return errorResponseMessage.AccountNotVerified;
                    case authErrCode.AccountNotConfiguredWithMobilePhone:
                        return errorResponseMessage.AccountNotConfiguredWithMobilePhone;
                    case authErrCode.AccountNotConfiguredWithCertificates:
                        return errorResponseMessage.AccountNotConfiguredWithCertificates;
                    case authErrCode.PasswordExpired:
                        return errorResponseMessage.PasswordExpired;
                    case authErrCode.LoginNotAllowed:
                        return errorResponseMessage.LoginNotAllowed;
                }
            } else {
                return errorResponseMessage.AuthInternalServerError;
            }
        },
        GetUserType: function () {
            return userType;
        },
        SetSession: function (site, response) {
            localStorage.AuthData = JSON.stringify({
                accessToken: response.access_token,
                username: response.userName,
                userType: response.user_type,
                role: response.role,
                refreshToken: response.refresh_token,
                firstName: response.first_name,
                langCode: response.lang_code,
                uid: response.uId,
                sessionExpires: GetSessionExpiresTime(response.expires_in),
                pwExpirationStatus: response.pw_expiryStatus,
                pwExpirationRemainDay: response.pw_expiryRemainDay,
                pwExpirationRemainHours: response.pw_expiryRemainHours,
                pwExpirationTotalHours: response.pw_expiryTotalHours,
                theme_id: response.theme_id,
                uMvnoId: response.uMvnoId,
                uDealerId: response.uDealerId,
                email: response.email
            });
            var temp_config = sessionStorage.webConfig != undefined ? JSON.parse(sessionStorage.webConfig) : {};
            temp_config.DealerId = response.uDealerId;
            sessionStorage.setItem("webConfig", JSON.stringify(temp_config));
            config = sessionStorage.webConfig != undefined ? JSON.parse(sessionStorage.webConfig) : {};
            //if (userType.Selfcare === site) {
            //    localStorage.IsLoginSelf = true;
            //    if (localStorage.IsLoginCSR != null && localStorage.IsLoginCSR != undefined) {
            //        localStorage.removeItem("IsLoginCSR");
            //    }
            //} else {
            //    localStorage.IsLoginCSR = true;
            //    if (localStorage.IsLoginSelf != null && localStorage.IsLoginSelf != undefined) {
            //        localStorage.removeItem("IsLoginSelf");
            //    }
            //}
        },
        ClearSession: function (sessionName) {
            localStorage.removeItem(sessionName);
        },
        StoreShoppingCartSessionId: function (data) {
            localStorage.ShoppingCartSession = JSON.stringify({
                SessionId: data.SessionId,
                CreationDate: data.CreationDate
            });
        },
        PasswordExpirationHandler: function () {
            var obj = JSON.parse(localStorage.AuthData);
            if (obj.pwExpirationStatus !== "" && obj.pwExpirationStatus === "active") {
                var pwExpirationRemainDay = parseFloat(obj.pwExpirationRemainDay);
                var pwExpirationRemainHours = parseFloat(obj.pwExpirationRemainHours);
                var pwExpirationTotalHours = parseFloat(obj.pwExpirationTotalHours);
                // check if FirstDisplayPasswordExpiryNotice has been set
                if (config.FirstDisplayPasswordExpiryNotice !== "" && config.FirstDisplayPasswordExpiryNotice > 0)
                {
                    if (pwExpirationRemainDay === config.FirstDisplayPasswordExpiryNotice)
                    {
                        Notification.warning({
                            message: '<span>Your password will expired in ' + pwExpirationRemainDay + ' days</span>',
                            positionY: 'bottom',
                            positionX: 'right',
                            delay: 300000,
                            replaceMessage: true,
                            title: "<span ><h5 style='color: white;'>Password Expiration</h5></span>"
                        });
                    }
                }
               
                // check if SecondDisplayPasswordExpiryNotice has been set
                if (config.SecondDisplayPasswordExpiryNotice !== "" && config.SecondDisplayPasswordExpiryNotice > 0)
                {
                    if (pwExpirationRemainDay <= config.SecondDisplayPasswordExpiryNotice && pwExpirationRemainDay >= 1
                    && pwExpirationTotalHours >= 24)
                    {
                        Notification.warning({
                            message: '<span>Your password will expired in ' + pwExpirationRemainDay + ' days</span>',
                            positionY: 'bottom',
                            positionX: 'right',
                            delay: 300000,
                            replaceMessage: true,
                            title: "<span ><h5 style='color: white;'>Password Expiration</h5></span>"
                        });
                    }
                    else if (pwExpirationRemainDay == 1 && (pwExpirationTotalHours > 0 && pwExpirationTotalHours < 24))
                    {
                        if (pwExpirationTotalHours > 0 && pwExpirationTotalHours < 1)
                        {
                            Notification.warning({
                                message: '<span>Your password will expired less than an hour</span>',
                                positionY: 'bottom',
                                positionX: 'right',
                                delay: 300000,
                                replaceMessage: true,
                                title: "<span ><h5 style='color: white;'>Password Expiration</h5></span>"
                            });
                        }
                        else {
                            Notification.warning({
                                message: '<span>Your password will expired in ' + pwExpirationRemainHours + ' hours</span>',
                                positionY: 'bottom',
                                positionX: 'right',
                                replaceMessage: true,
                                delay: 300000,
                                title: "<span ><h5 style='color: white;'>Password Expiration</h5></span>"
                            });
                        }
                    }
                }         
            }
        }
    }
});

//commonModule.factory('AuthInstanceService', function ($resource) {
//    return {
//        GetReqObj: function (username, password) {
//            var resource = $resource('http://localhost:5034/Token', {},
//                    {
//                        post: {
//                            method: 'POST',
//                            params: { grant_type: "password",username: username, password: password },
//                            headers: { 'Accept': 'application/x-www-form-urlencoded' }
//                        }
//                    });

//            return resource;
//        }
//    }

//});

commonModule.factory('AuthInstanceService', function ($resource, ApiConnection) {
    return $resource(ApiConnection + '/token', {}, {
        post: {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': "*/*" }
        }
    });

});

commonModule.factory('AuthRequestInterceptor', function ($q, $rootScope, ApiConnection) {
    var aborter = $q.defer();
    return {
        'request': function (config) {
            config.headers = config.headers || {};
            if (localStorage.AuthData != null && (config.url.toLowerCase()).indexOf("api") > -1) {
                //TO DO: checking internet connection
               // if (HasInternetConnection()) {
                    var authData = JSON.parse(localStorage.AuthData);
                    if (authData != null && authData.accessToken != null) {
                        config.headers.Authorization = 'Bearer ' + authData.accessToken;
                    }
                //TO DO: checking internet connection
               // } else {
                    // promise that should abort the request when resolved.
                   // $rootScope.$broadcast("errorConnection");
                   // config.timeout = canceller.promise;
                   // aborter.resolve();
               // }             
            }
            //TO DO: checking internet connection
        //    else if ((config.url.toLowerCase()).indexOf(ApiConnection + "/token") > -1) {
            //    if (!HasInternetConnection()) {
                    // promise that should abort the request when resolved.
                //  $rootScope.$broadcast("breakAuthRequest");
            //    aborter.reject(config);
            //    $rootScope.$broadcast("errorConnection");
                   // aborter.resolve();
              //  }
           // }
            return config;
        }
    };
});

commonModule.factory('AuthResponseInterceptor', function () {
    return {
        'response': function (response) {
            return response;
        }
    };
});

commonModule.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthRequestInterceptor');
    $httpProvider.interceptors.push('AuthResponseInterceptor');
});
