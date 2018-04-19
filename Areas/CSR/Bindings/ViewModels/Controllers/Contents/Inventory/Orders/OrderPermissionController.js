CSRContent.controller('ViewOrderSecureSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 82;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        // Intranet Button
        $scope.isUpdateOrderEnable = false;
        var oIntranetSecction = $filter('filter')(result, { SectionKey: 'ORDER_UPDATE' })[0];
        if (oIntranetSecction != null) $scope.isUpdateOrderEnable = true;

        // Jira Link Button
        $scope.isCancelOrderEnable = false;
        var oJiraSection = $filter('filter')(result, { SectionKey: 'CANCEL_ORDER' })[0];
        if (oJiraSection != null) $scope.isCancelOrderEnable = true;

        $scope.isOrderDetailEnable = false;
        var oJiraSection = $filter('filter')(result, { SectionKey: 'ORDER_DETAIL_VIEW' })[0];
        if (oJiraSection != null) $scope.isOrderDetailEnable = true;

    });
});

CSRContent.controller('OrderDetailSecureSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 126;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        // Intranet Button
        $scope.isUpdateOrderEnable = false;
        var oIntranetSecction = $filter('filter')(result, { SectionKey: 'ORDER_DETAIL_UPDATE' })[0];
        if (oIntranetSecction != null) $scope.isUpdateOrderEnable = true;

        // Jira Link Button
        $scope.isCancelOrderEnable = false;
        var oJiraSection = $filter('filter')(result, { SectionKey: 'ORDER_DETAIL_CANCEL' })[0];
        if (oJiraSection != null) $scope.isCancelOrderEnable = true;

    });
});