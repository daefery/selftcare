CSRContent.controller('BalanceAdjustmentForm', function ($scope, $parse, CommonEnum, CSRAdjustBalanceService, Notification) {
    $scope.dat = {};
    $scope.dat.Label = "Adjustment";
    $scope.balanceadjustment = function (data) {
        var adjustdata = {
            CustomerId: $scope.products.Customer.CustomerID,
            Amount: data.adjustvalue,
            ProvisioningType: "ETNA"
        }
        CSRAdjustBalanceService.save(adjustdata, function (result) {
            if (result.$status = 200) {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Your details has been updated</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
            else {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
        });

    };
    $scope.datas = {
        field: [
            {
                type: "number",
                name: "adjustvalue",
                size: 6,
                text: "Amount",
                model: "dat.adjustvalue",
                required: true,
                validation: [{ value: "mandatory" }, { value: "number" }]
            },
            {
                type: "textarea",
                name: "reason",
                size: 6,
                text: "Adjustment_Reason",
                model: "dat.reason",
                required: true,
                maxlength: 150,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
             }
        ],
        button: [
            {
                type: "submit",
                text: "Submit",
                click: "balanceadjustment(dat)"
            },
            {
                type: "cancel",
                text: "Cancel",
                click: "modal"
            },
        ]
    }
});

CSRContent.controller('BalanceForm', function ($scope, $parse, CommonEnum) {
    $scope.dat = {};
    $scope.dat.Label = "Adjustment";
    $scope.datas = {
        field: [
            {
                type: "label",
                name: "label",
                size: 8,
                text: "Balance_with_VAT",
                model: "data.balancewithvat"
            },
            {
                type: "label",
                name: "label",
                size: 8,
                text: "Promoted_Balance",
                model: "data.promotedbalance"
            }
        ],
        button: false
    }

});

CSRContent.controller('AdjustBalancewithCCForm', function ($scope, $parse, Notification, CSRAdjustBalanceService, CSRCreateChargeAccountService, CSRChargeCCService, CSRExecuteCCService) {
    $scope.dat = {};
    $scope.dat.Label = "Credit Card";
    $scope.ccadjustment = function (data) {
        console.log(data);
        var adjustdata = {
            CustomerId: $scope.products.Customer.CustomerID,
            Amount: data.adjustamount,
            ProvisioningType: "ETNA"
        }
        CSRAdjustBalanceService.save(adjustdata, function (result) {
            if (result.$status = 200) {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Your details has been updated</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
            else {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
        });

    };
    $scope.datas = {
        field: [
            {
                type: "number",
                name: "adjustamount",
                size: 6,
                text: "Amount",
                //model: "updateinfo.MobilePhoneNumber",
                model: "dat.adjustamount",
                required: true,
                validation: [{ value: "mandatory" }, { value: "number" }]
            },
            {
                type: "number",
                name: "ccnumber",
                size: 6,
                text: "cc_number",
                //model: "updateinfo.MobilePhoneNumber",
                model: "dat.ccnumber",
                required: true,
                validation: [{ value: "mandatory" }, { value: "number" }]
            },
            {
                type: "text",
                name: "ccname",
                size: 6,
                text: "cc_name",
                length:50,
                model: "dat.ccname",
                required: true,
                validation: [{ value: "mandatory" }, { value: "text" }, {value: "length"}]
            },
            {
                type: "number",
                name: "ccv",
                size: 6,
                text: "ccv",
                model: "dat.ccv",
                required: true,
                validation: [{ value: "mandatory" }, { value: "number" }]
            },
            {
                type: "date",
                name: "ccexpiration",
                size: 6,
                text: "cc_expiry_date",
                model: "dat.expiration",
                required: true,
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                type: "submit",
                text: "Submit",
                click: "ccadjustment(dat)"
            },
            {
                type: "cancel",
                text: "Cancel",
                click: "modal"
            },
        ]
    }

});


CSRContent.controller('AdjustBalancewithCouponForm', function ($scope, $parse, CSRAdjustBalanceService,Notification, CSRAdjustwithVoucherService) {
    $scope.dat = {};
    $scope.dat.Label = "Coupon";
    $scope.couponadjustment = function (data) {
        console.log(data);
        var adjustdata = {
            MobileNumber: $scope.products.Subscription.MSISDN,
            VoucherCode: String(data.couponnumber)
        }
        CSRAdjustwithVoucherService.save(adjustdata, function (result) {
            if (result.$status = 200) {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Your details has been updated</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
            else {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + result.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
        });

    };
    $scope.datas = {
        field: [
            {
                type: "number",
                name: "couponnumber",
                size: 6,
                text: "TopUp_Code",
                //model: "updateinfo.MobilePhoneNumber",
                model: "dat.couponnumber",
                required: true,
                validation: [{ value: "mandatory" }, { value: "number" }, ]
            }
        ],
        button: [
            {
                type: "submit",
                text: "Submit",
                click: "couponadjustment(dat)"
            },
            {
                type: "cancel",
                text: "Cancel",
                click: "modal"
            },
        ]
    }

});