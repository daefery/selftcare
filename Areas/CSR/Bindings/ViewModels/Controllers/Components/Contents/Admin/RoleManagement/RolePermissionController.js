CSRContent.controller('RoleSecureSectionController', function ($scope, $filter, CSRSecureSection) {
    CSRSecureSection.get({ ModuleId: 55 }, function (result) {

        // Intranet Button
        $scope.isSearchEnable = false;
        var oIntranetSecction = $filter('filter')(result, { SectionKey: 'ROLE_SEARCH' })[0];
        if (oIntranetSecction != null) $scope.isSearchEnable = true;

        // Jira Link Button
        $scope.isAddRoleEnable = false;
        var oJiraSection = $filter('filter')(result, { SectionKey: 'ROLE_ADD' })[0];
        if (oJiraSection != null) $scope.isAddRoleEnable = true;

        // Confluence Link Button
        $scope.isModifyRoleEnable = false;
        var isConfluenceSection = $filter('filter')(result, { SectionKey: 'ROLE_MODIFY' })[0];
        if (isConfluenceSection != null) $scope.isModifyRoleEnable = true;

        // Stock Link Button
        $scope.isAssignSEnable = false;
        var isStockSection = $filter('filter')(result, { SectionKey: 'ROLE_SS_ASSIGN' })[0];
        if (isStockSection != null) $scope.isAssignSEnable = true;

    });
});