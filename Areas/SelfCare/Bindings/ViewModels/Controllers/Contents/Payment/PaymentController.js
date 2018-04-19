SelfCareContent.controller("PaymentController", function ($scope, $timeout, ApiConnection, PaymentService, ErrorHandlerUtility, Notification,
                                                          BuyMoreService, PaymentFunction) {
    $scope.amount = 0;
    $scope.totalItem = 0;
    $scope.creditcard = {};
    $scope.bankaccount = {};
    $scope.paymentmean = {};
    $scope.customerpaymentmean = {};
    $scope.tax = {};


    var paymentData = {};
    var paymentData = JSON.parse(localStorage.shoppingcart);
    for (var i = 0; i < paymentData.items[0].device.length; i++) {
        $scope.amount += parseFloat(paymentData.items[0].device[i].amount);
    }
   
    $scope.totalItem = paymentData.items.length;

    // Get PaymentMeantByMVNO
    PaymentService.GetPaymentMaeanByMVNO.get({ mvnoid: 900000 }, function (result) {
        paymentMean = angular.copy(result.PaymentMeanCatalogs);
    });

    // Query Customer Means
    console.log(paymentData.items[0].customerid);
    PaymentService.QueryCustomerPaymentMean.get({ customerid: /*1759000762*/ paymentData.items[0].customerid }, function (result) {
        //console.log(result);
        customerpaymentmean = angular.copy(result.PaymentProfiles);
    });

    // Calculate Tax
    PaymentFunction.calculatetax($scope.amount).then(function (result) {
        console.log(result);
        tax = angular.copy(result);
    });

    $scope.isPayPal = true;
    $scope.setMethod = function (param) {
        var isbool = true;
        if (param == 'paypal') {
            isbool = true;
        } else {
            isbool = false;
        }

        $timeout(function () {
            $scope.isPayPal = isbool;
        }, 100);
    }

    $scope.payBalance = function (param) {
        if ($scope.isPayPal) {
            var paypal_param = {
                "Amount": paymentData.totalAmount,
                "CancelUrl": ApiConnection + "/api/payment/executechargeaccount?LandingPage=" + paymentData.url,
                "ReturnUrl": ApiConnection + "/api/payment/executechargeaccount?LandingPage=" + paymentData.url,
                "Currency": "USD",
                "Item": paymentData.items
            };
            PaymentService.PayPalCreateCharge.save(paypal_param, function (result) {
                if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                    window.location.href = result.PayPalRedirectUrl;
                } else {
                    Notification.error({
                        message: '<strong>' + result.Messages[0] + '</strong>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                }
            });
        } else {
            var creditcard_param = {
                "Amount": paymentData.totalAmount,
                "Currency": "USD",
                "Item": paymentData.items,
                "CreditCard": {
                    "CardNumber": param.cardnumber,
                    "ExpirationDate": param.cardmonth + '' + param.cardyear,
                    "CardCode": param.csc,
                    "Type": param.cardtype
                }
            }
            PaymentService.CreditCardPayment.save(creditcard_param, function (result) {
                if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                    var amount = paymentData.items[0].UnitPrice;
                    BuyMoreService.AdjustBalance.save({ Amount: amount }, function (resource) {
                        if (ErrorHandlerUtility.IsResultTypeOK(resource)) {
                            Notification.success({
                                message: '<strong>' + resource.Messages[0] + '</strong>',
                                positionY: 'top',
                                positionX: 'center'
                            });
                            $timeout(function () {
                                window.location.href = "/SelfCare/Customer/App";
                            }, 3000);
                        } else {
                            Notification.error({
                                message: '<span>' + resource.Messages[0] + '</span>',
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
        }
    }

    $scope.checkoutPayment = function (paymentType, data) {
        var param = angular.copy(paymentData.items);

        var promise = PaymentFunction.selfPayment(param, tax, paymentType, paymentMean, customerpaymentmean, data);
        promise.then(function (result) {
            if (result.CollSelfShoppingCartCheckoutResponse != undefined) {
                localStorage.removeItem('summaryCheckout');
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
    }
});

