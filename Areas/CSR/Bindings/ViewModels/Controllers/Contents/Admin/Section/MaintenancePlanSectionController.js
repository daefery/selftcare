CSRContent.controller('MaintenancePlanSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 115;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        $scope.isAddMaintenancePlanEnable = false;
        var AddMaintenanceManagement = $filter('filter')(result, { SectionKey: 'ADD_MAINTENANCE_MANAGEMENT' })[0];
        if (AddMaintenanceManagement != null) $scope.isAddMaintenancePlanEnable = true;

        $scope.isModifyMaintenanceManagementEnable = false;
        var ModifyMaintenanceManagement = $filter('filter')(result, { SectionKey: 'MODIFY_MAINTENANCE_MANAGEMENT' })[0];
        if (ModifyMaintenanceManagement != null) $scope.isModifyMaintenanceManagementEnable = true;

        $scope.isDeleteMaintenanceManagementEnable = false;
        var DeleteMaintenanceManagement = $filter('filter')(result, { SectionKey: 'DELETE_MAINTENANCE_MANAGEMENT' })[0];
        if (DeleteMaintenanceManagement != null) $scope.isDeleteMaintenanceManagementEnable = true;
    });
});
