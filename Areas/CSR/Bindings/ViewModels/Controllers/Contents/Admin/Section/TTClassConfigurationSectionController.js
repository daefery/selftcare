CSRContent.controller('TTClassConfigurationSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 91;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {
        
        $scope.isTTClassAddEnable = false;
        var TTClassAdd = $filter('filter')(result, { SectionKey: 'TT_CLASS_ADD' })[0];
        if (TTClassAdd != null) $scope.isTTClassAddEnable = true;
        
        $scope.isTTClassModifyEnable = false;
        var TTClassModify = $filter('filter')(result, { SectionKey: 'TT_CLASS_MODIFY' })[0];
        if (TTClassModify != null) $scope.isTTClassModifyEnable = true;
        
        $scope.isTTClassRemoveEnable = false;
        var TTClassRemove = $filter('filter')(result, { SectionKey: 'TT_CLASS_REMOVE' })[0];
        if (TTClassRemove != null) $scope.isTTClassRemoveEnable = true;

    });
});