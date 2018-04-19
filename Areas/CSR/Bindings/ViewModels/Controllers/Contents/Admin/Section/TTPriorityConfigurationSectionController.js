CSRContent.controller('TTPriorityConfigurationSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 90;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isTTPriorityAddEnable = false;
        var TTPriorityAdd = $filter('filter')(result, { SectionKey: 'TT_PRIORITY_ADD' })[0];
        if (TTPriorityAdd != null) $scope.isTTPriorityAddEnable = true;

        $scope.isTTPriorityModifyEnable = false;
        var TTPriorityModify = $filter('filter')(result, { SectionKey: 'TT_PRIORITY_MODIFY' })[0];
        if (TTPriorityModify != null) $scope.isTTPriorityModifyEnable = true;

        $scope.isTTPriorityRemoveEnable = false;
        var TTPriorityRemove = $filter('filter')(result, { SectionKey: 'TT_PRIORITY_REMOVE' })[0];
        if (TTPriorityRemove != null) $scope.isTTPriorityRemoveEnable = true;

    });
});