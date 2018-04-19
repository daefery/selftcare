recoverPassword.controller("RecoverResendKeyFormController", function ($scope) {
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
                type: "email",
                name: "email",
                size: 6,
                text: "Email_Address",
                model: "resend.email",
                required: true,
                validation: [{ value: "mandatory" }, { value: "email" }]
            }
        ],
        button: [
            {
                type: "submit",
                text: "Resend",
                click: "resendKey(resend.email)"
            }
        ]
    };
});