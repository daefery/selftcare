SelfCareContent.controller("ETBOSSFormController", function ($scope, CommonEnum, $parse, CustomerCache) {
    $scope.dat.Label = "Fery Yundara Putera";
    $scope.countries = CommonEnum.getCountryList();
    $scope.month = [
        { name: 'Jan', value: 1 },
        { name: 'Feb', value: 2 },
        { name: 'Mar', value: 3 },
    ];
    $scope.year = [
        { name: '2014', value: 2014 },
        { name: '2015', value: 2015 },
        { name: '2016', value: 2016 },
    ];
    $scope.datas = {
        field: [
            {
                type: "label",
                name: "label",
                size: 8,
                text: "Password",
                model: "dat.Label"
            },
            {
                type: "month_year",
                name: "expirationdate",
                size: 8,
                text: "First_Name",
                model: "dat.expirationdate",
                value_month: "month",
                value_year: "year",
                required: true,
                validation: false
            },
            {
                type: "csc",
                name: "csc",
                size: 8,
                text: "First_Name",
                info: "Fery Yundara Putera",
                maxlength: 5,
                model: "dat.csc",
                required: true,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "password",
                name: "password",
                size: 8,
                text: "Password",
                model: "dat.Password",
                required: true,
                validation: [{ value: "mandatory" }, { value: "password" }]
            },
            {
                type: "iban",
                name: "bank",
                size: 8,
                text: "Bank_Account",
                model: "dat.BankNumber",
                country: "AL",
                required: true,
                validation: [{ value: "mandatory" }, { value: "iban" }]
            },
            {
                type: "text",
                name: "fname",
                size: 8,
                text: "First_Name",
                model: "dat.FirstName",
                required: false,
                validation: false
            },
            {
                type: "number",
                name: "number",
                size: 8,
                text: "Number",
                model: "dat.Number",
                required: true,
                validation: [{ value: "mandatory" }, { value: "number" }]
            },
            {
                type: "phone",
                name: "phone",
                size: 8,
                text: "Phone",
                model: "dat.Phone",
                required: true,
                validation: [{ value: "mandatory" }, { value: "phone" }]
            },
            {
                type: "email",
                name: "email",
                size: 8,
                text: "Email",
                model: "dat.Email",
                required: true,
                validation: [{ value: "mandatory" }, { value: "email" }]
            },
            {
                type: "select",
                name: "option",
                size: 8,
                text: "Option",
                model: "dat.Option.Customer",
                value: "countries",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "radio",
                name: "radio",
                size: 8,
                text: "Radio",
                model: "dat.radio",
                required: true,
                style: "horizontal",
                content: [{ text: "Radio A", value: "R_A" }, { text: "Radio B", value: "R_B" }, { text: "Radio C", value: "R_C" }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "checkbox",
                name: "checkbox",
                size: 8,
                text: "Checkbox",
                model: "dat.checkbox",
                required: true,
                style: "horizontal",
                content: [{ text: "checkbox A", value: "C_A" }, { text: "checkbox B", value: "C_B" }],
                validation: [{ value: "mandatory" }]
            },
            {
                type: "birthdate",
                name: "birthdate",
                size: 8,
                text: "BIRTHDATE",
                model: "dat.birthdate",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "date",
                name: "datepicker",
                size: 8,
                text: "Date_Picker",
                model: "dat.date",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "tab",
                content: [
                    {
                        name: "Bank Info",
                        value: [
                            {
                                type: "text",
                                name: "l2_name",
                                size: 8,
                                text: "Second_LastName",
                                model: "dat.LastName2",
                                required: true,
                                validation: [{ value: "mandatory" }]
                            },
                            {
                                type: "radio",
                                name: "radiotab",
                                size: 8,
                                text: "Radiotab",
                                model: "dat.radiotab",
                                required: true,
                                style: "horizontal",
                                content: [{ text: "Radio A", value: "R_A" }, { text: "Radio B", value: "R_B" }],
                                validation: [{ value: "mandatory" }]
                            },
                        ]
                    },
                    {
                        name: "Customer Address",
                        value: [
                            {
                                type: "text",
                                name: "l_name",
                                size: 8,
                                text: "LastName",
                                model: "dat.LastName",
                                required: true,
                                validation: [{ value: "mandatory" }]
                            },
                            {
                                type: "radio",
                                name: "radiotab1",
                                size: 8,
                                text: "Radiotab",
                                model: "dat.radiotab1",
                                required: true,
                                style: "horizontal",
                                content: [{ text: "Radio A", value: "R_A" }, { text: "Radio B", value: "R_B" }],
                                validation: [{ value: "mandatory" }]
                            },
                        ]
                    },
                    {
                        name: "Customer Delivery",
                        value: [
                            {
                                type: "text",
                                name: "cust_name",
                                size: 8,
                                text: "Cust_Address",
                                model: "dat.LastName",
                                required: true,
                                validation: [{ value: "mandatory" }]
                            },
                            {
                                type: "text",
                                name: "cust_name1",
                                size: 8,
                                text: "Cust_Address1",
                                model: "dat.LastName",
                                required: true,
                                validation: [{ value: "mandatory" }]
                            }
                        ]
                    }
                ]
            }


        ],
        button: [
            {
                type: "submit",
                text: "Submit",
                click: "test(dat)"
            },
            {
                type: "cancel",
                text: "Cancel",
                click: "/SelfCare/Customer/App"
            },
        ]
    }
});