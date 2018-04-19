SelfCareContent.service("SelfShoppingCartService", function ($q, $timeout, SelfCareCache, SelfShoppingCartResource) {
    return {
        getshoppingcart: function () {
            var deferred = $q.defer();
            var dataCache = SelfCareCache;
            if (dataCache.get('selfCareshoppingcart')) {
                deferred.resolve(dataCache.get('selfCareshoppingcart'));
            } else if (sessionStorage.selfCareshoppingcart != undefined && sessionStorage.selfCareshoppingcart != null) {
                var dataCart = JSON.parse(sessionStorage.selfCareshoppingcart);
                SelfCareCache.put('selfCareshoppingcart', dataCart);
                sessionStorage.selfCareshoppingcart = JSON.stringify(dataCart);//store to sessionStorage

                SelfShoppingCartResource.createsessioncart.save(dataCart, function (result) {
                    if (result.Messages.length > 0 && result.Messages[0] != 'Created') {
                        refreshCart($timeout);
                    }
                });

                deferred.resolve(dataCart);
            } else {
                SelfShoppingCartResource.getsessioncart.get(function (data) {
                    if (data.Messages.length > 0 && data.Messages[0] != 'Success') {
                        var dataCart = {
                            cart: null,
                        }
                        dataCache.put('selfCareshoppingcart', dataCart);
                        deferred.resolve(data);
                    } else {
                        dataCache.put('selfCareshoppingcart', data);
                        sessionStorage.selfCareshoppingcart = JSON.stringify(data);//store to sessionStorage
                        deferred.resolve(data);
                    }
                });
                //var data = {
                //    shoppingCart: [
                //        {
                //            MSISDN: "098766564678",
                //            Cart: [
                //                {
                //                    productId: "TU001",
                //                    type: "topup",
                //                    name: "cash card 1",
                //                    amount: 50,
                //                    unitprice: 10000
                //                },
                //                {
                //                    productId: "TU002",
                //                    type: "topup",
                //                    name: "cash card 2",
                //                    amount: 60,
                //                    unitprice: 5000
                //                },
                //                {
                //                    productId: "SRV001",
                //                    type: "service",
                //                    name: "data 4G unlimit",
                //                    amount: 5000,
                //                    unitprice: 100
                //                },
                //            ]
                //        }
                //    ]
                //}
            }
            return deferred.promise;
        },
    }
});

