CSRContent.controller('TTSupportDashboardSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 94;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isSupportTTDashboardUpdateSupportEnable = false;
        var SupportTTDashboardUpdateSupport = $filter('filter')(result, { SectionKey: 'SUPPORT_TT_DASHBOARD_UPDATE_SUPPORT' })[0];
        if (SupportTTDashboardUpdateSupport != null) $scope.isSupportTTDashboardUpdateSupportEnable = true;

        $scope.isSupportTTDashboardEscalateSupportEnable = false;
        var SupportTTDashboardEscalateSupport = $filter('filter')(result, { SectionKey: 'SUPPORT_TT_DASHBOARD_ESCALATE_SUPPORT' })[0];
        if (SupportTTDashboardEscalateSupport != null) $scope.isSupportTTDashboardEscalateSupportEnable = true;
    });
});