publicContent.controller("ActivationController", function ($scope, $location, Notification, reCAPTCHA, CaptchaVerificationService, CaptchaKey,
    ErrorHandlerUtility, SelfActivationCache, vcRecaptchaService, MultiSubscriptionsCacheService, SelfPublicCache) {
    //captcha
    $scope.response = null;
    $scope.widgetId = null;

    $scope.model = {
        key: CaptchaKey
    };
    $scope.captchaProcess = function (type, param) {
        //var vm = this;
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
                //vm.VerifyCodeForm.$setPristine();
                //vm.VerifyCodeForm.$setUntouched();
                break;
        }
    }
    //end of captcha

    //$scope.user = {};
    $scope.orderDetail = {};
    //reCAPTCHA.setPublicKey(CaptchaKey);
    $scope.doConfirm = function (data) {
        //var usr = angular.copy($scope.user);
        //var datreq = {
        //    challenge: usr.captcha.challenge,
        //    response: usr.captcha.response
        //}
        //CaptchaVerificationService.save(datreq, function (result) {
        //if (result.success) {
        SelfPublicCache.remove('order_detail');
        SelfActivationCache.getCustomerOrder({ OrderNumber: data.key }).then(function (resource) {
            console.log('order', resource);
            if (ErrorHandlerUtility.IsResultTypeOK(resource)) {
                MultiSubscriptionsCacheService.getSubscriptionsList(resource.CustomerId, false).then(function (result) {
                    console.log('subs', result);
                    if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                        $location.path(Console.rootPath + 'public/customer/app/activation/order/information');
                    } else {
                        Notification.error({
                            message: '<span>' + result.Messages[0] + '</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                    }
                })
            } else {
                Notification.error({
                    message: '<span>' + resource.Messages[0] + '</span>',
                    positionY: 'bottom',
                    positionX: 'center'
                });
                vcRecaptchaService.reload($scope.widgetId);
            }
        });
        //    reCAPTCHA.reload();
        //} else {
        //    Notification.error({
        //        message: '<span>Failed! captcha does not match.</span>',
        //        positionY: 'bottom',
        //        positionX: 'center'
        //    });
        //    reCAPTCHA.reload();
        //    $scope.user.captcha = {};
        //}
        //});

    }


});

publicContent.controller("CustomerInformationController", function ($scope, $location, $filter, SelfPublicCache, RegistrationCache, CommonEnum) {
    var orderDetail = angular.copy(SelfPublicCache.get('order_detail'));

    $scope.orderDetail = orderDetail;
    //$scope.StoreId = orderDetail.StoreId != null ? orderDetail.StoreId : '-';
    $scope.ContactName = orderDetail.ContactName != null ? orderDetail.ContactName : '-';
    $scope.ContactPhone = orderDetail.ContactPhone != null ? orderDetail.ContactPhone : '-';
    $scope.OrderDate = moment(orderDetail.OrderDate).format(config.DateFormatMoment + ', h:mm:ss a');
    $scope.shippingAddress = orderDetail.ShippingAddress != null ? orderDetail.ShippingAddress.ShipToAddress1 + ' ' + orderDetail.ShippingAddress.ShipToAddress2 + ' ' + orderDetail.ShippingAddress.ShipToCity + '' + orderDetail.ShippingAddress.ShipToCountry + ' ' +
        orderDetail.ShippingAddress.ShipToState + ' ' + orderDetail.ShippingAddress.ShipToZip : '-';

    var ListItems = [];
    for (var i = 0; i < orderDetail.OrderedItems.length; i++) {
        var ItemDevice = orderDetail.OrderedItems[i];
        ListItems.push(ItemDevice);
    }
    var totalPayment = 0;
    var ListItemsGroup = [];
    for (var i = 0; i < ListItems.length; i++) {
        var ItemGroup = ListItems[i];
        var SaveItem = {
            names: ItemGroup.Description,
            totalQuantity: ItemGroup.Quantity,
            totalPrice: ItemGroup.UnitPrice,
        }
        totalPayment += SaveItem.totalPrice;
        var ItemGroupExists = $filter('filter')(ListItemsGroup, { names: SaveItem.names })[0];
        if (ItemGroupExists != null) {
            ItemGroupExists.totalQuantity += SaveItem.totalQuantity;
            ItemGroupExists.totalPrice += SaveItem.totalPrice;
        } else {
            ListItemsGroup.push(SaveItem);
        }
    }
    $scope.OrderedItemsGroupByDevice = ListItemsGroup;
    $scope.totalPayment = totalPayment;

    $scope.CustomerInfo = {};
    RegistrationCache.getCustomerInfo({ customerid: orderDetail.CustomerId }).then(function (result) {
        var customerInfo = result.CustomerData;
        $scope.CustomerInfo = customerInfo;
        $scope.CustomerInfo.fullName = customerInfo.FirstName + ' ' +
            (customerInfo.MiddleName == null ? "" : customerInfo.MiddleName) + ' ' +
            (customerInfo.LastName == null ? "" : customerInfo.LastName) + ' ' +
            (customerInfo.LastName2 == null ? "" : customerInfo.LastName2)
        ;
        $scope.CustomerInfo.customerAddress = customerInfo.CustomerAddress.Addresses + " No. " + customerInfo.CustomerAddress.HouseNo + " ext: " + customerInfo.CustomerAddress.HouseExtension + ", " +
            customerInfo.CustomerAddress.State + ", " + customerInfo.CustomerAddress.City + ", " + CommonEnum.convertCountryList(customerInfo.CustomerAddress.CountryId).name + ", " +
            customerInfo.CustomerAddress.ZipCode;
        //$scope.CustomerInfo.Nationality = CommonEnum.convertCountryList(customerInfo.Nationality).name;

    });

    $scope.goNext = function () {
        $location.path(Console.rootPath + 'public/customer/app/activation/order/numberverify');
    }
    $scope.goPrev = function () {
        $location.path(Console.rootPath + 'public/customer/app/activation/order');
    }
});

publicContent.controller("ActivationESNController", function ($scope, $location, $filter, SelfActivationResource, SelfPublicCache,
    ErrorHandlerUtility, Notification, CommonEnum, MultiSubscriptionsCacheService) {

    var data = angular.copy(SelfPublicCache.get('order_detail'));
    SelfPublicCache.put('NotActivatedDevice', []);
    var CustomerId = data.CustomerId;
    var datadummy = {};
    var Handset3G = CommonEnum.getProductTypeEnum().Handset3G;
    var Handset4G = CommonEnum.getProductTypeEnum().Handset4G;

    var groupby_SubOrderIdentificator = [];
    for (var i = 0; i < data.OrderedItems.length; i++) {
        var item = data.OrderedItems[i];
        if (item.ProductType.toString() == Handset3G.toString()
            || item.ProductType.toString() == Handset4G.toString()
            ) {
            item.DeviceName = item.Description == null || item.Description == "" ? "Others" : item.Description;
            item.orderedItems = [];
            item.isActivated = false;
            groupby_SubOrderIdentificator.push(item);
        }
    }
    for (var i = 0; i < groupby_SubOrderIdentificator.length; i++) {
        var device = groupby_SubOrderIdentificator[i];
        for (var j = 0; j < data.OrderedItems.length; j++) {
            var item = data.OrderedItems[j];
            if (item.ProductType.toString() != Handset3G.toString()
                && item.ProductType.toString() != Handset4G.toString()
                ) {
                if (item.SubOrderIdentificator == device.SubOrderIdentificator) {
                    device.orderedItems.push(item);
                }
            }
        }
    }
    datadummy.OrderedItems = groupby_SubOrderIdentificator;

    MultiSubscriptionsCacheService.getSubscriptionsList(CustomerId, false).then(function (result) {
        if (ErrorHandlerUtility.IsResultTypeOK(result)) {
            var subscriptions = angular.copy(result);
            if (subscriptions.Subscriptions != undefined && subscriptions.Subscriptions.length > 0) {
                for (var i = 0; i < datadummy.OrderedItems.length; i++) {
                    var device = datadummy.OrderedItems[i];
                    for (var j = 0; j < subscriptions.Subscriptions.length; j++) {
                        var subscription = subscriptions.Subscriptions[j].Subscription;
                        if (subscription != null && device.SubOrderIdentificator.toString() == subscription.SubscriptionId.toString()
                            && subscription.SubscriptionStatus != 8 // Init
                        ) {
                            device.isActivated = true;
                        }
                    }
                }

                datadummy.OrderedItems = $filter('filter')(datadummy.OrderedItems, { isActivated: false }); //Display Init Only
                SelfPublicCache.put('NotActivatedDevice', angular.copy(datadummy.OrderedItems));
                $scope.OrderDetailByDevice = datadummy;

            }
        }

    })

    $scope.confirm = {};
    $scope.confirm.ICCID = "ICCID";
    $scope.isIMEI = true;
    $scope.isCompiled = false;
    $scope.SubOrderIdentificator = 0;
    $scope.$watch("confirm.ESNIEMEI", function (newValue, oldValue) {
        if ($scope.confirm.ESNIEMEI != undefined && $scope.confirm.ESNIEMEI.length > 12) {
            $scope.confirm.ICCID = "";
            $scope.isIMEI = false;
        } else {
            $scope.isIMEI = true;
            $scope.confirm.ICCID = "x";    //because it is UI mandatory && its hidden
        }
    });

    $scope.confirm.isUseExistingMobileNumber = false;
    $scope.confirm.UseExistingMobileNumber_1 = false;
    $scope.confirm.ICCID = "x";    //because it is UI mandatory && its hidden
    $scope.confirm.Mobile_Number = "x";    //because it is UI mandatory && its hidden
    $scope.confirm.PIN_Number = "x";    //because it is UI mandatory && its hidden
    $scope.$watch('confirm.UseExistingMobileNumber_1', function () {
        if ($scope.confirm != undefined) {
            if ($scope.confirm.UseExistingMobileNumber_1 != undefined
                && $scope.confirm.UseExistingMobileNumber_1 == true) {
                $scope.confirm.isUseExistingMobileNumber = true;
                $scope.confirm.Mobile_Number = "";
                $scope.confirm.PIN_Number = "";
            } else {
                $scope.confirm.isUseExistingMobileNumber = false;
                $scope.confirm.Mobile_Number = "x";    //because it is UI mandatory
                $scope.confirm.PIN_Number = "x";    //because it is UI mandatory
            }
        }
    })

    var orderDetail = angular.copy(SelfPublicCache.get('order_detail'));
    $scope.orderDetail = orderDetail;
    setTimeout(function () {
        $scope.isCompiled = true;
        $scope.$apply();
    }, 1000);

    $scope.selectDevice = function (param) {
        var body = $("html, body");
        body.stop().animate({ scrollTop: 500 }, '500', 'swing', function () {
            $scope.SubOrderIdentificator = param;
            $scope.$apply();
            $("#esn").show("slow");
        });
    };
    $scope.activate = function (data) {
        var param;
        if (data.ESNIEMEI.length > 12) {
            param = {
                "OrderNumber": orderDetail.OrderNumber,
                "UniqueIdentifier": $scope.SubOrderIdentificator,
                "MarketInfo": "website",
                "ProvisioningType": config.TemplateCode,
                "ZipCode": data.ZipCode,
                "Sim": data.ESNIEMEI,
                "IccId": data.ICCID
            }
        } else {
            param = {
                "OrderNumber": orderDetail.OrderNumber,
                "UniqueIdentifier": $scope.SubOrderIdentificator,
                "MarketInfo": "website",
                "ProvisioningType": config.TemplateCode,
                "ZipCode": data.ZipCode,
                "Esn": data.ESNIEMEI
            }
        }

        if (data.isUseExistingMobileNumber == true) {
            param.PortInMobileNumber = data.Mobile_Number;
            param.PasswordPin = data.PIN_Number;
        }

        SelfActivationResource.activate.save(param, function (result) {
            if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                SelfPublicCache.put('msisdn_activated', result);
                $location.path(Console.rootPath + 'public/customer/app/activation/order/activated');
            } else {
                Notification.error({
                    message: '<span>' + result.Messages[0] + '</span>',
                    positionY: 'bottom',
                    positionX: 'center'
                });
            }
        });
    }
});

publicContent.controller("FinishSelfActivationController", function ($scope, $location, SelfPublicCache, MultiSubscriptionsCache) {
    var result = SelfPublicCache.get('msisdn_activated');
    $scope.MSISDN = result.mdn;

    $scope.showbutton_goToDeviceActivation = false;
    var NotActivatedDevice = SelfPublicCache.get('NotActivatedDevice');
    if (NotActivatedDevice != undefined && NotActivatedDevice.length - 1 > 0) {
        $scope.showbutton_goToDeviceActivation = true;
    }

    MultiSubscriptionsCache.remove('SubscriptionsListByCustomerId');
    $scope.goToDeviceActivation = function () {
        $location.path(Console.rootPath + 'public/customer/app/activation/order/numberverify');
    }
});