CSRContent.controller('TTSubTypeConfigurationSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 97;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isTTSubTypeAddEnable = false;
        var TTSubTypeAdd = $filter('filter')(result, { SectionKey: 'TT_SUBTYPE_ADD' })[0];
        if (TTSubTypeAdd != null) $scope.isTTSubTypeAddEnable = true;

        $scope.isTTSubTypeModifyEnable = false;
        var TTSubTypeModify = $filter('filter')(result, { SectionKey: 'TT_SUBTYPE_MODIFY' })[0];
        if (TTSubTypeModify != null) $scope.isTTSubTypeModifyEnable = true;

        $scope.isTTSubTypeRemoveEnable = false;
        var TTSubTypeRemove = $filter('filter')(result, { SectionKey: 'TT_SUBTYPE_REMOVE' })[0];
        if (TTSubTypeRemove != null) $scope.isTTSubTypeRemoveEnable = true;

    });
});