CSRContent.controller('CustAccSecureSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 96;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

        // Intranet Button
        $scope.isUpdateStatusEnable = false;
        var oIntranetSecction = $filter('filter')(result, { SectionKey: 'CUSTACC_STATUS' })[0];
        if (oIntranetSecction != null) $scope.isUpdateStatusEnable = true;

    });
});