CSRContent.controller("SelectNumberController", function ($scope, Notification, ErrorHandlerUtility, LocalStorageProvider,
    SubscriptionService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();
    $scope.TemplateCode = LocalStorageProvider.getTemplateCode();

    $scope.CancelSelectNumber = function () {
        angular.element('#SelectNumberModal').modal('hide');
        angular.element('#NumberSwapModal').modal('show');
    }
    $scope.SubmitSelectNumber = function (SelectNumber) {
        $scope.NumberSwap.New_Number = SelectNumber.Available_Number;
        angular.element('#SelectNumberModal').modal('hide');
        angular.element('#NumberSwapModal').modal('show');
    }

    $scope.Number_Categories = [
        { name: 'Category 1', value: 1 },
        { name: 'Category 2', value: 2 },
    ]

    $scope.ListAvailableNumber = [
        { text: '3472667849', value: 3472667849 },
        { text: '3472667849', value: 3472667849 },
    ]

    $scope.SelectNumberDatas = {

        field: [
            {
                type: "select",
                name: "Number_Category",
                size: 6,
                text: "Number_Category",
                model: "SelectNumber.Number_Category",
                value: "Number_Categories",
                required: true,
                maxlength: 50,
                //validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "radio",
                name: "Available_Number",
                size: 6,
                text: "Available_Number",
                model: "SelectNumber.Available_Number",
                required: true,
                style: "vertical",
                content: [{ text: "3472667849", value: 3472667849 }, { text: "123", value: 123 }],
                validation: [{ value: "mandatory" }]
            },
        ],
        button: [
            {
                name: "btnSubmitSelectNumber",
                type: "submit",
                text: "Submit",
                click: "SubmitSelectNumber(SelectNumber)"
            },
            {
                name: "btnCancelSelectNumber",
                type: "custom",
                text: "Cancel",
                item: "<a type=\"button\" " +
                                    "id=\"" + 'btnCancelSelectNumber' + "_btn_" + 'Cancel' + "\" " +
                                    "class=\"btn btn-danger\" " +
                                    "ng-click=\"" + 'CancelSelectNumber()' + "\" " +
                                    "ng-bind=\"lang." + 'Cancel' + "\">" + 'Cancel' +
                                    "</a>"
            }
        ]
    };

});