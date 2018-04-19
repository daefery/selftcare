CSRContent.controller('OrderDetailController', function ($scope, $route, $filter, $http, $window, $location, UploadtoTestService, GetOrderbyOrderIdService, UpdateOrderStatusService, DeviceManagementUtility, CacheInventoryOrderSearch, CSRSecureSection) {

    var orderid = DeviceManagementUtility.GetEmail();
    var temp = DeviceManagementUtility.GetOrderStatus();
    $scope.orderStatus = temp.Status;
    $scope.orderCompletionDate = temp.CompletionDate;
    CacheInventoryOrderSearch.getOrderDetail().then(function (result) {
        var item = angular.copy(result);
        item.OrderDate = moment(item.OrderDate).format(config.DateFormatMoment);
        item.DeliveryDate = moment(item.DeliveryDate).format(config.DateFormatMoment);
        if (item.OrderedItems.length > 0) {
            var items = item.OrderedItems;
            var data = DeviceManagementUtility.GetUsername();
            items.forEach(function (e) {
                var query = {
                    "PhysicalProduct": {
                        "ProductId": e.ProductOfferingId
                    }
                };
                var temp = $filter('filter')(data, query);
                if (temp.length > 0) {
                    var filtered = temp[0];
                    console.log(filtered);
                    e.Product_Name = filtered.PhysicalProduct.PhysicalResourceSpecification.Name;
                    e.SKU = filtered.PhysicalProduct.PhysicalResourceSpecification.SKU;
                    e.Model_Number = filtered.PhysicalProduct.PhysicalResourceSpecification.ModelNumber;
                }
            });
        }
        $scope.orderDetail = angular.copy(item);
        $scope.orderAddress = angular.copy(result.ShippingAddress);
        $scope.oldorderAddress = angular.copy(result.ShippingAddress);
    })
});

CSRContent.controller('vieworderitempaginationController', function ($scope, ApiConnection, DeviceManagementUtility) {
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.selectedRow = null;

    $scope.getOrderCode = function (index) {
        $scope.selectedRow = index;
    }
});

CSRContent.controller('CancelOrderForm', function ($scope) {
    $scope.datas = {
        field: [
            {
                type: "textarea",
                name: "reason",
                size: 6,
                text: "Cancel_Reason",
                model: "reason",
                required: false,
                maxlength: 150,
                validation: [{ value: "textarea" }, { value: "maxlength" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                click: "cancelorder(reason)"
            },
            {
                name: "Cancel",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    };

});

CSRContent.controller('CancelOrderFormController', function ($scope, CancelOrderService, DeviceManagementUtility, Notification) {
    $scope.cancelorder = function(order)
    {
        var reason = "";
        reason = order;
        var orderid = DeviceManagementUtility.GetEmail();
        var cancelDetail = {
            OrderNumber: orderid,
            CancelReason: reason
        }
        var temp = DeviceManagementUtility.GetOrderStatus();
        if (temp != 'Pending') {
            Notification.error({
                message: '<strong>Failure!</strong> <span>Cannot cancel non-pending Order</span>',
                positionY: 'top',
                positionX: 'center'
            });
        }
        else {
            CancelOrderService.update(cancelDetail, function (result) {
                if (result.$status = 200) {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>The order has been canceled</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                }
                else {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                }
            });
        }
    }
});

CSRContent.controller('UpdateOrderForm', function ($scope) {
    $scope.datas = {
        field: [
            {
                type: "textarea",
                name: "address",
                size: 6,
                text: "Address",
                model: "orderAddress.ShipToAddress1",
                required: true,
                maxlength: 150,
                validation: [{ value: "mandatory" }, { value: "textarea" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "city",
                size: 6,
                text: "City",
                model: "orderAddress.ShipToCity",
                required: true,
                maxlength: 150,
                validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "state",
                size: 6,
                text: "State",
                model: "orderAddress.ShipToState",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "country",
                size: 6,
                text: "Country",
                model: "orderAddress.ShipToCountry",
                required: true,
                maxlength: 50,
                validation: [{ value: "maxlength" }, { value: "mandatory" }, { value: "text" }]
            },
            {
                type: "text",
                name: "zipcode",
                size: 6,
                text: "Zip_Code",
                model: "orderAddress.ShipToZip",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "text" }, { value: "maxlength" }]
            }
        ],
        button: [
            {
                name: "Submit",
                type: "submit",
                text: "Submit",
                disabled: "!isFormChanged()",
                click: "updateOrder(orderAddress)"
            },
            {
                name: "Cancel",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    };
});

CSRContent.controller('UpdateOrderFormController', function ($scope, UpdateOrderService, DeviceManagementUtility, Notification, GetOrderbyOrderIdService, verifyAddress) {

    $scope.isFormChanged = function () {
        return !angular.equals($scope.oldorderAddress, $scope.orderAddress);
    };

    $scope.updateOrder = function (updateorder) {
        var orderid = DeviceManagementUtility.GetEmail();
        var mvno = DeviceManagementUtility.GetMvno();
        GetOrderbyOrderIdService.get({ orderNumber: orderid }, function (result) {
            $scope.prevOrderDetail = result;
            $scope.prevOrderAddress = result.ShippingAddress;
            var tempShippingAddress = {
                ContactName: $scope.prevOrderAddress.ContactName,
                ContactPhone: $scope.prevOrderAddress.ContactPhone,
                ShipToAddress1: updateorder.ShipToAddress1,
                ShipToAddress2: updateorder.ShipToAddress1,
                ShipToCity: updateorder.ShipToCity,
                ShipToCountry: updateorder.ShipToCountry,
                ShipToState: updateorder.ShipToState,
                ShipToZip: updateorder.ShipToZip
            }
            var tempOrderItems = $scope.prevOrderDetail.OrderItems;
            var Comment = $scope.orderDetail.Comment;
            var ShippingMethod = $scope.orderDetail.ShippingMethod;
            //var UpdateOrderRequest = {
            //    ShippingAddress: tempShippingAddress,
            //    OrderItems: tempOrderItems,
            //    Comment: Comment,
            //    ShippingMethod: ShippingMethod,
            //    MvnoId: "0"
            //}
            var upOrderDetail = {
                OrderNumber: orderid,
                ShippingAddress: tempShippingAddress,
                OrderItems: tempOrderItems,
                Comment: Comment,
                ShippingMethod: ShippingMethod,
                MvnoId: mvno
            }
            var sureAddress = {
                "ClientNumber": "4001484326",
                "ValidationKey": "1c542527-aeed-4054-ad8f-1d41b02ccdf3",
                "PrimaryAddressLine": updateorder.ShipToAddress1,
                "SecondaryAddressLine": updateorder.ShipToAddress1,
                "City": updateorder.ShipToCity,
                "State": updateorder.ShipToState,
                "ZIPCode": updateorder.ShipToZip
            }
            var temp = DeviceManagementUtility.GetOrderStatus();
            if (temp.Status != 'Pending') {
                Notification.error({
                    message: '<strong>Failure!</strong> <span>Cannot update non-pending Order</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
            else
            {
                verifyAddress.save(sureAddress, function (shipAddressResponse) {
                    if ((shipAddressResponse.TopMatchUnique == true) && (shipAddressResponse.ReturnCode == 100)) {
                        UpdateOrderService.update(upOrderDetail, function (result) {
                            if (result.$status = 200) {
                                Notification.success({
                                    message: '<strong>Success!</strong> <span>The order has been updated</span>',
                                    positionY: 'top',
                                    positionX: 'center'
                                });
                            }
                            else {
                                Notification.error({
                                    message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                                    positionY: 'top',
                                    positionX: 'center'
                                });
                            }
                        })
                    } else {
                        Notification.error({
                            message: '<strong>Failed!</strong> <span>Address is not valid to SureAddress service</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                    }
                });
            }
        })
    }
});