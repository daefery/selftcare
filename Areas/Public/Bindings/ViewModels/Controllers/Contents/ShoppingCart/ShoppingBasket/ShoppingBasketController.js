publicContent.controller("ShoppingBasketController", function ($scope, UpdateShoppingCartService, CreateShoppingCartService,
                                                                    ErrorHandlerUtility, Notification) {

    $scope.SaveToRedis = function () {
        var obj = JSON.parse(localStorage.ShoppingCartSession);

        var dat = {
            SessionId: obj.SessionId,
            CreationDate: obj.CreationDate,
            CustomerCart: $scope.Cart.CartList
        };
        CreateShoppingCartService.save(dat, function (result) {
            if (ErrorHandlerUtility.IsResultTypeOK(result)) {
            } else {
                var msg = result.Message[0];
                Notification.error({
                    message: '<p>' + msg + '</p>',
                    positionY: 'top',
                    positionX: 'center',
                    title: "<span ><h4 style='color: white;'>Failed Update Cart to Server!</h4></span>"
                });
            }
        });
    }
    $scope.cartItemCount = $scope.Cart.CartList.length;
    $scope.Cart.EditItem = {};
    $scope.editCartItem = function (item) {
        var index = $scope.Cart.CartList.indexOf(item);
        $scope.Cart.EditItem = $scope.Cart.CartList[index];
        $scope.ChangeCRPage('ordering');
    }

    $scope.SelectedParentItem = undefined;

    $scope.SetDefaultParent = function () {
        if ($scope.Cart.CartList.length == 1) { //if only one
            $scope.Cart.CartList[0].isParent = true;
            $scope.SelectedParentItem = angular.copy($scope.Cart.CartList[0]);
        }
    }

    for (var i = 0; i < $scope.Cart.CartList.length; i++) {
        if ($scope.Cart.CartList[i].isParent == true) {
            $scope.SelectedParentItem = $scope.Cart.CartList[i];
        }
    }

    $scope.removeCartItem = function (item) {

        var index = $scope.Cart.CartList.indexOf(item);
        $scope.Cart.CartList.splice(index, 1);

        $scope.SelectedParentItem = undefined;
        $scope.SaveToRedis();
    }

    $scope.selectParentItem = function (item) {
        var index = $scope.Cart.CartList.indexOf(item);
        for (var i = 0; i < $scope.Cart.CartList.length; i++) {
            if (i == index) {
                $scope.Cart.CartList[i].isParent = true;
            } else {
                $scope.Cart.CartList[i].isParent = false;
            }
        }
        $scope.SelectedParentItem = item;
        $scope.SaveToRedis();
    }

    $scope.NextButtonHide = function () {
        var hide = true;
        if ($scope.Cart.CartList.length <= 0) {
            hide = true;
        } else {
            if ($scope.SelectedParentItem != undefined)
                hide = false;
            else
                hide = true;
        }
        return hide;
    }
    var tempShoppingCost = 0.00;
    for (var j = 0; j < $scope.Cart.CartList.length; j++) {
        var item = $scope.Cart.CartList[j];
        tempShoppingCost += item.device.shippingCost;
    }
    $scope.Cart.ShippingCost = tempShoppingCost;

    $scope.NextButtonClick = function () {
        //$scope.SetDefaultParent();
        //if ($scope.NextButtonHide() == true) {
        //    var msg = 'Please set parent';
        //    Notification.error({
        //        message: '<p>' + msg + '</p>',
        //        positionY: 'top',
        //        positionX: 'center',
        //        title: "<span ><h4 style='color: white;'>Failed! " + msg + "</h4></span>"
        //    });
        //} else {
        //    $scope.ChangeCRPage('customerinfo');
        //}
        $scope.SaveToRedis();
        $scope.ChangeCRPage('customerinfo');
    }

    $scope.Cart.GroupBy();

    $(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
});