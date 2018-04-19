CSRContent.controller('TTDepartmentConfigurationSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 86;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isTTDepartmentAddEnable = false;
        var TTDepartmentAdd = $filter('filter')(result, { SectionKey: 'TT_DEPARTMENT_ADD' })[0];
        if (TTDepartmentAdd != null) $scope.isTTDepartmentAddEnable = true;

        $scope.isTTDepartmentModifyEnable = false;
        var TTDepartmentModify = $filter('filter')(result, { SectionKey: 'TT_DEPARTMENT_MODIFY' })[0];
        if (TTDepartmentModify != null) $scope.isTTDepartmentModifyEnable = true;

        $scope.isTTDepartmentRemoveEnable = false;
        var TTDepartmentRemove = $filter('filter')(result, { SectionKey: 'TT_DEPARTMENT_REMOVE' })[0];
        if (TTDepartmentRemove != null) $scope.isTTDepartmentRemoveEnable = true;

    });
});