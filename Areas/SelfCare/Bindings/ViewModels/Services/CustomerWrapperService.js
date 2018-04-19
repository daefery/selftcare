SelfCareContent.factory("CustomerWrapperResource", function ($resource, ApiConnection) {
    return {
        getuser: $resource(ApiConnection + '/api/accounts/userproperty/:username', {}, {}),
    }
});


SelfCareContent.service("CustomerWrapperService", function ($q, CustomerWrapperResource, ErrorHandlerUtility, CustomerInfo, SelfShoppingCartService, CommonEnum,
    MultiSubsModelBuilder, MultiSubscriptionsCacheService) {
    return {
        ShoppingHeader: function () {
            var deferred = $q.defer();
                SelfShoppingCartService.getshoppingcart().then(function (result) {
                    if (result != null) {
                        var isCartShow = true;
                        if (result.cart != null) {
                            var i = 0;
                            var price = 0;
                            angular.forEach(result.cart, function (value, key) {
                                i = i + value.device.length;
                                angular.forEach(value.device, function (valueitem, keyitem) {
                                    price = price + parseFloat(valueitem.unitprice);
                                });
                            });
                            if (window.location.pathname === '/SelfCare/Customer/App/BuyMore/Device') {
                                isCartShow = false
                            }
                            localStorage.shoppingcart = JSON.stringify({
                                items: result.cart,
                                count: i,
                                totalPrice: price,
                                isCartShow: isCartShow
                            });
                        } else {
                            isCartShow = false
                            localStorage.shoppingcart = JSON.stringify({
                                items: null,
                                count: 0,
                                totalPrice: 0,
                                isCartShow: isCartShow
                            });
                        }
                    }
                    shopping = localStorage.shoppingcart != undefined ? JSON.parse(localStorage.shoppingcart) : {};
                    deferred.resolve(true);
                });
                shopping = localStorage.shoppingcart != undefined ? JSON.parse(localStorage.shoppingcart) : {};
                return deferred.promise;
        },
        HeaderWrapper: function () {
            CheckingLoginStateGlobal();
            var deferred = $q.defer();
            if (localStorage.AuthData != undefined) {
                var obj = JSON.parse(localStorage.AuthData);
                if (localStorage.self_scope == undefined) {
                    CustomerWrapperResource.getuser.get({ username: obj.email }, function (resource) {
                        if (ErrorHandlerUtility.IsResultTypeOK(resource)) {
                            MultiSubscriptionsCacheService.getSubscriptionsList(resource.UserProperty.CustomerID).then(function (result) {
                                MultiSubsModelBuilder.getConverterResult(result, resource);
                                wrapper = localStorage.self_scope != undefined ? JSON.parse(localStorage.self_scope) : {};
                                deferred.resolve(true);
                            });
                        } else {
                            Notification.error({
                                message: '<strong>' + resource.Messages[0] + '</strong>',
                                positionY: 'top',
                                positionX: 'center'
                            });
                            deferred.resolve(true);
                        }
                    });
                } else {
                    wrapper = localStorage.self_scope != undefined ? JSON.parse(localStorage.self_scope) : {};
                    deferred.resolve(true);
                }
            }
            return deferred.promise;
        }
    }
});