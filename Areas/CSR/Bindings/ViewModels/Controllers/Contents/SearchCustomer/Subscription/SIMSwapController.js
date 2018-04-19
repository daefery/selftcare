CSRContent.controller("SIMSwapController", function ($scope, Notification, ErrorHandlerUtility, LocalStorageProvider,
    SubscriptionService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();
    $scope.TemplateCode = LocalStorageProvider.getTemplateCode();

    $scope.SubmitSIMSwap = function (SIMSwap) {
        var param = {
            MobileNumber: SIMSwap.MSISDN,
            IccId: SIMSwap.New_ICCID,
            IMEI: SIMSwap.New_IMEI,
            Reason: SIMSwap.Reason,
        }
        var valid = false;
        if (SIMSwap.Current_ICCID == 'N/A') {

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
            SubscriptionService.SwapSimCard.save(param, function (response) {
                console.log('SwapSimCard', response);
                if (ErrorHandlerUtility.IsResultTypeOK(response)) {
                    var msg = ErrorHandlerUtility.GetErrorMessage(response);
                    var msg = 'Number Swap succeed';
                    Notification.error({
                        message: '<span>' + msg + '</span>',
                        positionY: 'top',
                        positionX: 'center',
                        delay: 4000,
                        title: "<span ><h4 style='color: white;'>Success</h4></span>"
                    });
                    angular.element('#SIMSwapModal').modal('hide');

                    $scope.SIMSwap.New_ICCID = null;
                    $scope.SIMSwap.New_IMEI = null;
                    $scope.SIMSwap.Reason = null;
                    
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
    $scope.SIMSwapDatas = {

        field: [
            {
                type: "label",
                name: "Current_ICCID",
                size: 6,
                text: "Current_ICCID",
                model: "SIMSwap.Current_ICCID",
                required: true,
                maxlength: 50,
                //validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "New_ICCID",
                size: 6,
                text: "New_ICCID",
                model: "SIMSwap.New_ICCID",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "New_IMEI",
                size: 6,
                text: "New_IMEI",
                model: "SIMSwap.New_IMEI",
                //required: true,   //not required on backend
                maxlength: 50,
                //validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "textarea",
                name: "Reason",
                size: 6,
                text: "Reason_Optional",
                model: "SIMSwap.Reason",
                maxlength: 50,
                //validation: [{ value: "maxlength" }]
            },
        ],
        button: [
            {
                name: "btnSubmitSIMSwap",
                type: "submit",
                text: "Submit",
                click: "SubmitSIMSwap(SIMSwap)"
            },
            {
                name: "btnCancelSIMSwap",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    };

});