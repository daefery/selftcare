CSRContent.controller('TTDashboardSectionController', function ($scope, $filter, CacheNavigationService) {
    var curModuleId = 37;
    CacheNavigationService.getSecureSection(curModuleId).then(function (result) {

    });
});