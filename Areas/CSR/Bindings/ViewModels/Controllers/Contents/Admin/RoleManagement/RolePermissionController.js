CSRContent.controller('AddRoleSecureSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 55;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        // Jira Link Button
        $scope.isAddRoleEnable = false;
        var oJiraSection = $filter('filter')(result, { SectionKey: 'ROLE_ADD' })[0];
        if (oJiraSection != null) $scope.isAddRoleEnable = true;

        // Confluence Link Button
        $scope.isModifyRoleEnable = false;
        var isConfluenceSection = $filter('filter')(result, { SectionKey: 'ROLE_MODIFY' })[0];
        if (isConfluenceSection != null) $scope.isModifyRoleEnable = true;

    });
});

CSRContent.controller('AssignSStoRoleSecureSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 55;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        // Stock Link Button
        $scope.isAssignSEnable = false;
        var isStockSection = $filter('filter')(result, { SectionKey: 'ROLE_SS_ASSIGN' })[0];
        if (isStockSection != null) $scope.isAssignSEnable = true;

    });
});