'use strict';

/* UpdateProfile Form */
SelfCareContent.controller("UpdateProfileFormController", function ($scope,$parse, CommonEnum) {
    $scope.countries = CommonEnum.getCountryList();
    $scope.documents = CommonEnum.getDocumentType();
    
    /*update customer data form*/
    $scope.datas = {

        field: [
            {
                type: "label",
                name: "Email",
                size: 8,
                text: "Username",
                model: "update.CustomerData.Email"
            },
            {
                type: "text",
                name: "f_name",
                size: 8,
                text: "First_Name",
                model: "update.CustomerData.FirstName",
                maxlength: 200,
                required: true,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "m_name",
                size: 8,
                text: "Middle_Name",
                model: "update.CustomerData.MiddleName",
                maxlength: 100,
                required: false,
                validation: [{value: "maxlength" }]
            },
            {
                type: "text",
                name: "l1_name",
                size: 8,
                text: "Last_Name",
                model: "update.CustomerData.LastName",
                maxlength: 100,
                required: true,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "birthdate",
                name: "BirthOfDate",
                size: 8,
                text: "BIRTHDATE",
                model: "update.CustomerData.BirthDay",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "tab",
                content: [
                    {
                        name: "Bank Information",
                        value: [
                            {
                                type: "text",
                                name: "bankno",
                                size: 8,
                                text: "Bank_Account",
                                model: "update.CustomerData.BankInformation.BankNumber",
                                maxlength: 50,
                                required: true,
                                validation: [{ value: "mandatory" }, { value: "maxlength" }] /*to be done*/ //{ value: "iban" }]
                            },
                            {
                                type: "text",
                                name: "owner",
                                size: 8,
                                text: "Owner",
                                model: "update.CustomerData.BankInformation.Owner",
                                maxlength: 100,
                                required: true,
                                validation: [{ value: "mandatory" }, { value: "maxlength" }]
                            },
                        ]
                    },
                    {
                        name: "Customer Address",
                        value: [
                            {
                                type: "textarea",
                                name: "cust_address",
                                size: 8,
                                text: "Address",
                                model: "update.CustomerData.CustomerAddress.Addresses",
                                maxlength:100,
                                required: true,
                                validation: [{ value: "mandatory" }, { value: "maxlength" }]
                            },
                            {
                                type: "select",
                                name: "cust_country",
                                size: 8,
                                text: "Country",
                                model: "update.CustomerData.CustomerAddress.CountryId",
                                value: "countries",
                                required: true,
                                validation: [{ value: "mandatory" }]
                            },
                            {
                                type: "text",
                                name: "cust_city",
                                size: 8,
                                text: "City",
                                model: "update.CustomerData.CustomerAddress.City",
                                maxlength: 100,
                                required: true,
                                validation: [{ value: "mandatory" }, { value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "cust_h_ext",
                                size: 8,
                                text: "House_Ext",
                                model: "update.CustomerData.CustomerAddress.HouseExtension",
                                maxlength: 100,
                                required: true,
                                validation: [{ value: "mandatory" }, { value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "cust_h_no",
                                size: 8,
                                text: "House_No",
                                model: "update.CustomerData.CustomerAddress.HouseNo",
                                maxlength: 25,
                                required: true,
                                validation: [{ value: "mandatory" }, { value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "cust_state",
                                size: 8,
                                text: "State",
                                model: "update.CustomerData.CustomerAddress.State",
                                maxlength: 100,
                                required: true,
                                validation: [{ value: "mandatory" }, { value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "cust_zip",
                                size: 8,
                                text: "Zip_Code",
                                model: "update.CustomerData.CustomerAddress.ZipCode",
                                maxlength: 25,
                                required: true,
                                validation: [{ value: "mandatory" }, { value: "maxlength" }]
                            },
                        ]
                    },
                    {
                        name: "Customer Delivery",
                        value: [
                            {
                                type: "textarea",
                                name: "del_address",
                                size: 8,
                                text: "Address",
                                model: "update.CustomerData.DeliveryAddress.Addresses",
                                maxlength: 100,
                                required: true,
                                validation: [{ value: "mandatory" }, { value: "maxlength" }]
                            },
                            {
                                type: "select",
                                name: "del_country",
                                size: 8,
                                text: "Country",
                                model: "update.CustomerData.DeliveryAddress.CountryId",
                                value: "countries",
                                required: true,
                                validation: [{ value: "mandatory" }]
                            },
                            {
                                type: "text",
                                name: "del_city",
                                size: 8,
                                text: "City",
                                model: "update.CustomerData.DeliveryAddress.City",
                                maxlength: 100,
                                required: true,
                                validation: [{ value: "mandatory" }, { value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "del_h_ext",
                                size: 8,
                                text: "House_Ext",
                                model: "update.CustomerData.DeliveryAddress.HouseExtension",
                                maxlength: 100,
                                required: true,
                                validation: [{ value: "mandatory" }, { value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "del_h_no",
                                size: 8,
                                text: "House_No",
                                model: "update.CustomerData.DeliveryAddress.HouseNo",
                                maxlength: 25,
                                required: true,
                                validation: [{ value: "mandatory" }, { value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "del_state",
                                size: 8,
                                text: "State",
                                model: "update.CustomerData.DeliveryAddress.State",
                                maxlength: 100,
                                required: true,
                                validation: [{ value: "mandatory" }, { value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "del_zip",
                                size: 8,
                                text: "Zip_Code",
                                model: "update.CustomerData.DeliveryAddress.ZipCode",
                                maxlength: 25,
                                required: true,
                                validation: [{ value: "mandatory" }, { value: "maxlength" }]
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
            disabled: "!isFormChanged()",
            click: "saveChangesGeneral(update)"
        },
        {
            type: "cancel",
            text: "Cancel",
            click: "/SelfCare/Customer/App/YourProfile"
        }
    ]

    }
    /*end of form content*/
    
    
});

SelfCareContent.controller("ChangePasswordFormController", function ($scope, $parse) {
    $scope.dataPass = {
        field: [
            {
                type: "message",
                show: "isFalse",
                item: "sameLastFivePasswordMessage",
                size: 0
            },
            {
                type: "password",
                name: "OldPassword",
                size: 8,
                text: "Old_Password",
                model: "chPass.OldPassword",
                required: true,
                validation: [{ value: "mandatory" }, { value: "password" }]
            },
            {
                type: "password",
                name: "NewPassword",
                size: 8,
                text: "New_Password",
                model: "chPass.NewPassword",
                keypress: "check()",
                required: true,
                validation: [{ value: "mandatory" }, { value: "password" }]
            },
            {
                type: "confirm_password",
                name: "ConfirmNewPassword",
                size: 8,
                text: "Confirm_Password",
                model: "chPass.ConfirmPassword",
                compareTo: "chPass.NewPassword",
                required: true,
                validation: [{ value: "confirm_password" }, { value: "mandatory" }]
            }
        ],
        button: [
            {
                type: "submit",
                text: "Submit",
                click: "saveChangesPassword(chPass)"
            },
            {
                type: "cancel",
                text: "Cancel",
                click: "/SelfCare/Customer/App/YourProfile"
            },
        ]
    };
});
SelfCareContent.controller("TroubleTicketInfoController", function ($scope) {
    $scope.trouble_ticket_info = {
        field: [
            {
                type: "label",
                name: "supportId",
                size: 8,
                text: "Support_ID",
                model: "TroubleTicketDetailResponse.TroubleTicketDetail.TicketNumber"
            },
            {
                type: "label",
                name: "createTime",
                size: 8,
                text: "Create_Date",
                model: "TroubleTicketDetailResponse.TroubleTicketDetail.ReportTime"
            },
            {
                type: "label",
                name: "category",
                size: 8,
                text: "Category",
                model: "TroubleTicketDetailResponse.TroubleTicketDetail.Type.Name"
            },
            {
                type: "label",
                name: "Status",
                size: 8,
                text: "Status",
                model: "TroubleTicketDetailResponse.TroubleTicketDetail.Status.Name"
            },
            {
                type: "label",
                name: "update",
                size: 8,
                text: "Updates",
                model: "TroubleTicketDetailResponse.TroubleTicketDetail.UpdateTime"
            }
        ],
        button: false
    };
});
SelfCareContent.controller("CreateTroubleTicketFormController", function ($scope, CommonEnum, TroubleTicketService) {
    var content = '';
    var count = 1;
    TroubleTicketService.TTCategory.get({ MvnoId: config.DealerId }, function (result) {
        angular.forEach(result.TroubleTicketTypeLists, function (value, key) {
            if (count == result.TroubleTicketTypeLists.length) {
                content += '{"name":"' + value.NameId.DefaultMessage + '", "value":' + value.TypeId + '}';
            } else {
                content += '{"name":"' + value.NameId.DefaultMessage + '", "value":' + value.TypeId + '},';
            }
            count++;
        });

        var categories = JSON.parse('[' + content + ']');
        $scope.categories = categories;
    });


    $scope.tt = {
        field: [
            {
                type: "select",
                name: "category",
                size: 8,
                text: "Category",
                model: "tt.category",
                value: "categories",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "textarea",
                name: "description",
                size: 8,
                text: "Description",
                maxlength: 3000,
                model: "tt.description",
                required: true,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
        ],
        button: [
            {
                type: "submit",
                text: "Create",
                click: "createTicket(tt)"
            },
            {
                type: "cancel",
                text: "Cancel",
                click: "/SelfCare/Customer/App/ViewTroubleTicket"
            }
        ]
    };
});

SelfCareContent.controller("YourProfileETViewController", function ($scope) {
    $scope.icon = {
        "user": "<i class='fa fa-user'></i>",
        "envelope_o": "<i class='fa fa-envelope-o'></i>",
        "file_text_o": "<i class='fa fa-file-text-o'></i>",
        "map_marker": "<i class='fa fa-map-marker'></i>",
        "info": "<i class='fa fa-info'></i>",
        "globe": "<i class='fa fa-globe'></i>",
        "bank": "<i class='fa fa-bank'></i>",
        "calendar": "<i class='fa fa-calendar'></i>"
    }
    $scope.yourprofile_data = {
        field: [
            {
                type: "label",
                name: "fullname",
                size: 8,
                text: "Name",
                model: "Name",
                icon: "user"
            },
            {
                type: "label",
                name: "Email",
                size: 8,
                text: "EMAIL",
                model: "Email",
                icon: "envelope_o"
            },
            {
                type: "label",
                name: "BirthOfDate",
                size: 8,
                text: "BIRTHDATE",
                model: "BirthOfDate",
                icon: "calendar"
            },
            {
                type: "label",
                name: "documentType",
                size: 8,
                text: "Document_Type",
                model: "DocumentType",
                icon: "file_text_o"
            },
            {
                type: "label",
                name: "DocumentNumber",
                size: 8,
                text: "Document_Number",
                model: "DocumentNumber",
                icon: "file_text_o"
            },
            {
                type: "label",
                name: "CustomerAddress",
                size: 8,
                text: "Customer_Address",
                model: "CustomerAddress",
                icon: "map_marker"
            },
            {
                type: "label",
                name: "DeliveryAddress",
                size: 8,
                text: "Delivery_Address",
                model: "DeliveryAddress",
                icon: "map_marker"
            },
            {
                type: "label",
                name: "BankAccount",
                size: 8,
                text: "Bank_Account",
                model: "BankInformation.BankNumber",
                icon: "bank"
            },
            {
                type: "label",
                name: "Owner",
                size: 8,
                text: "Owner",
                model: "BankInformation.Owner",
                icon: "info"
            },
            {
                type: "label",
                name: "Nationality",
                size: 8,
                text: "Nationality",
                model: "Nationality",
                icon: "globe"
            }
        ],
        button: false
    };
});

