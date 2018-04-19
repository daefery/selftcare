//Created By Revani Bagus Amrulloh
//19 January 2016
//For customer activate, freeze, unfreeze and delete

CSRContent.controller('CustomerActionController', function ($scope, DetailCustomer, Notification, CustomerAction, $rootScope, CommonEnum) {
    //Hardcode
    var provisioningType = "Etna";
    //End Hardcode

    var deleteReason = CommonEnum.getDeleteCustomerReason();
    var freezeReason = CommonEnum.getFreezeCustomerReason();
    var unfreezeReason = CommonEnum.getUnfreezeCustomerReason();

    switch (provisioningType) {
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
    //$scope.ZipCodeFromUI = {};
    var submitFreezeUnfreezeDeleteObject = {};
    $scope.Activate = {};

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
        switch (subscriptionDetail.subscriptionStatus) {
            case 'UnAssigned':
                $scope.ButtonActionName = 'Not Available'; //should be changed
                action = -1; //default, should be changed
            case 'Deactive':
                $scope.ButtonActionName = 'Not Available'; //should be changed
                action = -1; //default, should be changed
            case 'Init':
                $scope.ButtonActionName = 'Activate';
                $scope.ZipCodeCollection = subscriptionDetail.zipCodeCollection;
                $scope.ESN = subscriptionDetail.iccidOrESN;
                action = 0;
                break;
            case 'Preactive':
                $scope.ButtonActionName = 'Not Available'; //should be changed
                action = -1; //default, should be changed
            case 'Inactive':
                $scope.ButtonActionName = 'Activate';
                $scope.ZipCodeCollection = subscriptionDetail.zipCodeCollection;
                $scope.ESN = subscriptionDetail.iccidOrESN;
                action = 0;
                break;
            case 'Active':
                $scope.ButtonActionName = 'Freeze';
                $scope.actionReasonEnum = freezeReason;
                action = 1;
                break;
            case 'Frozen':
                $scope.ButtonActionName = 'Unfreeze';
                $scope.actionReasonEnum = unfreezeReason;
                action = 2;
                break;
            default:
                $scope.ButtonActionName = 'NoAction';
                action = -1;
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

        switch (action) {
            case 0:
                //activateCustomer();
                break;
            case 1:
                submitFreezeUnfreezeDeleteObject = {
                    MobileNumber: subscriptionDetail.msisdn,
                };
                freezeSubscription();
                break;
            case 2:
                submitFreezeUnfreezeDeleteObject = {
                    MobileNumber: subscriptionDetail.msisdn,
                };
                unfreezeSubscription();
                break;
            case 3:
                submitFreezeUnfreezeDeleteObject = {
                    CustomerId: $scope.products.CustomerID,    //from Customer Detail
                };
                DeleteCustomer();
                break;
        }
    };

    var selectModal = function () {
        switch (action) {
            case 0:
                //modalFormActivate.modal('show');
                //$scope.ZipCodeFromUI.Input = '';
                $scope.openActivateModal();
                break;
            case 1:
                modalFormFreezeUnfreezeDelete.modal('show');
                break;
            case 2:
                modalFormFreezeUnfreezeDelete.modal('show');
                break;
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

    function NotificationSuccess(Message) {
        if (Message == null) {
            Message = "Success";
        }
        return Notification.success({
            message: '<span>' + Message + '</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 5000
        });
    };

    function NotificationError(errorMessage) {
        return Notification.error({
            message: '<span>' + errorMessage + '</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 5000
        });
    };

    var freezeSubscription = function () {
        submitFreezeUnfreezeDeleteObject.SuspendReason = $scope.Form.ActionReason.value;
        var ConnectionAPIFreezeSubscription = new CustomerAction.FreezeSubscription(submitFreezeUnfreezeDeleteObject);
        callAPI(ConnectionAPIFreezeSubscription);
    };

    var unfreezeSubscription = function () {
        submitFreezeUnfreezeDeleteObject.RestoreReason = $scope.Form.ActionReason.value;
        var ConnectionAPIUnfreezeSubscription = new CustomerAction.UnfreezeSubscription(submitFreezeUnfreezeDeleteObject);
        callAPI(ConnectionAPIUnfreezeSubscription);
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
                modalFormFreezeUnfreezeDelete.modal('hide');
                NotificationSuccess(result.Messages[0]);
                $rootScope.$broadcast('refresh-customerdashboard');
            };
            console.log(result);
        });
    }

    $scope.openActivateModal = function () {
        modalFormActivate.modal('show');
        $scope.ActivateForm.$setPristine();
        $scope.Activate.Zip_Code = null;
        $scope.Activate.ESN_Number_IMEI = null;
        $scope.Activate.ICCID = null;
        $scope.Activate.UseExistingMobileNumber = false;
        $scope.Activate.Mobile_Number = null;
        $scope.Activate.PIN_Number = null;
        $scope.Activate.isIMEI = true;
        $scope.Activate.isUseExistingMobileNumber = false;
        $scope.Activate.UseExistingMobileNumber_1 = false;
        $scope.Activate.ICCID = "x";    //because it is UI mandatory && its hidden
        $scope.Activate.Mobile_Number = "x";    //because it is UI mandatory && its hidden
        $scope.Activate.PIN_Number = "x";    //because it is UI mandatory && its hidden

        var submitActivateObject = {
            OrderNumber: subscriptionDetail.OrderNumber,
            SubscriptionIdentifier: subscriptionDetail.SubscriptionIdentifier
        }
        $scope.Activate.OrderNumber = submitActivateObject.OrderNumber;
        $scope.Activate.UniqueIdentifier = submitActivateObject.SubscriptionIdentifier;
    };
    $scope.$watch('Activate.ESN_Number_IMEI', function () {
        if ($scope.Activate != undefined) {
            if ($scope.Activate.ESN_Number_IMEI != undefined
                && $scope.Activate.ESN_Number_IMEI.length > 12) {
                $scope.Activate.isIMEI = false;
                $scope.Activate.ICCID = "";
            } else {
                $scope.Activate.isIMEI = true;
                $scope.Activate.ICCID = "x";    //because it is UI mandatory
            }
        }
    })

    $scope.$watch('Activate.UseExistingMobileNumber_1', function () {
        if ($scope.Activate != undefined) {
            if ($scope.Activate.UseExistingMobileNumber_1 != undefined
                && $scope.Activate.UseExistingMobileNumber_1 == true) {
                $scope.Activate.isUseExistingMobileNumber = true;
                $scope.Activate.Mobile_Number = "";
                $scope.Activate.PIN_Number = "";
            } else {
                $scope.Activate.isUseExistingMobileNumber = false;
                $scope.Activate.Mobile_Number = "x";    //because it is UI mandatory
                $scope.Activate.PIN_Number = "x";    //because it is UI mandatory
            }
        }
    })

    $scope.SubmitActivate = function (Activate) {

        var valid = false;

        var zipCodeValidation = angular.copy(/^[0-9]+$/.test(Activate.Zip_Code));
        if (zipCodeValidation == true) {
            valid = true;
        } else {
            valid = false;
            var errorMessage = 'Zip code is mandatory and must be numeric';
            NotificationError(errorMessage);
        }

        if (valid) {
            var submitActivate = {};

            if (Activate.ESN_Number_IMEI.length > 12) {
                submitActivate = {
                    "OrderNumber": Activate.OrderNumber,
                    "UniqueIdentifier": Activate.UniqueIdentifier,
                    "MarketInfo": "website",
                    "ProvisioningType": config.TemplateCode,
                    "ZipCode": Activate.Zip_Code,
                    "Sim": Activate.ESN_Number_IMEI,
                    "IccId": Activate.ICCID
                }
            } else {
                submitActivate = {
                    "OrderNumber": Activate.OrderNumber,
                    "UniqueIdentifier": Activate.UniqueIdentifier,
                    "MarketInfo": "website",
                    "ProvisioningType": config.TemplateCode,
                    "ZipCode": Activate.Zip_Code,
                    "Esn": Activate.ESN_Number_IMEI
                }
            }

            if (Activate.isUseExistingMobileNumber == true) {
                submitActivate.PortInMobileNumber = Activate.Mobile_Number;
                submitActivate.PasswordPin = Activate.PIN_Number;
            }

            var ConnectionAPIActivateCustomer = new CustomerAction.ActivateCustomer(submitActivate);
            callAPI(ConnectionAPIActivateCustomer);
        }
    }

    $scope.ActivateDatas = {

        field: [
            {
                type: "text",
                name: "Zip_Code",
                size: 6,
                text: "Zip_Code",
                model: "Activate.Zip_Code",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "ESN_Number_IMEI",
                size: 6,
                text: "ESN_Number_IMEI",
                model: "Activate.ESN_Number_IMEI",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "ICCID",
                size: 6,
                text: "ICCID",
                model: "Activate.ICCID",
                nghide: "Activate.isIMEI",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "checkbox",
                name: "UseExistingMobileNumberCheckBox",
                size: 6,
                text: "UseExistingMobileNumber",
                model: "Activate.UseExistingMobileNumber",
                required: false,
                style: "horizontal",
                content: [{ text: "UseExistingMobileNumber", value: "true" }],
                validation: false
            },
            {
                type: "text",
                name: "Mobile_Number",
                size: 6,
                text: "Mobile_Number",
                model: "Activate.Mobile_Number",
                nghide: "!Activate.isUseExistingMobileNumber",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "PIN_Number",
                size: 6,
                text: "PIN_Number",
                model: "Activate.PIN_Number",
                nghide: "!Activate.isUseExistingMobileNumber",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
        ],
        button: [
            {
                name: "btnSubmitActivate",
                type: "submit",
                text: "Submit",
                click: "SubmitActivate(Activate)"
            },
            {
                name: "btnCancelActivate",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    };

})

CSRContent.controller('SuspendCustomerController', function ($scope, DetailCustomer, Notification, CustomerAction, $rootScope, CommonEnum) {

    $scope.Suspend = {};
    $scope.SuspendReasonEnum = [];
    $scope.SuspendButtonName = "NoAction";
    $scope.SuspendAction = -1;
    $scope.submitSuspendCustomerObject = {};
    $scope.SuspendReasonText = "";

    $scope.SuspendCustomerDatas = {
        field: [
            {
                type: "select",
                name: "SuspendReasons",
                size: 12,
                text: "SuspendReasonText",
                model: "Suspend.ActionReason",
                value: "SuspendReasonEnum",
                required: true,
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                name: "SubmitSuspendAction",
                type: "submit",
                text: "Submit",
                click: "SubmitSuspendCustomer()"
            },
            {
                name: "CancelSuspendAction",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    };

    $scope.load_SuspendForm = function () {
        if ($scope.products.Status == 2) {  //Active
            $scope.SuspendAction = 0;
        } else if ($scope.products.Status == 6) {  //Frozen
            $scope.SuspendAction = 1;
        } else {
            $scope.SuspendAction = -1;
        }

        if ($scope.SuspendAction == 0) {
            $scope.SuspendReasonEnum = CommonEnum.getFreezeCustomerReason();
            $scope.SuspendButtonName = 'Suspend';
            $scope.SuspendReasonText = 'SuspendReason';
            $scope.submitSuspendCustomerObject.SuspendReason = $scope.Suspend.ActionReason;
        } else if ($scope.SuspendAction == 1) {
            $scope.SuspendReasonEnum = CommonEnum.getUnfreezeCustomerReason();
            $scope.SuspendButtonName = 'Restore';
            $scope.SuspendReasonText = 'RestoreReason';
            $scope.submitSuspendCustomerObject.RestoreReason = $scope.Suspend.ActionReason;
        } else {
            $scope.SuspendReasonEnum = [];
            $scope.SuspendButtonName = 'NoAction';
            $scope.submitSuspendCustomerObject = {};
        }
    }

    $scope.$watch('products', function (newValue, oldValue) {
        if ($scope.products != undefined) {
            if (newValue != oldValue) {
                $scope.load_SuspendForm();
            }
        }
    })

    $scope.ShowModalSuspendCustomer = function () {
        if ($scope.SuspendAction != -1) {
            $scope.SuspendCustomerForm.$setPristine();

            if ($scope.products != undefined) {
                angular.element('#SuspendCustomerActionModal').modal('show');
                $scope.load_SuspendForm();
                $scope.submitSuspendCustomerObject.CustomerId = $scope.products.CustomerID; //from Customer Detail
            } else {
                NotificationError('CustomerID for ' + $scope.SuspendButtonName + ' not Found!');
            }
        } else {
            NotificationError('No Action Available');
        }
    };

    $scope.SubmitSuspendCustomer = function () {
        if ($scope.submitSuspendCustomerObject != null) {

            if ($scope.SuspendAction == 0) {
                $scope.submitSuspendCustomerObject.SuspendReason = $scope.Suspend.ActionReason.value;
                var ConnectionAPI = new CustomerAction.SuspendCustomer($scope.submitSuspendCustomerObject);
                callAPI(ConnectionAPI);

            } else if ($scope.SuspendAction == 1) {
                $scope.submitSuspendCustomerObject.RestoreReason = $scope.Suspend.ActionReason.value;
                var ConnectionAPI = new CustomerAction.RestoreCustomer($scope.submitSuspendCustomerObject);
                callAPI(ConnectionAPI);
            }

        } else {
            NotificationError($scope.SuspendButtonName);
        }
    };

    var callAPI = function (ConnectionAPI) {
        ConnectionAPI.$save(function (result) {
            if (result.ResultCode !== 0 || result.ResultType !== 0) {
                NotificationError(result.Messages[0]);
            }
            else {
                angular.element('#SuspendCustomerActionModal').modal('hide');
                NotificationSuccess(result.Messages[0]);
                $rootScope.$broadcast('refresh-customerDetail');
            };
            console.log(result);
        });
    }

    function NotificationSuccess(Message) {
        if (Message == null) {
            Message = "Success";
        }
        return Notification.success({
            message: '<span>' + Message + '</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 5000
        });
    };

    function NotificationError(errorMessage) {
        return Notification.error({
            message: '<span>' + errorMessage + '</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 5000
        });
    };


})

CSRContent.controller('DeactivateSubscriptionController', function ($scope, DetailCustomer, Notification, CustomerAction, $rootScope, CommonEnum) {

    $scope.Deactivate = {};
    $scope.DeactivateReasonEnum = [];
    $scope.DeactivateButtonName = "Deactivate";
    $scope.submitDeactivateSubscriptionObject = {};
    $scope.DeactivateReasonText = "";

    $scope.subscriptionDetail_forDeactivateSubscription = {};
    $scope.$on('setSubscriptionInformationObject', function (event, args) {
        $scope.subscriptionDetail_forDeactivateSubscription = DetailCustomer.getSubscriptionInformation();
    });

    $scope.DeactivateSubscriptionDatas = {
        field: [
            {
                type: "select",
                name: "DeactivateReasons",
                size: 12,
                text: "DeactivateReasonText",
                model: "Deactivate.ActionReason",
                value: "DeactivateReasonEnum",
                required: true,
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                name: "SubmitDeactivateAction",
                type: "submit",
                text: "Submit",
                click: "SubmitDeactivateSubscription()"
            },
            {
                name: "CancelDeactivateSubscriptionAction",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    };

    $scope.load_DeactivateForm = function () {

        $scope.DeactivateReasonEnum = CommonEnum.getDeleteCustomerReason();
        $scope.DeactivateButtonName = 'Deactivate';
        $scope.DeactivateReasonText = 'DeactivateReason';

    }

    $scope.ShowModalDeactivateSubscription = function () {
        $scope.DeactivateForm.$setPristine();

        if ($scope.subscriptionDetail_forDeactivateSubscription.msisdn == undefined || $scope.subscriptionDetail_forDeactivateSubscription.msisdn == null || $scope.subscriptionDetail_forDeactivateSubscription.msisdn == '') {
            NotificationError('Mobile Number for Deactivate not Found!');
        } else {
            angular.element('#DeactivateSubscriptionActionModal').modal('show');
            $scope.load_DeactivateForm();
            $scope.submitDeactivateSubscriptionObject.MobileNumber = $scope.subscriptionDetail_forDeactivateSubscription.msisdn;
        }

    };

    $scope.SubmitDeactivateSubscription = function () {
        if ($scope.submitDeactivateSubscriptionObject != null) {

            $scope.submitDeactivateSubscriptionObject.DeactivateReason = $scope.Deactivate.ActionReason.value;

            var ConnectionAPI = new CustomerAction.DeleteSubscription($scope.submitDeactivateSubscriptionObject);
            callAPI(ConnectionAPI);
        } else {
            NotificationError($scope.DeactivateButtonName);
        }
    };

    var callAPI = function (ConnectionAPI) {
        ConnectionAPI.$save(function (result) {
            if (result.ResultCode !== 0 || result.ResultType !== 0) {
                NotificationError(result.Messages[0]);
            }
            else {
                angular.element('#DeactivateSubscriptionActionModal').modal('hide');
                NotificationSuccess(result.Messages[0]);
                $rootScope.$broadcast('refresh-customerDetail');
            };
            console.log(result);
        });
    }

    function NotificationSuccess(Message) {
        if (Message == null) {
            Message = "Success";
        }
        return Notification.success({
            message: '<span>' + Message + '</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 5000
        });
    };

    function NotificationError(errorMessage) {
        return Notification.error({
            message: '<span>' + errorMessage + '</span>',
            positionY: 'top',
            positionX: 'center',
            delay: 5000
        });
    };


})