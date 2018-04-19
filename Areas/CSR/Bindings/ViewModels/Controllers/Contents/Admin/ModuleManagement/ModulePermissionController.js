CSRContent.controller('ModulePermissionController', function ($scope, $route, $location, CSRModulePermission) {
    var authData = JSON.parse(localStorage.AuthData);
    var uid = authData.uid;
    //redirectTo: Console.rootPath + 'CSR/Customer/App/NotFound';
    CSRModulePermission.get({ userId: uid }, function (data) {
        var moduleList = angular.fromJson(data);
        var b = false;
        for (var i = 0; i < moduleList.length; i++) {
            if ($location.path() == moduleList[i].ModulePath | $location.path() == '/'+moduleList[i].ModulePath) {
                b = true;
                break;
            }
        }
        if (!b) {
            $location.path(Console.rootPath + 'CSR/Customer/App/NotFound').replace();
        }
    });
});

CSRContent.controller('ModuleSecureSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 54;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        // Intranet Button
        $scope.isAddModuleEnable = false;
        var oIntranetSecction = $filter('filter')(result, { SectionKey: 'MODULE_ADD' })[0];
        if (oIntranetSecction != null) $scope.isAddModuleEnable = true;

        // Jira Link Button
        $scope.isModifyModuleEnable = false;
        var oJiraSection = $filter('filter')(result, { SectionKey: 'MODULE_MODIFY' })[0];
        if (oJiraSection != null) $scope.isModifyModuleEnable = true;

        // Confluence Link Button
        $scope.isMoveModuleEnable = false;
        var isConfluenceSection = $filter('filter')(result, { SectionKey: 'MODULE_MOVE' })[0];
        if (isConfluenceSection != null) $scope.isMoveModuleEnable = true;

        // Stock Link Button
        $scope.isAddSSEnable = false;
        var isStockSection = $filter('filter')(result, { SectionKey: 'SS_ADD' })[0];
        if (isStockSection != null) $scope.isAddSSEnable = true;

        $scope.isEditSSEnable = false;
        var isStockSection = $filter('filter')(result, { SectionKey: 'SS_EDIT' })[0];
        if (isStockSection != null) $scope.isEditSSEnable = true;

        $scope.isAssignMVNOEnable = false;
        var isStockSection = $filter('filter')(result, { SectionKey: 'MODULE_MVNO_ASSIGN' })[0];
        if (isStockSection != null) $scope.isAssignMVNOEnable = true;
    });
});
