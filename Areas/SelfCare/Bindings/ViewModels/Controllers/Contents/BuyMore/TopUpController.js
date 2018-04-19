SelfCareContent.controller("TopUpController", function ($scope, $timeout, $location, $sce, CustomerCache, CommonEnum, BuyMoreService, ProductService, Notification, ErrorHandlerUtility, ApiConnection, ShoppingFunction, CustomerWrapperService) {

    var ProductCatalogId = null;
    // Language refer to ISO639LanguageCodes
    // English 139 (default)
    var Language = null; 
    // Type = Product Type
    // Enum for Product Type
    // Unassigned:0,
    // Plan:1,
    // Feature:2,
    // Handset3G:3,
    // Handset4G:4,
    // MoneteryCashCard: 5,
    // AllowanceCashCard: 6,
    // Allowance: 7,
    // SimCard: 8
    var ProductType = 5;

    $scope.isCompiled = false;
    $scope.MoneteryCashCardCollection = [];
    ProductService.getProductOffering.get({ ProductCatalogIds: ProductCatalogId, Language: Language, Type: ProductType }, function (result) {
        if (ErrorHandlerUtility.IsResultTypeOK(result)) {
            var productOffering = result.ProductOfferings

            // Function to get the amount and currency from product offering names
            for (var i = 0; i < productOffering.length; i++) {
                var cashCard = productOffering[i].Names.split(" ");
                var cashcardValue = cashCard[(cashCard.length - 1)];
                var cashCardAmount = cashcardValue.slice(0, -1);
                var cashCardCurrency = cashcardValue.slice(-1);

                productOffering[i].amount = cashCardAmount;
                productOffering[i].currency = cashCardCurrency;
            };
            $scope.MoneteryCashCardCollection = productOffering;
            $scope.isCompiled = true;
        } else {
            notificationError(result.Messages[0])
        }
    });

    $scope.selectBalance = function (param) {
        $scope.pay.amount = param.amount;
        $scope.pay.name = param.Names;
        $scope.pay.productid = param.Id;
        $scope.pay.paymenttype = CommonEnum.convertTopUpPaymentTypeEnum(0);
    }

    $scope.paynow = function (param) {
        localStorage.removeItem("payment");
        localStorage.payment = JSON.stringify({
            items: [
                {
                    ItemId: "1020000695",
                    Name: "Balance",
                    Quantity: 1,
                    Taxable: false,
                    TaxableSpecified: false,
                    UnitPrice: parseInt(param.amount)
                }
            ],
            totalAmount: 1 * param.amount,
            url: "LP1"
        });
        $timeout(function () {
            $location.path("/SelfCare/Customer/App/Payment");
        }, 300);
    }

    $scope.addToCart = function () {
        var items = {
            item: {
                "productid": $scope.pay.productid,
                "type": $scope.pay.paymenttype,
                "name": $scope.pay.name,
                "qty": 1,
                "amount": $scope.pay.amount,
                "unitprice": $scope.pay.amount
            },
            referenceCode: '',
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

    $scope.topUpType = "cash";
    $scope.headDetails = "Buy Cash Card";
    $scope.pay = {};
    $scope.pay.amount = 0;


    $scope.selectType = function (data) {
        if (data == 'cash') {
            $scope.topUpType = "cash";
            $scope.headDetails = "Buy Cash Card";
        } else {
            $scope.topUpType = "pin";
            $scope.headDetails = "Redeem Pin Card";
        }
    }

    $scope.activatePin = function (data) {
        if (config.TemplateCode == 'etna') {
            var param = {
                MobileNumber: wrapper.activeDevice.Msisdn,
                VoucherCode: data.pinnumber
            }
            BuyMoreService.VoucherTopUp.save(param, function (result) {
                if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                    Notification.success({
                        message: '<strong>voucher top up success</strong><br>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    $timeout(function () {
                        window.location.href = "/SelfCare/Customer/App/TopUp";
                    }, 1000);
                } else {
                    notificationError(result.Messages[0])
                    return false;
                }
            });
        } else {
            alert("top up for ET is not ready yet !!!");
        }
    }

    var notificationError = function (message) {
        Notification.error({
            message: '<strong>' + message + '</strong>',
            positionY: 'top',
            positionX: 'center'
        });
    };

});

SelfCareContent.controller("TopUpSuccessController", function (ErrorHandlerUtility, BuyMoreService, $scope) {
    $scope.paymentResult = '<img style="margin: 0 auto; display: block" class="img-responsive" src="http://noimpactproject.org/wp-content/uploads/2011/07/Thank-you-man1-221x240.png" />'+
                           '<h5 style="text-align: center">TOP UP Balance with PayPal done successfully, you will redirect to DASHBOARD page in 10 seconds</h5>';
    var obj = JSON.parse(localStorage.payment);
    var amount = obj.items[0].UnitPrice;
    if (config.TemplateCode == 'etna') {
        BuyMoreService.AdjustBalance.save({ Amount: amount }, function (resource) {
            if (ErrorHandlerUtility.IsResultTypeOK(resource)) {
                Notification.success({
                    message: '<strong>' + resource.Messages[0] + '</strong>',
                    positionY: 'top',
                    positionX: 'center'
                });
                $timeout(function () {
                    window.location.href = "/SelfCare/Customer/App";
                }, 10000);
            } else {
                //Notification.error({
                //    message: '<span>' + resource.Messages[0] + '</span>',
                //    positionY: 'bottom',
                //    positionX: 'center'
                //});
                $timeout(function () {
                    window.location.href = "/SelfCare/Customer/App/TopUpFailed";
                }, 100);

            }
            localStorage.removeItem("payment");
        });
    } else {
        alert('this service is not ready for ET');
    }
});

SelfCareContent.controller("TopUpFailedController", function ($timeout, $scope) {
    $scope.paymentResult = '<img style="margin: 0 auto; display: block" class="img-responsive" src="http://www.droid-life.com/wp-content/uploads/2012/10/Were-Sorry.png" />'+
                           '<h5 style="text-align: center">TOP UP Balance with PayPal failed, please try again, you will redirect to TOP UP page in 10 seconds</h5>';
    $timeout(function () {
        window.location.href = "/SelfCare/Customer/App/TopUp";
    }, 10000);
});

SelfCareContent.controller("TopUpCancelledController", function ($timeout, $scope) {
    $scope.paymentResult = '<img style="margin: 0 auto; display: block" class="img-responsive" src="http://www.droid-life.com/wp-content/uploads/2012/10/Were-Sorry.png" />' +
                           '<h5 style="text-align: center">TOP UP Balance with PayPal has cancelled, please try again, you will redirect to TOP UP page in 10 seconds</h5>';
    $timeout(function () {
        window.location.href = "/SelfCare/Customer/App/TopUp";
    }, 10000);
});