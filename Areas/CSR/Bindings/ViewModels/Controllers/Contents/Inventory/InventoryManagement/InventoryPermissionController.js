CSRContent.controller('InventorySecureSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 81;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        // Intranet Button
        $scope.isModifyProductEnable = false;
        var oIntranetSecction = $filter('filter')(result, { SectionKey: 'INVENTORY_PRODUCT_MODIFY' })[0];
        if (oIntranetSecction != null) $scope.isModifyProductEnable = true;

    });
});