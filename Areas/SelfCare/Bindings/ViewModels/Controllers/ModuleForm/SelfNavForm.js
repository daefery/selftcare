'use strict';
SelfCareNav.controller("UsageFilterFormController", function ($scope) {
    $scope.usageform = {
        field: [
            {
                type: "date",
                name: "startDate",
                size: 8,
                text: "Start_Date",
                model: "usage.startDate",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "date",
                name: "endDate",
                size: 8,
                text: "End_Date",
                model: "usage.endDate",
                required: true,
                validation: [{ value: "mandatory" }]
            },
        ],
        button: [
            {
                type: "submit",
                text: "Submit",
                disabled: "!isFormChanged()",
                click: "showData(usage)"
            }
        ]
    };

});