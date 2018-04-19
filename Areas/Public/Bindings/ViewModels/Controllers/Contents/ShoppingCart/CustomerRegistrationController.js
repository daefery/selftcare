publicContent.controller('CustomerRegistrationPageController', function ($scope, $rootScope, $http, $location,$parse, SelfPublicCache, RegistrationCache, ApiConnection,
                                                                        dealerIdService, queryMsisdnElementService, ShoppingCartService,
                                                                            GetShoppingCartService, ErrorHandlerUtility, RemoveShoppingCartService,
                                                                                AuthUtilityCommon, Notification, ShoppingCartHelper, CommonEnum) {
    $scope.isShoppingCart = true;
    $scope.isSelfCare = false;
    $scope.Devices = {};
    $scope.Order = {};
    $scope.CustomerInfo = {};
    $scope.CustomerInfo.CustomerAddress = {};
    $scope.ShippingAndPayment = {};
    $scope.dataCustInfo = {};
    $scope.dataShipping = {};
    $scope.dataSummary = {};
    $scope.ccPayment = {};
    $scope.paypalPayment = {};
    $scope.isPayPal = {};
    $scope.isPaypalSuccess = false;
    $scope.isPaypalFailed = false;
    $scope.Order.SelectedPlan = {};
    $scope.Order.SelectedDevice = {};
    $scope.Order.Plan = [];
    $scope.Order.ItemPlan = {};
    $scope.Cart = {};
    $scope.Order.OtherProduct = [];
    
    $scope.HasDevice = false;
    $scope.HasOtherProd = false;
    $scope.cartItemCount = 0;
    $scope.IsUpdatingCart = false;

    $scope.optFeatures = [];
    $scope.otherProd = [];

    $scope.activeCustomerId = "";
    $scope.paypalResponse = {};
    $scope.getProductRequired = true;

    $scope.CarrierList = [];
    $scope.validPortIn = false;
    $scope.isPortIn = false;

    if ($location.path() == '/SelfCare/Customer/App/BuyMore/Device') {
        $scope.activeCustomerId = JSON.parse(localStorage.getItem('self_scope')).customerInfo.CustomerID;
        RegistrationCache.getCustomerInfo({ customerid: $scope.activeCustomerId }).then(function (customer) {
            $scope.CustomerInfo = angular.copy(customer.CustomerData);
            $scope.CustomerInfo.GendersValue = $scope.CustomerInfo.Genders != -1 ? CommonEnum.convertGender(customer.CustomerData.Genders).value : '-';
            $scope.CustomerInfo.Genders = $scope.CustomerInfo.Genders != -1 ? CommonEnum.convertGender(customer.CustomerData.Genders).name : '-';
            angular.forEach($scope.CustomerInfo, function (value, key) {
                if (value == null || value == "") {
                    var keyval = $parse("CustomerInfo." + key);
                    keyval.assign($scope, '-');
                }
            });
            $scope.CustomerInfo.CountryCode = $scope.CustomerInfo.Nationality != '-' ? CommonEnum.convertCountryList($scope.CustomerInfo.Nationality).code : $scope.CustomerInfo.Nationality;
            $scope.CustomerInfo.CountryValue = $scope.CustomerInfo.Nationality != '-' ? CommonEnum.convertCountryList($scope.CustomerInfo.Nationality).value : $scope.CustomerInfo.Nationality;
            $scope.CustomerInfo.DocumentTypeValue = $scope.CustomerInfo.DocumentType != '-' ? CommonEnum.convertDocumentType(customer.CustomerData.DocumentType).value : $scope.CustomerInfo.DocumentType;
            $scope.CustomerInfo.DocumentType = $scope.CustomerInfo.DocumentType != '-' ? CommonEnum.convertDocumentType(customer.CustomerData.DocumentType).name : $scope.CustomerInfo.DocumentType;
            $scope.CustomerInfo.BirthDay = $scope.CustomerInfo.BirthDay != '-' ? moment(customer.CustomerData.BirthDay).format(config.DateFormatMoment) : $scope.CustomerInfo.BirthDay;
            $scope.CustomerInfo.Nationality = $scope.CustomerInfo.Nationality != '-' ? CommonEnum.convertCountryList($scope.CustomerInfo.Nationality).name : $scope.CustomerInfo.Nationality;
            $scope.CustomerInfo.CustomerAddress.CountryNameId = $scope.CustomerInfo.CustomerAddress.CountryId != '-' ? CommonEnum.convertCountryList($scope.CustomerInfo.CustomerAddress.CountryId).value : $scope.CustomerInfo.CustomerAddress.CountryId;
            $scope.CustomerInfo.CustomerAddress.CountryName = $scope.CustomerInfo.CustomerAddress.CountryId != '-' ? CommonEnum.convertCountryList($scope.CustomerInfo.CustomerAddress.CountryId).name : $scope.CustomerInfo.CustomerAddress.CountryId;
            $scope.CustomerInfo.CustomerAddress.CountryCode = $scope.CustomerInfo.CustomerAddress.CountryId != '-' ? CommonEnum.convertCountryList($scope.CustomerInfo.CustomerAddress.CountryId).code : $scope.CustomerInfo.CustomerAddress.CountryId;
        });
    }

    $scope.Cart.calculateOrderedTotalPrice = function () {
        var OrderedTotalPrice = 0;
        for (var i = 0; i < $scope.Cart.CartList.length; i++) {
            var CartItem = $scope.Cart.CartList[i];
            if (CartItem.isByod === true) {
                OrderedTotalPrice += 0;
            } else {
                OrderedTotalPrice += parseFloat(CartItem.device.price);
            }
            //OrderedTotalPrice += parseFloat(CartItem.device.price);

            OrderedTotalPrice += parseFloat(CartItem.plans.price);

            for (var k = 0; k < CartItem.plans.mandatoryFeatures.length; k++) {
                OrderedTotalPrice += parseFloat(CartItem.plans.mandatoryFeatures[k].parentFeature.price);
                for (var l = 0; l < CartItem.plans.mandatoryFeatures[k].childFeatures.length; l++) {
                    OrderedTotalPrice += parseFloat(CartItem.plans.mandatoryFeatures[k].childFeatures[l].price);
                }
            }
            for (var k = 0; k < CartItem.plans.optFeatures.length; k++) {
                OrderedTotalPrice += parseFloat(CartItem.plans.optFeatures[k].price);
            }

            for (var j = 0; j < CartItem.otherProd.length; j++) {
                OrderedTotalPrice += parseFloat(CartItem.otherProd[j].price);
            }
            for (var j = 0; j < CartItem.cashCards.length; j++) {
                OrderedTotalPrice += parseFloat(CartItem.cashCards[j].price);
            }
            for (var j = 0; j < CartItem.AllowanceCashCard.length; j++) {
                OrderedTotalPrice += parseFloat(CartItem.AllowanceCashCard[j].price);
            }


        }
        $scope.Cart.TotalPrice = OrderedTotalPrice;
        return OrderedTotalPrice;
    }


    $scope.Cart.refreshCartList = function () {
        if (ShoppingCartService.IsHasShoppingCartSessionId()) {
            var obj = JSON.parse(localStorage.ShoppingCartSession);
            var dat = { id: obj.SessionId }
            GetShoppingCartService.get(dat, function (resp) {
                if (ErrorHandlerUtility.IsResultTypeOK(resp)) {
                    $scope.cartItemCount = resp.ShoppingCart.Count;
                    $scope.Cart.CartList = resp.ShoppingCart.Cart;
                    $scope.isHasCartSession = true;

                    $scope.Cart.calculateOrderedTotalPrice();
                    $scope.Cart.GroupBy();
                } else {
                    $scope.isNotCompatible = true;
                    var msg = ErrorHandlerUtility.GetErrorMessage(resp);
                    if (msg === "Expired") {
                        var obj = JSON.parse(localStorage.ShoppingCartSession);
                        var dat = { id: obj.SessionId }
                        RemoveShoppingCartService.remove(dat, function (resp) {
                            if (ErrorHandlerUtility.IsResultTypeOK(resp)) {
                                AuthUtilityCommon.ClearSession("ShoppingCartSession");
                            }
                        });
                    }
                    $scope.isHasCartSession = false;
                    if (!ShoppingCartService.IsHasShoppingCartSessionId()) {
                        ShoppingCartService.GenerateSessionId();
                    }
                }
            });
        } else {
            $scope.isNotCompatible = true;
            ShoppingCartService.GenerateSessionId();

        }
    }
    $scope.Cart.refreshCartList();


    //CartGroupBy begin
    $scope.insertToGroupByCart = function (arrayOfItem, item) {
        var index = -1; //NotExistInArray
        for (var i = 0; i < arrayOfItem.length; i++) {
            if (arrayOfItem[i].id == item.id &&
                arrayOfItem[i].price == item.price
                ) { //assume if same [id & price] equal to [same data]
                index = i;
            }
        };
        if (index == -1) {
            var data = new Object({
                id: item.id,
                names: item.names,
                description: item.names,
                quantity: 1, //add new field
                unitprice: item.price,
                price: item.price,  //totalprice ~= price * quantity
            })
            //insert
            arrayOfItem.push(data);
        } else {
            //add quantity
            arrayOfItem[index].quantity += 1;
            arrayOfItem[index].price += item.price;
        }
    }

    $scope.Cart.GroupBy = function () {
        $scope.Cart.OrderedDeviceSummary = [];
        $scope.Cart.OrderedPlanSummary = [];
        $scope.Cart.OrderedOtherProductSummary = [];

        for (var i = 0; i < $scope.Cart.CartList.length; i++) {
            if ($scope.Cart.CartList[i].isByod !== true) {
                $scope.insertToGroupByCart($scope.Cart.OrderedDeviceSummary, $scope.Cart.CartList[i].device)
            }
            $scope.insertToGroupByCart($scope.Cart.OrderedPlanSummary, $scope.Cart.CartList[i].plans)

            for (var j = 0; j < $scope.Cart.CartList[i].plans.mandatoryFeatures.length; j++) {
                $scope.insertToGroupByCart($scope.Cart.OrderedPlanSummary, $scope.Cart.CartList[i].plans.mandatoryFeatures[j].parentFeature);
                for (var k = 0; k < $scope.Cart.CartList[i].plans.mandatoryFeatures[j].childFeatures.length; k++) {
                    $scope.insertToGroupByCart($scope.Cart.OrderedPlanSummary, $scope.Cart.CartList[i].plans.mandatoryFeatures[j].childFeatures[k]);
                }
            }
            for (var j = 0; j < $scope.Cart.CartList[i].plans.optFeatures.length; j++) {
                $scope.insertToGroupByCart($scope.Cart.OrderedPlanSummary, $scope.Cart.CartList[i].plans.optFeatures[j]);
            }

            for (var j = 0; j < $scope.Cart.CartList[i].otherProd.length; j++) {
                $scope.insertToGroupByCart($scope.Cart.OrderedOtherProductSummary, $scope.Cart.CartList[i].otherProd[j]);
            }
            for (var j = 0; j < $scope.Cart.CartList[i].cashCards.length; j++) {
                $scope.insertToGroupByCart($scope.Cart.OrderedOtherProductSummary, $scope.Cart.CartList[i].cashCards[j]);
            }
            for (var j = 0; j < $scope.Cart.CartList[i].AllowanceCashCard.length; j++) {
                $scope.insertToGroupByCart($scope.Cart.OrderedOtherProductSummary, $scope.Cart.CartList[i].AllowanceCashCard[j]);
            }

        }
        $scope.Cart.calculateOrderedTotalPrice();
    }
    //CartGroupBy end

    if ($location.path() === '/CSR/Customer/App/CustomerRegistration' || $location.path() === '/CSR/Customer/App/CustomerRegistration/Confirmation' || $location.path() === '/CSR/Customer/App/CustomerRegistration/Failed' || $location.path() === '/CSR/Customer/App/CustomerRegistration/Cancelled') {
        $scope.isShoppingCart = false;
    }

    var dealerId = 190000;
    var Quantity = 5;
    var CategoryId = 1;

    var dataQuery = {};
    dealerIdService.setDealerId(dealerId);

    dataQuery.categoryId = CategoryId;
    dataQuery.quantity = Quantity;
    queryMsisdnElementService.setQueryElement(dataQuery);

    $scope.mapShipMethod = function (data) {
        data.ShippingMethods.forEach(function (e) {
            e.value = e.ShipByCode;
            e.name = e.ShipByText;
            delete e.ShipByCode;
            delete e.ShipByText;
        });
        return data.ShippingMethods;
    };

    if (($location.path() === '/CSR/Customer/App/CustomerRegistration/Confirmation') || ($location.path() === '/public/customer/app/shoppingcart/confirmation') || $location.path() === '/SelfCare/Customer/App/BuyMoreDevice/Confirmation') {
        $scope.isPaypalSuccess = true;
        $scope.isPaypalFailed = false;
        $scope.getProductRequired = false;
        $scope.CustomerInfo = angular.copy(JSON.parse(localStorage.customerDataReq));
        localStorage.removeItem("customerDataReq");
        $scope.Order = angular.copy(JSON.parse(localStorage.orderingReq));
        localStorage.removeItem("orderingReq");
        $scope.ShippingAndPayment = angular.copy(JSON.parse(localStorage.shippingPaymentReq));
        localStorage.removeItem("shippingPaymentReq");
        $scope.Cart.CartList = angular.copy(JSON.parse(localStorage.CartItem));
        localStorage.removeItem("CartItem");
        $scope.paypalResponse = angular.copy(JSON.parse(localStorage.paymentResponse));
        localStorage.removeItem("paymentResponse");
        $scope.Cart.TotalPayment = angular.copy(JSON.parse(localStorage.paymentAmount));
        localStorage.removeItem("paymentAmount");
        $scope.Cart.refreshCartList();
    }

    if (($location.path() === '/CSR/Customer/App/CustomerRegistration/Failed') || ($location.path() === '/public/customer/app/shoppingcart/failed') || ($location.path() === '/CSR/Customer/App/CustomerRegistration/Cancelled') || ($location.path() === '/public/customer/app/shoppingcart/cancelled') || $location.path() === '/SelfCare/Customer/App/BuyMoreDevice/Failed' || $location.path() === '/SelfCare/Customer/App/BuyMoreDevice/Cancelled') {
        $scope.isPaypalFailed = true;
        $scope.isPaypalSuccess = false;
        $scope.CustomerInfo = angular.copy(JSON.parse(localStorage.customerDataReq));
        localStorage.removeItem("customerDataReq");
        $scope.Order = angular.copy(JSON.parse(localStorage.orderingReq));
        localStorage.removeItem("orderingReq");
        $scope.ShippingAndPayment = angular.copy(JSON.parse(localStorage.shippingPaymentReq));
        localStorage.removeItem("shippingPaymentReq");
        $scope.Cart = angular.copy(JSON.parse(localStorage.CartItem));
        localStorage.removeItem("CartItem");
        $scope.Cart.refreshCartList();
    }



    RegistrationCache.getListPaymentMethod().then(function (paymentMethod) {
        if (paymentMethod.PaymentMethods.indexOf('1') > -1) {
            $scope.paypalPayment = true;
        } else {
            $scope.paypalPayment = false;
        };
        if (paymentMethod.PaymentMethods.indexOf('2') > -1) {
            $scope.ccPayment = true;
        } else {
            $scope.ccPayment = false;
        };
        if (($scope.paypalPayment === true) && ($scope.ccPayment === true)) {
            $scope.isPayPal = true;
        } else if (($scope.paypalPayment === false) && ($scope.ccPayment === true)) {
            $scope.isPayPal = false;
        } else {
            $scope.isPayPal = true;
        };
    });

    RegistrationCache.getAvailableShippingMethod().then(function (shipMethodData) {
        $rootScope.listShipMethod = angular.copy(shipMethodData);
        $scope.DeliveryMethod = $scope.mapShipMethod($rootScope.listShipMethod);
    });



    $scope.DeviceSpecs = [];
    $scope.DeviceImages = [];
    if ($scope.getProductRequired) {
        RegistrationCache.getPlan().then(function (planData) {
            $rootScope.plan = angular.copy(planData);
            for (var k = 0; k < $rootScope.plan.Products.length; k++) {
                var groupsDevices = $rootScope.plan.Products[k].DevicesAndAccecories;
                for (var l = 0; l < groupsDevices.length; l++) {
                    var devices = {};
                    if (groupsDevices[l].GroupId != undefined) {
                        devices = $rootScope.plan.Products[k].DevicesAndAccecories[l].Products;
                    } else {
                        devices = $rootScope.plan.Products[k].DevicesAndAccecories[l].Product;
                    }

                    for (var i = 0; i < devices.length; i++) {
                        if (devices[i].ProductSpecification !== null) {
                            var deviceSpecification = devices[i].ProductSpecification;
                            var deviceStockQty = devices[i].Quantity;
                            var deviceId = devices[i].Id;
                            var deviceSpec = {
                                DeviceSpecification: deviceSpecification,
                                DeviceStock: deviceStockQty,
                                DeviceId: deviceId
                            }
                            if ($scope.DeviceSpecs.length > 0) {
                                var counter = 0;
                                for (var m = 0; m < $scope.DeviceSpecs.length; m++) {
                                    if (deviceSpec.DeviceId == $scope.DeviceSpecs[m].DeviceId) {
                                        counter++;
                                    }
                                }
                                if (counter === 0) {
                                    $scope.DeviceSpecs.push(deviceSpec);
                                }
                            } else {
                                $scope.DeviceSpecs.push(deviceSpec);
                            }
                        }
                    }
                }
            }

            if ($scope.DeviceSpecs.length > 0) {
                for (var j = 0; j < $scope.DeviceSpecs.length; j++) {
                    var Id = $scope.DeviceSpecs[j].DeviceId;
                    var image64File = "";
                    if ($scope.DeviceSpecs[j].DeviceSpecification.ImageUrl == null) {
                        image64File = null;
                    } else {
                        RegistrationCache.getDeviceImage($scope.DeviceSpecs[j].DeviceSpecification.ImageUrl, $scope.DeviceSpecs[j].DeviceId).then(function (imageData) {
                            image64File = imageData.Base64File;
                        });
                    }
                    $scope.DeviceImages.push({
                        base64File: image64File,
                        DeviceId: Id
                    });

                }
            }

            
            
            //if ($rootScope.plan.Products[6].DevicesAndAccecories[0].Product.ProductSpecification != null) {
                //var deviceSpecification = $rootScope.plan.Products[6].DevicesAndAccecories[0].Product.ProductSpecification;
                //var deviceStockQty = $rootScope.plan.Products[6].DevicesAndAccecories[0].Product.Quantity;
                //var deviceId = $rootScope.plan.Products[6].DevicesAndAccecories[0].Product.Id;
                //var deviceSpec = {
                //    DeviceSpecification: deviceSpecification,
                //    DeviceStock: deviceStockQty,
                //    DeviceId: deviceId
                //}
                //$scope.DeviceSpecs.push(deviceSpec);
                //for (var i = 0; i < $scope.DeviceSpecs.length; i++) {
                //    var Id = $scope.DeviceSpecs[i].DeviceId;
                //    RegistrationCache.getDeviceImage($scope.DeviceSpecs[i].DeviceSpecification.ImageUrl, $scope.DeviceSpecs[i].DeviceId).then(function (imageData) {
                //        $scope.DeviceImages.push({
                //            base64File: imageData.Base64File,
                //            DeviceId: Id
                //        });
                //    });
                //}
            //}
            //todo : RICO - still hardcoded since the product configuration structure still uncertain
            //for (var i = 0; i < $rootScope.plan.Products.length; i++) {
            //    var devices = $rootScope.plan.Products[i].DevicesAndAccecories;
            //    for (var j = 0; j < devices.length; j++) {
            //        if (devices[j].Product.ProductSpecification !== null) {
            //            var deviceSpecification = devices[j].Product.ProductSpecification;
            //            var deviceStockQty = devices[j].Product.Quantity;
            //            var deviceId = devices[j].Product.Id;
            //            var deviceSpec = {
            //                DeviceSpecification: deviceSpecification,
            //                DeviceStock: deviceStockQty,
            //                DeviceId: deviceId
            //            }
            //            $scope.DeviceSpecs.push(deviceSpec);
            //        }
            //    }
            //}
        });
    }
})