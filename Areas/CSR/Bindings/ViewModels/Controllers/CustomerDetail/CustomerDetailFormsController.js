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
CSRContent.controller("UpdateCustomerDetailFormController", function ($scope,$rootScope, $parse, CommonEnum, $route, $filter, $timeout, UpdateCustomerDetail, Notification,SearchCustomerDetailService,SearchPageService,CSRCache, CacheSearch, pinnedHtmlService) {
    $scope.countries = CommonEnum.getCountryList();
    $scope.documents = CommonEnum.getDocumentType();
    $scope.genders = CommonEnum.getGender();

    $scope.saveChangesGeneral = function (data) {
        var dataupdate = angular.copy(data);
        var gender = $parse("data.CustomerData.Genders");
        var documentType = $parse("data.CustomerData.DocumentType");
        var cust_country = $parse("data.CustomerData.CustomerAddress.CountryId");
        var fisc_country = $parse("data.CustomerData.FiscalAddress.CountryId");
        var del_country = $parse("data.CustomerData.DeliveryAddress.CountryId");
        
        var birthdayDate = $filter('date')(Date.parse(data.CustomerData.BirthDay), "yyyy-MM-dd HH:mm:ss Z");
        //var birthDayParts = data.CustomerData.BirthDay.split('/');
        //var updatedBirthday = new Date(birthDayParts[2], parseInt(birthDayParts[1]), parseInt(birthDayParts[0]));
        console.log(birthdayDate);
        dataupdate.CustomerData.BirthDay = birthdayDate;

        gender.assign($scope, CommonEnum.convertGender(data.CustomerData.Genders));
        documentType.assign($scope, CommonEnum.convertDocumentType(data.CustomerData.DocumentType));
        cust_country.assign($scope, CommonEnum.convertCountryList(data.CustomerData.CustomerAddress.CountryId));
        fisc_country.assign($scope, CommonEnum.convertCountryList(data.CustomerData.FiscalAddress.CountryId));
        del_country.assign($scope, CommonEnum.convertCountryList(data.CustomerData.DeliveryAddress.CountryId));

        dataupdate.CustomerData.Genders = data.CustomerData.Genders.value;
        dataupdate.CustomerData.DocumentType = data.CustomerData.DocumentType.value;
        dataupdate.CustomerData.CustomerAddress.CountryId = data.CustomerData.CustomerAddress.CountryId.value;
        dataupdate.CustomerData.FiscalAddress.CountryId = data.CustomerData.FiscalAddress.CountryId.value;
        dataupdate.CustomerData.DeliveryAddress.CountryId = data.CustomerData.DeliveryAddress.CountryId.value;

        console.log(dataupdate);
            UpdateCustomerDetail.update(dataupdate, function(response) {
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
                    SearchCustomerDetailService.get({ customerIdtemp: localStorage.CustomerID }, function (data) {
                        var updatesDetail = angular.copy(data);
                        CSRCache.put('updateCustDetail', data);
                        $rootScope.firstName = updatesDetail.CustomerData.FirstName;
                        $rootScope.middleName = updatesDetail.CustomerData.MiddleName;
                        $rootScope.lastName = updatesDetail.CustomerData.LastName;
                        $rootScope.genders = CommonEnum.convertGender(updatesDetail.CustomerData.Genders).name;
                        var temp = updatesDetail.CustomerData.BirthDay;
                        if ((temp === null) || (temp === undefined)) {
                            $rootScope.birthday = "";
                        } else {
                            $rootScope.birthday = moment(temp).format('DD MMMM YYYY');
                        }
                        $rootScope.idType = CommonEnum.convertDocumentType(updatesDetail.CustomerData.DocumentType).name;
                        $rootScope.idNumber = updatesDetail.CustomerData.DocumentNumber;
                        $rootScope.landlineNumber = updatesDetail.CustomerData.LandlineNumber;
                        $rootScope.mobileNumber = updatesDetail.CustomerData.MobileNumber;
                        $rootScope.altPhoneNumber = updatesDetail.CustomerData.AlternativePhoneNumber;
                        $rootScope.email = updatesDetail.CustomerData.Email;

                        var custHouseExt = updatesDetail.CustomerData.CustomerAddress.HouseExtension;
                        var delHouseExt = updatesDetail.CustomerData.DeliveryAddress.HouseExtension;
                        var fisHouseExt = updatesDetail.CustomerData.FiscalAddress.HouseExtension;

                        var custHouseNo = updatesDetail.CustomerData.CustomerAddress.HouseNo;
                        var delHouseNo = updatesDetail.CustomerData.DeliveryAddress.HouseNo;
                        var fisHouseNo = updatesDetail.CustomerData.FiscalAddress.HouseNo;

                        var custAddress = updatesDetail.CustomerData.CustomerAddress.Addresses;
                        var delAddress = updatesDetail.CustomerData.DeliveryAddress.Addresses;
                        var fisAddress = updatesDetail.CustomerData.FiscalAddress.Addresses;

                        var custCity = updatesDetail.CustomerData.CustomerAddress.City;
                        var delCity = updatesDetail.CustomerData.DeliveryAddress.City;
                        var fisCity = updatesDetail.CustomerData.FiscalAddress.City;

                        var custState = updatesDetail.CustomerData.CustomerAddress.State;
                        var delState = updatesDetail.CustomerData.DeliveryAddress.State;
                        var fisState = updatesDetail.CustomerData.FiscalAddress.State;

                        if ((custHouseExt === null) || (custHouseExt === "") || (custHouseExt === undefined)) {
                            $rootScope.customerAddress = custAddress + ' ' + custHouseNo + ', ' + custCity + ', ' + custState + ' ' + updatesDetail.CustomerData.CustomerAddress.ZipCode;
                            $rootScope.fiscalAddress = fisAddress + ' ' + fisHouseNo + ', ' + fisCity + ', ' + fisState + ' ' + updatesDetail.CustomerData.FiscalAddress.ZipCode;
                            $rootScope.deliveryAddress = delAddress + ' ' + delHouseNo + ', ' + delCity + ', ' + delState + ' ' + updatesDetail.CustomerData.DeliveryAddress.ZipCode;
                        } else {
                            $rootScope.customerAddress = custAddress + ' ' + custHouseNo + ', ext. ' + custHouseExt + ', ' + custCity + ', ' + custState + ' ' + updatesDetail.CustomerData.CustomerAddress.ZipCode;
                            $rootScope.fiscalAddress = fisAddress + ' ' + fisHouseNo + ', ext. ' + fisHouseExt + ', ' + fisCity + ', ' + fisState + ' ' + updatesDetail.CustomerData.FiscalAddress.ZipCode;
                            $rootScope.deliveryAddress = delAddress + ' ' + delHouseNo + ', ext. ' + delHouseExt + ', ' + delCity + ', ' + delState + ' ' + updatesDetail.CustomerData.DeliveryAddress.ZipCode;
                        }

                        $rootScope.jobTitle = updatesDetail.CustomerData.JobTitle;
                        $rootScope.company = updatesDetail.CustomerData.Company;
                        $rootScope.cocNo = updatesDetail.CustomerData.CoCNo;
                        $rootScope.vatNo = updatesDetail.CustomerData.VATNo;

                        var pinned = { pinnedId: updatesDetail.CustomerID, pinnedName: updatesDetail.CustomerData.FirstName + ' ' + updatesDetail.CustomerData.LastName, pinnedPhone: updatesDetail.CustomerData.MobileNumber };
                        pinnedHtmlService.setPinned(pinned);

                        var pinHtml = pinnedHtmlService.getPinned();
                        $rootScope.pinnedCustId = pinHtml.pinnedId;
                        $rootScope.pinnedCustName = pinHtml.pinnedName;
                        $rootScope.pinnedMSISDN = pinHtml.pinnedPhone;

                        $rootScope.isUpdated = true;
                    });
                    $timeout(function() {
                        angular.element('#btnCancelEditCustDetail').trigger('click');
                    }, 100);
                }
            });
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
                required: true,
                maxlength: 100,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
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
                type: "date",
                name: "dateOfBirth",
                size: 6,
                text: "Date_of_Birth",
                model: "update.CustomerData.BirthDay",
                required: true
            },
            {
                type: "select",
                name: "idType",
                size: 6,
                text: "Id_Type",
                model: "update.CustomerData.DocumentType",
                value: "documents",
                required: false,
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
                required: false,
                maxlength: 50,
                validation: [{ value: "phone" }, { value: "maxlength" }]
            },
            {
                type: "phone",
                name: "mobileNumber",
                size: 6,
                text: "Mobile_Number",
                model: "update.CustomerData.MobileNumber",
                required: true,
                maxlength: 50,
                validation: [{ value: "phone" }, { value: "maxlength" }]
            },
            {
                type: "phone",
                name: "altPhoneNumber",
                size: 6,
                text: "Alt_Phone_Number",
                model: "update.CustomerData.AlternativePhoneNumber",
                required: false,
                maxlength: 25,
                validation: [{ value: "phone" }, { value: "maxlength" }]
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
            {
                type: "text",
                name: "cocNo",
                size: 6,
                text: "COC_No",
                model: "update.CustomerData.CoCNo",
                required: false,
                maxlength: 50,
                validation: [{ value: "maxlength" }]
            },
            {
                type: "text",
                name: "vatNo",
                size: 6,
                text: "VAT_No",
                model: "update.CustomerData.VATNo",
                required: false,
                maxlength: 50,
                validation: [{ value: "maxlength" }]
            },
            {
                type: "tab",
                content: [
                    {
                        name: "Fiscal_Address",
                        value: [
                            {
                                type: "text",
                                name: "fiscalAddress",
                                size: 6,
                                text: "Fiscal_Address",
                                model: "update.CustomerData.FiscalAddress.Addresses",
                                required: true,
                                maxlength: 100,
                                validation: [{ value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "fiscalHouseNo",
                                size: 6,
                                text: "House_No",
                                model: "update.CustomerData.FiscalAddress.HouseNo",
                                required: true,
                                maxlength: 25,
                                validation: [{ value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "fiscalHouseExt",
                                size: 6,
                                text: "House_Ext",
                                model: "update.CustomerData.FiscalAddress.HouseExtension",
                                required: true,
                                maxlength: 100,
                                validation: [{ value: "maxlength" }]
                            },
                            {
                                type: "select",
                                name: "fiscalCountry",
                                size: 6,
                                text: "Country",
                                model: "update.CustomerData.FiscalAddress.CountryId",
                                value: "countries",
                                required: true,
                                validation: [{ value: "mandatory" }]
                            },
                            {
                                type: "text",
                                name: "fiscalState",
                                size: 6,
                                text: "State",
                                model: "update.CustomerData.FiscalAddress.State",
                                required: true,
                                maxlength: 100,
                                validation: [{ value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "fiscalCity",
                                size: 6,
                                text: "City",
                                model: "update.CustomerData.FiscalAddress.City",
                                required: true,
                                maxlength: 100,
                                validation: [{ value: "mandatory" },{ value: "maxlength" }] 
                            },
                            {
                                type: "text",
                                name: "fiscalZip",
                                size: 6,
                                text: "Zip_Code",
                                model: "update.CustomerData.FiscalAddress.ZipCode",
                                required: true,
                                maxlength: 25,
                                validation: [{ value: "mandatory" },{ value: "maxlength" }] 
                            }
                        ]
                    },
                    {
                        name: "Delivery_Address",
                        value: [
                            {
                                type: "text",
                                name: "deliveryAddress",
                                size: 6,
                                text: "Fiscal_Address",
                                model: "update.CustomerData.DeliveryAddress.Addresses",
                                required: true,
                                maxlength: 100,
                                validation: [{ value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "deliveryHouseNo",
                                size: 6,
                                text: "House_No",
                                model: "update.CustomerData.DeliveryAddress.HouseNo",
                                required: true,
                                maxlength: 25,
                                validation: [{ value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "deliveryHouseExt",
                                size: 6,
                                text: "House_Ext",
                                model: "update.CustomerData.DeliveryAddress.HouseExtension",
                                required: true,
                                maxlength: 100,
                                validation: [{ value: "maxlength" }]
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
                                validation: [{ value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "deliveryCity",
                                size: 6,
                                text: "City",
                                model: "update.CustomerData.DeliveryAddress.City",
                                required: true,
                                maxlength: 100,
                                validation: [{value: "mandatory"},{ value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "deliveryZip",
                                size: 6,
                                text: "Zip_Code",
                                model: "update.CustomerData.DeliveryAddress.ZipCode",
                                required: true,
                                maxlength: 25,
                                validation: [{value: "mandatory"},{ value: "maxlength" }]
                            }
                        ]
                    },
                    {
                        name: "Customer_Address",
                        value: [
                            {
                                type: "text",
                                name: "customerAddress",
                                size: 6,
                                text: "Customer_Address",
                                model: "update.CustomerData.CustomerAddress.Addresses",
                                required: true,
                                maxlength: 100,
                                validation: [{ value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "customerHouseNo",
                                size: 6,
                                text: "House_No",
                                model: "update.CustomerData.CustomerAddress.HouseNo",
                                required: true,
                                maxlength: 25,
                                validation: [{ value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "customerHouseExt",
                                size: 6,
                                text: "House_Ext",
                                model: "update.CustomerData.CustomerAddress.HouseExtension",
                                required: true,
                                maxlength: 100,
                                validation: [{ value: "maxlength" }]
                            },
                            {
                                type: "select",
                                name: "customerCountry",
                                size: 6,
                                text: "Country",
                                model: "update.CustomerData.CustomerAddress.CountryId",
                                value: "countries",
                                required: true,
                                validation: [{ value: "mandatory" }]
                            },
                            {
                                type: "text",
                                name: "customerState",
                                size: 6,
                                text: "State",
                                model: "update.CustomerData.CustomerAddress.State",
                                required: true,
                                maxlength: 100,
                                validation: [{ value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "customerCity",
                                size: 6,
                                text: "City",
                                model: "update.CustomerData.CustomerAddress.City",
                                required: true,
                                maxlength: 100,
                                validation: [{ value: "mandatory" },{ value: "maxlength" }]
                            },
                            {
                                type: "text",
                                name: "customerZip",
                                size: 6,
                                text: "Zip_Code",
                                model: "update.CustomerData.CustomerAddress.ZipCode",
                                required: true,
                                maxlength: 25,
                                validation: [{ value: "mandatory" },{ value: "maxlength" }]
                            }
                        ]
                    }
                ]
            }
        ],
        button: [
            {
                name: "btnSubmitChangeCustDetail",
                type: "submit",
                text: "Submit",
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
    setTimeout(function () {
        init();
    }, 1000);
    /*end of form content*/
});

/* EditCustomerStatus Form */
CSRContent.controller("EditCustomerStatusFormController", function ($scope, $parse, CommonEnum) {
    $scope.custStatus = CommonEnum.getCustomerStatus();
    
    /*update customer status form*/
    $scope.datas = {

        field: [
            //{
            //    type: "select",
            //    name: "custStatus",
            //    size: 6,
            //    text: "Customer Status",
            //    model: "",
            //    value: "custStatus",
            //    required: true,
            //    validation: [{ value: "mandatory" }]
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

/* EditCustomerLanguageSetting Form */
CSRContent.controller("EditCustomerLanguageSettingFormController", function ($scope, $parse, CommonEnum) {
    /*update customer data form*/
    $scope.datas = {

        field: [
            //{
            //    type: "select",
            //    name: "language",
            //    size: 6,
            //    text: "Language Setting",
            //    model: "",
            //    required: true,
            //    validation: [{ value: "mandatory" }]
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



