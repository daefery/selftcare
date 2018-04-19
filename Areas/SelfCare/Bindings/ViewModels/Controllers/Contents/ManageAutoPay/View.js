SelfCareContent.controller("ManageAutoPayController", function ($scope, $rootScope, $filter, SelfCareCache, PaymentService, ErrorHandlerUtility, Notification, CommonEnum) {
    $scope.isdataexist = false;
    $scope.isCreditCardExist = false;
    $scope.AutoPayServices = [];
    $scope.CreditCardCollection = 'undefined';
    $scope.CustomerID = JSON.parse(localStorage.self_scope).customerInfo.CustomerID;
    var dataCache = SelfCareCache;

    var dummyautoPayServices = function () {
        obj = [{
            MDN: '+274534342',
            ServiceName: 'Plan A',
            Price: '$ 5.2',
            Renewal: '1st of Month'
        },
        {
            MDN: '+274534343',
            ServiceName: 'Plan A',
            Price: '$ 5.2',
            Renewal: '1st of Month'
        },
        {
            MDN: '+274534344',
            ServiceName: 'Plan A',
            Price: '$ 5.2',
            Renewal: '1st of Month'
        }];
        return obj;
    };

    var refreshScope = function () {
        $scope.AutoPayServices = dummyautoPayServices();
        $scope.selectedCC = getDefaultCC();
        $scope.notAvailableCC = notAvailableFunction($scope.CreditCardCollection);
        checkEmptyData();
    };

    var getDefaultCC = function () {
        var selectedCC = $filter('filter')($scope.CreditCardCollection, { "IsDefault": true });
        if (selectedCC.length == 0)
            return "";
        else
            return selectedCC[0].CardNumber;
    }

    var checkEmptyData = function () {
        if (!$scope.AutoPayServices) 
            $scope.isdataexist = true;
        else
            $scope.isdataexist = false;
        if (!$scope.CreditCardCollection)
            $scope.isCreditCardExist = true;
        else
            $scope.isCreditCardExist = false;
    };

    var notAvailableFunction = function (data) {
        var notAvailable = [];
        if (data.length < 3) {
            for (var i = 0; i < 3 - data.length; i++) {
                notAvailable.push({ Id: i });
            }
        } else {
            notAvailable = undefined;
        }
        return notAvailable;
    };

    $scope.getExpirationDate = function (date) {
        return moment(date).format('MMM D, YYYY');
    }


    $scope.UseThisCard = function (paymentMeanId) {
        var paymentIdData = {
            "CustomerId": $scope.CustomerID,
            "DefaultPaymentMeanId": paymentMeanId
        };
        PaymentService.SetDefaultPayment.save(paymentIdData, function (result) {
            if (ErrorHandlerUtility.IsResultTypeOK(result)) {
                cacheKey = 'getPaymentMeans-by' + $scope.CustomerID;
                dataCache.remove(cacheKey);
                    //success
                    Notification.success({
                        message: '<span>' + 'Credit Card selected as default' + '</span>',
                        positionY: 'bottom',
                        positionX: 'center'
                    });
                    $scope.CreditCardCollection = 'undefined';
                    loadCreditCard();
            } else {
                Notification.error({
                    message: '<span>' + result.Messages[0] + '</span>',
                    positionY: 'bottom',
                    positionX: 'center'
                });
            }
        });
    }

    var loadCreditCard = function () {
        PaymentService.GetPaymentMeans.get({ customerid: $scope.CustomerID }, function (result) {
            var creditCardCollection = [];
            var ccIndex = 0;
            result.PaymentProfiles.forEach(function (element, index) {
                if (element.Type == 3) {
                    creditCardCollection.push(element.PaymentProfile);
                    temp = creditCardCollection[ccIndex].CreditCardType;
                    creditCardCollection[ccIndex].CreditCardType = CommonEnum.convertCCType(temp).name;
                    ccIndex++;
                }
                else {
                    //TO DO. do something for not credit card type;
                }
            });
            $scope.CreditCardCollection = creditCardCollection;
            refreshScope();
        });
    };

    loadCreditCard();
});