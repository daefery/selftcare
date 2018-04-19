/// <reference path="../../../../../../../Templates/CSR/Dashboard/Main.html" />
/// <reference path="../../../../../../../Templates/CSR/Search/Dashboard.html" />
'use strict';

/* DeleteCustomerStatus Form */
CSRContent.controller("DeleteCustomerFormController", function ($scope, $parse, CommonEnum) {
    /*update customer data form*/
    $scope.datas = {

        field: [
            //{
            //    type: "select",
            //    name: "deleteCause",
            //    size: 6,
            //    text: "Cause",
            //    model: "",
            //    required: true,
            //    validation: [{ value: "mandatory" }]
            //},
            //{
            //    type: "text",
            //    name: "deleteComment",
            //    size: 6,
            //    text: "Comment",
            //    model: "",
            //    required: false
            //}
        ],
        button: [
            {
                type: "submit",
                text: "Submit",
                click: "saveChangesGeneral(update)"
            },
            {
                type: "cancel",
                text: "Cancel",
                click: "CSR/Customer/App/SearchPage/CustomerDetailDashboard"
            }
        ]
    }
    /*end of form content*/
});

/* UpdateCustomerDetail Form */
CSRContent.controller("UpdateCustomerDetailFormController", function ($scope, $rootScope, $parse, CommonEnum, $route, $filter, $timeout, UpdateCustomerDetail, Notification, SearchCustomerDetailService, SearchPageService,
    CSRCache, CacheSearch, pinnedHtmlService, LocalStorageProvider, AddressValidatorService) {
    $scope.countries = CommonEnum.getCountryList();
    $scope.documents = CommonEnum.getDocumentType();
    $scope.genders = CommonEnum.getGender();

    $scope.TemplateCode = LocalStorageProvider.getTemplateCode();

    $scope.isDirty_EditCustomer = function (data) {
        var noChange = true;
        var updateData = angular.copy(CSRCache.get('searchDetail'));
        var update = angular.copy(data);
        if (update == undefined || updateData == undefined) {
            return noChange; //noChange = true;
        }

        if (updateData.CustomerData.FirstName !== update.CustomerData.FirstName) {
            noChange = false;
        } else if (updateData.CustomerData.MiddleName !== update.CustomerData.MiddleName) {
            noChange = false;
        } else if (updateData.CustomerData.LastName !== update.CustomerData.LastName) {
            noChange = false;
        } else if (updateData.CustomerData.Genders !== update.CustomerData.Genders.value
            && updateData.CustomerData.Genders != -1) {
            noChange = false;
        } else if (moment(updateData.CustomerData.BirthDay).format(config.DateFormatMoment) !== moment(update.CustomerData.BirthDay).format(config.DateFormatMoment)
            && isNaN(Date.parse(update.CustomerData.BirthDay)) == false
            ) {
            noChange = false;
        } else if (updateData.CustomerData.DocumentType !== update.CustomerData.DocumentType.value) {
            noChange = false;
        } else if (updateData.CustomerData.DocumentNumber !== update.CustomerData.DocumentNumber) {
            noChange = false;
        } else if (updateData.CustomerData.LandlineNumber !== update.CustomerData.LandlineNumber) {
            noChange = false;
        } else if (updateData.CustomerData.MobileNumber !== update.CustomerData.MobileNumber) {
            noChange = false;
        } else if (updateData.CustomerData.AlternativePhoneNumber !== update.CustomerData.AlternativePhoneNumber) {
            noChange = false;
        } else if (updateData.CustomerData.Email !== update.CustomerData.Email) {
            noChange = false;
        } else if (updateData.CustomerData.JobTitle !== update.CustomerData.JobTitle) {
            noChange = false;
        } else if (updateData.CustomerData.Company !== update.CustomerData.Company) {
            noChange = false;
        } else if (updateData.CustomerData.Nationality !== update.CustomerData.Nationality.value) {
            noChange = false;
        } else if (updateData.CustomerData.CoCNo !== update.CustomerData.CoCNo) {
            noChange = false;
        } else if (updateData.CustomerData.VATNo !== update.CustomerData.VATNo) {
            noChange = false;
        } else if (updateData.CustomerData.CustomerAddress.Addresses !== update.CustomerData.CustomerAddress.Addresses) {
            noChange = false;
        } else if (updateData.CustomerData.CustomerAddress.HouseNo !== update.CustomerData.CustomerAddress.HouseNo) {
            noChange = false;
        } else if (updateData.CustomerData.CustomerAddress.HouseExtension !== update.CustomerData.CustomerAddress.HouseExtension) {
            noChange = false;
        } else if (updateData.CustomerData.CustomerAddress.CountryId !== update.CustomerData.CustomerAddress.CountryId.value) {
            noChange = false;
        } else if (updateData.CustomerData.CustomerAddress.State !== update.CustomerData.CustomerAddress.State) {
            noChange = false;
        } else if (updateData.CustomerData.CustomerAddress.City !== update.CustomerData.CustomerAddress.City) {
            noChange = false;
        } else if (updateData.CustomerData.CustomerAddress.ZipCode !== update.CustomerData.CustomerAddress.ZipCode) {
            noChange = false;
        } else if (updateData.CustomerData.DeliveryAddress.Addresses !== update.CustomerData.DeliveryAddress.Addresses) {
            noChange = false;
        } else if (updateData.CustomerData.DeliveryAddress.HouseNo !== update.CustomerData.DeliveryAddress.HouseNo) {
            noChange = false;
        } else if (updateData.CustomerData.DeliveryAddress.HouseExtension !== update.CustomerData.DeliveryAddress.HouseExtension) {
            noChange = false;
        } else if (updateData.CustomerData.DeliveryAddress.CountryId !== update.CustomerData.DeliveryAddress.CountryId.value) {
            noChange = false;
        } else if (updateData.CustomerData.DeliveryAddress.State !== update.CustomerData.DeliveryAddress.State) {
            noChange = false;
        } else if (updateData.CustomerData.DeliveryAddress.City !== update.CustomerData.DeliveryAddress.City) {
            noChange = false;
        } else if (updateData.CustomerData.DeliveryAddress.ZipCode !== update.CustomerData.DeliveryAddress.ZipCode) {
            noChange = false;
        }

        if (noChange == false) {
        } else {
        }
        return noChange;
    }

    $scope.saveChangesGeneral = function (data) {
        var validToSave = true;
        var noChange = $scope.isDirty_EditCustomer(data);
        if (noChange == true) {
            validToSave = false;
            Notification.error({
                message: '<strong>Failed!</strong> <span>You havent changed anything yet</span>',
                positionY: 'top',
                positionX: 'center'
            });
        }

        if (validToSave == true) {

            var dataupdate = angular.copy(data);
            var gender = $parse("data.CustomerData.Genders");
            var documentType = $parse("data.CustomerData.DocumentType");
            var cust_country = $parse("data.CustomerData.CustomerAddress.CountryId");
            var fisc_country = $parse("data.CustomerData.FiscalAddress.CountryId");
            var del_country = $parse("data.CustomerData.DeliveryAddress.CountryId");
            var nationality = $parse("data.CustomerData.Nationality");

            var birthdayDate = $filter('date')(Date.parse(data.CustomerData.BirthDay), config.DateFormatCore);
            dataupdate.CustomerData.BirthDay = birthdayDate;

            gender.assign($scope, CommonEnum.convertGender(data.CustomerData.Genders));
            documentType.assign($scope, CommonEnum.convertDocumentType(data.CustomerData.DocumentType));
            cust_country.assign($scope, CommonEnum.convertCountryList(data.CustomerData.CustomerAddress.CountryId));
            fisc_country.assign($scope, CommonEnum.convertCountryList(data.CustomerData.FiscalAddress.CountryId));
            del_country.assign($scope, CommonEnum.convertCountryList(data.CustomerData.Nationality));

            dataupdate.CustomerData.Genders = data.CustomerData.Genders.value;
            dataupdate.CustomerData.DocumentType = data.CustomerData.DocumentType.value;
            dataupdate.CustomerData.CustomerAddress.CountryId = data.CustomerData.CustomerAddress.CountryId.value;
            dataupdate.CustomerData.DeliveryAddress.CountryId = data.CustomerData.DeliveryAddress.CountryId.value;
            dataupdate.CustomerData.Nationality = data.CustomerData.Nationality.value;

            if ($scope.TemplateCode == 'etna') {
                dataupdate.CustomerData.CustomerAddress.HouseNo = '-';
                dataupdate.CustomerData.CustomerAddress.HouseExtension = '-';
                dataupdate.CustomerData.CustomerAddress.CountryId = 840;//hardcode United States
                dataupdate.CustomerData.DeliveryAddress.HouseNo = '-';
                dataupdate.CustomerData.DeliveryAddress.HouseExtension = '-';
                dataupdate.CustomerData.DeliveryAddress.CountryId = 840;//hardcode United States
            }

            dataupdate.CustomerData.FiscalAddress = dataupdate.CustomerData.CustomerAddress; ///todo rico: since fiscalAddress still mandatory on update customer details service

            $scope.SkipCheckSureAddress = false;
            if ($scope.SkipCheckSureAddress == false) {

                var createSureAddressRequest = function (address) {
                    var jsonCustAddress = {
                        "ClientNumber": "4001484326",
                        "ValidationKey": "1c542527-aeed-4054-ad8f-1d41b02ccdf3",
                        "PrimaryAddressLine": address.Addresses,
                        "SecondaryAddressLine": null,
                        "City": address.City,
                        "State": address.State,
                        "ZIPCode": address.ZipCode,
                        "MatchCount": 2,
                        "ResponseType": "S"
                    };
                    return jsonCustAddress;
                }

                if (dataupdate.CustomerData.CustomerAddress.CountryId == 840) {

                    var createSureAddressRequestForCustomerAddress = createSureAddressRequest(dataupdate.CustomerData.CustomerAddress);
                    AddressValidatorService.IsAddressValid(createSureAddressRequestForCustomerAddress).then(function (CustomerAddress_SureAddressCheck) {

                        if (CustomerAddress_SureAddressCheck.isValidAddress == true) {
                            
                            if (dataupdate.CustomerData.DeliveryAddress.CountryId == 840) {
                                var createSureAddressRequestForDeliveryAddress = createSureAddressRequest(dataupdate.CustomerData.DeliveryAddress);
                                AddressValidatorService.IsAddressValid(createSureAddressRequestForDeliveryAddress).then(function (DeliveryAddress_SureAddressCheck) {

                                    if (DeliveryAddress_SureAddressCheck.isValidAddress == true) {
                                        //CustomerAddress.CountryId == 840 ("United States") && DeliveryAddress.CountryId == 840 ("United States")
                                        //UpdateCustomerDetail
                                        $scope.doUpdateCustomerDetail(dataupdate);
                                    } else {
                                        Notification.error({
                                            message: '<strong>Failed DeliveryAddress!</strong> <span>' + DeliveryAddress_SureAddressCheck.message + '.</span>',
                                            positionY: 'top',
                                            positionX: 'center',
                                            title: "<span ><h5 style='color: white;'>DeliveryAddress Check Failed</h5></span>"
                                        });
                                    }
                                });
                            } else {

                                //CustomerAddress.CountryId == 840 ("United States") && DeliveryAddress.CountryId != 840 (not "United States")

                                //UpdateCustomerDetail
                                $scope.doUpdateCustomerDetail(dataupdate);
                            }
                        } else {
                            Notification.error({
                                message: '<strong>Failed CustomerAddress!</strong> <span>' + CustomerAddress_SureAddressCheck.message + '.</span>',
                                positionY: 'top',
                                positionX: 'center',
                                title: "<span ><h5 style='color: white;'>CustomerAddress Check Failed</h5></span>"
                            });
                        }
                    });
                } else {
                    //CustomerAddress.CountryId != 840 (not "United States")

                    if (dataupdate.CustomerData.DeliveryAddress.CountryId == 840) {
                        var createSureAddressRequestForDeliveryAddress = createSureAddressRequest(dataupdate.CustomerData.DeliveryAddress);
                        AddressValidatorService.IsAddressValid(createSureAddressRequestForDeliveryAddress).then(function (DeliveryAddress_SureAddressCheck) {

                            if (DeliveryAddress_SureAddressCheck.isValidAddress == true) {
                                //CustomerAddress.CountryId != 840 (not "United States") && DeliveryAddress.CountryId == 840 ("United States")
                                //UpdateCustomerDetail
                                $scope.doUpdateCustomerDetail(dataupdate);
                            } else {
                                Notification.error({
                                    message: '<strong>Failed DeliveryAddress!</strong> <span>' + DeliveryAddress_SureAddressCheck.message + '.</span>',
                                    positionY: 'top',
                                    positionX: 'center',
                                    title: "<span ><h5 style='color: white;'>DeliveryAddress Check Failed</h5></span>"
                                });
                            }
                        });
                    } else {
                        //CustomerAddress.CountryId != 840 (not "United States") && DeliveryAddress.CountryId != 840 (not "United States")

                        //UpdateCustomerDetail
                        $scope.doUpdateCustomerDetail(dataupdate);
                    }
                }
            } else {
                //SkipCheckSureAddress, UpdateCustomerDetail
                $scope.doUpdateCustomerDetail(dataupdate);
            }
        }

    }

    $scope.doUpdateCustomerDetail = function (dataupdate) {

        UpdateCustomerDetail.update(dataupdate, function (response) {
            if (response.ResultType != 0) {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                return false;
            } else {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Customer Detail Data Is Successfully Updated.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                angular.element('#editCustDetailModal').modal('hide');

                $rootScope.$broadcast('refresh-customerDetail');

                $timeout(function () {
                    angular.element('#btnCancelEditCustDetail').trigger('click');
                }, 100);
            }
        });
    }

    var addressField_LOWI = [
    {
        name: "Customer Address",
        value: [
            {
                type: "text",
                name: "customerAddress",
                size: 6,
                text: "Customer_Address",
                model: "update.CustomerData.CustomerAddress.Addresses",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "customerHouseNo",
                size: 6,
                text: "House_No",
                model: "update.CustomerData.CustomerAddress.HouseNo",
                required: true,
                maxlength: 25,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "customerHouseExt",
                size: 6,
                text: "House_Ext",
                model: "update.CustomerData.CustomerAddress.HouseExtension",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "select",
                name: "customerCountry",
                size: 6,
                text: "Country",
                model: "update.CustomerData.CustomerAddress.CountryId",
                value: "countries",
                required: true,
                validation: [{ value: "mandatory" }, { value: "mandatory" }]
            },
            {
                type: "text",
                name: "customerState",
                size: 6,
                text: "State",
                model: "update.CustomerData.CustomerAddress.State",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "customerCity",
                size: 6,
                text: "City",
                model: "update.CustomerData.CustomerAddress.City",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "customerZip",
                size: 6,
                text: "Zip_Code",
                model: "update.CustomerData.CustomerAddress.ZipCode",
                required: true,
                maxlength: 25,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            }
        ]
    },
    {
        name: "Delivery Address",
        value: [
            {
                type: "text",
                name: "deliveryAddress",
                size: 6,
                text: "Delivery_Address",
                model: "update.CustomerData.DeliveryAddress.Addresses",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "deliveryHouseNo",
                size: 6,
                text: "House_No",
                model: "update.CustomerData.DeliveryAddress.HouseNo",
                required: true,
                maxlength: 25,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "deliveryHouseExt",
                size: 6,
                text: "House_Ext",
                model: "update.CustomerData.DeliveryAddress.HouseExtension",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "select",
                name: "deliveryCountry",
                size: 6,
                text: "Country",
                model: "update.CustomerData.DeliveryAddress.CountryId",
                value: "countries",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "text",
                name: "deliveryState",
                size: 6,
                text: "State",
                model: "update.CustomerData.DeliveryAddress.State",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "deliveryCity",
                size: 6,
                text: "City",
                model: "update.CustomerData.DeliveryAddress.City",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "deliveryZip",
                size: 6,
                text: "Zip_Code",
                model: "update.CustomerData.DeliveryAddress.ZipCode",
                required: true,
                maxlength: 25,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            }
        ]
    }
    ]


    var addressField_ETNA = [
    {
        name: "Customer Address",
        value: [
            {
                type: "text",
                name: "customerAddress",
                size: 6,
                text: "Customer_Address",
                model: "update.CustomerData.CustomerAddress.Addresses",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            //{
            //    type: "select",
            //    name: "customerCountry",
            //    size: 6,
            //    text: "Country",
            //    model: "update.CustomerData.CustomerAddress.CountryId",
            //    value: "countries",
            //    required: true,
            //    validation: [{ value: "mandatory" }, { value: "mandatory" }]
            //},
            {
                type: "label",
                name: "customerCountry",
                size: 6,
                text: "Country",
                model: "update.CustomerData.CustomerAddress.CountryId.name",
                required: false,
                validation: false
            },
            {
                type: "text",
                name: "customerState",
                size: 6,
                text: "State",
                model: "update.CustomerData.CustomerAddress.State",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "customerCity",
                size: 6,
                text: "City",
                model: "update.CustomerData.CustomerAddress.City",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "customerZip",
                size: 6,
                text: "Zip_Code",
                model: "update.CustomerData.CustomerAddress.ZipCode",
                required: true,
                maxlength: 25,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            }
        ]
    },
    {
        name: "Delivery Address",
        value: [
            {
                type: "text",
                name: "deliveryAddress",
                size: 6,
                text: "Delivery_Address",
                model: "update.CustomerData.DeliveryAddress.Addresses",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            //{
            //    type: "select",
            //    name: "deliveryCountry",
            //    size: 6,
            //    text: "Country",
            //    model: "update.CustomerData.DeliveryAddress.CountryId",
            //    value: "countries",
            //    required: true,
            //    validation: [{ value: "mandatory" }]
            //},
            {
                type: "label",
                name: "deliveryCountry",
                size: 6,
                text: "Country",
                model: "update.CustomerData.DeliveryAddress.CountryId.name",
                required: false,
                validation: false
            },
            {
                type: "text",
                name: "deliveryState",
                size: 6,
                text: "State",
                model: "update.CustomerData.DeliveryAddress.State",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "deliveryCity",
                size: 6,
                text: "City",
                model: "update.CustomerData.DeliveryAddress.City",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "deliveryZip",
                size: 6,
                text: "Zip_Code",
                model: "update.CustomerData.DeliveryAddress.ZipCode",
                required: true,
                maxlength: 25,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            }
        ]
    }
    ]

    var addressFields;
    if ($scope.TemplateCode == 'etna') {
        addressFields = addressField_ETNA;
    } else {
        addressFields = addressField_LOWI;
    }

    /*update customer data form*/
    $scope.datas = {

        field: [
            {
                type: "text",
                name: "f_name",
                size: 6,
                text: "First_Name",
                model: "update.CustomerData.FirstName",
                required: true,
                maxlength: 200,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "m_name",
                size: 6,
                text: "Middle_Name",
                model: "update.CustomerData.MiddleName",
                required: false,
                maxlength: 100,
                validation: [{ value: "maxlength" }]
            },
            {
                type: "text",
                name: "l1_name",
                size: 6,
                text: "Last_Name",
                model: "update.CustomerData.LastName",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "select",
                name: "gender",
                size: 6,
                text: "Gender",
                model: "update.CustomerData.Genders",
                value: "genders",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "birthdate",
                name: "dateOfBirth",
                size: 6,
                text: "Date_of_Birth",
                model: "update.CustomerData.BirthDay",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "select",
                name: "idType",
                size: 6,
                text: "Id_Type",
                model: "update.CustomerData.DocumentType",
                value: "documents",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "text",
                name: "idNumber",
                size: 6,
                text: "Id_Number",
                model: "update.CustomerData.DocumentNumber",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "phone",
                name: "landlineNumber",
                size: 6,
                text: "Landline_Number",
                model: "update.CustomerData.LandlineNumber",
                required: true, //equal as Mandatory Telephone in CustomerDataDTO
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "phone" }, { value: "maxlength" }]
            },
            //{
            //    type: "label",
            //    name: "mobileNumber",
            //    size: 6,
            //    text: "Mobile_Number",
            //    model: "update.CustomerData.MobileNumber"
            //},
            {
                type: "text",
                name: "altPhoneNumber",
                size: 6,
                text: "Alt_Phone_Number",
                model: "update.CustomerData.AlternativePhoneNumber",
                required: false, //equal as NonMandatory Mobile in CustomerDataDTO
                maxlength: 100,
                validation: [{ value: "maxlength" }]
            },
            {
                type: "email",
                name: "Email",
                size: 6,
                text: "Email",
                model: "update.CustomerData.Email",
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }, { value: "email" }]
            },
            {
                type: "select",
                name: "Nationality",
                size: 6,
                text: "Nationality",
                model: "update.CustomerData.Nationality",
                value: "countries",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "text",
                name: "jobTitle",
                size: 6,
                text: "Job_Title",
                model: "update.CustomerData.JobTitle",
                required: false,
                maxlength: 100,
                validation: [{ value: "maxlength" }]
            },
            {
                type: "text",
                name: "company",
                size: 6,
                text: "Company",
                model: "update.CustomerData.Company",
                required: false,
                maxlength: 100,
                validation: [{ value: "maxlength" }]
            },
            //{
            //    type: "text",
            //    name: "cocNo",
            //    size: 6,
            //    text: "COC_No",
            //    model: "update.CustomerData.CoCNo",
            //    required: false,
            //    maxlength: 50,
            //    validation: [{ value: "maxlength" }]
            //},
            //{
            //    type: "label",
            //    name: "vatNo",
            //    size: 6,
            //    text: "VAT_No",
            //    model: "update.CustomerData.VATNo"
            //},
            {
                type: "tab",
                content: addressFields
            }
        ],
        button: [
            {
                name: "btnSubmitChangeCustDetail",
                type: "submit",
                text: "Submit",
                disabled: "isDirty_EditCustomer(update)",
                click: "saveChangesGeneral(update)"
            },
            {
                name: "btnCancelChangeCustDetail",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
    /*end of form content*/
});

/* EditCustomerStatus Form */
CSRContent.controller("EditCustomerStatusFormController", function ($scope, $parse, CommonEnum) {

    $scope.custStatusSetting = CommonEnum.getCustomerStatus();

    $scope.Close_CustomerStatusSettingModal = function (ModifyStatus) {
        if ($scope.customerStatus != undefined) {
            $scope.customerStatus = CommonEnum.convertCustomerStatus(ModifyStatus.value).name;
        }
        angular.element('#ModifyCustomerStatusModal').modal('hide');
    }

    /*update customer status form*/
    $scope.datas = {

        field: [
            {
                type: "select",
                name: "customerStatusField",
                size: 6,
                text: "Customer_Status",
                model: "ModifyStatus",
                //required: true,
                value: "custStatusSetting",
                //validation: [{ value: "mandatory" }]
            }
        ],
        button: [
            {
                type: "submit",
                text: "Submit",
                //click: "saveChangesGeneral(update)"
                click: "Close_CustomerStatusSettingModal(ModifyStatus)"
            },
            {
                type: "cancel",
                text: "Cancel",
                //click: "CSR/Customer/App/SearchPage/CustomerDetailDashboard"
                click: "modal"
            }
        ]
    }

    /*end of form content*/
});

/* EditCustomerLanguageSetting Form */
CSRContent.controller("EditCustomerLanguageSettingFormController", function ($scope, $parse, CommonEnum) {

    $scope.CustomerAvailableLanguageSetting = [
        {
            name: 'English',
            value: 'English'
        },
        //{
        //    name: 'Spain',
        //    value: 'Spain'
        //},
    ]

    $scope.Close_CustomerLanguageSettingModal = function (ModifyLanguageName) {
        if ($scope.products.CustomerData != undefined) {
            $scope.products.CustomerData.LanguageName = ModifyLanguageName.name;
        }
        angular.element('#ModifyCustomerLanguageSettingModal').modal('hide');
    }

    /*update customer data form*/
    $scope.datas = {

        field: [
            {
                type: "select",
                name: "language",
                size: 6,
                text: "Language_Setting",
                model: "ModifyLanguageName",
                //required: true,
                value: "CustomerAvailableLanguageSetting",
                //validation: [{ value: "mandatory" }]
            },
        ],
        button: [
            {
                type: "submit",
                text: "Submit",
                //click: "saveChangesGeneral(update)"
                click: "Close_CustomerLanguageSettingModal(ModifyLanguageName)"
            },
            {
                type: "cancel",
                text: "Cancel",
                //click: "CSR/Customer/App/SearchPage/CustomerDetailDashboard"
                click: "modal"
            }
        ]
    }
    /*end of form content*/
});