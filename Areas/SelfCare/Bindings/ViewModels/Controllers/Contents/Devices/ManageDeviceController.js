SelfCareNav.controller("ManageDeviceController", function ($scope, $location, ManageDeviceCacheService, CommonEnum, SelfCareCache) {
    $scope.isCompiled = false;
    $scope.notAvailableDevice = [];
    var wrap = JSON.parse(localStorage.self_scope);
    var device = [];
    var mainDevice = {
        Name: wrapper.customerInfo.FirstName + ' ' + wrapper.customerInfo.MiddleName + ' ' + wrapper.customerInfo.LastName,
        CustomerId: wrapper.customerInfo.CustomerID,
        MSISDN: wrapper.activeDevice.Msisdn,
    };

    var notAvailableFunction = function (data) {
        var notAvailable = [];
        if (data.length < 3) {
            for (var i = 0; i < 3 - data.length; i++) {
                notAvailable.push({ Id: i });
            }
        } else {
            notAvailable = undefined;
        }
        return notAvailable;
    }

    $scope.Device = device;
    $scope.CurrentMsisdn = wrap.activeDevice.Msisdn;
    $scope.Device = wrap.multiDevice;
    $scope.isCompiled = true;
    $scope.notAvailableDevice = notAvailableFunction($scope.Device);

    $scope.switchdevice = function (data) {
        if (data.SubscriptionStatus !== 8) {
            var wrap = JSON.parse(localStorage.self_scope);
            wrap.activeDevice = data
            localStorage.setItem("self_scope", JSON.stringify(wrap));
            $scope.CurrentMsisdn = angular.copy(data.MSISDN);
            SelfCareCache.remove("summary");
            SelfCareCache.remove("UsageDetails");
            SelfCareCache.remove("querybalance");
            SelfCareCache.remove("productService");
            SelfCareCache.remove("productService");
            window.location.reload()
        };
    };

    $scope.activation = function (data) {
        wrap.selectedNotActiveDevice = data;
        localStorage.setItem("self_scope", JSON.stringify(wrap));
        $location.path("SelfCare/Customer/App/Activate");
    }
});