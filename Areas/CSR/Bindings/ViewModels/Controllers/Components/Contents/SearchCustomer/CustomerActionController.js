//Created By Revani Bagus Amrulloh
//19 January 2016
//For customer activate, freeze, unfreeze and delete

CSRContent.controller('CustomerActionController', function ($scope, DetailCustomer, Notification, CustomerAction, $rootScope, CommonEnum) {
    //Hardcode
    var provisioningType = "Etna";
    //End Hardcode

   var deleteReason = CommonEnum.getDeleteCustomerReason();

    switch(provisioningType){
        case "Etna":
            $scope.ESNorICCIDtext = 'ESN'
            break;
        case "Lowi":
            $scope.ESNorICCIDtext = 'ICCID'
            break;
    };

    var subscriptionDetail,
        modalFormFreezeUnfreezeDelete = angular.element('#CustomerActionFreezeUnfreezeDelete'),
        modalFormActivate = angular.element('#CustomerActionActivate'),
        action;
    $scope.Form = {};
    $scope.ZipCodeFromUI = {};
    var submitFreezeUnfreezeDeleteObject = {};

    $scope.ActionReasonForm1 = {
        field: [
            {
                type: "select",
                name: "actionReason",
                size: 12,
                text: "ActionReason",
                model: "Form.ActionReason",
                value: "actionReasonEnum",
                required: true,
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                name: "SubmitActionReason",
                type: "submit",
                text: "Submit",
                click: "Action()"
            },
            {
                name: "CancelActionReason",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    };

    var setAction = function () {
        switch (subscriptionDetail.customerStatus) {
            case 'UnAssigned':
            case 'Deactive':
            case 'Init':
            case 'Preactive':
            case 'Inactive':
                $scope.ButtonActionName = 'Activate';
                $scope.ZipCodeCollection = subscriptionDetail.zipCodeCollection;
                $scope.ESN = subscriptionDetail.iccidOrESN;
                action = 0;
                break;
            case 'Active':
                $scope.ButtonActionName = 'Freeze';
                action = 1;
                break;
            case 'Frozen':
                $scope.ButtonActionName = 'Unfreeze';
                action = 2;
                break;
        }
    }

    subscriptionDetail = DetailCustomer.getSubscriptionInformation();
    if (typeof subscriptionDetail === 'undefined') {
        $scope.ButtonActionName = 'Action';
    } else {
        setAction();
    }

    $scope.$on('setSubscriptionInformationObject', function (event, args) {
        subscriptionDetail = DetailCustomer.getSubscriptionInformation();
        setAction();
    });

    $scope.Action = function () {
        submitFreezeUnfreezeDeleteObject = {
            CustomerId : $scope.products.CustomerID,
            ProvisioningType: provisioningType
        };
        switch (action) {
            case 0:
                activateCustomer();
                break;
            case 1:
                freezeCustomer();
                break;
            case 2:
                unfreezeCustomer();
                break;
            case 3:
                DeleteCustomer();
                break;
        }
    };

    var selectModal = function () {
        switch (action) {
            case 0:
                modalFormActivate.modal('show');
                $scope.ZipCodeFromUI.Input = '';
                break;
            case 1:
            case 2:
            case 3:
                modalFormFreezeUnfreezeDelete.modal('show');
                break;
            default:
                NotificationError('Action is not defined')
        }
    }

    $scope.ShowModalCustomerAction = function () {
        selectModal();
    };

    $scope.ShowModalDeleteCustomer = function () {
        $scope.actionReasonEnum = deleteReason;
        subscriptionDetail = DetailCustomer.getSubscriptionInformation();
        $scope.ButtonActionName = 'Delete';
        action = 3;
        selectModal();
    };

    function NotificationError(errorMessage) {
        return Notification.error({
            message: '<span>' + errorMessage + '</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 5000
        });
    };

    $scope.selectedZipCode = function (zipCode) {
        zipzipzap = zipCode;
        $scope.ZipCodeFromUI.Input = angular.copy(zipCode);
        $scope.ZipCodeFromUI.Selected = ''
    }

    var activateCustomer = function () {
        var zipCodeValidation = angular.copy(/^[0-9]+$/.test($scope.ZipCodeFromUI.Input));
        if (zipCodeValidation == true) {
            var submitActivate = {
                ProvisioningType: provisioningType,
                ESN: subscriptionDetail.iccidOrESN,
                ZipCode: $scope.ZipCodeFromUI.Input,
            };
            var ConnectionAPIActivateCustomer = new CustomerAction.ActivateCustomer(submitActivate);
            callAPI(ConnectionAPIActivateCustomer);
        } else {
            NotificationError('Zip code is mandatory and must be numeric');
        }
    };

    var freezeCustomer = function () {
        submitFreezeUnfreezeDeleteObject.SuspendReason = $scope.Form.ActionReason;
        var ConnectionAPIFreezeCustomer = new CustomerAction.FreezeCustomer(submitFreezeUnfreezeDeleteObject);
        callAPI(ConnectionAPIFreezeCustomer);
    };

    var unfreezeCustomer = function () {
        submitFreezeUnfreezeDeleteObject.RestoreReason = $scope.Form.ActionReason;
        var ConnectionAPIUnfreezeCustomer = new CustomerAction.UnfreezeCustomer(submitFreezeUnfreezeDeleteObject);
        callAPI(ConnectionAPIUnfreezeCustomer);
    };

    var DeleteCustomer = function () {
        submitFreezeUnfreezeDeleteObject.DeactiveCustomerReason = $scope.Form.ActionReason.value;
        var ConnectionAPIDeleteComment = new CustomerAction.DeleteCustomer(submitFreezeUnfreezeDeleteObject);
        callAPI(ConnectionAPIDeleteComment);
    };

    var callAPI = function (ConnectionAPI) {
        ConnectionAPI.$save(function (result) {
            if (result.ResultCode !== 0 || result.ResultType !== 0) {
                NotificationError(result.Messages[0]);
            }
            else {
                modalFormActivate.modal('hide');
                $rootScope.$broadcast('refresh-customerdashboard');
            };
            console.log(result);
        });
    }

    $scope.CloseModalActivate = function () {
        modalFormActivate.modal('hide');
    }

})