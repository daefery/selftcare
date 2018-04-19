publicContent.controller('CustomerInfoController', function ($scope, $rootScope, $parse, $location, CommonEnum) {
    $scope.idtype = CommonEnum.getDocumentType();
    $scope.gender = CommonEnum.getGender();
    $scope.nationality = CommonEnum.getCountryList();

    var config = sessionStorage.webConfig != undefined ? JSON.parse(sessionStorage.webConfig) : {};
    var countrySelection;
    if (config.TemplateCode === 'etna') {
        $scope.CustomerInfo.CustomerAddress.CountryId = CommonEnum.convertCountryList($scope.countryList).name;
        countrySelection = {
            type: "label",
            name: "cust_country",
            size: 8,
            text: "Country",
            model: "CustomerInfo.CustomerAddress.CountryId"
        }
    } else {
        countrySelection={
            type: "select",
            name: "cust_country",
            size: 8,
            text: "Country",
            model: "CustomerInfo.CustomerAddress.CountryId",
            value: "nationality",
            required: true,
            validation: [{ value: "mandatory" }]
        }
    }
    if ($location.path() == '/SelfCare/Customer/App/BuyMore/Device') {
        $scope.customerInfo = {
            field: [
                {
                    type: "label",
                    name: "firstname",
                    size: 8,
                    text: "First_Name",
                    model: "CustomerInfo.FirstName"
                },
                {
                    type: "label",
                    name: "middlename",
                    size: 8,
                    text: "Middle_Name",
                    model: "CustomerInfo.MiddleName",
                },
                {
                    type: "label",
                    name: "lastname",
                    size: 8,
                    text: "Last_Name",
                    model: "CustomerInfo.LastName",
                },
                {
                    type: "label",
                    name: "gender",
                    size: 8,
                    text: "Gender",
                    model: "CustomerInfo.Genders",
                },
                {
                    type: "label",
                    name: "idtype",
                    size: 8,
                    text: "Id_Type",
                    model: "CustomerInfo.DocumentType",
                },
                {
                    type: "label",
                    name: "idnumber",
                    size: 8,
                    text: "Id_Number",
                    model: "CustomerInfo.DocumentNumber",
                },
                {
                    type: "label",
                    name: "dateofbirth",
                    size: 8,
                    text: "Date_of_Birth",
                    model: "CustomerInfo.BirthDay",
                },
                {
                    type: "label",
                    name: "nationality",
                    size: 8,
                    text: "Nationality",
                    model: "CustomerInfo.Nationality",
                },
                {
                    type: "label",
                    name: "landlinenumber",
                    size: 8,
                    text: "Landline_Number",
                    model: "CustomerInfo.LandlineNumber",
                },
                {
                    type: "label",
                    name: "alternatephonenumber",
                    size: 8,
                    text: "Alt_Phone_Number",
                    model: "CustomerInfo.AlternativePhoneNumber",
                }, {
                    type: "label",
                    name: "email",
                    size: 8,
                    text: "Email",
                    model: "CustomerInfo.Email",
                },
                {
                    type: "label",
                    name: "company",
                    size: 8,
                    text: "Company",
                    model: "CustomerInfo.Company",
                },
                {
                    type: "label",
                    name: "remarks",
                    size: 8,
                    text: "Remarks",
                    model: "CustomerInfo.Remark",
                },
                {
                    type: "label",
                    name: "cust_address",
                    size: 8,
                    text: "Address",
                    model: "CustomerInfo.CustomerAddress.Addresses",
                },
                {
                    type: "label",
                    name: "cust_city",
                    size: 8,
                    text: "City",
                    model: "CustomerInfo.CustomerAddress.City",
                },
                {
                    type: "label",
                    name: "cust_state",
                    size: 8,
                    text: "State",
                    model: "CustomerInfo.CustomerAddress.State",
                },
                {
                    type: "label",
                    name: "cust_country",
                    size: 8,
                    text: "Country",
                    model: "CustomerInfo.CustomerAddress.CountryName",
                },
                {
                    type: "label",
                    name: "cust_zip",
                    size: 8,
                    text: "Zip_Code",
                    model: "CustomerInfo.CustomerAddress.ZipCode",
                },
                {
                    type: "radio",
                    name: "cust_applyAllAddress",
                    size: 8,
                    text: "applyAllAddress",
                    model: "CustomerInfo.CustomerAddress.ApplyAllAddress",
                    style: "horizontal",
                    content: [{ text: "Yes", value: "applyAll" }, { text: "No", value: "notApply" }],
                    required: true,
                    validation: [{ value: "mandatory" }]
                }
            ],
            button: [
                {
                    type: "link",
                    item: '<button type="submit" id="custInfoForm_btn_submit_1" ng-click="customerInfo.$valid && validForm(customerInfo.$valid, CustomerInfo)" ng-show="test()"></button>',
                    click: "please()"
                }
            ]
        }
    } else {
        $scope.customerInfo = {
            field: [
                {
                    type: "text",
                    name: "firstname",
                    size: 8,
                    text: "First_Name",
                    model: "CustomerInfo.FirstName",
                    required: true,
                    validation: [{ value: "mandatory" }]
                },
                {
                    type: "text",
                    name: "middlename",
                    size: 8,
                    text: "Middle_Name",
                    model: "CustomerInfo.MiddleName",
                    required: false,
                    validation: false
                },
                {
                    type: "text",
                    name: "lastname",
                    size: 8,
                    text: "Last_Name",
                    model: "CustomerInfo.LastName",
                    required: true,
                    validation: [{ value: "mandatory" }]
                },
                {
                    type: "select",
                    name: "gender",
                    size: 8,
                    text: "Gender",
                    model: "CustomerInfo.Genders",
                    value: "gender",
                    required: true,
                    validation: [{ value: "mandatory" }]
                },
                {
                    type: "select",
                    name: "idtype",
                    size: 8,
                    text: "Id_Type",
                    model: "CustomerInfo.DocumentType",
                    value: "idtype",
                    required: true,
                    validation: [{ value: "mandatory" }]
                },
                {
                    type: "text",
                    name: "idnumber",
                    size: 8,
                    text: "Id_Number",
                    model: "CustomerInfo.DocumentNumber",
                    required: true,
                    validation: [{ value: "mandatory" }]

                },
                {
                    type: "date",
                    name: "dateofbirth",
                    size: 8,
                    text: "Date_of_Birth",
                    model: "CustomerInfo.BirthDay",
                    required: true,
                    validation: [{ value: "mandatory" }]
                }, {
                    type: "select",
                    name: "nationality",
                    size: 8,
                    text: "Nationality",
                    model: "CustomerInfo.Nationality",
                    value: "nationality",
                    required: true,
                    validation: [{ value: "mandatory" }]
                },
                {
                    type: "phone",
                    name: "landlinenumber",
                    size: 8,
                    text: "Landline_Number",
                    model: "CustomerInfo.LandlineNumber",
                    required: true,
                    validation: [{ value: "mandatory" }]
                },
                {
                    type: "phone",
                    name: "alternatephonenumber",
                    size: 8,
                    text: "Alt_Phone_Number",
                    model: "CustomerInfo.AlternativePhoneNumber",
                    required: false,
                    validation: false
                }, {
                    type: "email",
                    name: "email",
                    size: 8,
                    text: "Email",
                    model: "CustomerInfo.Email",
                    required: true,
                    validation: [{ value: "mandatory" }]
                },
                {
                    type: "text",
                    name: "company",
                    size: 8,
                    text: "Company",
                    model: "CustomerInfo.Company",
                    required: false,
                    validation: false
                },

                {
                    type: "textarea",
                    name: "remarks",
                    size: 8,
                    text: "Remarks",
                    model: "CustomerInfo.Remark",
                    required: false,
                    validation: false
                },
                {
                    type: "tab",
                    content: [
                    {
                        name: "Customer Address",
                        value: [
                            {
                                type: "textarea",
                                name: "cust_address",
                                size: 12,
                                text: "Address",
                                model: "CustomerInfo.CustomerAddress.Addresses",
                                required: true,
                                validation: [{ value: "mandatory" }]
                            },
                            {
                                type: "text",
                                name: "cust_city",
                                size: 8,
                                text: "City",
                                model: "CustomerInfo.CustomerAddress.City",
                                required: true,
                                validation: [{ value: "mandatory" }]
                            },
                            {
                                type: "text",
                                name: "cust_state",
                                size: 8,
                                text: "State",
                                model: "CustomerInfo.CustomerAddress.State",
                                required: true,
                                validation: [{ value: "mandatory" }]
                            },
                            countrySelection,
                            {
                                type: "text",
                                name: "cust_zip",
                                size: 8,
                                text: "Zip_Code",
                                model: "CustomerInfo.CustomerAddress.ZipCode",
                                required: true,
                                validation: [{ value: "mandatory" }]
                            },
                            {
                                type: "radio",
                                name: "cust_applyAllAddress",
                                size: 8,
                                text: "applyAllAddress",
                                model: "CustomerInfo.CustomerAddress.ApplyAllAddress",
                                style: "horizontal",
                                content: [{ text: "Yes", value: "applyAll" }, { text: "No", value: "notApply" }],
                                required: true,
                                validation: [{ value: "mandatory" }]
                            }
                        ]
                    }]
                }
            ],
            button: [
                {
                    type: "link",
                    item: '<button type="submit" id="custInfoForm_btn_submit_1" ng-click="customerInfo.$valid && validForm(customerInfo.$valid, CustomerInfo)" ng-show="test()"></button>',
                    click: "please()"
                }
            ]
        }
    }
    

    $scope.$watch("CustomerInfo.CustomerAddress.ApplyAllAddress", function (x) {
        if (x === "applyAll") {
            $scope.CustomerInfo.applyAll = true;
            $scope.CustomerInfo.FiscalAddress = $scope.CustomerInfo.CustomerAddress;
        } else {
            $scope.CustomerInfo.applyAll = false;
            $scope.CustomerInfo.FiscalAddress = null;
        }
    });
})
