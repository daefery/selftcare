function refreshCart($timeout) {
    $timeout(function () {
        angular.element('#cek_shoppingcart').trigger('click');
    }, 0);
}

function groupBy(array, f) {
    var groups = {};
    array.forEach(function (o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
        return groups[group];
    })
}

SelfCareContent.service("ShoppingFunction", function ($q, $timeout, $filter, SelfShoppingCartResource, CustomerWrapperService, SelfCareCache, Notification) {
    return {
        addToCart: function (param) {
            var deferred = $q.defer();
            var dataCart = {
                cart: [],
            }
            if (shopping.items != null) {
                var count = 0;
                var temp_cart = angular.copy(shopping);
                var isProductidExist = false;
                var isPlanInCart = false;
                var isServiceInCart = false;

                var shopping_filter = $filter('filter')(temp_cart.items, { msisdn: param.msisdn });

                if (shopping_filter.length == 0) {
                    var othernumber = {
                        customerid: param.customerid,
                        msisdn: param.msisdn,
                        activesubscriberid: param.activesubscriberid,
                        device: [
                            param.item
                        ]
                    }
                    temp_cart.items.push(othernumber);
                    dataCart.cart = temp_cart.items;
                    sessionStorage.selfCareshoppingcart = JSON.stringify(dataCart);//store to sessionStorage
                    SelfShoppingCartResource.createsessioncart.save(dataCart, function (result) {
                        if (result.Messages.length > 0 && result.Messages[0] != 'Created') {
                            SelfCareCache.put('selfCareshoppingcart', dataCart);
                            refreshCart($timeout);
                            deferred.resolve(true);
                        } else {
                            SelfCareCache.remove("selfCareshoppingcart");
                            localStorage.removeItem('shoppingcart');
                            refreshCart($timeout);
                            deferred.resolve(true);
                        }
                    });
                } else {
                    angular.forEach(shopping_filter[0].device, function (dev, key_dev) {
                        if (dev.productid == param.item.productid) {
                            isProductidExist = true;
                        }
                        if (dev.type == "PLANS" && (param.item.type == "SERVICE" || param.item.type == "CASHCARD")) {
                            isPlanInCart = true;
                        }
                        if ((dev.type == "SERVICE" || dev.type == "CASHCARD") && param.item.type == "PLANS") {
                            isServiceInCart = true;
                        }

                    });
                    if (!isProductidExist) {
                        if (!isPlanInCart) {
                            if (!isServiceInCart) {
                                shopping_filter[0].device.push(param.item);
                                angular.forEach(temp_cart.items, function (value, key) {
                                    if (value.msisdn == shopping_filter[0].msisdn) {
                                        temp_cart.items[count] = shopping_filter[0];
                                    }
                                    count++;
                                });
                                dataCart.cart = temp_cart.items;
                                sessionStorage.selfCareshoppingcart = JSON.stringify(dataCart);//store to sessionStorage
                                SelfShoppingCartResource.createsessioncart.save(dataCart, function (result) {
                                    if (result.Messages.length > 0 && result.Messages[0] != 'Created') {
                                        SelfCareCache.put('selfCareshoppingcart', dataCart);
                                        refreshCart($timeout);
                                        deferred.resolve(true);
                                    } else {
                                        SelfCareCache.remove("selfCareshoppingcart");
                                        localStorage.removeItem('shoppingcart');
                                        refreshCart($timeout);
                                        deferred.resolve(true);
                                    }
                                });
                            }
                            else {
                                Notification.error({
                                    message: '<strong>There is another selected service in your card, please remove it before change plan !</strong>',
                                    positionY: 'top',
                                    positionX: 'center'
                                });
                                deferred.resolve(true);
                            }
                        } else {
                            Notification.error({
                                message: '<strong>There is another selected plan in your card, please remove it before buy more service !</strong>',
                                positionY: 'top',
                                positionX: 'center'
                            });
                            deferred.resolve(true);
                        }                       
                    } else {
                        Notification.error({
                            message: '<strong>Product selected already in your cart!</strong>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                        deferred.resolve(true);
                    }
                }
            } else {
                var temp_EmptyCart = {
                    customerid:param.customerid,
                    msisdn: param.msisdn,
                    activesubscriberid : param.activesubscriberid,
                    device: [
                        param.item
                    ],
                }
                dataCart.cart.push(temp_EmptyCart);
                sessionStorage.selfCareshoppingcart = JSON.stringify(dataCart);//store to sessionStorage
                SelfShoppingCartResource.createsessioncart.save(dataCart, function (result) {
                    if (result.Messages.length > 0 && result.Messages[0] != 'Created') {
                        SelfCareCache.put('selfCareshoppingcart', dataCart);
                        refreshCart($timeout);
                        deferred.resolve(true);
                    } else {
                        SelfCareCache.remove("selfCareshoppingcart");
                        localStorage.removeItem('shoppingcart');
                        refreshCart($timeout);
                        deferred.resolve(true);
                    }
                });
            }
            return deferred.promise;
        },
        removeCartItem: function (index, msisdn) {
            var temp_cart = angular.copy(shopping);
            var deferred = $q.defer();
            var dataCart = {
                cart: [],
            }
            var shopping_filter = $filter('filter')(temp_cart.items, { msisdn: msisdn });
            var count = 0;
            if (shopping_filter[0].device.length == 1) {
                angular.forEach(temp_cart.items, function (value, key) {
                    if (value.msisdn == shopping_filter[0].msisdn) {
                        temp_cart.items.splice(count, 1);
                    }
                    count++;
                });

                dataCart.cart = temp_cart.items;
                sessionStorage.selfCareshoppingcart = JSON.stringify(dataCart);//store to sessionStorage
                SelfShoppingCartResource.createsessioncart.save(dataCart, function (result) {
                    if (result.Messages.length > 0 && result.Messages[0] != 'Created') {
                        SelfCareCache.put('selfCareshoppingcart', dataCart);
                        refreshCart($timeout);
                        deferred.resolve(true);
                    } else {
                        SelfCareCache.remove("selfCareshoppingcart");
                        localStorage.removeItem('shoppingcart');
                        refreshCart($timeout);
                        deferred.resolve(true);
                    }
                });
            } else {
                shopping_filter[0].device.splice(index, 1);
                angular.forEach(temp_cart.items, function (value, key) {
                    if (value.msisdn == shopping_filter[0].msisdn) {
                        temp_cart.items[count].device = shopping_filter[0].device;
                    }
                    count++;
                });

                dataCart.cart = temp_cart.items;
                sessionStorage.selfCareshoppingcart = JSON.stringify(dataCart);//store to sessionStorage
                SelfShoppingCartResource.createsessioncart.save(dataCart, function (result) {
                    if (result.Messages.length > 0 && result.Messages[0] != 'Created') {
                        SelfCareCache.put('selfCareshoppingcart', dataCart);
                        refreshCart($timeout);
                        deferred.resolve(true);
                    } else {
                        SelfCareCache.remove("selfCareshoppingcart");
                        localStorage.removeItem('shoppingcart');
                        deferred.resolve(true);
                    }
                });
            }
            return deferred.promise;
        },
        removeAllCartItem: function () {
            var deferred = $q.defer();
            var dataCart = {
                cart: [],
            }
            sessionStorage.selfCareshoppingcart = JSON.stringify(dataCart);//store to sessionStorage
            SelfShoppingCartResource.removesessioncart.removeSession(function (result) {
                SelfCareCache.remove("selfCareshoppingcart");
                localStorage.removeItem('shoppingcart');
                deferred.resolve(true);
            });
            return deferred.promise;
        },
        adjustBalance: function (param) {
            var deferred = $q.defer();
            deferred.resolve(true);
            return deferred.promise;
        },
        addFeature: function (param) {
            return param;
        },

        // For checkout shopping cart
        checkout: function () {
            var deferred = $q.defer();
            var dataCart = {
                cart: [],
            }
            dataCart.cart = shopping.items;

            var cart = angular.copy(dataCart);

            SelfShoppingCartResource.checkoutcart.save(cart, function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        },

        validateorder: function () {
            var deferred = $q.defer();
            var dataCart = {
                cart: [],
            }
            dataCart.cart = shopping.items;

            var cart = angular.copy(dataCart);

            SelfShoppingCartResource.validateorder.save(cart, function (result) {
                deferred.resolve(true);
            });
            return deferred.promise;
        },

        createorder: function (param) {
            var deferred = $q.defer();
            var dataCart = {
                cart: [],
            }

            //if (param == null) {
            //    dataCart.cart = shopping.items;
            //} else {
                dataCart.cart = param
            //}

            var cart = angular.copy(dataCart);

            SelfShoppingCartResource.createorder.save(cart, function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        },

        getOrder: function(param) {
            var deferred = $q.defer();
            //console.log(param);
            SelfShoppingCartResource.getorderitem.get(param, function (result) {
                //Grouping by sub order identifier
                var dataDummy = { "OrderedItems": [] }
                var grouping = groupBy(result.OrderedItems, function (orderitem) {
                    return [orderitem.SubOrderIdentificator];
                });

                dataDummy.OrderedItems = grouping
                //console.log(dataDummy);
                deferred.resolve(dataDummy);
            });
            return deferred.promise;
        },



        // For pay with balance
        payWithBalance: function (param) {
            var deferred = $q.defer();
            var dataCart = {
                cart: [],
            }

            var temp_EmptyCart = {
                customerid: param.customerid,
                msisdn: param.msisdn,
                device: [
                    param.item
                ],
            }
            dataCart.cart.push(temp_EmptyCart);
            var cart = angular.copy(dataCart);
           
            SelfShoppingCartResource.checkoutcart.save(cart, function (result) {
                deferred.resolve(true);
            });
            return deferred.promise;
        }
    }
});