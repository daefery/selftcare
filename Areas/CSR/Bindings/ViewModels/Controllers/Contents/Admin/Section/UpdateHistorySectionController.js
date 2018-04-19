CSRContent.controller('UpdateHistorySectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 116;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isAddUpdateHistoryEnable = false;
        var AddUpdateHistory = $filter('filter')(result, { SectionKey: 'ADD_UPDATE_HISTORY' })[0];
        if (AddUpdateHistory != null) $scope.isAddUpdateHistoryEnable = true;

        $scope.isModifyUpdateHistoryEnable = false;
        var ModifyUpdateHistory = $filter('filter')(result, { SectionKey: 'MODIFY_UPDATE_HISTORY' })[0];
        if (ModifyUpdateHistory != null) $scope.isModifyUpdateHistoryEnable = true;

        $scope.isDeleteUpdateHistoryEnable = false;
        var DeleteUpdateHistory = $filter('filter')(result, { SectionKey: 'DELETE_UPDATE_HISTORY' })[0];
        if (DeleteUpdateHistory != null) $scope.isDeleteUpdateHistoryEnable = true;
    });
});
