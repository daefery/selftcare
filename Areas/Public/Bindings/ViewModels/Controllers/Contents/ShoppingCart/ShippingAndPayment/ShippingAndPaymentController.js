publicContent.controller('ShippingAndPaymentController', function ($scope, $parse, $rootScope, $timeout, $location, $window,
                                                                CommonEnum, SelfPublicCache, ApiConnection,
                                                                ErrorHandlerUtility, Notification,
                                                                chargeCreditCardService, createPaypalChargeAccountService, createCreditCardProfileService,
                                                                initRegisterService, finalRegisterService) {
    $scope.countries = CommonEnum.getCountryList();
    $scope.hideTableSummary = false;
    var config = sessionStorage.webConfig != undefined ? JSON.parse(sessionStorage.webConfig) : {};
    var countrySelection;
    if (config.TemplateCode === 'etna') {
        $scope.ShippingAndPayment.shippingcountry = CommonEnum.convertCountryList($scope.countryList).name;
        countrySelection = {
            type: "label",
            name: "shipping_country",
            size: 8,
            text: "Country",
            model: "ShippingAndPayment.shippingcountry"
        }
    } else {
        countrySelection = {
            type: "select",
            name: "shipping_country",
            size: 8,
            text: "Country",
            model: "ShippingAndPayment.shippingcountry",
            value: "countries",
            required: true,
            validation: [{ value: "mandatory" }]
        }
    }

    var path = $location.path();
    var pathArray = path.split('/');
    switch (pathArray[1]) {
        case "SelfCare":
            $scope.isSelfCare = true;
            $scope.isCSR = false;
            $scope.isPublic = false;
            break;
        case "CSR":
            $scope.isSelfCare = false;
            $scope.isCSR = true;
            $scope.isPublic = false;
            break;
        case "public":
            $scope.isSelfCare = false;
            $scope.isCSR = false;
            $scope.isPublic = true;
            break;
    }


    var getDataCartList = function () {
        $scope.Cart.GroupBy();
        if ($scope.Cart.OrderedOtherProductSummary.length <= 0) {
            $scope.hideTableSummary = true;
        }
        $scope.Cart.calculateOrderedTotalPrice();

        $scope.Cart.TotalPayment = $scope.Cart.TotalPrice + $scope.Cart.ShippingCost + parseFloat($scope.ShippingAndPayment.TotalTax);
    }

    if ($scope.Cart == undefined) {
        getDataCartList();
    } else {
        var getData = false;    //cancelled
        $scope.$watch('Cart.CartList', function () {
            if ($scope.Cart.CartList != undefined && getData == false) { //after GetShoppingCartService done
                getDataCartList();
                getData = true;
            }
        })
    }

    if (($scope.CustomerInfo.MiddleName !== undefined) && ($scope.CustomerInfo.MiddleName !== null)) {
        $scope.ShippingAndPayment.contactname = $scope.CustomerInfo.FirstName + " " + $scope.CustomerInfo.MiddleName + " " + $scope.CustomerInfo.LastName;
    } else {
        $scope.ShippingAndPayment.contactname = $scope.CustomerInfo.FirstName + " " + $scope.CustomerInfo.LastName;
    }
    $scope.ShippingAndPayment.contactphone = $scope.CustomerInfo.AlternativePhoneNumber;

    var countryField;
    if ($scope.isSelfCare === true) {
        countryField = $scope.CustomerInfo.CustomerAddress.CountryId;
    } else {
        countryField = $scope.CustomerInfo.CustomerAddress.CountryId.value;
    }

    if ($scope.CustomerInfo.applyAll === true) {
        $scope.ShippingAndPayment.shippingaddress = $scope.CustomerInfo.CustomerAddress.Addresses;
        $scope.ShippingAndPayment.shippingcity = $scope.CustomerInfo.CustomerAddress.City;
        $scope.ShippingAndPayment.shippingstate = $scope.CustomerInfo.CustomerAddress.State;
        $scope.ShippingAndPayment.shippingzipcode = $scope.CustomerInfo.CustomerAddress.ZipCode;
    } else {
        $scope.ShippingAndPayment.shippingaddress = "";
        $scope.ShippingAndPayment.shippingcity = "";
        $scope.ShippingAndPayment.shippingstate = "";
        $scope.ShippingAndPayment.shippingzipcode = "";
    }
    $scope.shippingcost = $scope.Cart.ShippingCost;
    $scope.Cart.TotalPayment = $scope.Cart.TotalPrice + $scope.Cart.ShippingCost + parseFloat($scope.ShippingAndPayment.TotalTax);

    $scope.shippingaddress2 = {
        field: [
            {
                type: "select",
                name: "deliverymethod",
                size: 8,
                text: "delivery_method",
                model: "ShippingAndPayment.deliverymethod",
                value: "DeliveryMethod",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "date",
                name: "deliverydate",
                size: 8,
                text: "deliveryDate",
                model: "ShippingAndPayment.shippingdeldate",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "text",
                name: "contactname",
                size: 8,
                text: "contactName",
                model: "ShippingAndPayment.contactname",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "text",
                name: "contactphone",
                size: 8,
                text: "contactPhone",
                model: "ShippingAndPayment.contactphone",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "textarea",
                name: "shipping_address",
                size: 8,
                text: "shipping_address",
                model: "ShippingAndPayment.shippingaddress",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "text",
                name: "shippingcity",
                size: 8,
                text: "City",
                model: "ShippingAndPayment.shippingcity",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "text",
                name: "shipping_state",
                size: 8,
                text: "State",
                model: "ShippingAndPayment.shippingstate",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            countrySelection,
            {
                type: "text",
                name: "shippingzipcode",
                size: 8,
                text: "Zip_Code",
                model: "ShippingAndPayment.shippingzipcode",
                required: true,
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
    {
        type: "link",
        item: '<button type="submit" id="shippingForm_btn_submit_1" ng-click="shippingaddress2.$valid && validForm(shippingaddress2.$valid, ShippingAndPayment)" ng-show="test()"></button>',
        click: "please()"
    }
        ]

    };
    $scope.paymentmethod = {
        field: [
            {
                type: "radio",
                name: "paymentmethod",
                size: 8,
                text: "Payment_Method",
                model: "ShippingAndPayment.paymentmethod",
                required: true,
                style: "horizontal",
                content: [{ text: "Pay Now", value: "paymentmethod_A" }, { text: "Payment On Delivery", value: "paymentmethod_B" }],
                validation: [{ value: "mandatory" }]
            },
        ]
    };

    $scope.chargePayment = function () {
        return $scope.initRegister();
    };

    $scope.createPaymentRequest = function (custInfo, orderInfo, delInfo,paymentMethod) {
        var countryCode, countryName, custAddCode, custAddName, delAddCode, delAddName;
        if ($scope.isSelfCare === true) {
            countryCode = custInfo.CountryCode;
            countryName = custInfo.CountryName;
            custAddCode = custInfo.CustomerAddress.CountryCode;
            custAddName = custInfo.CustomerAddress.CountryName;

        } else {
            countryCode = custInfo.Nationality.code;
            countryName = custInfo.Nationality.name;
            if (config.TemplateCode === 'etna') {
                custAddCode = CommonEnum.convertCountryList($scope.countryList).code;
                custAddName = custInfo.CustomerAddress.CountryId;
            } else {
                custAddCode = custInfo.CustomerAddress.CountryId.code;
                custAddName = custInfo.CustomerAddress.CountryId.name;
            }
        }
        if (config.TemplateCode === 'etna') {
            delAddCode = CommonEnum.convertCountryList($scope.countryList).code;
            delAddName = delInfo.shippingcountry;
        } else {
            delAddCode = delInfo.shippingcountry.code;
            delAddName = delInfo.shippingcountry.name;
        }

        var cancelUrl = "", returnUrl = "";
        if (paymentMethod === "paypal") {
            if ($scope.isSelfCare) {
                cancelUrl = ApiConnection + "/api/payment/executechargeaccount?LandingPage=LP5";
                returnUrl = ApiConnection + "/api/payment/executechargeaccount?LandingPage=LP5";
                countryCode = custInfo.CountryCode;
                countryName = custInfo.CountryName;
                custAddCode = custInfo.CustomerAddress.CountryCode;
                custAddName = custInfo.CustomerAddress.CountryName;
            }
            if ($scope.isCSR) {
                cancelUrl = ApiConnection + "/api/payment/executechargeaccount?LandingPage=LP3";
                returnUrl = ApiConnection + "/api/payment/executechargeaccount?LandingPage=LP3";
                countryCode = custInfo.Nationality.code;
                countryName = custInfo.Nationality.name;
                custAddCode = custInfo.CustomerAddress.CountryId.code;
                custAddName = custInfo.CustomerAddress.CountryId.name;
            }
            if ($scope.isPublic) {
                cancelUrl = ApiConnection + "/api/payment/executechargeaccount?LandingPage=LP2";
                returnUrl = ApiConnection + "/api/payment/executechargeaccount?LandingPage=LP2";
                countryCode = custInfo.Nationality.code;
                countryName = custInfo.Nationality.name;
                custAddCode = custInfo.CustomerAddress.CountryId.code;
                custAddName = custInfo.CustomerAddress.CountryId.name;
            }
        }

        var itemList = [];
        for (var i = 0; i < $scope.Cart.OrderedDeviceSummary.length; i++) {
            var device = $scope.Cart.OrderedDeviceSummary;
            var Item = {
                "Description": device[i].description,
                "ItemId": device[i].id,
                "Name": device[i].names,
                "Quantity": device[i].quantity,
                "Taxable": false,
                "TaxableSpecified": false,
                "UnitPrice": device[i].unitprice.toFixed(2)
            }
            itemList.push(Item);
        }
        for (var i = 0; i < $scope.Cart.OrderedPlanSummary.length; i++) {
            var plan = $scope.Cart.OrderedPlanSummary;
            var Item = {
                "Description": plan[i].description,
                "ItemId": plan[i].id,
                "Name": plan[i].names,
                "Quantity": plan[i].quantity,
                "Taxable": false,
                "TaxableSpecified": false,
                "UnitPrice": plan[i].unitprice.toFixed(2)
            }
            itemList.push(Item);
        }
        for (var i = 0; i < $scope.Cart.OrderedOtherProductSummary.length; i++) {
            var otherProd = $scope.Cart.OrderedOtherProductSummary;
            var Item = {
                "Description": otherProd[i].description,
                "ItemId": otherProd[i].id,
                "Name": otherProd[i].names,
                "Quantity": otherProd[i].quantity,
                "Taxable": false,
                "TaxableSpecified": false,
                "UnitPrice": otherProd[i].unitprice.toFixed(2)
            }
            itemList.push(Item);
        }

        var jsonPayment = {
            "Amount": $scope.Cart.TotalPayment.toFixed(2),
            "Currency": "USD",
            "CancelUrl": cancelUrl,
            "ReturnUrl": returnUrl,
            "Item": itemList,
            "CustomerData": {
                "driversLicense": {
                    "dateOfBirth": custInfo.BirthDay,
                    "number": custInfo.DocumentNumber,
                    "state": custInfo.CustomerAddress.State
                },
                "email": custInfo.Email,
                "type": 0,
                "BirthDate": custInfo.BirthDay,
                "CountryCode": countryCode,
                "FirstName": custInfo.FirstName,
                "LastName": custInfo.LastName,
                "MiddleName": custInfo.MiddleName,
                "Phone": custInfo.MobileNumber,
                "PhoneType": "sample string 12"
            },
            "ShippingAddress": {
                "PhoneNumber": custInfo.MobileNumber,
                "City": delInfo.shippingcity,
                "Company": custInfo.company,
                "Country": delAddName,
                "CountryCode": delAddCode,
                "Fax": "sample string 8",
                "First": custInfo.FirstName,
                "Last": custInfo.LastName,
                "Phone": custInfo.MobileNumber,
                "State": delInfo.shippingstate,
                "Street": delInfo.shippingaddress,
                "Zip": delInfo.shippingzipcode,
                "PreferredAddress": true,
                "DefaultAddress": true
            },
            "BillingAddress": {
                "PhoneNumber": custInfo.MobileNumber,
                "City": custInfo.CustomerAddress.City,
                "Company": custInfo.company,
                "Country": custAddName,
                "CountryCode": custAddCode,
                "First": custInfo.FirstName,
                "Last": custInfo.LastName,
                "Phone": custInfo.MobileNumber,
                "State": custInfo.CustomerAddress.State,
                "Street": custInfo.CustomerAddress.Addresses,
                "Zip": custInfo.CustomerAddress.ZipCode,
                "PreferredAddress": true,
                "DefaultAddress": true
            },
            "ShippingCost": {
                "amount": $scope.shippingcost,
                "description": delInfo.deliverymethod.name,
                "name": "sample string 3"
            },
            "TaxCost": {
                "amount": $scope.ShippingAndPayment.TotalTax,
                "description": "sample string 2",
                "name": "sample string 3"
            },
            "CreditCard": {
                "CardNumber": delInfo.cardnumber,
                "ExpirationDate": delInfo.cardmonth + delInfo.cardyear,
                "CardCode": delInfo.csc,
                "FirstName": delInfo.cardholdername.substr(0, delInfo.cardholdername.indexOf(" ")),
                "LastName": delInfo.cardholdername.split(" ").pop(),
                "Type": delInfo.cardtype
            }
        }
        return jsonPayment;
    };

    $scope.setMethod = function (param) {
        var isbool = true;
        if (param == 'paypal') {
            isbool = true;
        } else {
            isbool = false;
        }

        $timeout(function () {
            $scope.isPayPal = isbool;
        }, 100);
    }

    $scope.chargePaypal = function () {
        if ($scope.ShippingAndPayment.CPNI) {
            var agreeCPNI = true;
        } else {
            agreeCPNI = false;
        }
        if ($scope.ShippingAndPayment.Term) {
            var agreeTerm = true;
        } else {
            agreeTerm = false;
        }
        if ((agreeCPNI === true) && (agreeTerm === true)) {

            var jsonRequest = $scope.createPaymentRequest($scope.CustomerInfo, $scope.Order, $scope.ShippingAndPayment,"paypal");
            createPaypalChargeAccountService.save(jsonRequest, function (createAccountResponse) {
                if (ErrorHandlerUtility.IsResultTypeOK(createAccountResponse)) {
                    $scope.ShippingAndPayment.PaymentType = 2; //1 : CC, 2: paypal
                    $scope.ShippingAndPayment.PaymentInfo = "Paypal";
                    localStorage.setItem('paymentResponse', JSON.stringify(createAccountResponse));
                    localStorage.setItem('paymentAmount', JSON.stringify($scope.Cart.TotalPayment));
                    localStorage.setItem('customerDataReq', JSON.stringify($scope.CustomerInfo));
                    localStorage.setItem('orderingReq', JSON.stringify($scope.Order));
                    localStorage.setItem('shippingPaymentReq', JSON.stringify($scope.ShippingAndPayment));
                    localStorage.setItem('CartItem', JSON.stringify($scope.Cart.CartList));
                    window.open(createAccountResponse.PayPalRedirectUrl, '_self');
                    //window.location.href = createAccountResponse.PayPalRedirectUrl;
                } else {
                    var msg = createAccountResponse.Messages[0];
                    Notification.error({
                        message: '<strong>' + msg + '</strong>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    return false;
                }
            });
        } else {
            Notification.error({
                message: '<p>Please check both of CPNI term and our Term and Condition.</p>',
                positionY: 'top',
                positionX: 'center'
            });
        }
    };

    $scope.createCCProfile=function(custInfo, delInfo) {
        var jsonData = {
            "Address": {
                "Email": custInfo.Email,
                "PhoneNumber": custInfo.mobilenumber,
                "City": custInfo.FiscalAddress.City,
                "Company": custInfo.company,
                "Country": custInfo.FiscalAddress.CountryId.name,
                "CountryCode": custInfo.FiscalAddress.CountryId.code,
                "First": custInfo.firstname,
                "Id": "",
                "Last": custInfo.lastname,
                "Phone": custInfo.mobilenumber,
                "State": custInfo.FiscalAddress.State,
                "Street": custInfo.FiscalAddress.Addresses,
                "Zip": custInfo.FiscalAddress.ZipCode,
                "NormalizationStatus": "",
                "AddressStatus": "",
                "PreferredAddress": true,
                "DefaultAddress": true
            },
            "CreditCard": {
                "CardNumber": delInfo.cardnumber,
                "ExpirationDate": delInfo.cardmonth + delInfo.cardyear,
                "CardCode": delInfo.csc,
                "FirstName": delInfo.cardholdername.substr(0, delInfo.cardholdername.indexOf(" ")),
                "LastName": delInfo.cardholdername.split(" ").pop(),
                "Type": delInfo.cardtype
            },
            "Description": "sample string 1"
        }
        createCreditCardProfileService.save(jsonData, function(response) {
            if (ErrorHandlerUtility.IsResultTypeOK(response)) {
                $scope.ChangeCRPage('summary');
            } else {
                var msg = response.Messages[0];
                Notification.error({
                    message: '<p>Create CC Profile Failed! ' + msg + '.</p>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
        });
    }




    $scope.initRegister = function () {
        var initRegisterData = $scope.createInitRegisterRequest($scope.CustomerInfo, $scope.ShippingAndPayment, $scope.Cart, "CC");

        var agreeCPNI = false;
        var agreeTerm = false;
        if ($scope.ShippingAndPayment.CPNI) { agreeCPNI = true; }
        if ($scope.ShippingAndPayment.Term) { agreeTerm = true; }

        if ((agreeCPNI === true) && (agreeTerm === true)) {
            //LP2: ShoppingCart, LP3: CSRRegistration, LP5: BuyMoreDevice-Selfcare
            var curLandingPage = 'LP3';
            initRegisterService.save({ LandingPage: curLandingPage }, initRegisterData, function (initRegisterResponse) {
                if (ErrorHandlerUtility.IsResultTypeOK(initRegisterResponse)) {
                    var curOrderNumber = initRegisterResponse.CustomerOrderCode;
                    var curShippingMethod = $scope.ShippingAndPayment.deliverymethod.name;
                    var curRegisterOrderCode = initRegisterResponse.RegisterOrderCode;
                    finalRegisterService.save({ OrderNumber: curOrderNumber, ShippingMethod: curShippingMethod, RegisterOrderCode: curRegisterOrderCode }, initRegisterData, function (finalRegisterResponse) {
                        if (ErrorHandlerUtility.IsResultTypeOK(finalRegisterResponse)) {
                            SelfPublicCache.put('initRegisterResponse', initRegisterResponse);
                            SelfPublicCache.put('finalRegisterResponse', finalRegisterResponse);
                            $scope.IsPaymentSuccess = true;
                            $scope.ShippingAndPayment.PaymentType = 1;
                            $scope.ShippingAndPayment.PaymentInfo = "CreditCard";
                            $scope.ChangeCRPage('finalreg_summary');
                        }
                        else {
                            var msg = finalRegisterResponse.Messages[0];
                            Notification.error({
                                message: '<p>FinalRegister Failed! ' + msg + '.</p>',
                                positionY: 'top',
                                positionX: 'center'
                            });
                        }
                    });
                }
                else {
                    var msg = initRegisterResponse.Messages[0];
                    Notification.error({
                        message: '<p>InitRegister Failed! ' + msg + '.</p>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                }
            });
        }
        else {
            Notification.error({
                message: '<p>Please check both of CPNI term and our Term and Condition.</p>',
                positionY: 'top',
                positionX: 'center'
            });
        }
    };

    $scope.createInitRegisterRequest = function (custInfo, delInfo, cartInfo, paymentMethod) {
        //custCountry : FiscalAddress.CountrId, CustomerAress.CountryId
        //nationality : CustomerData.Nationality
        //delAddValue : DeliveryAddress.CountryId
        //
        //delAddCode : ShippingAddress.CountryCode
        //delAddName : ShippingAddress.Country
        //
        var index;
        var registeredItem = [];
        var custId, gender, custCountry, nationality, docType, delAddCode, delAddName, delAddValue;


        if ($scope.isSelfCare === true) {
            custId = $scope.activeCustomerId; //JSON.parse(localStorage.getItem('self_scope')).customerInfo.CustomerID;
            gender = custInfo.GendersValue;
            custCountry = custInfo.CustomerAddress.CountryNameId;
            nationality = custInfo.CountryValue;
            docType = custInfo.DocumentTypeValue;
        }
        else {
            custId = "";
            gender = custInfo.Genders.value;
            if (config.TemplateCode === 'etna') {
                custCountry = $scope.countryList;
            }
            else {
                custCountry = custInfo.CustomerAddress.CountryId.value;
            }
            nationality = custInfo.Nationality.value;
            docType = custInfo.DocumentType.value;
        }




        if (config.TemplateCode === 'etna') {
            delAddCode = CommonEnum.convertCountryList($scope.countryList).code;
            delAddName = delInfo.shippingcountry;
            delAddValue = $scope.countryList;
        } else {
            delAddCode = delInfo.shippingcountry.code;
            delAddName = delInfo.shippingcountry.name;
            delAddValue = delInfo.shippingcountry.value;
        }





        for (index = 0; index < cartInfo.CartList.length; index++) {
            var singleSubs = [];
            var esn = "";
            var imei = "";
            var byodInfo = {};
            //
            if (cartInfo.CartList[index].isByod) {
                if (cartInfo.CartList[index].ByodInfo.DeviceSerialNumber.length < 15) {
                    esn = cartInfo.CartList[index].ByodInfo.DeviceSerialNumber;
                } else {
                    imei = cartInfo.CartList[index].ByodInfo.DeviceSerialNumber;
                }
                byodInfo = {
                    "Carrier": cartInfo.CartList[index].ByodInfo.Carrier.value,
                    "Sim": imei,
                    "Esn": esn
                };
            }
            //
            //
            //
            var mainPlan = {
                "productId": cartInfo.CartList[index].plans.id,
                "productPurchaseOptionId": cartInfo.CartList[index].plans.purchaseOptionId,
                "IsPortIn": cartInfo.CartList[index].isPortIn,
                "IsByod": cartInfo.CartList[index].isByod,
                "PortInRequest": cartInfo.CartList[index].PortInRequest,
                "ByodInfo": byodInfo
            }
            singleSubs.push(mainPlan);
            //
            if (cartInfo.CartList[index].plans.mandatoryFeatures.length > 0) {
                for (y = 0; y < cartInfo.CartList[index].plans.mandatoryFeatures.length; y++) {
                    if (cartInfo.CartList[index].plans.mandatoryFeatures[y].parentFeature.id != undefined) {
                        var mandatoryFeat =
                        {
                            "productId": cartInfo.CartList[index].plans.mandatoryFeatures[y].parentFeature.id,
                            "productPurchaseOptionId": cartInfo.CartList[index].plans.mandatoryFeatures[y].parentFeature.purchaseOptionId,
                            "IsPortIn": cartInfo.CartList[index].isPortIn,
                            "IsByod": cartInfo.CartList[index].isByod,
                            "PortInRequest": cartInfo.CartList[index].PortInRequest,
                            "ByodInfo": byodInfo
                        }
                        singleSubs.push(mandatoryFeat);
                    }
                    for (c = 0; c < cartInfo.CartList[index].plans.mandatoryFeatures[y].childFeatures.length; c++) {
                        if (cartInfo.CartList[index].plans.mandatoryFeatures[y].childFeatures[c].id != undefined) {
                            var mandatoryFeat =
                            {
                                "productId": cartInfo.CartList[index].plans.mandatoryFeatures[y].childFeatures[c].id,
                                "productPurchaseOptionId": cartInfo.CartList[index].plans.mandatoryFeatures[y].childFeatures[c].purchaseOptionId,
                                "IsPortIn": cartInfo.CartList[index].isPortIn,
                                "IsByod": cartInfo.CartList[index].isByod,
                                "PortInRequest": cartInfo.CartList[index].PortInRequest,
                                "ByodInfo": byodInfo
                            }
                            singleSubs.push(mandatoryFeat);
                        }
                    }
                }
            }
            //
            if (cartInfo.CartList[index].plans.optFeatures.length > 0) {
                for (z = 0; z < cartInfo.CartList[index].plans.optFeatures.length; z++) {
                    if (cartInfo.CartList[index].plans.optFeatures[z].id != undefined) {
                        var optFeat =
                        {
                            "productId": cartInfo.CartList[index].plans.optFeatures[z].id,
                            "productPurchaseOptionId": cartInfo.CartList[index].plans.optFeatures[z].purchaseOptionId,
                            "IsPortIn": cartInfo.CartList[index].isPortIn,
                            "IsByod": cartInfo.CartList[index].isByod,
                            "PortInRequest": cartInfo.CartList[index].PortInRequest,
                            "ByodInfo": byodInfo
                        }
                        singleSubs.push(optFeat);
                    }
                }
            }
            // bucket goes here
            if (cartInfo.CartList[index].otherProd.length > 0) {
                for (k = 0; k < cartInfo.CartList[index].otherProd.length; k++) {
                    if (cartInfo.CartList[index].otherProd[k].id != undefined) {
                        var otherProduct =
                        {
                            "productId": cartInfo.CartList[index].otherProd[k].id,
                            "productPurchaseOptionId": cartInfo.CartList[index].otherProd[k].purchaseOptionId,
                            "IsPortIn": cartInfo.CartList[index].isPortIn,
                            "IsByod": cartInfo.CartList[index].isByod,
                            "PortInRequest": cartInfo.CartList[index].PortInRequest,
                            "ByodInfo": byodInfo
                        }
                        singleSubs.push(otherProduct);
                    }
                }
            }
            //
            if (cartInfo.CartList[index].device !== undefined) {
                var device =
                {
                    "productId": cartInfo.CartList[index].device.id,
                    "productPurchaseOptionId": cartInfo.CartList[index].device.PurchaseOptionId,
                    "IsPortIn": cartInfo.CartList[index].isPortIn,
                    "IsByod": cartInfo.CartList[index].isByod,
                    "PortInRequest": cartInfo.CartList[index].PortInRequest,
                    "ByodInfo": byodInfo
                }
                singleSubs.push(device);
            }
            //
            // Allowance Card
            if (cartInfo.CartList[index].AllowanceCashCard.length > 0) {
                for (k = 0; k < cartInfo.CartList[index].AllowanceCashCard.length; k++) {
                    if (cartInfo.CartList[index].AllowanceCashCard[k].id != undefined) {
                        var allowanceCard =
                        {
                            "productId": cartInfo.CartList[index].AllowanceCashCard[k].id,
                            "productPurchaseOptionId": cartInfo.CartList[index].AllowanceCashCard[k].purchaseOptionId,
                            "IsPortIn": cartInfo.CartList[index].isPortIn,
                            "IsByod": cartInfo.CartList[index].isByod,
                            "PortInRequest": cartInfo.CartList[index].PortInRequest,
                            "ByodInfo": byodInfo
                        }
                        singleSubs.push(allowanceCard);
                    }
                }
            }
            //
            // Cash Card
            if (cartInfo.CartList[index].cashCards.length > 0) {
                for (k = 0; k < cartInfo.CartList[index].cashCards.length; k++) {
                    if (cartInfo.CartList[index].cashCards[k].id != undefined) {
                        var cashCards =
                        {
                            "productId": cartInfo.CartList[index].cashCards[k].id,
                            "productPurchaseOptionId": cartInfo.CartList[index].cashCards[k].purchaseOptionId,
                            "IsPortIn": cartInfo.CartList[index].isPortIn,
                            "IsByod": cartInfo.CartList[index].isByod,
                            "PortInRequest": cartInfo.CartList[index].PortInRequest,
                            "ByodInfo": byodInfo
                        }
                        singleSubs.push(cashCards);
                    }
                }
            }
            //
            registeredItem.push(singleSubs);

        }

        var Amount = $scope.Cart.TotalPayment.toFixed(2);

        var sc_amount = $scope.shippingcost;
        var sc_description = delInfo.deliverymethod.name;
        var sc_name = "sample string 3";

        var t_amount = $scope.ShippingAndPayment.TotalTax;
        var t_description = "sample string 2";
        var t_name = "sample string 3";

        var ccCardNumber = "";
        var ccExpirationDate = "";
        var ccCardCode = "";
        var ccFirstName = "";
        var ccLastName = "";
        var ccType = "";
        if (delInfo.cardnumber != undefined) {
            ccCardNumber = delInfo.cardnumber;
            //
            var ccXMonth = delInfo.cardmonth;
            var ccXYear = delInfo.cardyear;
            var ccXDate = new Date(ccXYear + '-' + ccXMonth + '-' + '01');
            var ccExpDate = new Date(ccXDate.getFullYear(), ccXDate.getMonth() + 1, 0);
            ccExpirationDate = moment(ccExpDate).format(config.DateFormatMoment);
            //
            ccCardCode = delInfo.csc;
            ccFirstName = delInfo.cardholdername.substr(0, delInfo.cardholdername.indexOf(" "));
            ccLastName = delInfo.cardholdername.split(" ").pop();
            ccType = delInfo.cardtype;
        }

        var jsonData = {
            "Channel": "Test",
            "CustomerId": custId,
            "CustomerData": {
                "BankInformation": {
                    "ABI": 123,
                    "AccountCode": 123,
                    "BankCode": 123,
                    "BankName": "TEST",
                    "BankNumber": 1234567890,
                    "CAB": 123,
                    "CVC": 123,
                    "City": "TEST",
                    "CountryID": 1,
                    "CreateDate": "2016-01-12T00:00:00.000+01:00",
                    "EndDate": "2017-01-12T00:00:00.000+01:00",
                    "IBAN": "A123456",
                    "Owner": "LILI",
                    "StartDate": "2016-01-01T00:00:00.000+01:00",
                    "Swift": "",
                    "ValidDate": "01/17"
                },
                "Initial": "sample string 1",
                "PendingStatus": 1,
                "Telefax": "sample string 2",
                "Email": custInfo.Email,
                "FirstName": custInfo.FirstName,
                "MiddleName": custInfo.MiddleName,
                "LastName": custInfo.LastName,
                "Genders": gender,
                "BirthDay": custInfo.BirthDay,
                "DocumentType": docType,
                "DocumentNumber": custInfo.DocumentNumber,
                "FiscalAddress": {
                    "Addresses": custInfo.CustomerAddress.Addresses,
                    "City": custInfo.CustomerAddress.City,
                    "CountryId": custCountry,
                    "State": custInfo.CustomerAddress.State,
                    "Status": 15,
                    "ZipCode": custInfo.CustomerAddress.ZipCode
                },
                "DeliveryAddress": {
                    "Addresses": delInfo.shippingaddress,
                    "City": delInfo.shippingcity,
                    "CountryId": delAddValue,
                    "State": delInfo.shippingstate,
                    "ZipCode": delInfo.shippingzipcode,
                    "Status": 15
                },
                "CustomerAddress": {
                    "Addresses": custInfo.CustomerAddress.Addresses,
                    "City": custInfo.CustomerAddress.City,
                    "CountryId": custCountry,
                    "State": custInfo.CustomerAddress.State,
                    "ZipCode": custInfo.CustomerAddress.ZipCode,
                    "Status": 15
                },
                "Nationality": nationality,
                "LandlineNumber": custInfo.LandlineNumber,
                "MobileNumber": custInfo.MobileNumber,
                "AlternativePhoneNumber": custInfo.AlternativePhoneNumber,
                "JobTitle": custInfo.JobTitle,
                "Company": custInfo.Company,
                "CoCNo": custInfo.CoCNo,
                "VATNo": custInfo.VATNo,
                "CreateDate": moment().format(config.DateFormatMoment),
                "Remark": custInfo.Remark,
                "CustomerType": 1,
                "PaymentType": 2,
                "Telephone": delInfo.contactphone
            },
            "CreditLimit": 200, //todo : still hardcode
            "Products": registeredItem,
            //

            "PaymentData": {
                "PaymentMeanCatalogID": 1020000001,
                "PaymentProfile": {
                    "CustomerPaymentMeanId": 1,
                    "AccountId": 1,
                    "CardNumber": ccCardNumber, 
                    "ExpirationDate": ccExpirationDate, 
                    "StartDate": moment().format(config.DateFormatMoment), 
                    "EndDate": null,
                    "NameOnCard": ccFirstName + ' ' + ccLastName,
                    "CCV": ccCardCode, 
                    "CreditCardType": ccType, // 1,
                    "profiletype": 3 //CC
                },
                "Amount": Amount,
                "Currency": "USD",
                "TaxAmount": t_amount,
                "ShippingCost": sc_amount
            },
            "ExternalReference": "sample string 3",
        }
        //console.log(JSON.stringify(jsonData, null, "    "));
        return jsonData;
    };
})