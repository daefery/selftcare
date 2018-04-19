SelfCareContent.controller("AddCreditCardFormController", function ($scope) {
    $scope.documentType = [
        { name: 'Passport', value : 1 },
        { name: 'DrivingLicence', value: 2 },
        { name: 'DNI', value: 3 },
        { name: 'NIF', value: 4 },
        { name: 'NIE', value: 5 },
        { name: 'CIF', value: 6 }
    ];

    var currentTime = new Date()
    // returns the month (from 0 to 11)
    var monthNow = currentTime.getMonth()
    // returns the year (four digits)
    var yearNow = currentTime.getFullYear()

    monthObject = [
        { name: 'Jan', value: '01' },
        { name: 'Feb', value: '02' },
        { name: 'Mar', value: '03' },
        { name: 'Apr', value: '04' },
        { name: 'May', value: '05' },
        { name: 'Jun', value: '06' },
        { name: 'Jul', value: '07' },
        { name: 'Aug', value: '08' },
        { name: 'Sep', value: '09' },
        { name: 'Oct', value: '10' },
        { name: 'Nov', value: '11' },
        { name: 'Dec', value: '12' },
    ];

    $scope.month = [];
    $scope.year = [];
    $scope.startdatemonth = monthObject;
    $scope.stardateyear = [];

    for (var i = monthNow; i < 13; i++) {
        $scope.month.push(monthObject[i]);
    }
    for (var i = yearNow; i < (yearNow + 5); i++) {
        $scope.year.push({ name: i, value: i });
    }
    for (var i = (yearNow - 4) ; i < (yearNow + 1) ; i++) {
        $scope.stardateyear.push({ name: i, value: i });
    }

    $scope.AddCreditCardFormStructure = {
        field: [
            {
                type: "radio",
                name: "cardtypename",
                size: 8,
                text: "CARD_TYPE",
                model: "CCInput.CardType",
                required: true,
                style: "horizontal",
                content: [{ text: "Visa", value: 0 }, { text: "Master Card", value: 1 }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "number",
                name: "cardnumbername",
                size: 8,
                text: "CARD_NUMBER",
                model: "CCInput.Number",
                required: true,
                maxlength: 100,
                validation: [{ value: "number" }, { value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "nameoncard",
                size: 8,
                text: "cc_name",
                model: "CCInput.NameOnCard",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "month_year",
                name: "expirationdate",
                size: 8,
                text: "EXPIRATION_DATE",
                value_month: "startdatemonth",
                value_year: "year",
                model: "CCInput.ExpirationDate",
                required: true,
                validation: false
            },
            {
                type: "csc",
                name: "cvv",
                size: 8,
                text: "cvv",
                info: "Card Verification Value",
                maxlength: 5,
                model: "CCInput.CSC",
                required: true,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
        ],
        button: [
            {
                type: "custom",
                item: '<button id="submitAddCC" ng-click="SubmitAddCreditCard(CCInput, AddCreditCardForm.$valid)" class="btn btn-success btn-md">{{"Submit"|translate}}</button>'
            },
            {
                type: "custom",
                item: '<a href="/SelfCare/Customer/App/ManageAutoPay" class="btn btn-danger" role="button">{{"Cancel"|translate}}</a>'
            }
        ]
    };
});