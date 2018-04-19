CSRContent.controller("ConfigurationDetailController", function ($scope, Notification, ErrorHandlerUtility, LocalStorageProvider,
    SubscriptionService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();
    $scope.TemplateCode = LocalStorageProvider.getTemplateCode();

    $scope.ConfigurationDetail.openConfigurationDetailModal = function (ConfigurationDetail) {
        angular.element('#ConfigurationDetailModal').modal('show');
    }

    $scope.ConfigurationDetailDatas = {

        field: [
            {
                type: "label",
                name: "NotAvailable",
                size: 6,
                text: "NotAvailable",
                model: "selectedMultiSubscription.NotAvailable",
                required: true,
                maxlength: 50,
                //validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
        ],
        button: [
            {
                name: "btnSubmitConfigurationDetail",
                type: "submit",
                text: "Submit",
                click: "SubmitConfigurationDetail(ConfigurationDetail)"
            },
            {
                name: "btnCancelConfigurationDetail",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    };

});