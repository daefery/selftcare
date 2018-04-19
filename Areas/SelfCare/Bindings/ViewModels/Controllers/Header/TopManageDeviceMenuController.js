SelfCareHeader.controller("TopManageDeviceMenuController", function ($scope, $route, $location, ManageDeviceCacheService, SelfCareCache, SelfcareSecureSection, $filter) {
    var CustomerId = wrapper.customerInfo.CustomerID;
    var wrap = JSON.parse(localStorage.self_scope);
    $scope.SelectedDevice = wrap.activeDevice.Msisdn;
    SelfcareSecureSection.get({ ModuleId: 3 }, function (result) {
        $scope.isManageDeviceHeaderEnable = false;
        var objectDeviceHeader = $filter('filter')(result, { SectionKey: 'MANAGE_DEVICE_HEADER' })[0];
        if (wrap.multiDevice.length < 2) {
            $scope.isManageDeviceHeaderEnable = false;
        } else {
            if (objectDeviceHeader != null) $scope.isManageDeviceHeaderEnable = true;
            $scope.MSISDNParentChild = [];
            var msisdncollection = wrap.multiDevice;
            for (var i = 0; i < msisdncollection.length; i++) {
                if (msisdncollection[i].SubscriptionStatus !== 8) {
                    $scope.MSISDNParentChild.push(msisdncollection[i]);
                }
            };
        }
    });

    

    $scope.ChangeCustomer = function (data) {
        var wrap = JSON.parse(localStorage.self_scope);
        wrap.activeDevice = data
        localStorage.setItem("self_scope", JSON.stringify(wrap));
        SelfCareCache.remove("summary");
        SelfCareCache.remove("UsageDetails");
        SelfCareCache.remove("querybalance");
        SelfCareCache.remove("productService");
        SelfCareCache.remove("productService");
        window.location.reload()
    }
});