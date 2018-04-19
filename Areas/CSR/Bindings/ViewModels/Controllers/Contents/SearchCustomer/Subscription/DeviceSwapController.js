CSRContent.controller("DeviceSwapController", function ($scope, Notification, ErrorHandlerUtility, LocalStorageProvider,
    SubscriptionService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();
    $scope.TemplateCode = LocalStorageProvider.getTemplateCode();

    $scope.SubmitDeviceSwap = function (DeviceSwap) {
        var param = {
            MSISDN: DeviceSwap.MSISDN,
            NewEsn: DeviceSwap.New_ESN,
            NewImei: null,
            NewIccId: null,
            Reason: DeviceSwap.Reason,
        }

        var valid = false;
        if (DeviceSwap.Current_ESN == 'N/A') {

            var msg = 'Current ESN Not Available';
            Notification.error({
                message: '<span>' + msg + '</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 4000
            });
            valid = false;
        } else {
            valid = true;
        }

        if (valid) {
            SubscriptionService.SwapESN.save(param, function (response) {
                console.log('SwapESN', response);
                if (ErrorHandlerUtility.IsResultTypeOK(response)) {
                    var msg = ErrorHandlerUtility.GetErrorMessage(response);
                    var msg = 'Device Swap succeed';
                    Notification.error({
                        message: '<span>' + msg + '</span>',
                        positionY: 'top',
                        positionX: 'center',
                        delay: 4000,
                        title: "<span ><h4 style='color: white;'>Success</h4></span>"
                    });
                    angular.element('#DeviceSwapModal').modal('hide');

                    $scope.DeviceSwap.New_ESN = null;
                    $scope.DeviceSwap.Reason = null;

                } else {
                    var msg = ErrorHandlerUtility.GetErrorMessage(response);
                    Notification.error({
                        message: '<span>' + msg + '</span>',
                        positionY: 'top',
                        positionX: 'center',
                        delay: 4000,
                        title: "<span ><h4 style='color: white;'>Failed</h4></span>"
                    });
                }
            })
        }
    }
    $scope.DeviceSwapDatas = {

        field: [
            {
                type: "label",
                name: "Current_ESN",
                size: 6,
                text: "Current_ESN",
                model: "DeviceSwap.Current_ESN",
                required: true,
                maxlength: 50,
                //validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "New_ESN",
                size: 6,
                text: "New_ESN",
                model: "DeviceSwap.New_ESN",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "textarea",
                name: "Reason",
                size: 6,
                text: "Reason_Optional",
                model: "DeviceSwap.Reason",
                maxlength: 50,
                //validation: [{ value: "maxlength" }]
            },
        ],
        button: [
            {
                name: "btnSubmitDeviceSwap",
                type: "submit",
                text: "Submit",
                click: "SubmitDeviceSwap(DeviceSwap)"
            },
            {
                name: "btnCancelDeviceSwap",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    };
});