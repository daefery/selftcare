SelfCareContent.controller("BuyServiceController", function ($scope, $location, $timeout, $filter, CustomerCache, Notification, BuyMoreCacheService, BuyMoreService, ShoppingFunction, PaymentFunction, 
                                ErrorHandlerUtility) {
    $scope.Promotions = undefined;
    $scope.CashCards = undefined;
    $scope.ExistingPlan = undefined;
    $scope.isPromotion = false;
    $scope.isCashCard = false;
    $scope.dataAddToChart = undefined;
    $scope.currentPromotionId = undefined;
    $scope.currentCashCardId = undefined;
    $scope.totalPayment = 0;
        
    BuyMoreCacheService.getProduct({ msisdn: wrapper.activeDevice.Msisdn }).then(function (result) {
        var ext_isGroup = false;
        var promo_temp = [];
        var cash_card = [];
        $scope.ExistingPlan = angular.copy(result.ExistingMainPlanServices[0]);
        angular.forEach($scope.ExistingPlan.Options, function (val, key) {
            angular.forEach(val, function (v, k) {
                if (k == 'GroupId') {
                    ext_isGroup = true;
                }
            });
            if (ext_isGroup) {
                ext_isGroup = false;
            } else {
                if (val.SpecifiedProductOffering.Product.ProductType == 7) {
                    promo_temp.push(val.SpecifiedProductOffering);
                }
                if (val.SpecifiedProductOffering.Product.ProductType == 6) {
                    cash_card.push(val.SpecifiedProductOffering);
                }
                ext_isGroup = false;
            }
        });
        $scope.Promotions = promo_temp;
        if ($scope.Promotions.length <= 0) {
            $scope.Promotions = undefined;
        }
        $scope.CashCards = cash_card;
        if ($scope.CashCards.length <= 0) {
            $scope.CashCards = undefined;
        }
        
        $scope.ExistingPlan.HtmlModel = {};
        $scope.ExistingPlan.HtmlModel.Name = $scope.ExistingPlan.Names[0].Text;
        $scope.ExistingPlan.HtmlModel.Description = $scope.ExistingPlan.Descriptions[0].Text;
        for (var i = 0; i < $scope.Promotions.length; i++) {
            $scope.Promotions[i].HtmlModel = {};
            $scope.Promotions[i].HtmlModel.Name = $scope.Promotions[i].Names[0].Text;
            $scope.Promotions[i].HtmlModel.Amount = $scope.Promotions[i].PurchaseOptions[0].Charges[0].Prices[0].Amount;
        };
        for (var i = 0; i < $scope.CashCards.length; i++) {
            $scope.CashCards[i].HtmlModel = {};
            $scope.CashCards[i].HtmlModel.Name = $scope.CashCards[i].Names[0].Text;
            $scope.CashCards[i].HtmlModel.Amount = $scope.CashCards[i].PurchaseOptions[0].Charges[0].Prices[0].Amount;
        };
    });

    $scope.selectPromotion = function (param) {
        angular.forEach($scope.Promotions, function (val, key) {
            if (val.Id == param) {
                $scope.dataAddToChart = val;
                $scope.totalPayment = val.PurchaseOptions.length > 0 ? val.PurchaseOptions[0].Charges[0].Prices[0].Amount : 0;
            }
        });
        $scope.currentPromotionId = param;
        $scope.currentCashCardId = 0;
        $scope.isPromotion = true;
        $scope.isCashCard = false;
    }
    $scope.selectCashCard = function (param) {
        angular.forEach($scope.CashCards, function (val, key) {
            if (val.Id == param) {
                $scope.dataAddToChart = val.Product;
                $scope.totalPayment = val.PurchaseOptions.length > 0 ? val.PurchaseOptions[0].Charges[0].Prices[0].Amount : 0;
            }
        });
        $scope.currentPromotionId = 0;
        $scope.currentCashCardId = param;
        $scope.isPromotion = false;
        $scope.isCashCard = true;
    }

    $scope.addToCart = function (param) {
        console.log($scope.dataAddToChart);
        var items = {
            item: {
                "productid": $scope.dataAddToChart.Id,
                "type": param,
                "name": param + " - " + $scope.dataAddToChart.Names[0].Text,
                "qty": 1,
                "amount": $scope.totalPayment,
                "unitprice": $scope.totalPayment
            },
            msisdn: wrapper.activeDevice.Msisdn,
            customerid: wrapper.customerInfo.CustomerID,
            activesubscriberid: wrapper.activeDevice.Subscription.SubscriptionId
        };
        var promise = ShoppingFunction.addToCart(items);
        promise.then(function (result) {
            if (result) {
                ///some function
            }
        });
    }

    $scope.purchase = function () {
        var selectedItem = {        
            "productid": $scope.dataAddToChart.Id,
            "type": "SERVICE",
            "name": "SERVICE - " + $scope.dataAddToChart.Names[0].Text,
            "qty": 1,
            "amount": $scope.totalPayment,
            "unitprice": $scope.totalPayment
        }

        var items = {
            customerid: wrapper.customerInfo.CustomerID,
            msisdn: wrapper.activeDevice.Msisdn,
            device: [
                selectedItem
            ]
        };

        var paymentMean = {};
        var customerPaymentMeant = {};

        var promise = PaymentFunction.getPaymentMeansCatalog(900000);
        promise.then(function (result) {
            if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                paymentMean = angular.copy(result);
                promise = PaymentFunction.getCustomerPaymentMean(wrapper.customerInfo.CustomerID);
                promise.then(function (result) {                   
                    if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                        promise = PaymentFunction.selfPayment([items], 10, 2, paymentMean, result, null);
                        promise.then(function (result) {
                            if (result.CollSelfShoppingCartCheckoutResponse != undefined) {
                                localStorage.setItem('summaryCheckout', JSON.stringify(result));
                                setTimeout(function () {
                                    window.location.href = '/SelfCare/Customer/App/Cart/Summary';
                                }, 3000);
                            } else {
                                if (!ErrorHandlerUtility.IsResultTypeOK(result)) {
                                    Notification.error({
                                        message: '<span>' + result.Messages[0] + '</span>',
                                        positionY: 'bottom',
                                        positionX: 'center'
                                    });
                                }
                            }                                                 
                        });
                    } else {
                        Notification.error({
                            message: '<span>' + result.Messages[0] + '</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                    }
                });
            } else {
                Notification.error({
                    message: '<span>' + result.Messages[0] + '</span>',
                    positionY: 'bottom',
                    positionX: 'center'
                });
            }
        });

        /*var promise = PaymentFunction.getPaymentMeansCatalog(900000).then(function (paymentMean) {
            if (ErrorHandlerUtility.IsResultTypeOK(paymentMean)) {
                PaymentFunction.selfPayment([items], 10, 2, paymentMean, null, null).then(function (result) {
                    if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                        Notification.error({
                            message: '<span>' + 'SUKSESS' + '</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                    } else {
                        Notification.error({
                            message: '<span>' + result.Messages[0] + '</span>',
                            positionY: 'bottom',
                            positionX: 'center'
                        });
                    }
                })
            } else {

            }
        });*/

        //var promise = PaymentFunction.selfPayment([items], 10, 2, [items], [items]);
        //promise.then(function (result) {
        //    if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                
        //    } else {

        //    }
        //});
    }
});

SelfCareContent.controller("BuyMoreServiceSuccessController", function ($timeout, $scope) {
    $scope.paymentResult = '<img style="margin: 0 auto; display: block" class="img-responsive" src="http://noimpactproject.org/wp-content/uploads/2011/07/Thank-you-man1-221x240.png" />' +
                                '<h5 style="text-align: center">Buy More Service with PayPal done successfully, you will redirect to DASHBOARD page in 10 seconds</h5>';
    localStorage.removeItem("payment");
    $timeout(function() {
        window.location.href = "/SelfCare/Customer/App";
    }, 10000);
});

SelfCareContent.controller("BuyMoreServiceFailedController", function ($timeout, $scope) {
    $scope.paymentResult = '<img style="margin: 0 auto; display: block" class="img-responsive" src="http://www.droid-life.com/wp-content/uploads/2012/10/Were-Sorry.png" />' +
                                '<h5 style="text-align: center">Buy More Service with PayPal failed, please try again, you will redirect to TOP UP page in 10 seconds</h5>';
    localStorage.removeItem("payment");
    $timeout(function() {
        window.location.href = "/SelfCare/Customer/App/BuyService";
    }, 10000);
});

SelfCareContent.controller("BuyMoreServiceCancelledController", function ($timeout, $scope) {
    $scope.paymentResult = '<img style="margin: 0 auto; display: block" class="img-responsive" src="http://www.droid-life.com/wp-content/uploads/2012/10/Were-Sorry.png" />' +
                                '<h5 style="text-align: center">Buy More Service with PayPal cancelled, please try again, you will redirect to TOP UP page in 10 seconds</h5>';
    localStorage.removeItem("payment");
    $timeout(function() {
        window.location.href = "/SelfCare/Customer/App/BuyService";
    }, 10000);
});
