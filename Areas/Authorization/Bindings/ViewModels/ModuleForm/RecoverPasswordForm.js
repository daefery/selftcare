recoverPassword.controller("recoverPasswordFormController", function ($scope) {
    $scope.datas = {
        field: [
            {
                type: "logo",
                item: '<img class="center" src="images/et-logo.png">'
            },
            {
                type: "message",
                show: "isFalse",
                item: "warningRecoverPass"
            },
            {
                type: "text",
                name: "username",
                size: 6,
                text: "Username",
                model: "data.username",
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
                click: "doConfirm(data)"
            }
        ]
    };
});