SelfCareContent.controller("DashboardController", function ($rootScope, $scope, GetCustomerProducts, NavigationMenuCache, SelfCareDashboardDefault, CustomerCache, SelfCareCache, SelfCareDashboard, AuthUtilityCommon
    , CustomerCache, RevenueCache, SelfcareSecureSection, $filter, Notification) {
    AuthUtilityCommon.PasswordExpirationHandler();
    /* DashBoard data*/
    //CustomerCache.getDataSummary({ customerid: wrapper.CustomerID }).then(function (result) {
    //    var summary = angular.copy(result);
    //    if (config.TemplateCode == 'etna') {
    //        CustomerCache.getBalance({mdn:summary.Subscription.MSISDN}).then(function(data) {
    //            $scope.custBalances = data.Balance;
    //        });
    //    } else {
    //        $scope.custBalances = summary.Subscription.CreditLimit;
    //    }
        
    //});

    var activeCustomerId = wrapper.customerInfo.CustomerID

    if (config.TemplateCode == 'etna') {
        //CustomerCache.getBalanceETNA({ mdn: wrapper.activeDevice.Msisdn }).then(function (data) {
        //    $scope.custBalances = data.Balance;
        //});
        CustomerCache.getBalanceCommon({ mobileNumber: wrapper.activeDevice.Msisdn }).then(function (data) {
            $scope.custBalances = data.Balance;
        })
    } else {
        //CustomerCache.getBalanceET({ customerid: wrapper.customerInfo.CustomerID }).then(function (data) {
        //    $scope.custBalances = data.LastSubscription.CreditLimit;
        //});
        CustomerCache.getBalanceCommon({ mobileNumber: wrapper.activeDevice.Msisdn }).then(function (data) {
            $scope.custBalances = data.Balance;
        })
        CustomerCache.getUsageDetail({ customerid: wrapper.customerInfo.CustomerID }).then(function (data) {
            //$scope.usage = data;
            var usage = data.CustomerUsage;
            $scope.dataUsage = (usage.DataUsage)/1024;
            $scope.voiceUsage = usage.VoiceUsage;
            $scope.textUsage = usage.SMSUsage;
        });
    }

    //Dynamic Dashboard

    $rootScope.dynamic = 'no'
    $rootScope.shake = '';
    var cacheKey = 'DashboardMenu';
    $scope.getVal = angular.copy(SelfCareCache.get(cacheKey));
    if (typeof $scope.getVal === 'undefined') {
        SelfCareDashboard.get(function (data) {
            $scope.getVal = angular.copy(data);
            SelfCareCache.put(cacheKey, data);
            $scope.mainDashboard = dynamicDashboard($scope.getVal)
        })
    }
    else {
        $scope.mainDashboard = dynamicDashboard($scope.getVal);
    };
    $scope.save = function () {
        $scope.SelfCareDashboard = $scope.mainDashboard;
        $scope.SelfCareDashboard.$save();
        disableSort();
        $rootScope.dynamic = 'no';
        $rootScope.shake = '';
        SelfCareCache.put(cacheKey, $scope.SelfCareDashboard);
    }
    $scope.default = function () {
        SelfCareDashboardDefault.get(function (data) {
            $scope.getVal = data.DashboardDefault;
            $scope.mainDashboard.DashboardMenu = $scope.getVal;
        });
    }
    $scope.close = function () {
        SelfCareDashboard.get(function (data) {
            $scope.getVal = data.DashboardMenu;
            $scope.mainDashboard.DashboardMenu = $scope.getVal;
        });
        disableSort()
        $rootScope.dynamic = 'no'
        $rootScope.shake = '';
    }
    $scope.edit = function () {
        $rootScope.dynamic = 'yes';
        $rootScope.shake = 'shake';
        enableSort()
    }

    $scope.Products = {};
    $scope.Products.CurrentPlan = "";
    $scope.Products.CurrentServiceAndPromotion = [];

    GetCustomerProducts.getProductByMobileNumber.get({ MobileNumber: wrapper.activeDevice.Msisdn }, function (response) {
        if (response.ResultType === 0 && response.ResultCode === 0) {
            $scope.Products.CurrentPlan = response.Plan.ProductName;
            var indexFeaturesAndPromotions = 0;
            for (var i = 0; i < response.FeaturesAndPromotions.length; i++) {
                if (parseInt(response.FeaturesAndPromotions[i].ProductTypeId) === 1020000790) {
                    $scope.Products.CurrentServiceAndPromotion[indexFeaturesAndPromotions] = {}
                    $scope.Products.CurrentServiceAndPromotion[indexFeaturesAndPromotions].Name = response.FeaturesAndPromotions[i].ProductName;
                    indexFeaturesAndPromotions++
                }
            };
        } else {
            NotificationError(response.Messages[0]);
        };
    });

    function NotificationError(errorMessage) {
        //var errorMessage = ErrorHandlerUtility.GetErrorMessage(data);
        return Notification.error({
            message: '<span>' + errorMessage + '</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 10000
        });
    };

    var mobileNumber = wrapper.activeDevice.Msisdn,
        balanceType = 'Both',
        sweepOn = true;


    //Model for bucket list
    bucketList = {};
    bucketList.data = {};
    bucketList.voice = {};
    bucketList.sms = {};
    bucketList.mms = {};
    bucketList.sms.value = '-';
    bucketList.sms.unit = '';
    bucketList.mms.value = '-';
    bucketList.mms.unit = '';
    bucketList.voice.value = '-';
    bucketList.voice.unit = '';
    bucketList.data.value = '-';
    bucketList.data.unit = '';
    $scope.Bucket = bucketList;

    RevenueCache.getBuckets(mobileNumber, balanceType, sweepOn).then(function (response) {
        bucketInfo = response.BucketInfo;
        
        
        for (var i = 0; i < bucketInfo.BucketsList.length; i++) {
            var sourceType = bucketInfo.BucketsList[i].SourceValue;
            sourceType = sourceType.toLowerCase();
            var type = (sourceType.split(" "))[2]
            switch (type) {
                case "sms":
                    bucketList.sms.value = angular.copy(bucketInfo.BucketsList[i].BalanceValue);
                    bucketList.sms.unit = angular.copy(bucketInfo.BucketsList[i].Unit).toUpperCase();
                    break;
                case "mms":
                    bucketList.mms.value = angular.copy(bucketInfo.BucketsList[i].BalanceValue);
                    bucketList.mms.unit = angular.copy(bucketInfo.BucketsList[i].Unit).toUpperCase();
                    break;
                case "voice":
                    bucketList.voice.value = angular.copy(bucketInfo.BucketsList[i].BalanceValue);
                    bucketList.voice.unit = angular.copy(bucketInfo.BucketsList[i].Unit).toUpperCase();
                    break;
                case "data":
                    bucketList.data.value = angular.copy(bucketInfo.BucketsList[i].BalanceValue);
                    bucketList.data.unit = angular.copy(bucketInfo.BucketsList[i].Unit).toUpperCase();
                    break;
            }
        }
        $scope.Bucket = bucketList;
    });


    SelfcareSecureSection.get({ ModuleId: 3 }, function (result) {
        $scope.isTopUpEnable = false;
        $scope.isBuyMoreEnable = false;
        $scope.isEasyPayEnable = false;
        $scope.isChangePlanButtonEnable = false;
        $scope.isChangeServicesButtonEnable = false;
        $scope.isContractAndUsagePanelEnable = false;
        $scope.isYourDevicePanelEnable = false;
        var objectTopUp = $filter('filter')(result, { SectionKey: 'Top_Up' })[0];
        if (objectTopUp != null) $scope.isTopUpEnable = true;
        var objectBuyMore = $filter('filter')(result, { SectionKey: 'Buy_More' })[0];
        if (objectBuyMore != null) $scope.isBuyMoreEnable = true;
        var objectEasyPay = $filter('filter')(result, { SectionKey: 'Easy_Pay' })[0];
        if (objectEasyPay != null) $scope.isEasyPayEnable = true;
        var objectChangePlanButton = $filter('filter')(result, { SectionKey: 'Change_Plan_Button' })[0];
        if (objectChangePlanButton != null) $scope.isChangePlanButtonEnable = true;
        var objectChangeServicesButton = $filter('filter')(result, { SectionKey: 'Change_Services_Button' })[0];
        if (objectChangeServicesButton != null) $scope.isChangeServicesButtonEnable = true;
        var isContractAndUsagePanel = $filter('filter')(result, { SectionKey: 'ContractInfo_AccountUsage' })[0];
        if (isContractAndUsagePanel != null) $scope.isContractAndUsagePanelEnable = true;
        var isYourDevicePanel = $filter('filter')(result, { SectionKey: 'Your_Device' })[0];
        if (isYourDevicePanel != null) $scope.isYourDevicePanelEnable = true;
    });
});

SelfCareContent.controller("EasyPayDefaultCardController", function ($scope, $filter, PaymentCache) {
    var activeCustomerId = wrapper.customerInfo.CustomerID
    $scope.selectedCard = "";
    PaymentCache.getBuckets(activeCustomerId).then(function (response) {
        var creditCardCollection = [];
        response.PaymentProfiles.forEach(function (element, index) {
            if (element.Type == 3) {
                creditCardCollection.push(element.PaymentProfile);
            }
            else {
                //TO DO action for non credit card type
            }
        });
        var selectedCC = $filter('filter')(creditCardCollection, { "IsDefault": true });
        if (selectedCC.length == 0) {
            $scope.selectedCard = ""
        } else {
            $scope.selectedCard = selectedCC[0].CardNumber;
        }
    });
});