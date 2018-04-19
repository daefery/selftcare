accountConfirm.controller("AccountConfirmationFormController", function ($scope) {
    $scope.confirm = {
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
                text: "Activation_Key",
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
                text: "Confirm",
                click: "doConfirm(confirm)"
            }

        ]
    };
});