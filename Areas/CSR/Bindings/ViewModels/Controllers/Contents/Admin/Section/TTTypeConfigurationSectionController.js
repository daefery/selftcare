CSRContent.controller('TTTypeConfigurationSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 89;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isTTTypeAddEnable = false;
        var TTTypeAdd = $filter('filter')(result, { SectionKey: 'TT_TYPE_ADD' })[0];
        if (TTTypeAdd != null) $scope.isTTTypeAddEnable = true;

        $scope.isTTTypeModifyEnable = false;
        var TTTypeModify = $filter('filter')(result, { SectionKey: 'TT_TYPE_MODIFY' })[0];
        if (TTTypeModify != null) $scope.isTTTypeModifyEnable = true;

        $scope.isTTTypeRemoveEnable = false;
        var TTTypeRemove = $filter('filter')(result, { SectionKey: 'TT_TYPE_REMOVE' })[0];
        if (TTTypeRemove != null) $scope.isTTTypeRemoveEnable = true;

    });
});