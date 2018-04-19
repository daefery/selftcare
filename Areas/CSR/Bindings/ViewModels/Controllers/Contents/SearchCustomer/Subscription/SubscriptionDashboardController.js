CSRContent.controller("SubscriptionDashboardController", function ($scope, $rootScope, $filter, Notification, ErrorHandlerUtility, LocalStorageProvider, CacheSearch, CommonEnum
    , DetailCustomer, MultiSubscriptionsCacheService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();
    $scope.TemplateCode = LocalStorageProvider.getTemplateCode();

    $scope.selectedMultiSubscription = {};
    $scope.selectedDeviceInfo = {};
    $scope.selectedSIM = {};

    $scope.NumberSwap = {};
    $scope.SIMSwap = {};
    $scope.DeviceSwap = {};
    $scope.ConfigurationDetail = {};
    $scope.SelectNumber = {};
    $scope.PortabilityInfo = {};
    $scope.SubscriptionsLifecycleHistory = {};

    $scope.SIM_Device_Swap_Title = 'SIM_Swap';//Default
    $scope.open_SIMDeviceSwapModal = function () {
        if ($scope.selectedMultiSubscription.Subscription != undefined) {
            if ($scope.SIM_Device_Swap_Title == 'SIM_Swap') {
                $scope.SIMSwap.MSISDN = $scope.selectedMultiSubscription.Subscription.MSISDN;
                if ($scope.selectedSIM == undefined || $scope.selectedSIM == null) {
                    $scope.SIMSwap.Current_ICCID = 'N/A';
                } else {
                    $scope.SIMSwap.Current_ICCID = $scope.selectedSIM.ICCID;
                }
                angular.element('#SIMSwapModal').modal('show');
            } else {
                $scope.DeviceSwap.MSISDN = $scope.selectedMultiSubscription.Subscription.MSISDN;
                if ($scope.selectedSIM == undefined || $scope.selectedSIM == null) {
                    $scope.DeviceSwap.Current_ESN = 'N/A';
                } else {
                    $scope.DeviceSwap.Current_ESN = $scope.selectedSIM.ICCID;
                }
                angular.element('#DeviceSwapModal').modal('show');
            }
        } else {
            var msg = 'Subscription not found.';
            Notification.error({
                message: '<span>' + msg + '</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 4000
            });
        }
    }

    $scope.NumberSwap.openNumberSwapModal = function (NumberSwap) {
        if ($scope.selectedMultiSubscription.Subscription != undefined) {
            $scope.NumberSwap.New_Number = null;
            $scope.NumberSwap.MSISDN = $scope.selectedMultiSubscription.Subscription.MSISDN;
            angular.element('#NumberSwapModal').modal('show');
        } else {
            var msg = 'Subscription not found.';
            Notification.error({
                message: '<span>' + msg + '</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 4000
            });
        }
    }

    $scope.SubscriptionId;
    $scope.load_SubscriptionDashboard = function (MSISDNParam, clearCache) {
        var customerSession = sessionStorage.CustomerDataForCustomerSummary != undefined ? JSON.parse(sessionStorage.CustomerDataForCustomerSummary) : {};
        var customerId = customerSession.customerid;
        $scope.SubscriptionId = customerSession.subscriptionId;

        MultiSubscriptionsCacheService.getSubscriptionsList(customerId, clearCache).then(function (response) {
            var Subscriptions = response.Subscriptions.filter(function (filterdata) {
                return (filterdata.Subscription.SubscriptionId.toString() == $scope.SubscriptionId.toString());
            });
            var SingleSubscriptions = null;
            if (Subscriptions != undefined && Subscriptions.length > 0) {
                SingleSubscriptions = Subscriptions[0];
            }
            $scope.load_SubscriptionDataUI(SingleSubscriptions);
            $scope.load_SubscriptionProductsByMSISDN(SingleSubscriptions.Subscription.MSISDN, clearCache);
        });

    }

    $scope.selectedPromotionList;
    $scope.selectedProduct;
    $scope.selectedDeviceInfo;
    $scope.selectedBucketsList;
    $scope.load_SubscriptionProductsByMSISDN = function (Subscription_MSISDN, clearCache) {
        if (Subscription_MSISDN != undefined && Subscription_MSISDN != null) {
            CacheSearch.getCustomerProducts(Subscription_MSISDN, clearCache).then(function (response) {
                var CustomerProducts = angular.copy(response);
                $scope.selectedPromotionList = CustomerProducts.FeaturesAndPromotions;
                $scope.selectedProduct = CustomerProducts.Plan;
                $scope.selectedDeviceInfo = CustomerProducts.Device;
                $scope.selectedBucketsList = CustomerProducts.BucketInfo == null ? null : CustomerProducts.BucketInfo.BucketsList;
            });
        } else {
            $scope.selectedPromotionList = null;
            $scope.selectedProduct = null;
            $scope.selectedDeviceInfo = null;
            $scope.selectedBucketsList = null;
        }
    }

    $scope.isICCIDExists = false;
    $scope.load_SubscriptionDataUI = function (SubscriptionData) {
        if (SubscriptionData != undefined && SubscriptionData != null) {

            $scope.selectedMultiSubscription = SubscriptionData;

            $scope.selectedSIM = $scope.selectedMultiSubscription.SimCard;

            if ($scope.selectedSIM != null && $scope.selectedSIM.ICCID != undefined && $scope.selectedSIM.ICCID != null && $scope.selectedSIM.ICCID != '' && $scope.selectedSIM.ICCID != 'N/A') {
                $scope.isICCIDExists = true;
                $scope.SIM_Device_Swap_Title = 'SIM_Swap';
            } else {
                $scope.isICCIDExists = false;
                $scope.SIM_Device_Swap_Title = 'Device_Swap';
            }

            //Action-Freeze/UnFreeze/Delete
            var setSubscriptionInformationObject = {
                msisdn: SubscriptionData.Subscription.MSISDN,
                iccidOrESN: (SubscriptionData.SimCard !== null) ? SubscriptionData.SimCard.ICCID : null,
                subscriptionStatus: SubscriptionData.Subscription.subscriptionStatus,
                simStatus: (SubscriptionData.SimCard !== null) ? SubscriptionData.SimCard.simStatus : null,
                //customerStatus: CommonEnum.convertCustomerStatus($scope.Customer.CustomerStatus).name,
                OrderNumber: (SubscriptionData.OrderInfo !== null) ? SubscriptionData.OrderInfo.OrderNumber : null,
                SubscriptionIdentifier: SubscriptionData.Subscription.SubscriptionId,
            };
            DetailCustomer.setSubscriptionInformation(setSubscriptionInformationObject);
            $rootScope.$broadcast('setSubscriptionInformationObject');
        } else {

            var setSubscriptionInformationObject = {
                msisdn: null,
                iccidOrESN: null,
                subscriptionStatus: null,
                simStatus: null,
                customerStatus: null,
                OrderNumber: null,
                SubscriptionIdentifier: null,
            };
            DetailCustomer.setSubscriptionInformation(setSubscriptionInformationObject);
            $rootScope.$broadcast('setSubscriptionInformationObject');

            var msg = 'Subscription not found.';
            Notification.error({
                message: '<span>' + msg + '</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 4000
            });
        }
    }

    $scope.load_SubscriptionDashboard(null, false);

    $scope.$on('refresh-customerdashboard', function (event, args) {
        $scope.load_SubscriptionDashboard(null, true);
    });

});