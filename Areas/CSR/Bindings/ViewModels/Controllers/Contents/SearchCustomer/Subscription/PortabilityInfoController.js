CSRContent.controller("PortabilityInfoController", function ($scope, Notification, ErrorHandlerUtility, LocalStorageProvider,
    SubscriptionService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();
    $scope.TemplateCode = LocalStorageProvider.getTemplateCode();

    $scope.ListPortabilityInfo = {};
});