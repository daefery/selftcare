CSRContent.controller('TTKPIConfigurationSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 100;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isTTKPIModifyEnable = false;
        var TTKPIModify = $filter('filter')(result, { SectionKey: 'TT_KPI_MODIFY' })[0];
        if (TTKPIModify != null) $scope.isTTKPIModifyEnable = true;

    });
});