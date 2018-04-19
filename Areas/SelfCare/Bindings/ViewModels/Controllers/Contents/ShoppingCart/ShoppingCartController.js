SelfCareContent.controller("SelfShoppingCartController", function ($scope, $timeout, $location, ShoppingFunction, CustomerWrapperService) {
    var promiseCart = CustomerWrapperService.ShoppingHeader();
    promiseCart.then(function (result) {
        //console.log(shopping)
        if (shopping != undefined) {
            $scope.cartExist = shopping.items != null ? shopping.items.length != 0 ? true : false : false;
            $scope.checkout = shopping;
            var number = shopping.totalPrice;
            $scope.totalPayment = number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
        }

        $scope.refreshCart = function () {
            var promise = CustomerWrapperService.ShoppingHeader();
            promise.then(function (result) {
                if (result) {
                    $timeout(function () {
                        angular.element('#cek_shoppingcart').trigger('click');
                        $scope.checkout = shopping;
                        $scope.cartExist = shopping.items != null ? shopping.items.length != 0 ? true : false : false;
                        var number = shopping.totalPrice;
                        $scope.totalPayment = number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    }, 0);
                }
            });
        }

        $scope.removeItem = function (index, msisdn) {
            var promise = ShoppingFunction.removeCartItem(index, msisdn);
            promise.then(function (result) {
                if (result) {
                    $scope.refreshCart();
                }
            });
        }

        $scope.removeAllItem = function () {
            var promise = ShoppingFunction.removeAllCartItem();
            promise.then(function (result) {
                if (result) {
                    $scope.refreshCart();
                }
            });
        }

        $scope.checkoutCart = function () {
            var promise = ShoppingFunction.validateorder();
            promise.then(function (result) {
                if (result) {
                    $location.path("SelfCare/Customer/App/Payment");
                }
            });
        }
    });
});

SelfCareContent.controller("SelfShoppingCartSummaryController", function ($scope, ErrorHandlerUtility, ShoppingFunction, CustomerWrapperService) {
    var successOrder = [];
    var failedOrder = [];
    var JSONSummary = localStorage.getItem('summaryCheckout');
    var summary = angular.copy(JSON.parse(JSONSummary).CollSelfShoppingCartCheckoutResponse)
    
    for (var i = 0; i < summary.length; i++) {
        var object = {};
        if (summary[i].ResultCode === 0 && summary[i].ResultType === 0) {
            object.Result = summary[i];
            //object.OrderDate = summary[i].OrderDate;
            object.OrderName = summary[i].ProductName;
            object.OrderNumber = summary[i].TransactionId;
            object.Device = summary[i].MSISDN;
            object.Item = {};
            object.Item.Id = summary[i].ProductId;
            object.Item.Qty = summary[i].ProductQty;
            object.Item.Price = summary[i].ProductPrice;
            object.Item.Description = summary[i].ProductName;
            successOrder.push(object);

            // Remove succesfully item from cart 
            var promise = CustomerWrapperService.ShoppingHeader();
            promise.then(function (result) {
                if (result) {
                    promise = ShoppingFunction.removeCartItem(summary[0].Index, summary[0].MSISDN);
                    promise.then(function (result) {
                        if (result) {
                            $timeout(function () {
                                angular.element('#cek_shoppingcart').trigger('click');
                                $scope.checkout = shopping;
                                $scope.cartExist = shopping.items != null ? shopping.items.length != 0 ? true : false : false;
                                var number = shopping.totalPrice;
                                $scope.totalPayment = number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            }, 0);
                        }
                    });
                }
            });
        } else {
            object.Result = summary[i];
            object.Result = summary[i];
            //object.OrderDate = summary[i].OrderDate;
            object.OrderName = summary[i].ProductName;
            object.OrderNumber = summary[i].TransactionId;
            object.Device = summary[i].MSISDN;
            object.Item = {};
            object.Item.Id = summary[i].ProductId;
            object.Item.Qty = summary[i].ProductQty;
            object.Item.Price = summary[i].ProductPrice;
            object.Item.Description = summary[i].ProductName;
            failedOrder.push(object);
        };         
    }

    $scope.successOrder = successOrder;
    $scope.failedOrder = failedOrder;
});