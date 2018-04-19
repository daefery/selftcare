'use strict';
SelfCareContent.controller("UpdateDetailCustomerController", function ($scope, $location, $timeout, $http, $parse, $filter, CommonEnum, CustomerCache, SelfCareCache, Notification, CustomerInfo, UserAccountManagement) {
    var oriUpdate = {};
    $scope.update = {};
    var fakeemail = "";
    var isUpdated = false;
    CustomerCache.getDataGeneral({ customerid: wrapper.customerInfo.CustomerID }).then(function (result)
    {
        var bdate = result.CustomerData.BirthDay != null ? moment(result.CustomerData.BirthDay).format(config.DateFormatMoment) : '-';
        $scope.update = angular.copy(result);
        fakeemail = angular.copy(result.CustomerData.Email);
        var cust_country = $parse("update.CustomerData.CustomerAddress.CountryId");
        var fisc_country = $parse("update.CustomerData.FiscalAddress.CountryId");
        var del_country = $parse("update.CustomerData.DeliveryAddress.CountryId");
        var birthOfDate = $parse("update.CustomerData.BirthDay");
        cust_country.assign($scope, CommonEnum.convertCountryList($scope.update.CustomerData.CustomerAddress.CountryId));
        fisc_country.assign($scope, CommonEnum.convertCountryList($scope.update.CustomerData.FiscalAddress.CountryId));
        del_country.assign($scope, CommonEnum.convertCountryList($scope.update.CustomerData.DeliveryAddress.CountryId));
        birthOfDate.assign($scope, bdate);
        oriUpdate = angular.copy($scope.update);
        
    });

    $scope.isFormChanged = function () {
        return !angular.equals($scope.update, oriUpdate);
    };

    $scope.saveChangesGeneral = function (data) {
        var set = angular.copy(data);
        var dataupdate = data;
        dataupdate.CustomerData.LastName2 = data.CustomerData.LastName;
        dataupdate.CustomerData.CustomerAddress.CountryId = data.CustomerData.CustomerAddress.CountryId.value;
        dataupdate.CustomerData.FiscalAddress.CountryId = data.CustomerData.FiscalAddress.CountryId.value;
        dataupdate.CustomerData.DeliveryAddress.CountryId = data.CustomerData.DeliveryAddress.CountryId.value;
        var birthdayDate = $filter('date')(Date.parse(data.CustomerData.BirthDay), config.DateFormatCore);
        dataupdate.CustomerData.BirthDay = birthdayDate;
        if (wrapper.customerInfo.CustomerID) {
            $scope.doUpadate(dataupdate);
        }
        $scope.update = set;
    }

    $scope.doUpadate = function (param) {
        var auth = JSON.parse(localStorage.AuthData);
        var wrap = JSON.parse(localStorage.self_scope);
        CustomerInfo.updatecustomerinfo.update(param, function (result) {
            if (result.ResultType != 0) {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + result.Messages[0] + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                isUpdated = false;
                return false;
            } else {
                isUpdated = true;
                Notification.success({
                    message: '<strong>Success!</strong> <span>your profile is updated.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                $timeout(function () {
                    if (auth.email != param.CustomerData.Email) {
                        auth.email = param.CustomerData.Email;
                        localStorage.setItem("AuthData", JSON.stringify(auth));
                        localStorage.removeItem("self_scope");
                    } else {
                        //if (wrap.main.CustomerID != wrap.child.CustomerID) {
                        //    wrap.child.Username = $scope.update.CustomerData.FirstName + ' ' + $scope.update.CustomerData.LastName;
                        //    localStorage.setItem("self_scope", JSON.stringify(wrap));
                        //} else {
                        //    localStorage.removeItem("self_scope");
                        //}
                    }
                    SelfCareCache.remove("GeneralInfo");
                    $location.path("/SelfCare/Customer/App/YourProfile");
                }, 2000);
            }
        });
    }

    $scope.$on('$locationChangeStart', function (event, current, previous) {
        var urls = $location.protocol() + "://" + location.host + "/SelfCare/Customer/App/UpdateProfile";
        if (previous == urls && $scope.isFormChanged()) {
            if (!isUpdated) {
                var r = confirm("Are you sure want to leave this page? Your changes data will be removed...");
                if (r == true) {
                    $location.path(current.path);
                } else {
                    $location.path(Console.rootPath + 'SelfCare/Customer/App/UpdateProfile');
                }
            } else {
                $location.path(current.path);
            }
            
        } else {
            $location.path(current.path);
        }
    });
});