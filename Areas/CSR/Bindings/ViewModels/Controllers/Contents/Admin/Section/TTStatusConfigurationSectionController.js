CSRContent.controller('TTStatusConfigurationSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 87;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isTTStatusAddEnable = false;
        var TTStatusAdd = $filter('filter')(result, { SectionKey: 'TT_STATUS_ADD' })[0];
        if (TTStatusAdd != null) $scope.isTTStatusAddEnable = true;

        $scope.isTTStatusModifyEnable = false;
        var TTStatusModify = $filter('filter')(result, { SectionKey: 'TT_STATUS_MODIFY' })[0];
        if (TTStatusModify != null) $scope.isTTStatusModifyEnable = true;

        $scope.isTTStatusRemoveEnable = false;
        var TTStatusRemove = $filter('filter')(result, { SectionKey: 'TT_STATUS_REMOVE' })[0];
        if (TTStatusRemove != null) $scope.isTTStatusRemoveEnable = true;

    });
});