SelfCareRegister.controller("RegisterController", function ($scope, $timeout, SelfCareRegistrationCache, ErrorHandlerUtility, CustomerRegistration, Notification,
    CommonEnum, CustomerRegistrationCache, UserAccountManagement, sendSMSFunction) {
    $scope.customerData = {};
    $scope.register = {};
    $scope.formValid = false;
    $scope.isFalse = false;
    $scope.stepType = '';
    $scope.registerMessage = '';
    $scope.CurrentPage = "Templates/SelfCare/CustomerRegistration/Content/NumberVerification/Main.html";
    $scope.header_verify = '';
    $scope.header_finish = 'last disabled';
    $scope.header_custinfo = 'disabled';

    $scope.ShowCurrentPage = function () {
        return $scope.CurrentPage;
    }

    $scope.validForm = function (isValid, data) {
        $scope.formValid = true;
        if (isValid) {
            $scope.process(data);
        } else {
            return false;
        }
    }
    var validateSubscriptionType = function (subscriptionType) {
        var deviceType = CommonEnum.convertSubscriptionType(subscriptionType);
        if (deviceType === 'Child') {
            $scope.Steps('NumberVerification');
            $scope.registerMessage = "Not allowed, device type is " + deviceType;
            $scope.isFalse = true;
            return false;
        } 
        return true;
    };
    var processRegistration = function (param,data)
    {
       
        $scope.customerData = angular.copy(data.CustomerData);
        $scope.isFalse = false;
        $scope.register = data;
        $scope.register.Username = param.Username;
        $scope.register.Email = data.CustomerData.Email;
        $scope.register.SecurityQuestion = {};
        $scope.register.SecurityQuestion.Question = "";
        $scope.register.SecurityQuestion.Answer = "";
        $scope.Name = data.CustomerData.FirstName + " " + data.CustomerData.MiddleName + " " + data.CustomerData.LastName + " " + data.CustomerData.LastName2;
        $scope.Email = data.CustomerData.Email == "" || data.CustomerData.Email == null ? "NA" : data.CustomerData.Email;
        $scope.DocumentType = CommonEnum.convertDocumentType(data.CustomerData.DocumentType).name;
        $scope.DocumentNumber = data.CustomerData.DocumentNumber;
        $scope.CustomerAddress = data.CustomerData.CustomerAddress.Addresses + " No. " + data.CustomerData.CustomerAddress.HouseNo + " ext: " + data.CustomerData.CustomerAddress.HouseExtension + ", " + data.CustomerData.CustomerAddress.State + ", " + data.CustomerData.CustomerAddress.City + ", " + CommonEnum.convertCountryList(data.CustomerData.CustomerAddress.CountryId).name + ", " + data.CustomerData.CustomerAddress.ZipCode;
        $scope.FiscalAddress = data.CustomerData.FiscalAddress.Addresses + " No. " + data.CustomerData.FiscalAddress.HouseNo + " ext: " + data.CustomerData.FiscalAddress.HouseExtension + ", " + data.CustomerData.FiscalAddress.State + ", " + data.CustomerData.FiscalAddress.City + ", " + CommonEnum.convertCountryList(data.CustomerData.FiscalAddress.CountryId).name + ", " + data.CustomerData.FiscalAddress.ZipCode;
        $scope.DeliveryAddress = data.CustomerData.DeliveryAddress.Addresses + " No. " + data.CustomerData.DeliveryAddress.HouseNo + " ext: " + data.CustomerData.DeliveryAddress.HouseExtension + ", " + data.CustomerData.DeliveryAddress.State + ", " + data.CustomerData.DeliveryAddress.City + ", " + CommonEnum.convertCountryList(data.CustomerData.DeliveryAddress.CountryId).name + ", " + data.CustomerData.DeliveryAddress.ZipCode;
        $scope.Nationality = CommonEnum.convertCountryList(data.CustomerData.Nationality).name;

        UserAccountManagement.uservalidation.get({ email: $scope.Email }, function (resource) {
            if (ErrorHandlerUtility.IsResultTypeOK(resource)) {
                $scope.CurrentPage = "Templates/SelfCare/CustomerRegistration/Content/" + $scope.stepType + "/Main.html";
                $scope.header_verify = 'success';
                $scope.header_finish = 'last disabled';
                $scope.header_custinfo = '';
            } else {
                $scope.isFalse = true;
                $scope.Steps('NumberVerification');
                $scope.registerMessage = resource.Messages[0];
            }
        });
    }
    $scope.process = function (param) {
        switch ($scope.stepType) {
            case "CustomerInfo":
                SelfCareRegistrationCache.remove('CustomerByMsisd');
                
                CustomerRegistrationCache.getUserbyMsisdn({ msisdn: param.Username }).then(function (data) {
                    if (ErrorHandlerUtility.IsResultTypeOK(data)) {
                        if (validateSubscriptionType(data.SubscriptionType))
                        {
                            processRegistration(param,data);
                        }                        

                    } else {
                        $scope.Steps('NumberVerification');
                        $scope.registerMessage = data.Messages[0];
                        $scope.isFalse = true;
                    }
                });
                $scope.header_verify = 'success';
                $scope.header_finish = 'last disabled';
                $scope.header_custinfo = '';
                
                break;
            case "Finish":
                $scope.finish(param);
                $scope.header_verify = 'success';
                $scope.header_finish = 'last';
                $scope.header_custinfo = 'success';
                break;
        }
    }

    $scope.StepForm = function (param) {
        switch (param) {
            case "CustomerInfo":
                $scope.stepType = 'CustomerInfo';
                $timeout(function () {
                    angular.element('#registerForm_btn_submit_1').trigger('click');
                }, 100);
                break;
            case "Finish":
                $scope.stepType = 'Finish';
                $timeout(function () {
                    angular.element('#registerStep1Form_btn_submit_1').trigger('click');
                }, 100);
                break;
        }
    }

    $scope.Steps = function (param) {
        switch (param) {
            case "NumberVerification":
                $scope.stepType = 'NumberVerification';
                $scope.CurrentPage = "Templates/SelfCare/CustomerRegistration/Content/" + param + "/Main.html";
                $scope.header_verify = '';
                $scope.header_finish = 'last disabled';
                $scope.header_custinfo = 'disabled';
                break;
            case "CustomerInfo":
                $scope.stepType = 'CustomerInfo';
                $scope.CurrentPage = "Templates/SelfCare/CustomerRegistration/Content/" + param + "/Main.html";
                $scope.header_verify = 'success';
                $scope.header_finish = 'last disabled';
                $scope.header_custinfo = '';
                break;
            case "Finish":
                $scope.stepType = 'Finish';
                $scope.CurrentPage = "Templates/SelfCare/CustomerRegistration/Content/" + param + "/Main.html";
                $scope.header_verify = 'success';
                $scope.header_finish = 'last';
                $scope.header_custinfo = 'success';
                break;
        }
    }

    $scope.check = function () {
        $scope.register.ConfirmPassword = '';
    }

    $scope.$watch("register.Password", function () {
        $scope.register.ConfirmPassword = '';
    });

    $scope.finish = function (data) {
        var jsondata = {
            "CustomerId": data.CustomerID,
            "customerData": $scope.customerData,
            /* will be replaced by PaymentType */
            "paymentType": 2,
            "SecurityQuestion": {
                "Question": data.SecurityQuestion.Question.value,
                "Answer": data.SecurityQuestion.Answer
            },
            "Username": data.Username,
            "Email": data.Email,
            "Password": data.Password,
            "ConfirmPassword": data.ConfirmPassword
        };
        CustomerRegistration.save(jsondata, function (result) {
            if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                //send sms
                var tmplt = CommonEnum.getSMSTemplates();
                var smsData = {
                    msisdn: data.Username,
                    body: tmplt.selfcareRegistration
                }

                var promise = sendSMSFunction.send(smsData);
                promise.then(function (promiseResult) {
                    if (promiseResult) {
                        Notification.success({
                            message: '<p>email confirmation already sent to your email, <br> please check your email account and confirm your selfcare account. Thank You</p>',
                            positionY: 'top',
                            positionX: 'center',
                            delay: 1000000
                        });
                        $timeout(function () {
                            window.location.href = '/Authorization/Login';
                        }, 20000);
                    }
                });
            } else {
                Notification.error({
                    message: '<p>Failed! ' + result.Messages[0] + '.</p>',
                    positionY: 'top',
                    positionX: 'center',
                });

            }
        });
    }
});