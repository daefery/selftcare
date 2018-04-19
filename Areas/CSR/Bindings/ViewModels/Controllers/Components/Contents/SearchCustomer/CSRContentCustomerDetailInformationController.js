/// <reference path="../../../../../../../Templates/CSR/Customer/CustomerDetailInformation.html" />
/// <reference path="../../../../../../../Templates/CSR/Customer/EditCustomer/EditCustomerDetailPopUp.html" />
//Agung Meinastesi Caesar
// Controlder for customer detail
CSRContent.controller("CustomerDetailInformation", function ($scope, $rootScope, $http, $q, ApiConnection, breadcrumbs, SearchCustomerDetailService, CacheSearch, CSRCache, CommonEnum, pinnedHtmlService, $filter, $parse, CSRGetCustomerBalanceService, GetOrdersbyFilterService, ErrorHandlerUtility, ValidateUser, LocalStorageProvider) {

    //if (typeof customerId === 'undefined') {
    //}
    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();
    $scope.TemplateCode = LocalStorageProvider.getTemplateCode();

    var pinHtml
    if (!customerId) {
        var customerSession = sessionStorage.CustomerDataForCustomerSummary != undefined ? JSON.parse(sessionStorage.CustomerDataForCustomerSummary) : {};
        customerId = customerSession.customerid;
        pinHtml = customerSession.pinned;
    } else {
        pinHtml = pinnedHtmlService.getPinned();
    }

    CacheSearch.getSearchDetailCustomer().then(function (result) {
        $rootScope.pinnedCustId = pinHtml.pinnedId;
        $rootScope.pinnedCustName = pinHtml.pinnedName;
        $rootScope.pinnedMSISDN = pinHtml.pinnedPhone;
        data = angular.copy(result);
        $scope.defaultDetail = data;
        $scope.update = data;
        $scope.products = data;

        if ($scope.products.CustomerData.Email !== null) {
            ValidateUser.get({ username: $scope.products.CustomerData.Email }, function (resource) {
                if (resource.$status == 200) {
                    if (ErrorHandlerUtility.IsResultTypeOK(resource)) {
                        document.getElementById('editcustomerdetail_Email').disabled = false;
                    } else {
                        document.getElementById('editcustomerdetail_Email').disabled = true;
                    }
                } else {
                    // Get the error message from the body response
                    var msg = ErrorHandlerUtility.GetErrorMessage(data);
                    // Set notification for error message
                    Notification.error({
                        message: msg,
                        positionY: 'top',
                        positionX: 'center',
                        delay: 10000,
                    });
                }
            });
        }

        $scope.resetEditDetailForm = function () {
            $scope.update = angular.copy($scope.defaultDetail);
        }

        if ($scope.products != null) {

            localStorage.CustomerID = $scope.products.CustomerID;
            localStorage.MSISDN = $scope.products.CustomerData.MobileNumber;

            $scope.customerId = $scope.products.CustomerID;
            $rootScope.firstName = $scope.products.CustomerData.FirstName;
            $rootScope.middleName = $scope.products.CustomerData.MiddleName;
            $rootScope.lastName = $scope.products.CustomerData.LastName;
            $rootScope.genders = CommonEnum.convertGender($scope.products.CustomerData.Genders).name;
            var temp = ($scope.products.CustomerData.BirthDay);
            if ((temp === null) || (temp === undefined)) {
                $rootScope.birthday = "";
            } else {
                $rootScope.birthday = moment(temp).format(config.DateFormatMoment);
            }
            $rootScope.idType = CommonEnum.convertDocumentType($scope.products.CustomerData.DocumentType).name;
            $rootScope.idNumber = $scope.products.CustomerData.DocumentNumber;
            $rootScope.landlineNumber = $scope.products.CustomerData.LandlineNumber;
            $rootScope.mobileNumber = $scope.products.CustomerData.MobileNumber;
            $rootScope.altPhoneNumber = $scope.products.CustomerData.AlternativePhoneNumber;
            $rootScope.email = $scope.products.CustomerData.Email;
            

            var custHouseExt = $scope.products.CustomerData.CustomerAddress.HouseExtension;
            var delHouseExt = $scope.products.CustomerData.DeliveryAddress.HouseExtension;

            var custHouseNo = $scope.products.CustomerData.CustomerAddress.HouseNo;
            var delHouseNo = $scope.products.CustomerData.DeliveryAddress.HouseNo;

            var custAddress = $scope.products.CustomerData.CustomerAddress.Addresses;
            var delAddress = $scope.products.CustomerData.DeliveryAddress.Addresses;

            var custCity = $scope.products.CustomerData.CustomerAddress.City;
            var delCity = $scope.products.CustomerData.DeliveryAddress.City;

            var custState = $scope.products.CustomerData.CustomerAddress.State;
            var delState = $scope.products.CustomerData.DeliveryAddress.State;

            var custCountry = CommonEnum.convertCountryList($scope.products.CustomerData.CustomerAddress.CountryId).name;
            var delCountry = CommonEnum.convertCountryList($scope.products.CustomerData.DeliveryAddress.CountryId).name;

            if ($scope.TemplateCode == 'lowi') {
                if ((custHouseExt === null) || (custHouseExt === "") || (custHouseExt === undefined)) {
                    $rootScope.customerAddress = custAddress + ' ' + custHouseNo + ', ' + custCity + ', ' + custState + ', ' + custCountry + ' ' + $scope.products.CustomerData.CustomerAddress.ZipCode;
                    $rootScope.deliveryAddress = delAddress + ' ' + delHouseNo + ', ' + delCity + ', ' + delState + ', ' + delCountry + ' ' + $scope.products.CustomerData.DeliveryAddress.ZipCode;
                } else {
                    $rootScope.customerAddress = custAddress + ' ' + custHouseNo + ', ext. ' + custHouseExt + ', ' + custCity + ', ' + custState + ', ' + custCountry + ' ' + $scope.products.CustomerData.CustomerAddress.ZipCode;
                    $rootScope.deliveryAddress = delAddress + ' ' + delHouseNo + ', ext. ' + delHouseExt + ', ' + delCity + ', ' + delState + ', ' + delCountry + ' ' + $scope.products.CustomerData.DeliveryAddress.ZipCode;
                }
            } else {    //no houseno and ext
                $rootScope.customerAddress = custAddress + ', ' + custCity + ', ' + custState + ', ' + custCountry + ' ' + $scope.products.CustomerData.CustomerAddress.ZipCode;
                $rootScope.deliveryAddress = delAddress + ', ' + delCity + ', ' + delState + ', ' + delCountry + ' ' + $scope.products.CustomerData.DeliveryAddress.ZipCode;
            }

            $rootScope.jobTitle = $scope.products.CustomerData.JobTitle;
            $rootScope.company = $scope.products.CustomerData.Company;
            $rootScope.cocNo = $scope.products.CustomerData.CoCNo;
            $rootScope.vatNo = $scope.products.CustomerData.VATNo;
            $rootScope.createDate = moment($scope.products.CustomerData.CreateDate).format(config.DateFormatMoment);

            $rootScope.remark = $scope.products.CustomerData.Remark;

            //start mapping data to edit customer detail modal
            var gender = $parse("update.CustomerData.Genders");
            var documentType = $parse("update.CustomerData.DocumentType");
            var cust_country = $parse("update.CustomerData.CustomerAddress.CountryId");
            var fisc_country = $parse("update.CustomerData.FiscalAddress.CountryId");
            var del_country = $parse("update.CustomerData.DeliveryAddress.CountryId");
            var birthday = moment($scope.update.CustomerData.BirthDay).format(config.DateFormatMoment);
            $scope.update.CustomerData.BirthDay = birthday;
            gender.assign($scope, CommonEnum.convertGender($scope.update.CustomerData.Genders));
            documentType.assign($scope, CommonEnum.convertDocumentType($scope.update.CustomerData.DocumentType));
            cust_country.assign($scope, CommonEnum.convertCountryList($scope.update.CustomerData.CustomerAddress.CountryId));
            fisc_country.assign($scope, CommonEnum.convertCountryList($scope.update.CustomerData.FiscalAddress.CountryId));
            del_country.assign($scope, CommonEnum.convertCountryList($scope.update.CustomerData.DeliveryAddress.CountryId));
            //end mapping data to edit customer detail modal

            $scope.country = CommonEnum.convertCountryList($scope.products.CustomerData.Nationality).name;
            $scope.customerStatus = CommonEnum.convertCustomerStatus($scope.products.Status).name;
        }
    });
});

CSRContent.controller('CustDetailModalController', function ($scope, $modal, $parse, CSRCache, CommonEnum, $filter) {
    $scope.animationsEnabled = true;

    $scope.openEditDetail = function (size) {
        var custDetail = CSRCache.get('searchDetail');
        $scope.update = angular.copy(custDetail);

        var gender = $parse("update.CustomerData.Genders");
        var documentType = $parse("update.CustomerData.DocumentType");
        var cust_country = $parse("update.CustomerData.CustomerAddress.CountryId");
        var fisc_country = $parse("update.CustomerData.FiscalAddress.CountryId");
        var del_country = $parse("update.CustomerData.DeliveryAddress.CountryId");
        var birthday = moment($scope.update.CustomerData.BirthDay).format(config.DateFormatMoment);
        $scope.update.CustomerData.BirthDay = birthday;
        gender.assign($scope, CommonEnum.convertGender($scope.update.CustomerData.Genders));
        documentType.assign($scope, CommonEnum.convertDocumentType($scope.update.CustomerData.DocumentType));
        cust_country.assign($scope, CommonEnum.convertCountryList($scope.update.CustomerData.CustomerAddress.CountryId));
        fisc_country.assign($scope, CommonEnum.convertCountryList($scope.update.CustomerData.FiscalAddress.CountryId));
        del_country.assign($scope, CommonEnum.convertCountryList($scope.update.CustomerData.DeliveryAddress.CountryId));

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'Templates/CSR/Customer/EditCustomer/EditCustomerDetailPopUp.html',
            controller: 'ModalInstanceController',
            size: size,
            resolve: {
                items: function () {
                    return $scope.update;
                }
            }
        });

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    }

    $scope.openEditStatus = function (size) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'Templates/CSR/Customer/EditCustomer/EditCustomerStatusPopUp.html',
            controller: 'ModalInstanceController',
            size: size
        });

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    }

    $scope.openEditLanguage = function (size) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'Templates/CSR/Customer/EditCustomer/EditCustomerLanguageSettingPopUp.html',
            controller: 'ModalInstanceController',
            size: size
        });

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    }

    $scope.openDeleteCustomer = function (size) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'Templates/CSR/Customer/EditCustomer/DeleteCustomerPopUp.html',
            controller: 'ModalInstanceController',
            size: size
        });

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    }

    $scope.openEditCustomerRemarks = function (size) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'Templates/CSR/Customer/EditCustomer/EditCustomerRemarksPopUp.html',
            controller: 'ModalInstanceController',
            size: size

        });

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    }

});

CSRContent.controller('ModalInstanceController', function ($scope, $modalInstance, items, $parse, CommonEnum) {
    $scope.update = angular.copy(items);

    $scope.close = function () {
        $modalInstance.close();
        $scope.update = items;
    };
});

