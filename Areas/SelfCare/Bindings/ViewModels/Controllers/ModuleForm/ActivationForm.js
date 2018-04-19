SelfCareContent.controller("SelfCareActivationFormController", function ($scope) {
    $scope.cancel = "/SelfCare/Customer/App/Devices"
    if (typeof(JSON.parse(localStorage.self_scope).activeDevice.Msisdn) === 'undefined') {
        $scope.cancel = "/SelfCare/Customer/App/Start"
    };
    //// generic form template
    //var cancel = "/SelfCare/Customer/App/Devices"
    //if (sessionStorage.HideHeaderAndBC && sessionStorage.HideHeaderAndBC === 'true') {
    //    cancel = "/SelfCare/Customer/App/Start"
    //};

    //$scope.activateDeviceForm = {
    //    field: [
    //        {
    //            type: "text",
    //            name: "zipcode",
    //            size: 6,
    //            text: "Zip_Code",
    //            model: "confirm.zipcode",
    //            required: true,
    //            maxlength: 30,
    //            validation: [{ value: "maxlength" }, { value: "mandatory" }]
    //        },
    //        {
    //            type: "text",
    //            name: "esnnumberorimei",
    //            size: 6,
    //            text: "ESN_Number_IMEI",
    //            model: "confirm.esnNumberOrImei",
    //            required: true,
    //            maxlength: 30,
    //            validation: [{ value: "maxlength" }, { value: "mandatory" }]
    //        },
    //        {
    //            type: "text",
    //            name: "iccid",
    //            size: 6,
    //            text: "ICCID",
    //            model: "confirm.iccid",
    //            required: false,
    //            maxlength: 30,
    //            validation: [{ value: "maxlength" }]
    //        },
    //        {
    //            type: "checkbox",
    //            name: "checkbox",
    //            size: 8,
    //            text: "checkboxhidden",
    //            model: "confirm.checkboxUseExistingMobileNumber",
    //            required: false,
    //            style: "horizontal",
    //            content: [{ text: "Use Existing Mobile Number", value: "C_A" }],
    //            validation: []
    //        },
    //        {
    //            type: "text",
    //            name: "mobilenumber",
    //            size: 6,
    //            text: "Mobile_Number",
    //            model: "confirm.mobileNumber",
    //            required: false,
    //            maxlength: 30,
    //            validation: [{ value: "maxlength" }]
    //        },
    //        {
    //            type: "text",
    //            name: "pinnumber",
    //            size: 6,
    //            text: "pin_number",
    //            model: "confirm.pinNumber",
    //            required: false,
    //            maxlength: 30,
    //            validation: [{ value: "maxlength" }]
    //        }
    //    ],
    //    button: [
    //        {
    //            type: "submit",
    //            text: "Activate",
    //            click: "activate(confirm)"
    //        },
    //        {
    //            type: "custom",
    //            item: '<a href=' + cancel + ' class="btn btn-danger" role="button">{{"Cancel"|translate}}</a>'
    //        }
    //    ]
    //};
});