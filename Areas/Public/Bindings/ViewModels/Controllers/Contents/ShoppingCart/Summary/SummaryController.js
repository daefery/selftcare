publicContent.controller('SummaryController', function ($scope, CommonEnum, SelfPublicCache, AuthUtilityCommon, RemoveShoppingCartService,
                                                            ErrorHandlerUtility, Notification) {


    $scope.OrderDate = moment().format(config.DateFormatMoment);
    $scope.custId = $scope.Summary.CustomerId;
    $scope.OrderNo = $scope.Summary.CustomerOrderCode;
    $scope.TotalTax = $scope.ShippingAndPayment.TotalTax;
    $scope.totalPayment = $scope.Cart.TotalPayment;
    $scope.sumShippingCost = $scope.Cart.ShippingCost;
    //
    var getData = false;    //confirmation
    $scope.$watch('Cart.CartList', function () {
        if ($scope.Cart.CartList != undefined && getData == false) { //after GetShoppingCartService done
            $scope.Cart.GroupBy();
            $scope.Summary.OrderedDeviceSummary = angular.copy($scope.Cart.OrderedDeviceSummary);
            $scope.Summary.OrderedPlanSummary = angular.copy($scope.Cart.OrderedPlanSummary);
            $scope.Summary.OrderedOtherProductSummary = angular.copy($scope.Cart.OrderedOtherProductSummary);

            getData = true;

            var obj = JSON.parse(localStorage.ShoppingCartSession);
            var dat = { id: obj.SessionId }
            RemoveShoppingCartService.remove(dat, function (resp) {
                if (ErrorHandlerUtility.IsResultTypeOK(resp)) {
                    AuthUtilityCommon.ClearSession("ShoppingCartSession");
                    $scope.Cart.CartList = [];
                }
            });
        }
    })

    if (($scope.CustomerInfo.MiddleName !== null) && (typeof $scope.CustomerInfo.MiddleName !== "undefined")) {
        $scope.custName = ($scope.CustomerInfo.FirstName + " " + $scope.CustomerInfo.MiddleName + " " + $scope.CustomerInfo.LastName).toUpperCase();
    } else {
        $scope.custName = ($scope.CustomerInfo.FirstName + " " + $scope.CustomerInfo.LastName).toUpperCase();
    };
    $scope.serviceType = CommonEnum.convertPaymentType($scope.Order.ServiceType).name;
    $scope.shippingMethod = $scope.ShippingAndPayment.deliverymethod.name;
    $scope.shippingAddress = $scope.ShippingAndPayment.shippingaddress + ", " + $scope.ShippingAndPayment.shippingcity + ", " + $scope.ShippingAndPayment.shippingstate + ", " + $scope.ShippingAndPayment.shippingcountry.name + ", " + $scope.ShippingAndPayment.shippingzipcode;
})
