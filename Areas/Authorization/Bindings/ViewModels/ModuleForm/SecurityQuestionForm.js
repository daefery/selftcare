recoverPassword.controller("securityQuestionFormController", function ($scope, RecoverPasswordUtility) {
    $scope.question = RecoverPasswordUtility.GetQuestion();
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
                type: "logo",
                item: '<h4 style="color: #E2524E;">Security Question</h4>'
            },
            {
                type: "logo",
                item: '<p>{{question}}</p>'
            },
            {
                type: "text",
                name: "answer",
                size: 6,
                text: "Answer",
                model: "data.answer",
                required: true,
                validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                type: "submit",
                text: "Submit",
                click: "submit(data)"
            }
        ]
    };
});