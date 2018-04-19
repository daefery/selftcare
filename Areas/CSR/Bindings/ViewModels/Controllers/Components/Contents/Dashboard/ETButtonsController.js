CSRContent.controller('ETButtonsController', function ($scope, $filter, CSRSecureSection) {
    CSRSecureSection.get({ ModuleId: 2 }, function (result) {

        // Intranet Button
        $scope.isIntranetEnable = false;
        var oIntranetSecction = $filter('filter')(result, { SectionKey: 'CSR_HOME_INTRANET' })[0];
        if (oIntranetSecction != null) $scope.isIntranetEnable = true;

        // Jira Link Button
        $scope.isJiraEnable = false;
        var oJiraSection = $filter('filter')(result, { SectionKey: 'CSR_HOME_JIRA' })[0];
        if (oJiraSection != null) $scope.isJiraEnable = true;

        // Confluence Link Button
        $scope.isConfluenceEnable = false;
        var isConfluenceSection = $filter('filter')(result, { SectionKey: 'CSR_HOME_CONFLUENCE' })[0];
        if (isConfluenceSection != null) $scope.isConfluenceEnable = true;

        // Stock Link Button
        $scope.isStockEnable = false;
        var isStockSection = $filter('filter')(result, { SectionKey: 'CSR_HOME_STOCK' })[0];
        if (isStockSection != null) $scope.isStockEnable = true;
    });
});