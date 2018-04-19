/// <reference path="../../../../../../../../Templates/CSR/Customer/CustomerRegistration/Content/Ordering/Ordering.html" />
publicContent.controller('OrderingController', function ($scope, $rootScope, $http, SelfPublicCache, RegistrationCache, DeviceValidationService,
                                                        ErrorHandlerUtility, Notification) {
    var selected = {};
    $scope.$watch("packageListJson", function(x) {
        if (x !== undefined) {
            $scope.OrderProduct = $rootScope.packageListJson;
        }
    });

    $scope.$watch("availableDevices", function(x) {
        if (x !== undefined) {
            $scope.Order.Devices = $rootScope.availableDevices;
        };
    });

    $scope.selectedRow = null;
    $scope.setClickedRow = function (x,y) {
        selected = JSON.stringify({
            "productId": x,
            "productPrice": y,
            "productQty": 1
        });
        $scope.Order.SelectedDevice = JSON.parse(selected);
        SelfPublicCache.put('selectedDevice', selected);
    };
    $scope.$watch("Order.BuyDevice", function (x) {
        if (x === 'newDevice') {
            $scope.isNewDevice = true;
            $scope.isOwnDevice = false;
            $scope.cantContinue = false;
        } else {
            $scope.isNewDevice = false;
            $scope.isOwnDevice = true;
            $scope.cantContinue = true;
        }
    });

    $scope.mvnoList = [{ name: 'mvno A' }, { name: 'mvno B' }, { name: 'mvno C' }];
    $scope.BYOD = {
        field: [
            {
                type: "select",
                name: "mvnoname",
                size: 8,
                text: "Choose_your_carrier",
                model: "Order.BYOD.Mvno",
                value: "mvnoList",
                required: false,
                validation: false
            },
            {
                type: "text",
                name: "esnOrImei",
                size: 8,
                text: "IMEI",
                model: "CustomerInfo.BYOD.IMEI",
                required: false,
                validation: false
            }
        ],
        button: [
            {
                name: "btnCheckDeviceCompatibility",
                type: "submit",
                text: "CheckCompatibility",
                click: "checkDeviceCompatibility()"
            }
        ]
    };

    $scope.checkDeviceCompatibility = function () {
        var jsonData = {
            "OrderId": moment().format('YYMMDDHHmmss'),
            "EsnMeid": $scope.CustomerInfo.BYOD.IMEI,
            "CustomerId": "13210029"
        };
        DeviceValidationService.save(jsonData, function (validityResponse) {
            console.log(validityResponse);
            if (ErrorHandlerUtility.IsResultTypeOK(validityResponse)) {
                Notification.success({
                    message: '<p>Device Validation Success, Please continue registration process with click the Next button</p>',
                    positionY: 'top',
                    positionX: 'center'
                });
                $scope.cantContinue = false;
                $scope.buyNewDevice = false;
            } else {
                Notification.error({
                    message: '<p>Device Validation Failed! ' + validityResponse.Messages[0] + '.</p>',
                    positionY: 'top',
                    positionX: 'center'
                });
                $scope.cantContinue = false; //this should be removed when the API already working properly. otherwise the next button will always be visible although the validation process failed

            }

        });
    };
    $scope.devicepaymentmethod = [{ name: 'Full Payment' }, { name: 'payment 2' }, { name: 'payment 3' }];
    $scope.TotalAmount = '$ 540';
    $scope.Product = {
        field: [
            {
                type: "select",
                name: "Product",
                size: 12,
                text: "Products",
                model: "Order.Product",
                value: "OrderProduct",
                required: false,
                validation: false
            }
        ]
    };
    $scope.devicepayment = {
        field: [
            {
                type: "select",
                name: "DevicePayment",
                size: 8,
                text: "device_payment",
                model: "Order.DevicePayment",
                value: "devicepaymentmethod",
                required: true,
                validation: [{ value: "mandatory" }]
            }
        ]
    };
    $scope.CustomerType = {
        field: [
            {
                type: "radio",
                name: "CustomerType",
                size: 8,
                text: "customer_type",
                model: "Order.CustomerType",
                required: true,
                style: "horizontal",
                content: [{ text: "Private", value: 1 }, { text: "Business", value: 2 }],
                validation: [{ value: "mandatory" }]
            }
        ]
    };
    $scope.ServiceType = {
        field: [
            {
                type: "radio",
                name: "ServiceType",
                size: 8,
                text: "service_type",
                model: "Order.ServiceType",
                required: true,
                style: "horizontal",
                content: [{ text: "Pre-paid", value: 2 }, { text: "Post paid", value: 1 },{text:"Hybrid",value:3}],
                validation: [{ value: "mandatory" }]
            }
        ]
    };
    $scope.BuyDevice = {
        field: [
            {
                type: "radio",
                name: "BuyDevice",
                size: 8,
                text: "buy_device",
                model: "Order.BuyDevice",
                required: true,
                style: "horizontal",
                content: [{ text: "Yes", value: "newDevice" }, { text: "No", value: "oldDevice" }],
                //validation: [{ value: "mandatory" }]
            },
        ]
    };
    $scope.ProductInfo = [
    {
        service: 'Voice',
        priority: '1',
        creditlimit: '100 minutes',
        price: '0.5'
    },
    {
        service: 'Voice',
        priority: '2',
        creditlimit: '200 minutes',
        price: '0.7'
    },
    {
        service: 'Data',
        priority: '1',
        creditlimit: '10 GB',
        price: '1'
    },
    {
        service: 'Data',
        priority: '2',
        creditlimit: '5 GB',
        price: '1.3'
    },
    {
        service: 'Data',
        priority: '3',
        creditlimit: '2.5 GB',
        price: '0.7'
    },
    {
        service: 'SMS',
        priority: '1',
        creditlimit: '1000',
        price: '0'
    },
    {
        service: 'SMS',
        priority: '2',
        creditlimit: '200',
        price: '1'
    }];
    $scope.PromotionInfo = [
    {
        service: 'Voice',
        creditlimit: '100 minutes',
        price: '0.5'
    },
    {
        service: 'Data',
        creditlimit: '10 GB',
        price: '1'
    },
    {
        service: 'SMS',
        creditlimit: '200',
        price: '1'
    }];
    $scope.deviceInfo = [
    {
        color: [{ value: 'red' }, { value: 'blue' }, { value: 'black' }],
        memory: '8 GB',
        quantity: '5',
        otherdetails: 'lorem'
    }];
})
