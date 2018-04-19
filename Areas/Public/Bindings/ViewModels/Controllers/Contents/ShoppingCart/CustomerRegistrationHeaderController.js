publicContent.controller('CustomerRegistrationHeaderController', function ($scope, $rootScope, $http, CommonEnum, SelfPublicCache, $location, $timeout,
                                                                            createNewCustomer, CreateCustomerOrderService, getSureTaxAmountService, portabilityRequestService, registerNewCustomer,
                                                                            addressRecord, verifyAddress, getzipwithindistance,AddressValidatorService,
                                                                            ErrorHandlerUtility, Notification, CreateShoppingCartService,
                                                                            ShoppingCartService, ApiConnection) {
    var config = sessionStorage.webConfig != undefined ? JSON.parse(sessionStorage.webConfig) : {};
    $scope.Devices = {};
    $scope.NumberSelection = {};
    $scope.OrderSummary = {};
    $scope.Summary = {};
    $scope.TotalPaymentOrder = {};
    $scope.jsonCustomerData = {};
    //$scope.totalTax = {};
    $scope.IsPaymentSuccess = false;
    $scope.portInRequest = false;
    $scope.buyNewDevice = true;
    $scope.TaxResponse = {};

    $scope.stepType = '';
    $scope.PaymentResponse = {};
    $scope.isValidCustAddress = true;
    $scope.isValidFisAddress = true;
    $scope.isValidDelAddress = true;
    $scope.isErrorCustAddress = false;
    $scope.isErrorFisAddress = false;
    $scope.isErrorDelAddress = false;
    var etnaMvnoConfig;

    $scope.dataCustInfo = $scope.CustomerInfo;
    $scope.countryList = {};

    var path = $location.path();
    var pathArray = path.split('/');
    switch (pathArray[1]) {
        case "SelfCare":
            $scope.isSelfCare = true;
            $scope.isCSR = false;
            $scope.isPublic = false;
            $scope.finishPath = "SelfCare/Customer/App/Devices";
            break;
        case "CSR":
            $scope.isSelfCare = false;
            $scope.isCSR = true;
            $scope.isPublic = false;
            $scope.finishPath = "Authorization/Login";
            break;
        case "public":
            $scope.isSelfCare = false;
            $scope.isCSR = false;
            $scope.isPublic = true;
            $scope.finishPath = "public/customer/app";
            break;
    }

    $scope.custInfo = {};
    if (config.TemplateCode === 'etna') {
        etnaMvnoConfig = true;
        $scope.countryList = 840;
    } else {
        etnaMvnoConfig = false;
    }
    $scope.defaultheader = function () {
        //$scope.ordering = "first";
        $scope.summary = "last";
        $scope.numberSelectionPass = true;
        $scope.custInfoPass = true;
        $scope.shippingPaymentPass = true;
        $scope.summaryPass = true;
        $scope.isDefault = true;
        $scope.isEtna = false;
        $scope.orderingStepNumber = 1;
        $scope.numberSelectionStepNumber = 2;
        $scope.customerInfoStepNumber = 3;
        $scope.shippingPaymentStepNumber = 4;
        $scope.summaryStepNumber = 5;
    }

    $scope.etnaHeader = function () {
        //$scope.coveragecheck = "first";
        $scope.ordering = "";
        $scope.shoppingCart = "disabled";
        $scope.customerinfo = "disabled";
        $scope.shipping = "disabled";
        $scope.payment = "disabled";
        $scope.numberselection = "disabled";
        $scope.summary = "disabled last";
        //$scope.ordering = "first";
        $scope.shoppingCartPass = true;
        $scope.numberSelectionPass = true;
        $scope.custInfoPass = true;
        //$scope.shippingPaymentPass = true;
        $scope.shippingPass = true;
        $scope.paymentPass = true;
        $scope.summaryPass = true;
        $scope.isDefault = false;
        $scope.isEtna = true;
        //$scope.coverageCheckStepNumber = 1;
        $scope.orderingStepNumber = 1;
        $scope.shoppingCartStepNumber = 2;
        //$scope.numberSelectionStepNumber = 4;
        $scope.customerInfoStepNumber = 3;
        $scope.shippingStepNumber = 4;
        $scope.paymentStepNumber = 5;
        //$scope.shippingPaymentStepNumber = 5;
        $scope.summaryStepNumber = 6;

    }

    if (etnaMvnoConfig === true) {
        $scope.etnaHeader();
        $scope.DefaultCountryId = 840;
        $scope.CurrentCRPage = "/Templates/Public/ShoppingCart/Content/Ordering/Ordering.html";
        SelfPublicCache.put('mvnoConfig', "etna");
    } else {
        $scope.defaultheader();
        $scope.CurrentCRPage = "/Templates/Public/ShoppingCart/Content/Ordering/Ordering.html";
        SelfPublicCache.put('mvnoConfig', "default");
    }


    $scope.createRegisterRequest = function (custInfo, orderInfo, delInfo, cartInfo) {
        var paymentResponse;
        if ($scope.isPaypalSuccess) {
            paymentResponse = $scope.paypalResponse;
        } else {
            paymentResponse = SelfPublicCache.get('paymentResponse');
        }
        
        var index;
        var registeredItem = [];
        var custId, gender, custCountry, nationality, docType, delAddCode, delAddName,delAddValue;
        if ($scope.isSelfCare === true) {
            if ($scope.isPaypalSuccess) {
                custId = JSON.parse(localStorage.getItem('self_scope')).customerInfo.CustomerID;
            } else {
                custId = $scope.activeCustomerId;
            }
            gender = $scope.CustomerInfo.GendersValue;
            custCountry = $scope.CustomerInfo.CustomerAddress.CountryNameId;
            nationality = $scope.CustomerInfo.CountryValue;
            docType = $scope.CustomerInfo.DocumentTypeValue;
        } else {
            custId = "";
            gender = $scope.CustomerInfo.Genders.value;
            if (config.TemplateCode === 'etna') {
                custCountry = $scope.countryList;
            } else {
                custCountry = $scope.CustomerInfo.CustomerAddress.CountryId.value;
            }
            nationality = $scope.CustomerInfo.Nationality.value;
            docType = $scope.CustomerInfo.DocumentType.value;

        }
        if (config.TemplateCode === 'etna') {
            delAddCode = CommonEnum.convertCountryList($scope.countryList).code;
            delAddName = $scope.ShippingAndPayment.shippingcountry;
            delAddValue = $scope.countryList;
        } else {
            delAddCode = $scope.ShippingAndPayment.shippingcountry.code;
            delAddName = $scope.ShippingAndPayment.shippingcountry.name;
            delAddValue = $scope.ShippingAndPayment.shippingcountry.value;
        }

        for (index = 0; index < cartInfo.CartList.length; index++) {
            var singleSubs = [];
            var esn = "";
            var imei = "";
            var byodInfo = {};
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
            var mainPlan= {
                "productId": cartInfo.CartList[index].plans.id,
                "productPurchaseOptionId": cartInfo.CartList[index].plans.purchaseOptionId,
                "IsPortIn": cartInfo.CartList[index].isPortIn,
                "IsByod": cartInfo.CartList[index].isByod,
                "PortInRequest": cartInfo.CartList[index].PortInRequest,
                "ByodInfo":byodInfo
            }
            singleSubs.push(mainPlan);
            if (cartInfo.CartList[index].plans.mandatoryFeatures.length > 0) {
                for (y = 0; y < cartInfo.CartList[index].plans.mandatoryFeatures.length; y++) {
                    var mandatoryFeat= {
                        "productId": cartInfo.CartList[index].plans.mandatoryFeatures[y].id,
                        "productPurchaseOptionId": cartInfo.CartList[index].plans.mandatoryFeatures[y].purchaseOptionId,
                        "IsPortIn": cartInfo.CartList[index].isPortIn,
                        "IsByod": cartInfo.CartList[index].isByod,
                        "PortInRequest": cartInfo.CartList[index].PortInRequest,
                        "ByodInfo": byodInfo
                    }
                    singleSubs.push(mandatoryFeat);
                }
            }
            if (cartInfo.CartList[index].plans.optFeatures.length > 0) {
                for (z = 0; z < cartInfo.CartList[index].plans.optFeatures.length; z++) {
                    var optFeat = {
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
            if (cartInfo.CartList[index].otherProd.length > 0) {
                for (k = 0; k < cartInfo.CartList[index].otherProd.length; k++) {
                    var otherProduct = {
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
            if (cartInfo.CartList[index].device !== undefined) {
                var device= {
                    "productId": cartInfo.CartList[index].device.id,
                    "productPurchaseOptionId": cartInfo.CartList[index].device.PurchaseOptionId,
                    "IsPortIn": cartInfo.CartList[index].isPortIn,
                    "IsByod": cartInfo.CartList[index].isByod,
                    "PortInRequest": cartInfo.CartList[index].PortInRequest,
                    "ByodInfo": byodInfo
                }
                singleSubs.push(device);
            }
            registeredItem.push(singleSubs);
        }
        var jsonData = {
            "MarketInfo": "WEB",
            "CustomerId": custId,
            "CustomerData": {
                "BankInformation": {
                    //todo : still hardcoded
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
            "CreditLimit": 1000, //todo : still hardcode
            "Products": registeredItem,
            "ShipThrough": delInfo.deliverymethod.value,
            "PaymentData": {
                "Amount": $scope.Cart.TotalPayment,
                "Discount": 0,
                "ExternalPaymentId": paymentResponse.TransactionId,
                "PaymentInfo": delInfo.PaymentInfo,
                "PaymentMethodId": delInfo.PaymentType,
                "TaxInfo": "ETAK-TAX" + moment().format('MMDD')
            },
            "ProvisioningType": "sample string 4",
            "Email": custInfo.Email,
            "Telephone": delInfo.contactphone
        }
        return jsonData;
    }


    $scope.ShowCurrentPage = function () {
        return $scope.CurrentCRPage;
    }

    $scope.ChangeCRPage = function (data) {
        if (config.TemplateCode === 'etna') {
            $scope.etnaHeader();
        } else {
            $scope.defaultheader();
        }

        if (data !== 'summary') {
            switch (data) {
            case "ordering":
                $scope.stepType = 'ordering';
                $scope.CurrentCRPage = "/Templates/Public/ShoppingCart/Content/" + data + "/" + data + ".html";
                $scope.shoppingCart = "disabled";
                $scope.customerinfo = "disabled";
                $scope.numberselection = "disabled";
                $scope.shipping = "disabled";
                $scope.payment = "disabled";
                $scope.summary = "disabled last";
                $scope.orderingPass = false;
                break;
            case "shoppingCart":
                    $scope.stepType = 'shoppingCart';
                    $scope.CurrentCRPage = "/Templates/Public/ShoppingCart/Content/" + data + "/" + data + ".html";
                    $scope.ordering = "success";
                    $scope.shoppingCart = "";
                    $scope.customerinfo = "disabled";
                    $scope.numberselection = "disabled";
                    $scope.shipping = "disabled";
                    $scope.payment = "disabled";
                    $scope.summary = "disabled last";
                    $scope.btnordering = "success";
                    $scope.shoppingCartPass = false;
                    $scope.orderingPass = false;
                
                break;
            case "customerinfo":
                    $scope.stepType = 'customerinfo';
                    $scope.CurrentCRPage = "/Templates/Public/ShoppingCart/Content/" + data + "/" + data + ".html";
                    $scope.ordering = "success";
                    $scope.shoppingCart = "success";
                    $scope.customerinfo = "";
                    $scope.numberselection = "disabled";
                    $scope.shipping = "disabled";
                    $scope.payment = "disabled";
                    $scope.summary = "disabled last";
                    $scope.btnordering = "success";
                    $scope.custInfoPass = false;
                    $scope.shoppingCartPass = false;
                    $scope.orderingPass = false;
                
                break;
            case "shipping":
                if ($scope.Cart.ShippingCost != 0 || $scope.Cart.ShippingCost != undefined) {
                    var countryField;
                    if ($scope.isSelfCare === true) {
                        countryField = $scope.CustomerInfo.CustomerAddress.CountryId;
                    } else {
                        if (config.TemplateCode === 'etna') {
                            countryField = $scope.CustomerInfo.CustomerAddress.CountryId;
                        } else {
                            countryField = $scope.CustomerInfo.CustomerAddress.CountryId.value;
                        }
                    }
                    if (countryField === 840 || countryField === "United States") {
                        var jsonCustAddress = $scope.createSureAddressRequest($scope.CustomerInfo.CustomerAddress);
                        AddressValidatorService.IsAddressValid(jsonCustAddress).then(function(addressResponse) {
                            if (addressResponse.isValidAddress) {
                                $scope.CurrentCRPage = "/Templates/Public/ShoppingCart/Content/" + data + "/" + data + ".html";
                                $scope.ordering = "success";
                                $scope.shoppingCart = "success";
                                $scope.customerinfo = "success";
                                $scope.numberselection = "success";
                                $scope.shipping = "";
                                $scope.payment = "disabled";
                                $scope.summary = "disabled last";
                                $scope.shippingPass = false;
                                $scope.numberSelectionPass = false;
                                $scope.custInfoPass = false;
                                $scope.shoppingCartPass = false;
                                $scope.orderingPass = false;
                            } else {
                                $scope.isValidCustAddress = false;
                                $scope.CustomerAddressResponse = addressResponse.message;
                                $scope.isErrorCustAddress = true;
                            }
                        });
                    } else {
                        // at the moment, the address validation API only available for USA only
                        $scope.CurrentCRPage = "/Templates/Public/ShoppingCart/Content/" + data + "/" + data + ".html";
                        $scope.ordering = "success";
                        $scope.shoppingCart = "success";
                        $scope.customerinfo = "success";
                        $scope.numberselection = "success";
                        $scope.shipping = "";
                        $scope.payment = "disabled";
                        $scope.summary = "disabled last";
                        $scope.shippingPass = false;
                        $scope.numberSelectionPass = false;
                        $scope.custInfoPass = false;
                        $scope.shoppingCartPass = false;
                        $scope.orderingPass = false;
                    }
                } else {
                    $scope.ChangeCRPage('payment');
                }

                break;
            case "payment":
                    $scope.stepType = 'payment';
                    if ($scope.isPaypalFailed === true) {
                        $scope.CurrentCRPage = "/Templates/Public/ShoppingCart/Content/" + data + "/" + data + ".html";
                        $scope.ordering = "success";
                        $scope.shoppingCart = "success";
                        $scope.customerinfo = "success";
                        $scope.numberselection = "success";
                        $scope.shipping = "success";
                        $scope.payment = "";
                        $scope.summary = "disabled last";
                        $scope.paymentPass = false;
                        $scope.shippingPass = false;
                        $scope.numberSelectionPass = false;
                        $scope.custInfoPass = false;
                        $scope.shoppingCartPass = false;
                        $scope.orderingPass = false;
                    } else {
                        var countryField;
                        if ($scope.isSelfCare === true) {
                            countryField = $scope.ShippingAndPayment.shippingcountry;
                        } else {
                            if (config.TemplateCode === 'etna') {
                                countryField = $scope.ShippingAndPayment.shippingcountry;
                            } else {
                                countryField = $scope.ShippingAndPayment.shippingcountry.value;
                            }
                        }

                        if (countryField === 840||countryField==="United States") {
                            var shipAddress = $scope.createSureAddressRequestforShipping($scope.ShippingAndPayment);
                            AddressValidatorService.IsAddressValid(shipAddress).then(function (addressResponse) {
                                if (addressResponse.isValidAddress) {
                                    var taxRequest = $scope.createGetTaxAmountRequest(addressResponse.response, $scope.Cart.CartList);
                                    if (taxRequest.TotalRevenue == 0) {
                                        $scope.TaxResponse = 0;
                                        $scope.ShippingAndPayment.TotalTax = 0;

                                        $scope.CurrentCRPage = "/Templates/Public/ShoppingCart/Content/" + data + "/" + data + ".html";
                                        $scope.ordering = "success";
                                        $scope.shoppingCart = "success";
                                        $scope.customerinfo = "success";
                                        $scope.numberselection = "success";
                                        $scope.shipping = "success";
                                        $scope.payment = "";
                                        $scope.summary = "disabled last";
                                        $scope.paymentPass = false;
                                        $scope.shippingPass = false;
                                        $scope.numberSelectionPass = false;
                                        $scope.custInfoPass = false;
                                        $scope.shoppingCartPass = false;
                                        $scope.orderingPass = false;
                                    } else {
                                        getSureTaxAmountService.save(taxRequest, function(taxResponse) {
                                            $scope.TaxResponse = taxResponse;
                                            if (taxResponse.Successful === "Y") {
                                                $scope.ShippingAndPayment.TotalTax = taxResponse.TotalTax;

                                                $scope.CurrentCRPage = "/Templates/Public/ShoppingCart/Content/" + data + "/" + data + ".html";
                                                $scope.ordering = "success";
                                                $scope.shoppingCart = "success";
                                                $scope.customerinfo = "success";
                                                $scope.numberselection = "success";
                                                $scope.shipping = "success";
                                                $scope.payment = "";
                                                $scope.summary = "disabled last";
                                                $scope.paymentPass = false;
                                                $scope.shippingPass = false;
                                                $scope.numberSelectionPass = false;
                                                $scope.custInfoPass = false;
                                                $scope.shoppingCartPass = false;
                                                $scope.orderingPass = false;
                                            } else {
                                                var message = taxResponse.Messages[0];
                                                for (var i = 1; i < taxResponse.Messages.length; i++) {
                                                    message += '<br/>' + taxResponse.Messages[i];
                                                }
                                                Notification.error({
                                                    message: '<p>Calculate tax service failed!' + '<span>' + message + '</span>' + '</p>',
                                                    positionY: 'bottom',
                                                    positionX: 'center'
                                                });
                                            }
                                        });
                                    }
                                } else {
                                    $scope.isValidDelAddress = false;
                                    $scope.DelAddressResponse = addressResponse.message;
                                    $scope.isErrorDelAddress = true;
                                }
                            });
                        } else {
                            $scope.TaxResponse = 0;
                            $scope.ShippingAndPayment.TotalTax = 0;

                            $scope.CurrentCRPage = "/Templates/Public/ShoppingCart/Content/" + data + "/" + data + ".html";
                            $scope.ordering = "success";
                            $scope.shoppingCart = "success";
                            $scope.customerinfo = "success";
                            $scope.numberselection = "success";
                            $scope.shipping = "success";
                            $scope.payment = "";
                            $scope.summary = "disabled last";
                            $scope.paymentPass = false;
                            $scope.shippingPass = false;
                            $scope.numberSelectionPass = false;
                            $scope.custInfoPass = false;
                            $scope.shoppingCartPass = false;
                            $scope.orderingPass = false;
                        }
                    }
                    break;

            case "finalreg_summary":
                var initRegisterResponse = SelfPublicCache.get('initRegisterResponse');
                var finalRegisterResponse = SelfPublicCache.get('finalRegisterResponse');
                //
                $scope.Summary = initRegisterResponse;
                $scope.CurrentCRPage = "/Templates/Public/ShoppingCart/Content/summary/summary.html";
                $scope.ordering = "success";
                $scope.shoppingCart = "success";
                $scope.customerinfo = "success";
                $scope.shipping = "success";
                $scope.payment = "success";
                $scope.numberselection = "success";
                $scope.summary = "last";
                $scope.summaryPass = true;
                $scope.numberSelectionPass = true;
                $scope.paymentPass = true;
                $scope.shippingPass = true;
                $scope.custInfoPass = true;
                $scope.shoppingCartPass = true;
                $scope.orderingPass = true;
                break;
            }
        } else {
            var reqData = $scope.createRegisterRequest($scope.CustomerInfo, $scope.Order, $scope.ShippingAndPayment,$scope.Cart);
            registerNewCustomer.save(reqData, function (response) {
                if (ErrorHandlerUtility.IsResultTypeOK(response)) {
                    $scope.Summary = response;
                    $scope.CurrentCRPage = "/Templates/Public/ShoppingCart/Content/" + data + "/" + data + ".html";
                    $scope.ordering = "success";
                    $scope.shoppingCart = "success";
                    $scope.customerinfo = "success";
                    $scope.shipping = "success";
                    $scope.payment = "success";
                    $scope.numberselection = "success";
                    $scope.summary = "last";
                    $scope.summaryPass = true;
                    $scope.numberSelectionPass = true;
                    $scope.paymentPass = true;
                    $scope.shippingPass = true;
                    $scope.custInfoPass = true;
                    $scope.shoppingCartPass = true;
                    $scope.orderingPass = true;
                } else {
                    Notification.error({
                        message: '<p>Your payment is success and saved but register process is failed! ' + response.Messages[0] + '. Please click on Next button to retry it <br/>' +
                            'Otherwise, please contact our customer service.</p>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    $scope.IsPaymentSuccess = true;
                    if ($scope.isPaypalSuccess) {
                        $scope.ChangeCRPage('payment');
                    }
                }
            });
        }
    }

    $scope.finish = function () {
        localStorage.setItem('successBuyMoreDevice', JSON.stringify(JSON.parse(localStorage.getItem('self_scope')).activeDevice))
        localStorage.removeItem('self_scope');
        $location.path($scope.finishPath);
    }

    if (($scope.isPaypalSuccess === true)) {
        $scope.ChangeCRPage('summary');
    };

    if ($scope.isPaypalFailed === true) {
        $scope.ChangeCRPage('payment');
    }

    $scope.createGetTaxAmountRequest = function (sureAddressResponse, CartList) {
        var i;
        var lineNumber = 0;
        var totalDevice = 0;
        var totalPlan = 0;
        var totalOther = 0;
        var totalCashCards = 0;
        var totalAllowanceCashCard = 0;
        var totalItem = 0;
        var totalRev = 0;
        var itemList = [];

        for (index = 0; index < CartList.length; index++) 
        {
            var item = CartList[index];



            if (CartList[index].isByod === false)
            {
                if (!(item.device.price == undefined || parseFloat(item.device.price) == 0))
                {
                    lineNumber += 1;
                    {
                        var device = {
                            "LineNumber": lineNumber,
                            "InvoiceNumber": "ETAK" + moment().format('DDMMYYYYhhmmss'),
                            "CustomerNumber": "8585260000",
                            "OrigNumber": "8585260000",
                            "TermNumber": "8585260000",
                            "BillToNumber": "8585260000",
                            "Zipcode": sureAddressResponse.ZIPCode,
                            "Plus4": sureAddressResponse.ZIPPlus4,
                            "P2PZipcode": sureAddressResponse.ZIPCode,
                            "P2PPlus4": sureAddressResponse.ZIPPlus4,
                            "TransDate": moment().format(config.DateFormatMoment),
                            "Revenue": item.device.price == 0 ? 1 : parseFloat(item.device.price),//todo : suretax cannot handle revenue with 0 price
                            "Units": 1,
                            "taxSitusOverrideCode": "13"
                        };
                        totalRev = totalRev + item.device.price;
                        itemList.push(device);
                    }
                }
                totalDevice += 1;                
            }



            if (!(item.plans.price == undefined || parseFloat(item.plans.price) == 0))
            {
                lineNumber += 1;
                {
                    var plans = {
                        "LineNumber": lineNumber,
                        "InvoiceNumber": "ETAK" + moment().format('DDMMYYYYhhmmss'),
                        "CustomerNumber": "8585260000",
                        "OrigNumber": "8585260000",
                        "TermNumber": "8585260000",
                        "BillToNumber": "8585260000",
                        "Zipcode": sureAddressResponse.ZIPCode,
                        "Plus4": sureAddressResponse.ZIPPlus4,
                        "P2PZipcode": sureAddressResponse.ZIPCode,
                        "P2PPlus4": sureAddressResponse.ZIPPlus4,
                        "TransDate": moment().format(config.DateFormatMoment),
                        "Revenue": parseFloat(item.plans.price),
                        "Units": 1,
                        "taxSitusOverrideCode": "13"
                    };
                    itemList.push(plans);
                }
            }
            totalPlan += 1;
            


            if (Object.keys(item.plans.mandatoryFeatures).length > 0)
            {
                //lineNumber += 1;
                for (i = 0; i < Object.keys(item.plans.mandatoryFeatures).length; i++)
                {

                    if (!(item.plans.mandatoryFeatures[i].parentFeature.price == undefined || parseFloat(item.plans.mandatoryFeatures[i].parentFeature.price) == 0))
                    {
                        lineNumber += 1;
                        var plans = {
                            "LineNumber": lineNumber,
                            "InvoiceNumber": "ETAK" + moment().format('DDMMYYYYhhmmss'),
                            "CustomerNumber": "8585260000",
                            "OrigNumber": "8585260000",
                            "TermNumber": "8585260000",
                            "BillToNumber": "8585260000",
                            "Zipcode": sureAddressResponse.ZIPCode,
                            "Plus4": sureAddressResponse.ZIPPlus4,
                            "P2PZipcode": sureAddressResponse.ZIPCode,
                            "P2PPlus4": sureAddressResponse.ZIPPlus4,
                            "TransDate": moment().format(config.DateFormatMoment),
                            "Revenue": parseFloat(item.plans.mandatoryFeatures[i].parentFeature.price),
                            "Units": 1,
                            "taxSitusOverrideCode": "13"
                        };
                        //lineNumber += 1;
                        itemList.push(plans);
                    }


                    if (Object.keys(item.plans.mandatoryFeatures[i].childFeatures).length > 0) {
                        for (var j = 0; j < Object.keys(item.plans.mandatoryFeatures[i].childFeatures).length; j++)
                        {

                            if (!(item.plans.mandatoryFeatures[i].childFeatures[j].price == undefined || parseFloat(item.plans.mandatoryFeatures[i].childFeatures[j].price) == 0))
                            {
                                lineNumber += 1;
                                var subPlans = {
                                    "LineNumber": lineNumber,
                                    "InvoiceNumber": "ETAK" + moment().format('DDMMYYYYhhmmss'),
                                    "CustomerNumber": "8585260000",
                                    "OrigNumber": "8585260000",
                                    "TermNumber": "8585260000",
                                    "BillToNumber": "8585260000",
                                    "Zipcode": sureAddressResponse.ZIPCode,
                                    "Plus4": sureAddressResponse.ZIPPlus4,
                                    "P2PZipcode": sureAddressResponse.ZIPCode,
                                    "P2PPlus4": sureAddressResponse.ZIPPlus4,
                                    "TransDate": moment().format(config.DateFormatMoment),
                                    "Revenue": parseFloat(item.plans.mandatoryFeatures[i].childFeatures[j].price),
                                    "Units": 1,
                                    "taxSitusOverrideCode": "13"
                                };
                                //lineNumber += 1;
                                itemList.push(subPlans);
                            }
                        }
                    }
                }
                totalPlan += Object.keys(item.plans.mandatoryFeatures).length;
            }



            //lineNumber += 1;
            for (i = 0; i < Object.keys(item.plans.optFeatures).length; i++)
            {
                if (!(item.plans.optFeatures[i].price == undefined || parseFloat(item.plans.optFeatures[i].price) == 0))
                {
                    lineNumber += 1;
                    var plans = {
                        "LineNumber": lineNumber,
                        "InvoiceNumber": "ETAK" + moment().format('DDMMYYYYhhmmss'),
                        "CustomerNumber": "8585260000",
                        "OrigNumber": "8585260000",
                        "TermNumber": "8585260000",
                        "BillToNumber": "8585260000",
                        "Zipcode": sureAddressResponse.ZIPCode,
                        "Plus4": sureAddressResponse.ZIPPlus4,
                        "P2PZipcode": sureAddressResponse.ZIPCode,
                        "P2PPlus4": sureAddressResponse.ZIPPlus4,
                        "TransDate": moment().format(config.DateFormatMoment),
                        "Revenue": parseFloat(item.plans.optFeatures[i].price),
                        "Units": 1,
                        "taxSitusOverrideCode": "13"
                    };
                    //lineNumber += 1;
                    itemList.push(plans);
                }
            }
            totalPlan += Object.keys(item.plans.optFeatures).length;
            


            if (Object.keys(item.otherProd).length > 0)
            {
                //lineNumber += 1;
                for (i = 0; i < Object.keys(item.otherProd).length; i++)
                {

                    if (!(item.otherProd[i].price == undefined || parseFloat(item.otherProd[i].price) == 0))
                    {
                        lineNumber += 1;
                        var others = {
                            "LineNumber": lineNumber,
                            "InvoiceNumber": "ETAK" + moment().format('DDMMYYYYhhmmss'),
                            "CustomerNumber": "8585260000",
                            "OrigNumber": "8585260000",
                            "TermNumber": "8585260000",
                            "BillToNumber": "8585260000",
                            "Zipcode": sureAddressResponse.ZIPCode,
                            "Plus4": sureAddressResponse.ZIPPlus4,
                            "P2PZipcode": sureAddressResponse.ZIPCode,
                            "P2PPlus4": sureAddressResponse.ZIPPlus4,
                            "TransDate": moment().format(config.DateFormatMoment),
                            "Revenue": parseFloat(item.otherProd[i].price),
                            "Units": 1,
                            "taxSitusOverrideCode": "13"
                        };
                        //lineNumber += 1;
                        itemList.push(others);
                    }
                }
                totalOther += Object.keys(item.otherProd).length;
            }



            if (Object.keys(item.cashCards).length > 0)
            {
                //lineNumber += 1;
                for (i = 0; i < Object.keys(item.cashCards).length; i++)
                {

                    if (!(item.cashCards[i].price == undefined || parseFloat(item.cashCards[i].price) == 0))
                    {
                        lineNumber += 1;
                        var cashCard = {
                            "LineNumber": lineNumber,
                            "InvoiceNumber": "ETAK" + moment().format('DDMMYYYYhhmmss'),
                            "CustomerNumber": "8585260000",
                            "OrigNumber": "8585260000",
                            "TermNumber": "8585260000",
                            "BillToNumber": "8585260000",
                            "Zipcode": sureAddressResponse.ZIPCode,
                            "Plus4": sureAddressResponse.ZIPPlus4,
                            "P2PZipcode": sureAddressResponse.ZIPCode,
                            "P2PPlus4": sureAddressResponse.ZIPPlus4,
                            "TransDate": moment().format(config.DateFormatMoment),
                            "Revenue": parseFloat(item.cashCards[i].price),
                            "Units": 1,
                            "taxSitusOverrideCode": "13"
                        };
                        //lineNumber += 1;
                        itemList.push(cashCard);
                    }
                }
                totalCashCards += Object.keys(item.cashCards).length;
            }


            if (Object.keys(item.AllowanceCashCard).length > 0)
            {
                //lineNumber += 1;
                for (i = 0; i < Object.keys(item.AllowanceCashCard).length; i++)
                {

                    if (item.AllowanceCashCard[i].price == undefined || parseFloat(item.AllowanceCashCard[i].price) == 0)
                    {

                        lineNumber += 1;
                        var AllowanceCashCard = {
                            "LineNumber": lineNumber,
                            "InvoiceNumber": "ETAK" + moment().format('DDMMYYYYhhmmss'),
                            "CustomerNumber": "8585260000",
                            "OrigNumber": "8585260000",
                            "TermNumber": "8585260000",
                            "BillToNumber": "8585260000",
                            "Zipcode": sureAddressResponse.ZIPCode,
                            "Plus4": sureAddressResponse.ZIPPlus4,
                            "P2PZipcode": sureAddressResponse.ZIPCode,
                            "P2PPlus4": sureAddressResponse.ZIPPlus4,
                            "TransDate": moment().format(config.DateFormatMoment),
                            "Revenue": parseFloat(item.AllowanceCashCard[i].price),
                            "Units": 1,
                            "taxSitusOverrideCode": "13"
                        };
                        //lineNumber += 1;
                        itemList.push(AllowanceCashCard);
                    }

                }
                totalAllowanceCashCard += Object.keys(item.AllowanceCashCard).length;
            }

            totalItem += totalDevice + totalPlan + totalOther + totalCashCards + totalAllowanceCashCard;
        }


        var itemPrice = 0;
        for (var i = 0; i < itemList.length; i++) {
            itemPrice += parseFloat(itemList[i].Revenue);
        }
        $scope.TotalPaymentOrder = itemPrice;        
        var itemQty = 1;
        var jsonData = {
            "BusinessUnit": "000000454",
            "Datayear": moment().format('YYYY'),
            "DataMonth": moment().format('MM'),
            "TotalRevenue": itemPrice,
            "ReturnFileCode": 0,
            "ClientTracking": "000000454",
            "IndustryExemption": "",
            "ItemList": itemList
        };
        //
        //console.log(JSON.stringify(jsonData, null, "    "));
        //
        return jsonData;
    };

    $scope.createSureAddressRequest = function (address) {
        var jsonCustAddress = {
            "ClientNumber": "4001484326",
            "ValidationKey": "1c542527-aeed-4054-ad8f-1d41b02ccdf3",
            "PrimaryAddressLine": address.Addresses,
            "SecondaryAddressLine": null,
            "City": address.City,
            "State": address.State,
            "ZIPCode": address.ZipCode,
            "MatchCount": 2,
            "ResponseType": "S"
        };
        return jsonCustAddress;
    }

    $scope.createSureAddressRequestforShipping = function (address) {
        var jsonShipAddress = {
            "ClientNumber": "4001484326",
            "ValidationKey": "1c542527-aeed-4054-ad8f-1d41b02ccdf3",
            "PrimaryAddressLine": address.shippingaddress,
            "SecondaryAddressLine": null,
            "City": address.shippingcity,
            "State": address.shippingstate,
            "ZIPCode": address.shippingzipcode,
            "MatchCount": 2,
            "ResponseType": "S"
        };
        return jsonShipAddress;
    }

    $scope.validForm = function (isValid, data) {
        $scope.formValid = true;
        if (isValid) {
            $scope.ChangeCRPage($scope.stepType);
        } else {
            return false;
        }
    };

    $scope.validateForm = function (param) {
        switch (param) {
            //case "customerinfo":
            //    $scope.stepType = 'customerinfo';
            //    $timeout(function() {
            //        angular.element('#')
            //    })
            //    break;
            case "shipping":
                $scope.stepType = 'shipping';
                $timeout(function () {
                    angular.element('#custInfoForm_btn_submit_1').trigger('click');
                }, 100);
                break;
            case "payment":
                $scope.stepType = 'payment';
                $timeout(function () {
                    angular.element('#shippingForm_btn_submit_1').trigger('click');
                }, 100);
                break;

        }
    }

    $scope.createPortInRequest = function (custInfo, orderInfo, delInfo, orderResponse, portInInfo) {
        var firstname;
        var lastname;
        var businessname;
        if (orderInfo.CustomerType.value === 1) {
            firstname = custInfo.firstName;
            lastname = custInfo.lastname;
            businessname = "";
        } else {
            firstname = "";
            lastname = "";
            businessname = custInfo.company;
        }
        var jsonReqData = {
            "UniqueIdentifier": orderResponse.OrderNumber,
            "MarketInfo": "WEB",
            "ZipCode": delInfo.shippingzipcode,
            "Esn": portInInfo.ESN,
            "Sim": "",
            "RateplanItemId": "1020000703",
            "AccessoryItemId": "1020000711",
            "IccId": portInInfo.IMEI,
            "Mdn": portInInfo.phonenumber,
            "PasswordPin": "",
            "AccountNumber": "",
            "FirstName": firstname,
            "LastName": lastname,
            "BusinessName": businessname,
            "StreetName": custInfo.FiscalAddress.Addresses,
            "BillingCity": custInfo.FiscalAddress.City,
            "BillingState": custInfo.FiscalAddress.State,
            "BillingZip": custInfo.FiscalAddress.ZipCode,
            "ProvisioningType": ""
        };
        return jsonReqData;
    };


    $scope.verifyAddress = function (inputParam, addressSelector) {
        var isValidAdd;
        if ((inputParam.Score < 1.00) && (inputParam.Score !== 0)) {
            isValidAdd = false;
            if (inputParam.TopMatchUnique) {
                switch (addressSelector) {
                case "custAddress":
                    $scope.CustomerAddressResponse = $scope.CustAddressResp.PrimaryAddressLine + ", " + $scope.CustAddressResp.City + ", " + $scope.CustAddressResp.State + ", " + $scope.CustAddressResp.ZIPCode;
                    break;
                case "fisAddress":
                    $scope.FiscalAddressResponse = $scope.FisAddressResp.PrimaryAddressLine + ", " + $scope.FisAddressResp.City + ", " + $scope.FisAddressResp.State + ", " + $scope.FisAddressResp.ZIPCode;
                    break;
                case "delAddress":
                    $scope.DelAddressResponse = $scope.DelAddressResp.PrimaryAddressLine + ", " + $scope.DelAddressResp.City + ", " + $scope.DelAddressResp.State + ", " + $scope.DelAddressResp.ZIPCode;
                    break;
                }
            } else {
                var addressResponse = "Please specify your input address!!";
                switch (addressSelector) {
                    case "custAddress":
                        $scope.CustomerAddressResponse = addressResponse;
                        break;
                    case "fisAddress":
                        $scope.FiscalAddressResponse = addressResponse;
                        break;
                    case "delAddress":
                        $scope.DelAddressResponse = addressResponse;
                        break;
                }
            }
        } else if (inputParam.Score === 0) {
            isValidAdd = false;
            switch (addressSelector) {
                case "custAddress":
                    $scope.CustomerAddressResponse = "OOPS!! We could not find your address in USPS database!";
                    $scope.isErrorCustAddress = true;
                    break;
                case "fisAddress":
                    $scope.FiscalAddressResponse = "OOPS!! We could not find your address in USPS database!";
                    $scope.isErrorFisAddress = true;
                    break;
                case "delAddress":
                    $scope.DelAddressResponse = "OOPS!! We could not find your address in USPS database!";
                    $scope.isErrorDelAddress = true;
                    break;
            }
        } else {
            isValidAdd = true;
        }
        return isValidAdd;
    };
    $scope.replaceAdd = function (addressSelector) {
        if (addressSelector === "custAddress") {
            $scope.CustomerInfo.CustomerAddress.Addresses = $scope.CustAddressResp.PrimaryAddressLine;
            $scope.CustomerInfo.CustomerAddress.City = $scope.CustAddressResp.City;
            $scope.CustomerInfo.CustomerAddress.State = $scope.CustAddressResp.State;
            $scope.CustomerInfo.CustomerAddress.ZipCode = $scope.CustAddressResp.ZIPCode;
            $scope.isValidCustAddress = true;
            if ($scope.CustomerInfo.applyAll === true) {
                $scope.isValidFisAddress = true;
            };
        } else if (addressSelector === "fisAddress") {
            $scope.CustomerInfo.FiscalAddress.Addresses = $scope.FisAddressResp.PrimaryAddressLine;
            $scope.CustomerInfo.FiscalAddress.City = $scope.FisAddressResp.City;
            $scope.CustomerInfo.FiscalAddress.State = $scope.FisAddressResp.State;
            $scope.CustomerInfo.FiscalAddress.ZipCode = $scope.FisAddressResp.ZIPCode;
            $scope.isValidFisAddress = true;
            if ($scope.CustomerInfo.applyAll === true) {
                $scope.isValidCustAddress = true;
            };
        } else if (addressSelector === "delAddress") {
            $scope.ShippingAndPayment.shippingaddress = $scope.DelAddressResp.PrimaryAddressLine;
            $scope.ShippingAndPayment.shippingcity = $scope.DelAddressResp.City;
            $scope.ShippingAndPayment.shippingstate = $scope.DelAddressResp.State;
            $scope.ShippingAndPayment.shippingzipcode = $scope.DelAddressResp.ZIPCode;
            $scope.isValidDelAddress = true;
        }
    }
});