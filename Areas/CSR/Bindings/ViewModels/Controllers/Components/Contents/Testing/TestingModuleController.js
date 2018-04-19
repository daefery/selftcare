CSRContent.controller("TestingController", function ($scope, $location, breadcrumbs, CSRSecureSection) {
    //IsOverContentEnabled
    //isInventoryShowTableEnabled
    //isUserMShowTableEnabled
    CSRSecureSection.get({ ModuleId: 28 }, function (result) {
        //check for Billing Info & Invoices secure section
        $scope.IsOverContentEnabled = false;
        var objectBilling = $filter('filter')(result, { SectionKey: 'Testing_Overview_SS' })[0];
        if (objectBilling != null) $scope.IsOverContentEnabled = true;
    });
    CSRSecureSection.get({ ModuleId: 29 }, function (result) {
        //check for Billing Info & Invoices secure section
        $scope.isInventoryShowTableEnabled = false;
        var objectBilling = $filter('filter')(result, { SectionKey: 'Testing_Inventory_SS' })[0];
        if (objectBilling != null) $scope.isInventoryShowTableEnabled = true;
    });
    CSRSecureSection.get({ ModuleId: 29 }, function (result) {
        //check for Billing Info & Invoices secure section
        $scope.isUserMShowTableEnabled = false;
        var objectBilling = $filter('filter')(result, { SectionKey: 'Testing_UserM_SS' })[0];
        if (objectBilling != null) $scope.isUserMShowTableEnabled = true;
    });
});