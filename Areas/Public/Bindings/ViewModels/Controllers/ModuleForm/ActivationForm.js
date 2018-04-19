publicContent.controller("SelfActivationFormController", function ($scope) {
    $scope.datas = {
        field: [
            {
                type: "logo",
                item: '<img class="center" src="images/et-logo.png">'
            },
            {
                type: "message",
                show: "isNotConfirm",
                item: "messageConfirm"
            },
            {
                type: "text",
                name: "key",
                size: 6,
                text: "Verification_Code",
                model: "confirm.key",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "captcha",
                size: 6,
                text: "Captcha",
                name: "recaptcha_response_field",
                model: "captcha",
                //validation: [{ value: "mandatory" }]
            }

        ],
        button: [
            {
                type: "submit",
                text: "Verify",
                click: "doConfirm(confirm)"
            }

        ]
    };


    $scope.activated = {
        field: [
            {
                type: "logo",
                item: '<hr/>'
            },
            {
                type: "text",
                name: "key",
                size: 6,
                text: "ESN_IMEI",
                model: "confirm.ESNIEMEI",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "text",
                name: "IccId",
                size: 6,
                text: "ICCID",
                model: "confirm.ICCID",
                nghide: "isIMEI",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "text",
                name: "zipcode",
                size: 6,
                text: "Zip_Code",
                model: "confirm.ZipCode",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "checkbox",
                name: "UseExistingMobileNumberCheckBox",
                size: 6,
                text: "UseExistingMobileNumber",
                model: "confirm.UseExistingMobileNumber",
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
                model: "confirm.Mobile_Number",
                nghide: "!confirm.isUseExistingMobileNumber",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "PIN_Number",
                size: 6,
                text: "PIN_Number",
                model: "confirm.PIN_Number",
                nghide: "!confirm.isUseExistingMobileNumber",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },

        ],
        button: [
            {
                type: "submit",
                text: "Activate",
                click: "activate(confirm)"
            }

        ]
    };
});