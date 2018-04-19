CSRVerification.controller('CSRVerifyUserForm', function ($scope) {
    $scope.confirm = {
        field: [
            {
                type: "logo",
                item: '<img class="center" src="images/et-logo.png">'
            },
            {
                type: "text",
                name: "key",
                size: 6,
                text: "Activation_Key",
                model: "confirm.key",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "captcha",
                size: 6,
                text: "Captcha",
                name: "recaptcha_response_field",
                model: "captcha",
                required:true,
                //validation: [{ value: "mandatory" }]
            }

        ],
        button: [
            {
                type: "submit",
                text: "Confirm",
                click: "doConfirm(confirm)"
            },
            {
                type: "link",
                item: '<a href="/Authorization/ResendKey" id="VerifyCSR_ResendKey" target="_self" class="link">Resend activation key?</a>'
            }

        ]
    };
});

CSRVerification.controller('CSRVerifyUserChangePasswordForm', function ($scope) {
    $scope.datas = {
        field: [
            {
                type: "logo",
                item: '<img class="center" src="images/et-logo.png">'
            },
            {
                type: "message",
                show: "isNotConfirm",
                item: "messageConfirm"
            },
            //{
            //    type: "email",
            //    name: "email",
            //    size: 6,
            //    text: "Email",
            //    model: "verify.Email",
            //    required: true,
            //    validation: [{ value: "mandatory" }, { value: "email" }]
            //},
            {
                type: "password",
                name: "newpassword",
                size: 6,
                text: "New_Password",
                model: "verify.Password",
                required: true,
                validation: [{ value: "mandatory" }, { value: "password" }]
            },
            {
                type: "confirm_password",
                name: "retypenwpassword",
                size: 6,
                text: "Confirm_Password",
                model: "verify.RetypePassword",
                compareTo: "verify.Password",
                required: true,
                validation: [{ value: "mandatory" }, { value: "confirm_password" }]
            }],
        button: [
            {
                type: "submit",
                text: "Submit",
                click: "submit(verify)"
            },
            {
                type: "link",
                item: '<a href="/Authorization/ResendKey" id="VerifyCSR_ResendKey" target="_self" class="link">Resend activation key?</a>'
            }
        ]
    };
});

CSRVerification.controller("CSRVerifyUserFormController", function ($q, $rootScope, $scope, AuthUtilityCommon, AuthInstanceService, CommonEnum, Notification, vcRecaptchaService, CaptchaKey, CSRUserConfirmationService, $location, CSRVerifyUtility, CSRUserGetID, CSRVerifyCache) {

    //captcha
    $scope.response = null;
    $scope.widgetId = null;

    $scope.model = {
        key: CaptchaKey
    };
    $scope.captchaProcess = function (type, param) {
        switch (type) {
            case 'create':
                $scope.widgetId = param;
                break;
            case 'success':
                $scope.response = param;
                $scope.captcha = true;
                break;
            case 'expired':
                vcRecaptchaService.reload($scope.widgetId);
                $scope.response = null;
                $scope.captcha = '';
                break;
        }
    }
    //end of captcha

    $scope.isFalse = false;
    $scope.doConfirm = function (data) {
        var cacheKey4 = 'verifykey';
        CSRVerifyCache.put(cacheKey4, data.key);
        vcRecaptchaService.reload($scope.widgetId);
        $location.path(Console.rootPath + 'Authorization/Verify/SetPassword');
    }

});

CSRVerification.controller("CSRVerifyUserChangePasswordFormController", function ($scope, $rootScope, CSRVerifyUtility, ErrorHandlerUtility, CSRUserSetPasswordService, Notification, CSRVerifyCache, CSRUserConfirmationService, CSRUserGetID, CaptchaKey) {
    $scope.isFalse = false;
    $scope.isNotConfirm = false;
    $scope.messageConfirm = '';
    $scope.check = function () {
        $scope.data.confirmPassword = '';
    };
    $scope.messageConfirm = '';
    var email = "";
    var tenant = "";
    var id = "";
    //var cacheKey = 'verifyemail';
    //var cacheKey2 = 'verifytenant';
    //var cacheKey3 = 'verifyid';
    var cacheKey4 = 'verifykey';
    //var email = angular.copy(CSRVerifyCache.get(cacheKey));
    //var tenant = angular.copy(CSRVerifyCache.get(cacheKey2));
    //var id = angular.copy(CSRVerifyCache.get(cacheKey3));
    var datakey = angular.copy(CSRVerifyCache.get(cacheKey4));
    if (datakey == null || datakey == undefined)
    {
        //console.log(datakey);
        Notification.error({
            message: '<strong>Failed!</strong> <span>. You are not authorized here. Will be redirected to Verification page</span>',
            positionY: 'top',
            positionX: 'center'
        });
        setTimeout(function () {
            window.location.assign('/Authorization/Verify/VerifyCode');
        }, 3000);
    } //else
    //{
        //CSRUserGetID.get({ key: datakey }, function (result) {
        //    if (result.ResultType == 0) {
        //        email = result.email;
        //        tenant = result.tenant;
        //        id = result.ID;
        //    } else {
        //        Notification.error({
        //            message: result.Messages[0] + '. to get new activation key, please click <a href="/Authorization/ResendKey" target="_self">here</a> to resend key',
        //            positionY: 'top',
        //            positionX: 'center'
        //        });
        //    }
        //});
    //}
    $scope.oldpassword = '111111';
    $scope.submit = function (data) {
        $scope.isNotConfirm = false;
        if (data.Password != data.RetypePassword) {
            Notification.error({
                message: '<strong>Failed!</strong> <span>. Your password is not matching</span>',
                positionY: 'top',
                positionX: 'center'
            });
        }
        else {
            CSRUserGetID.get({ key: datakey }, function (result) {
                if (result.ResultType == 0) {
                    email = result.email;
                    tenant = result.tenant;
                    id = result.ID;
                    //console.log(result);
                    var verifykey = {
                        Key: datakey
                    }
                    CSRUserConfirmationService.confirm(verifykey, function (result) {
                        if (result.ResultType == 0) {
                            var dat = {
                                password: data.Password,
                                email: email,
                                tenant: tenant,
                                id: id
                            }
                            //console.log(dat);
                            if (dat.password != $scope.oldpassword) {
                                CSRUserSetPasswordService.update(dat, function (result) {
                                    if (result.$status == 200) {
                                        Notification.success({
                                            message: '<strong>Success!</strong> <span>Your password has been updated<br />You will be redirected to Login page in 3 seconds </span>',
                                            positionY: 'top',
                                            positionX: 'center'
                                        });
                                        setTimeout(function () {
                                            window.location.assign('/Authorization/Login');
                                        }, 3000);
                                    } else {
                                        Notification.error({
                                            message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                                            positionY: 'top',
                                            positionX: 'center'
                                        });
                                    }
                                });
                            } else {
                                Notification.error({
                                    message: '<strong>Failed!</strong> <span>' + 'Invalid Password' + '.</span>',
                                    positionY: 'top',
                                    positionX: 'center'
                                });
                                return false;
                            }
                        } else {
                            //Notification.error({
                            //    message: '<strong>Failed!</strong> <span>. To get new activation key, please click Link Resend Key to resend key.</span>',
                            //    positionY: 'top',
                            //    positionX: 'center'
                            //});
                            //$scope.isNotConfirm = true;
                            $scope.messageConfirm = result.Messages[0] + '. to get new activation key, please click <a href="/Authorization/ResendKey" target="_self">here</a> to resend key';
                            $scope.isNotConfirm = true;
                        }
                    });
                } else {
                    //Notification.error({
                    //    message: result.Messages[0] + '. to get new activation key, please click <a href="/Authorization/ResendKey" target="_self">here</a> to resend key',
                    //    positionY: 'top',
                    //    positionX: 'center'
                    //});
                    $scope.messageConfirm = result.Message + '. To get new activation key, please click <a href="/Authorization/ResendKey" target="_self">here</a> to resend key';
                    $scope.isNotConfirm = true;
                }
            });
            
        }
        
        
    }
});