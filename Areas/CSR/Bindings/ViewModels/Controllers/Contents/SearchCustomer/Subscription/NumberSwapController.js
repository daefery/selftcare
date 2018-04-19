CSRContent.controller("NumberSwapController", function ($scope, Notification, ErrorHandlerUtility, LocalStorageProvider,
    SubscriptionService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();
    $scope.TemplateCode = LocalStorageProvider.getTemplateCode();

    $scope.ShowSelectNumber = function () {
        angular.element('#NumberSwapModal').modal('hide');
        angular.element('#SelectNumberModal').modal('show');
    }

    $scope.SubmitNumberSwap = function (NumberSwap) {
        var param = {
            MSISDN: NumberSwap.MSISDN,
            NewCsa: null,
            NewZipCode: NumberSwap.New_ZipCode,
            Reason: NumberSwap.Reason,
        }
        var valid = false;
        if (NumberSwap.New_Number == undefined || NumberSwap.New_Number == null) {
            var msg = 'New Number not selected';
            Notification.error({
                message: '<span>' + msg + '</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 4000
            });
            valid = false;
            valid = true; //skip
        } else {
            valid = true;
        }

        if (valid) {
            SubscriptionService.SwapMDN.save(param, function (response) {
                console.log('SWAPMDN', response);
                if (ErrorHandlerUtility.IsResultTypeOK(response)) {
                    var msg = ErrorHandlerUtility.GetErrorMessage(response); //Completed
                    var msg = 'Number Swap succeed';
                    Notification.error({
                        message: '<span>' + msg + '</span>',
                        positionY: 'top',
                        positionX: 'center',
                        delay: 4000,
                        title: "<span ><h4 style='color: white;'>Success</h4></span>"
                    });
                    angular.element('#NumberSwapModal').modal('hide');

                    $scope.NumberSwap.New_Number = null;
                    $scope.NumberSwap.New_ZipCode = null;
                    $scope.NumberSwap.Reason = null;

                    var NewMSISDN = response.MSISDN;    //change!! -- blind development
                    //$scope.load_SubscriptionDashboard(NewMSISDN);
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

    if ($scope.TemplateCode == "etna") {
        $scope.NumberSwapDatas = {

            field: [
                {
                    type: "label",
                    name: "Current_Number",
                    size: 6,
                    text: "Current_Number",
                    model: "NumberSwap.MSISDN",
                    required: true,
                    maxlength: 50,
                    //validation: [{ value: "mandatory" }, { value: "maxlength" }]
                },
                {
                    type: "label",
                    name: "New_Number",
                    size: 6,
                    text: "New_Number",
                    model: "NumberSwap.New_Number",
                    required: true,
                    maxlength: 50,
                    //validation: [{ value: "mandatory" }, { value: "maxlength" }]
                },
                {   //ETNA Only
                    type: "text",
                    name: "New_ZipCode",
                    size: 6,
                    text: "New_ZipCode",
                    model: "NumberSwap.New_ZipCode",
                    required: true,
                    maxlength: 50,
                    validation: [{ value: "mandatory" }, { value: "maxlength" }]
                },
                {
                    type: "textarea",
                    name: "Reason",
                    size: 6,
                    text: "Reason_Optional",
                    model: "NumberSwap.Reason",
                    maxlength: 50,
                    //validation: [ { value: "maxlength" }]
                },
            ],
            button: [
                {
                    name: "btnShowSelectNumber",
                    type: "custom",
                    text: "Select_Number",
                    item: "<a type=\"button\" " +
                                        "id=\"" + 'btnShowSelectNumber' + "_btn_" + 'SelectNumber' + "\" " +
                                        "class=\"btn btn-danger\" " +
                                        "ng-click=\"" + 'ShowSelectNumber()' + "\" " +
                                        "ng-bind=\"lang." + 'Select_Number' + "\">" + 'Select_Number' +
                                        "</a>"
                },
                {
                    name: "btnSubmitNumberSwap",
                    type: "submit",
                    text: "Submit",
                    click: "SubmitNumberSwap(NumberSwap)"
                },
                {
                    name: "btnCancelNumberSwap",
                    type: "cancel",
                    text: "Cancel",
                    click: "modal"
                }
            ]
        };
    } else {
        //$scope.TemplateCode != "etna"
        $scope.NumberSwapDatas = {

            field: [
                {
                    type: "label",
                    name: "Current_Number",
                    size: 6,
                    text: "Current_Number",
                    model: "NumberSwap.MSISDN",
                    required: true,
                    maxlength: 50,
                    //validation: [{ value: "mandatory" }, { value: "maxlength" }]
                },
                {
                    type: "label",
                    name: "New_Number",
                    size: 6,
                    text: "New_Number",
                    model: "NumberSwap.New_Number",
                    required: true,
                    maxlength: 50,
                    //validation: [{ value: "mandatory" }, { value: "maxlength" }]
                },
                {
                    type: "textarea",
                    name: "Reason",
                    size: 6,
                    text: "Reason_Optional",
                    model: "NumberSwap.Reason",
                    maxlength: 50,
                    //validation: [ { value: "maxlength" }]
                },
            ],
            button: [
                {
                    name: "btnShowSelectNumber",
                    type: "custom",
                    text: "Select_Number",
                    item: "<a type=\"button\" " +
                                        "id=\"" + 'btnShowSelectNumber' + "_btn_" + 'SelectNumber' + "\" " +
                                        "class=\"btn btn-danger\" " +
                                        "ng-click=\"" + 'ShowSelectNumber()' + "\" " +
                                        "ng-bind=\"lang." + 'Select_Number' + "\">" + 'Select_Number' +
                                        "</a>"
                },
                {
                    name: "btnSubmitNumberSwap",
                    type: "submit",
                    text: "Submit",
                    click: "SubmitNumberSwap(NumberSwap)"
                },
                {
                    name: "btnCancelNumberSwap",
                    type: "cancel",
                    text: "Cancel",
                    click: "modal"
                }
            ]
        };
    }
});