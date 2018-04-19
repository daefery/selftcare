CSRContent.controller("AutoPayController", function ($scope, Notification, ErrorHandlerUtility, LocalStorageProvider, $timeout,
    SubscriptionService, CommonEnum) {
    $scope.defaultccnumber = null;
    $timeout(function () {
        if ($scope.products != null) {
            var cust = $scope.products.Customer.CustomerID;
            SubscriptionService.CustomerCC.query({ customerid: cust }, function (result) {
                var data = angular.copy(result.PaymentProfiles);;
                var truedata = [];
                if (data != null && data.length > 0) {
                    for (var index = 0; index < data.length; index++) {
                        var item = data[index];
                        var temp = item.PaymentProfile;
                        temp.CreditCardType = CommonEnum.convertCCType(temp.CreditCardType).name;
                        temp.ExpirationDate = moment(temp.ExpirationDate).format(config.DateFormatMoment);
                        if (item.Type == 3) {
                            truedata.push(temp);
                            if (temp.IsDefault == true) {
                                $scope.defaultccnumber = temp.CustomerPaymentMeanId;
                                $scope.newdefault = temp.CustomerPaymentMeanId;
                                temp.IsDefault = "Default"
                            } else if (temp.IsDefault == false) {
                            }
                        }
                    };
                    $scope.cctabledata = angular.copy(truedata)
                }
            });
        }
    }, 5000);
    
    

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.selectedRow = null;
    $scope.newdefault = null;

    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index.CustomerPaymentMeanId;
        $scope.newdefault = index.CustomerPaymentMeanId;
    }

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();
    $scope.TemplateCode = LocalStorageProvider.getTemplateCode();

    $scope.isFormVisible = false;

    $scope.isNewCCSelected = function () {
        return angular.equals($scope.newdefault, $scope.defaultccnumber);
    }

    $scope.addCC = function() {
        $scope.isFormVisible = true;
        $scope.isDifferentFromDefault = false;
        //console.log($scope.showForm);
    }

    $scope.showForm = function () {
        return $scope.isFormVisible;
        
    }

    $scope.setDefaultCC = function () {
        var custid = $scope.products.Customer.CustomerID;
        var data = {
            CustomerId: custid,
            DefaultPaymentMeanId: $scope.newdefault
        }
        SubscriptionService.SetDefaultCC.save(data, function (response) {
            console.log(response);
            if (ErrorHandlerUtility.IsResultTypeOK(response)) {
                    var msg = 'Credit card has been set as default';
                    Notification.success({
                        message: '<span>' + msg + '</span>',
                        positionY: 'top',
                        positionX: 'center',
                        delay: 4000,
                        title: "<span ><h4 style='color: white;'>Success</h4></span>"
                    });
                    $scope.cctabledata = [];
                    SubscriptionService.CustomerCC.query({ customerid: custid }, function (result) {
                        var data = angular.copy(result.PaymentProfiles);;
                        var truedata = [];
                        $scope.cctabledata = [];
                        if (data != null && data.length > 0) {
                            for (var index = 0; index < data.length; index++) {
                                var item = data[index];
                                var temp = item.PaymentProfile;
                                temp.CreditCardType = CommonEnum.convertCCType(temp.CreditCardType).name;
                                temp.ExpirationDate = moment(temp.ExpirationDate).format(config.DateFormatMoment);
                                if (item.Type == 3) {
                                    truedata.push(temp);
                                    $scope.cctabledata.push(temp);
                                    if (temp.IsDefault == true) {
                                        $scope.defaultccnumber = item.CardNumber;
                                    }
                                }
                            };
                            //$scope.cctabledata = angular.copy(truedata);
                            setTimeout(function () {
                                $scope.$apply(function () {
                                    $scope.cctabledata = truedata;
                                }
                                )
                            }, 1000);
                        }
                    });
                    $scope.selectedRow = null;
                    angular.element('#ManageAutoPay').modal('hide');
            } else {
                var msg = ErrorHandlerUtility.GetErrorMessage(response);
                Notification.error({
                    message: '<span>' + msg + '</span>',
                    positionY: 'top',
                    positionX: 'center',
                    delay: 4000,
                    title: "<span ><h4 style='color: white;'>Failed</h4></span>"
                });
            }
        });
    };

    $scope.SubmitNewCC = function (SIMSwap) {
        var custid = $scope.products.Customer.CustomerID;
        var date = new Date();
        var temp = moment(date).format(config.DateFormatMoment);
        $scope.typecc = parseInt(SIMSwap.CCtype, 10);
        var PaymentProfile = {
            CustomerPaymentMeanId: "1",
            CardNumber: SIMSwap.CCnumber,
            ExpirationDate: SIMSwap.expirationdate,
            StartDate: null,
            EndDate: null,
            NameOnCard: SIMSwap.CCname,
            CCV: SIMSwap.CSC,
            CreditCardType: $scope.typecc,
            IsDefault: false,
            profiletype: 3
        }
        var NewPaymentData = {
            AccountId: null,
            CustomerId: custid,
            PaymentCatalogId: 1020000001,
            PaymentProfile: PaymentProfile
        }
        var valid = true;
        if (valid) {
            SubscriptionService.NewCC.save(NewPaymentData, function (response) {
                if (ErrorHandlerUtility.IsResultTypeOK(response)) {
                    var msg = ErrorHandlerUtility.GetErrorMessage(response);
                    autopayform.reset();
                    var msg = 'Credit Card profile created';
                    Notification.success({
                        message: '<span>' + msg + '</span>',
                        positionY: 'top',
                        positionX: 'center',
                        delay: 4000,
                        title: "<span ><h4 style='color: white;'>Success</h4></span>"
                    });
                    SubscriptionService.CustomerCC.query({ customerid: custid }, function (result) {
                        var data = angular.copy(result.PaymentProfiles);;
                        var truedata = [];
                        $scope.cctabledata = [];
                        if (data != null && data.length > 0) {
                            for (var index = 0; index < data.length; index++) {
                                var item = data[index];
                                var temp = item.PaymentProfile;
                                temp.CreditCardType = CommonEnum.convertCCType(temp.CreditCardType).name;
                                temp.ExpirationDate = moment(temp.ExpirationDate).format(config.DateFormatMoment);
                                if (item.Type == 3) {
                                    truedata.push(temp);
                                    $scope.cctabledata.push(temp);
                                    if (temp.IsDefault == true) {
                                        $scope.defaultccnumber = item.CardNumber;
                                    }
                                }
                            };
                            setTimeout(function () {
                                $scope.$apply(function () {
                                    $scope.cctabledata = truedata;
                                }
                                )
                            }, 1000);
                        }
                    });
                    $scope.selectedRow = null;
                    angular.element('#ManageAutoPay').modal('hide');

                } else {
                    var msg = ErrorHandlerUtility.GetErrorMessage(response);
                    Notification.error({
                        message: '<span>' + msg + '</span>',
                        positionY: 'top',
                        positionX: 'center',
                        delay: 4000,
                        title: "<span ><h4 style='color: white;'>Failed</h4></span>"
                    });
                }
            })
        }
    }

});

CSRContent.controller("AutoPayForm", function ($scope, Notification, ErrorHandlerUtility, LocalStorageProvider,
    SubscriptionService, CommonEnum, $timeout) {

    $scope.datas = {

        field: [
            {
                type: "radio",
                name: "radioCCtype",
                size: 6,
                text: "cc_type",
                model: "addCC.CCtype",
                required: true,
                style: "horizontal",
                content: [{ text: "Visa", value: 0 }, { text: "Master Card", value: 1 }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "text",
                name: "CCnumber",
                size: 6,
                text: "cc_number",
                model: "addCC.CCnumber",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "CCname",
                size: 6,
                text: "cc_name",
                model: "addCC.CCname",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "date",
                name: "expirationdate",
                size: 6,
                text: "cc_expiry_date",
                model: "addCC.expirationdate",
                required: true,
                validation: [{ value: "mandatory" }, { value: "date" }]
            },
            {
                type: "text",
                name: "CCcsc",
                size: 6,
                text: "cvv",
                model: "addCC.CSC",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
        ],
        button: [
            {
                name: "btnSubmitSIMSwap",
                type: "submit",
                text: "Submit",
                click: "SubmitNewCC(addCC)"
            },
            {
                name: "btnCancelSIMSwap",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    };
});