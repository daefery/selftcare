SelfCareRegister.controller("registerFormController", function ($scope, CommonEnum) {
    $scope.questions = CommonEnum.getSecurityQuestions();
    $scope.datas = {
        field: [
            {
                type: "message",
                show: "isFalse",
                item: "registerMessage"
            },
            {
                type: "phone",
                name: "phone",
                size: 6,
                text: "Phone_Number",
                model: "register.Username",
                required: true,
                validation: [{ value: "mandatory" }, { value: "phone" }]
            }
        ],
        button: [
            {
                type: "link",
                item: "Don't have any phone number?<a href='/public/customer/app/shoppingcart' target='_self' class='link'> Purchase</a> or <a href='/Authorization/Login' class='link' target='_self'>Login</a>"
            },
            {
                type: "link",
                item: '<button type="submit" id="registerForm_btn_submit_1" ng-click="registerForm.$valid && validForm(registerForm.$valid, register)" ng-show="test()"></button>'
            }
            
        ]
    };

    $scope.step1 = {
        field: [
            {
                type: "email",
                name: "email",
                size: 6,
                text: "Email_Address",
                model: "register.Email",
                required: true,
                validation: [{ value: "mandatory" }, { value: "email" }]
            },
            {
                type: "select",
                name: "question",
                size: 6,
                text: "Security_Questions",
                model: "register.SecurityQuestion.Question",
                value: "questions",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "text",
                name: "answer",
                size: 6,
                text: "Answer",
                model: "register.SecurityQuestion.Answer",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "password",
                name: "newreg_pass",
                size: 6,
                text: "Password",
                model: "register.Password",
                keypress: "check()",
                required: true,
                validation: [{ value: "mandatory" }, { value: "password" }]
            },
            {
                type: "confirm_password",
                name: "confirmreg_pass",
                size: 6,
                text: "Confirm_Password",
                model: "register.ConfirmPassword",
                compareTo: "register.Password",
                required: true,
                validation: [ { value: "confirm_password" }, { value: "mandatory" }]
            }

        ],
        button: [
            {
                type: "link",
                item: '<button type="submit" id="registerStep1Form_btn_submit_1" ng-click="registerStep1Form.$valid && validForm(registerStep1Form.$valid, register)" ng-show="test()"></button>',
                click: "please()",
            }

        ]
    };
});