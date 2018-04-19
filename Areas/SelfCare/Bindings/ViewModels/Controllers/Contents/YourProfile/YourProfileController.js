SelfCareContent.controller("YourProfileController", function ($scope, CommonEnum, CustomerCache, NavigationMenuCache, SelfCareDashboard, SelfCareCache) {
    var cacheKey = 'DashboardMenu';
    $scope.getVal = angular.copy(SelfCareCache.get(cacheKey));
    if (typeof $scope.getVal === 'undefined') {
        SelfCareDashboard.get(function (data) {
            $scope.getVal = angular.copy(data);
            SelfCareCache.put(cacheKey, data);
            $scope.mainDashboard = dynamicDashboard($scope.getVal)
        })
    }
    else {
        $scope.mainDashboard = dynamicDashboard($scope.getVal);
    };
    CustomerCache.getDataGeneral({ customerid: wrapper.customerInfo.CustomerID }).then(function (data) {
        $scope.Name = data.CustomerData.FirstName + " " + data.CustomerData.MiddleName + " " + data.CustomerData.LastName;
        $scope.Email = data.CustomerData.Email != "" ? data.CustomerData.Email : "-";
        $scope.DocumentType = CommonEnum.convertDocumentType(data.CustomerData.DocumentType).name;
        $scope.DocumentNumber = data.CustomerData.DocumentNumber;
        $scope.CustomerAddress = data.CustomerData.CustomerAddress.Addresses + " No. " + data.CustomerData.CustomerAddress.HouseNo + " ext: " + data.CustomerData.CustomerAddress.HouseExtension + ", " + data.CustomerData.CustomerAddress.State + ", " + data.CustomerData.CustomerAddress.City + ", " + CommonEnum.convertCountryList(data.CustomerData.CustomerAddress.CountryId).name + ", " + data.CustomerData.CustomerAddress.ZipCode;
        $scope.FiscalAddress = data.CustomerData.FiscalAddress.Addresses + " No. " + data.CustomerData.FiscalAddress.HouseNo + " ext: " + data.CustomerData.FiscalAddress.HouseExtension + ", " + data.CustomerData.FiscalAddress.State + ", " + data.CustomerData.FiscalAddress.City + ", " + CommonEnum.convertCountryList(data.CustomerData.FiscalAddress.CountryId).name + ", " + data.CustomerData.FiscalAddress.ZipCode;
        $scope.DeliveryAddress = data.CustomerData.DeliveryAddress.Addresses + " No. " + data.CustomerData.DeliveryAddress.HouseNo + " ext: " + data.CustomerData.DeliveryAddress.HouseExtension + ", " + data.CustomerData.DeliveryAddress.State + ", " + data.CustomerData.DeliveryAddress.City + ", " + CommonEnum.convertCountryList(data.CustomerData.DeliveryAddress.CountryId).name + ", " + data.CustomerData.DeliveryAddress.ZipCode;
        $scope.BankInformation = data.CustomerData.BankInformation;
        $scope.Nationality = CommonEnum.convertCountryList(data.CustomerData.Nationality).name;
        $scope.BirthOfDate = data.CustomerData.BirthDay != null ? moment(data.CustomerData.BirthDay).format(config.DateFormatMoment) :'-';
    });

    if (config.TemplateCode == 'etna') {
    } else {
        //CustomerCache.getUsageDetail({ customerid: wrapper.customerInfo.CustomerID }).then(function (data) {
        //    $scope.usage = data;
        //});
        CustomerCache.getUsageDetail({ customerid: wrapper.customerInfo.CustomerID }).then(function (data) {
            //$scope.usage = data;
            var usage = data.CustomerUsage;
            $scope.dataUsage = (usage.DataUsage) / 1024;
            $scope.voiceUsage = usage.VoiceUsage;
            $scope.textUsage = usage.SMSUsage;
        });
    }

});