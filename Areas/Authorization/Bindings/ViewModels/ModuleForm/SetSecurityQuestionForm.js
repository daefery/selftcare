recoverPassword.controller("setSecurityQuestionFormController", function ($scope, CommonEnum) {
    $scope.questions = CommonEnum.getSecurityQuestions();
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
                type: "select",
                name: "question",
                size: 6,
                text: "Security_Questions",
                model: "data.SecurityQuestion.Question",
                value: "questions",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "text",
                name: "answer",
                size: 6,
                text: "Answer",
                model: "data.SecurityQuestion.Answer",
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