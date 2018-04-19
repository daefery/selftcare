CSRContent.controller("TestingController", function ($scope, $location, breadcrumbs, CacheNavigationService) {
    //IsOverContentEnabled
    //isInventoryShowTableEnabled
    //isUserMShowTableEnabled
    var curModuleId = 28;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {
        //check for Billing Info & Invoices secure section
        $scope.IsOverContentEnabled = false;
        var objectBilling = $filter('filter')(result, { SectionKey: 'Testing_Overview_SS' })[0];
        if (objectBilling != null) $scope.IsOverContentEnabled = true;
    });
    var curModuleId = 29;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {
        //check for Billing Info & Invoices secure section
        $scope.isInventoryShowTableEnabled = false;
        var objectBilling = $filter('filter')(result, { SectionKey: 'Testing_Inventory_SS' })[0];
        if (objectBilling != null) $scope.isInventoryShowTableEnabled = true;
    });
    var curModuleId = 29;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {
        //check for Billing Info & Invoices secure section
        $scope.isUserMShowTableEnabled = false;
        var objectBilling = $filter('filter')(result, { SectionKey: 'Testing_UserM_SS' })[0];
        if (objectBilling != null) $scope.isUserMShowTableEnabled = true;
    });
});