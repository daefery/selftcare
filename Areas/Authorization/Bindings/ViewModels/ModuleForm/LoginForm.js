authorization.controller("loginFormController", function ($scope) {
    $scope.datas = {
        field: [
            {
                type: "logo",
                item: '<img class="center" src="images/et-logo.png">'
            },
            {
                type: "message",
                show: "isFalse",
                item: "warningLogin"
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
                type: "password",
                name: "password",
                size: 6,
                text: "Password",
                model: "data.password",
                required: true,
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                type: "submit",
                text: "Login",
                click: 'submit(data)'
            },
            {
                type: "link",
                item: '<a href="/Authorization/RecoverPassword" id="LoginForm_ForgotPassword" target="_self" class="link">Forgot Password?</a> or '+
                '<a href="/SelfCare/Customer/Registration" id="LoginForm_SelfCareRegistration" class="link" target="_self">Self Care Registration</a>'
            }

        ]
    };
});