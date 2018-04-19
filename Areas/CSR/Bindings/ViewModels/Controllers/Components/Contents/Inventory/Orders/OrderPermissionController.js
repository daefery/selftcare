CSRContent.controller('ViewOrderSecureSectionController', function ($scope, $filter, CSRSecureSection) {
    CSRSecureSection.get({ ModuleId: 82 }, function (result) {

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

CSRContent.controller('OrderDetailSecureSectionController', function ($scope, $filter, CSRSecureSection) {
    CSRSecureSection.get({ ModuleId: 126 }, function (result) {

        // Intranet Button
        $scope.isUpdateOrderEnable = false;
        var oIntranetSecction = $filter('filter')(result, { SectionKey: 'ORDER_DETAIL_UPDATE' })[0];
        if (oIntranetSecction != null) $scope.isUpdateOrderEnable = true;

        // Jira Link Button
        $scope.isCancelOrderEnable = false;
        var oJiraSection = $filter('filter')(result, { SectionKey: 'ORDER_DETAIL_CANCE' })[0];
        if (oJiraSection != null) $scope.isCancelOrderEnable = true;

    });
});