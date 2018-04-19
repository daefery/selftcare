SelfCareContent.controller('BreadcrumbsController', function ($scope, breadcrumbs, SelfCareCommonService) {
    breadcrumbs.generateBreadcrumbs();
    $scope.breadcrumbs = breadcrumbs;
    $scope.isActiveDevice = SelfCareCommonService.SubscriptionListHeaderIcon();
})