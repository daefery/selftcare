CSRContent.controller('ViewUserSecureSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 56;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        // Intranet Button
        $scope.isAddEnable = false;
        var oIntranetSecction = $filter('filter')(result, { SectionKey: 'USER_ADD' })[0];
        if (oIntranetSecction != null) $scope.isAddEnable = true;

        // Jira Link Button
        $scope.isDetailEnable = false;
        var oJiraSection = $filter('filter')(result, { SectionKey: 'USER_DETAIL' })[0];
        if (oJiraSection != null) $scope.isDetailEnable = true;

    });
});

CSRContent.controller('AddUserSecureSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 66;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

    });
});

CSRContent.controller('UserDetailSecureSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 65;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        // Intranet Button
        $scope.isEditEnable = false;
        var oIntranetSecction = $filter('filter')(result, { SectionKey: 'USER_EDIT' })[0];
        if (oIntranetSecction != null) $scope.isEditEnable = true;

        // Jira Link Button
        $scope.isEmailEnable = false;
        var oJiraSection = $filter('filter')(result, { SectionKey: 'USER_EMAIL' })[0];
        if (oJiraSection != null) $scope.isEmailEnable = true;

        // Confluence Link Button
        $scope.isRoleEnable = false;
        var isConfluenceSection = $filter('filter')(result, { SectionKey: 'USER_ROLE' })[0];
        if (isConfluenceSection != null) $scope.isRoleEnable = true;

        // Stock Link Button
        $scope.isDealerEnable = false;
        var isStockSection = $filter('filter')(result, { SectionKey: 'USER_DEALER' })[0];
        if (isStockSection != null) $scope.isDealerEnable = true;

        $scope.isDepartmentEnable = false;
        var isStockSection = $filter('filter')(result, { SectionKey: 'USER_DEPARTMENT' })[0];
        if (isStockSection != null) $scope.isDepartmentEnable = true;
    });
});