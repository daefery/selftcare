recoverPassword.controller("changePasswordFormController", function ($scope, RecoverPasswordUtility) {
    $scope.username = RecoverPasswordUtility.GetUsername();
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
                type: "logo",
                item: '<p>{{username}}</p>'
            },
            {
                type: "password",
                name: "NewPassword",
                size: 6,
                text: "New_Password",
                model: "recover.NewPassword",
                keypress: "check()",
                required: true,
                validation: [
                { value: "mandatory" },{ value: "password" }]
            },
            {
                type: "confirm_password",
                name: "ConfirmNewPassword",
                size: 6,
                text: "Confirm_Password",
                model: "recover.ConfirmPassword",
                compareTo: "recover.NewPassword",
                required: true,
                validation: [
                { value: "mandatory" },{ value: "confirm_password" }]
            }
        ],
        button: [
            {
                type: "submit",
                text: "Submit",
                click: "submit(recover)"
            }
        ]
    };
});