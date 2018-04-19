CSRContent.controller('TTFlowTypeConfigurationSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 88;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isTTFlowTypeAddEnable = false;
        var TTFlowTypeAdd = $filter('filter')(result, { SectionKey: 'TT_FLOW_TYPE_ADD' })[0];
        if (TTFlowTypeAdd != null) $scope.isTTFlowTypeAddEnable = true;

        $scope.isTTFlowTypeModifyEnable = false;
        var TTFlowTypeModify = $filter('filter')(result, { SectionKey: 'TT_FLOW_TYPE_MODIFY' })[0];
        if (TTFlowTypeModify != null) $scope.isTTFlowTypeModifyEnable = true;

        $scope.isTTFlowTypeRemoveEnable = false;
        var TTFlowTypeRemove = $filter('filter')(result, { SectionKey: 'TT_FLOW_TYPE_REMOVE' })[0];
        if (TTFlowTypeRemove != null) $scope.isTTFlowTypeRemoveEnable = true;

    });
});