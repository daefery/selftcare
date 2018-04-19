CSRContent.controller('TTFlowRuleConfigurationSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 103;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isTTFlowRuleAddEnable = false;
        var TTFlowRuleAdd = $filter('filter')(result, { SectionKey: 'TT_FLOW_RULE_ADD' })[0];
        if (TTFlowRuleAdd != null) $scope.isTTFlowRuleAddEnable = true;

        $scope.isTTFlowRuleModifyEnable = false;
        var TTFlowRuleModify = $filter('filter')(result, { SectionKey: 'TT_FLOW_RULE_MODIFY' })[0];
        if (TTFlowRuleModify != null) $scope.isTTFlowRuleModifyEnable = true;

        $scope.isTTFlowRuleRemoveEnable = false;
        var TTFlowRuleRemove = $filter('filter')(result, { SectionKey: 'TT_FLOW_RULE_REMOVE' })[0];
        if (TTFlowRuleRemove != null) $scope.isTTFlowRuleRemoveEnable = true;

    });
});