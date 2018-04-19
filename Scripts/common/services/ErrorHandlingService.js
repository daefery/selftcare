// This factory is used to handle when the response is not OK
ErrorHandler.factory('httpRequestInterceptor', function ($q, $rootScope, $location, CommonEnum, ApiConnection) {
    return {
        'responseError': function (rejection) {
            $rootScope.IsError = true;
            // get response code
            var responseCode =  CommonEnum.getResponseCode();
            // get response message
            var errorResponseMessage = CommonEnum.getErrorResponseMessage();
            // checking error response status
            switch(rejection.status) {
                case responseCode.Forbidden:
                    $rootScope.ErrorResponseMessage = errorResponseMessage.Forbidden;
                    break;
                case responseCode.BadRequest:
                    $rootScope.ErrorResponseMessage = errorResponseMessage.BadRequest;
                    //console.log('rejection : ' + rejection.Messages);
                    //for (var key in rejection.data) {
                    //    var value = rejection.data['Message'];
                    //    console.log('key : ' + key + ' | val : ' + value)
                    //}
                    if (rejection.data['Message'] != 'undefined') {
                        $rootScope.ErrorResponseMessage = rejection.data['Message'];
                    }
                    break;
                case responseCode.NotFound:
                    $rootScope.ErrorResponseMessage = errorResponseMessage.NotFound;
                    break;
                case responseCode.RequestTimeOut:
                    $rootScope.ErrorResponseMessage = errorResponseMessage.RequestTimeOut;
                    break;
                case responseCode.Unauthorized:
                    $rootScope.ErrorResponseMessage = errorResponseMessage.Unauthorize;
                    break;
                case responseCode.ServerNotFound:
                    $rootScope.ErrorResponseMessage = errorResponseMessage.ServerNotFound;
                    break;
                default:
                    $rootScope.ErrorResponseMessage = errorResponseMessage.InternalServerError;
                    break;
            }

            // make error message notification not show on login page
            if (rejection.config != null) {
                if (rejection.config.url !== ApiConnection + "/token" &&
                        rejection.config.url.indexOf(ApiConnection + "/api/shoppingcart/getsession?SessionId") === -1 &&
                            rejection.config.url.indexOf(ApiConnection + "/api/shoppingcart/createsession") === -1
                    ) {
                    // if not login page and not shopping cart page then don't show error notification
                    $rootScope.$broadcast("responseError", $rootScope.ErrorResponseMessage);
                }
            } else {
                $rootScope.$broadcast("responseError", $rootScope.ErrorResponseMessage);
            }
            

            return $q.reject(rejection);
        }
    };
});

// Error Handler Utility
ErrorHandler.factory('ErrorHandlerUtility', function (Notification) {
    return {
        // This method is used to get the error message when the status code is 200
        GetErrorMessage: function (response) {
            var message = 'Unknown Error';
            if (response.length > 0) {
                // response is array
                if (response[0].Messages[0].length > 0) {
                    message = response[0].Messages[0];
                }
            } else {
                if (response.Messages.length > 0) {
                    message = response.Messages[0];
                }
            }
            
            return message;
        },
        // This method is used to check the result type when the status code is 200
        IsResultTypeOK: function (response) {
            var isOK = true;
            var resp;
            // checking whether response is array or object
            if (response.length > 0) {
                resp = response[0];
            } else {
                resp = response;
            }
            if ((response.$status >= 200 && response.$status < 400) && resp.ResultType !== 0) {
                isOK = false;
            }
            return isOK;
        },
        HasInternetConnection: function () {
            $.ajax({
                url: "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js",
                crossDomain: true,
                async: "false",
                type: "GET",
                success: function() {
                    return true;
                },
                error: function (XMLHttpRequest) {
                    if (XMLHttpRequest.status < 200 || XMLHttpRequest.status >= 400) {
                        return false;
                    }
                }
            });
        }
    }
});


