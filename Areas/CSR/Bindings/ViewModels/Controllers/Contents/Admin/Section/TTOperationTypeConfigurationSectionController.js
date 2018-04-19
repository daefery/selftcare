CSRContent.controller('TTOperationTypeConfigurationSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 92;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isTTOperationTypeAddEnable = false;
        var TTOperationTypeAdd = $filter('filter')(result, { SectionKey: 'TT_OPERATION_TYPE_ADD' })[0];
        if (TTOperationTypeAdd != null) $scope.isTTOperationTypeAddEnable = true;

        $scope.isTTOperationTypeModifyEnable = false;
        var TTOperationTypeModify = $filter('filter')(result, { SectionKey: 'TT_OPERATION_TYPE_MODIFY' })[0];
        if (TTOperationTypeModify != null) $scope.isTTOperationTypeModifyEnable = true;

        $scope.isTTOperationTypeRemoveEnable = false;
        var TTOperationTypeRemove = $filter('filter')(result, { SectionKey: 'TT_OPERATION_TYPE_REMOVE' })[0];
        if (TTOperationTypeRemove != null) $scope.isTTOperationTypeRemoveEnable = true;

    });
});