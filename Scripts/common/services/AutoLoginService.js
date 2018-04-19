commonModule.factory('AutoLoginService', function (AuthUtilityCommon) {
    return {
        AutoLoginHandler: function () {
            var autoLogin = true;
            // checking local storage
            if (localStorage.AuthData != null) {
                var obj = JSON.parse(localStorage.AuthData);
                if (obj.accessToken != null)
                {
                    var now = new Date().getTime();
                    // checking local storage expiration
                    if (obj.sessionExpires === undefined || obj.sessionExpires == null || now > obj.sessionExpires) {
                        ClearCommonSession();
                        return autoLogin = false;
                    }
                    // get site flag
                    var userType = AuthUtilityCommon.GetUserType();
                    // checking response
                    if (obj.userType != null) {
                        // checking userType on response
                        if (obj.userType != undefined || obj.userType !== "undefined") {
                            // make userType lower case
                            var user = obj.userType.replace(/ /g, '').toLowerCase();
                            // whether selfcare
                            if (user === userType.Selfcare) {
                                if (config.isMultisubscription && typeof (JSON.parse(localStorage.self_scope).activeDevice.Msisdn) === 'undefined' && JSON.parse(localStorage.self_scope).totalSubscriptionActive >= 0) {
                                    window.location.href = "/SelfCare/Customer/App/Start";
                                } else {
                                    window.location.href = "/SelfCare/Customer/App";
                                };
                                return autoLogin;
                            } else if (user === userType.CSR) { // whether csr
                                window.location.href = "/CSR/Customer/App";
                                return autoLogin;
                            } else {
                                throw "Failed on userType comparison";
                            }
                        } else {
                            throw "Failed on userType comparison";
                        }
                    } else {
                        ClearCommonSession();
                        return autoLogin = false;
                    }   
                }
                else {
                    ClearCommonSession();
                    return autoLogin = false;
                }
            } else {
                ClearCommonSession();
                return autoLogin = false;
            }
        }
    }
});
