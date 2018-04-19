CSRContent.controller('SubscriptionDashboardSectionController', function ($scope, $filter, CSRSecureSection, CacheNavigationService) {
    var curModuleId = 47;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isSubscriptionDashboardActionButtonEnable = false;
        var SubscriptionDashboardActionButton = $filter('filter')(result, { SectionKey: 'SUBSCRIPTION_DASHBOARD_ACTION_BUTTON' })[0];
        if (SubscriptionDashboardActionButton != null) $scope.isSubscriptionDashboardActionButtonEnable = true;

        $scope.isSubscriptionDashboardNumberSwapEnable = false;
        var SubscriptionDashboardNumberSwap = $filter('filter')(result, { SectionKey: 'SUBSCRIPTION_DASHBOARD_NUMBER_SWAP' })[0];
        if (SubscriptionDashboardNumberSwap != null) $scope.isSubscriptionDashboardNumberSwapEnable = true;

        $scope.isSubscriptionDashboardSIMDeviceSwapEnable = false;
        var SubscriptionDashboardSIMDeviceSwap = $filter('filter')(result, { SectionKey: 'SUBSCRIPTION_DASHBOARD_SIMDEVICE_SWAP' })[0];
        if (SubscriptionDashboardSIMDeviceSwap != null) $scope.isSubscriptionDashboardSIMDeviceSwapEnable = true;

        $scope.isSubscriptionDashboardPortabilityInfoEnable = false;
        var SubscriptionDashboardPortabilityInfo = $filter('filter')(result, { SectionKey: 'SUBSCRIPTION_DASHBOARD_PORTABILITY_INFO' })[0];
        if (SubscriptionDashboardPortabilityInfo != null) $scope.isSubscriptionDashboardPortabilityInfoEnable = true;

        $scope.isSubscriptionDashboardConfigurationDetailsEnable = false;
        var SubscriptionDashboardConfigurationDetails = $filter('filter')(result, { SectionKey: 'SUBSCRIPTION_DASHBOARD_CONFIGURATION_DETAILS' })[0];
        if (SubscriptionDashboardConfigurationDetails != null) $scope.isSubscriptionDashboardConfigurationDetailsEnable = true;

        $scope.isSubscriptionDashboardDeviceUsageHistoryEnable = false;
        var SubscriptionDashboardDeviceUsageHistory = $filter('filter')(result, { SectionKey: 'SUBSCRIPTION_DASHBOARD_DEVICE_USAGE_HISTORY' })[0];
        if (SubscriptionDashboardDeviceUsageHistory != null) $scope.isSubscriptionDashboardDeviceUsageHistoryEnable = true;
    });
});