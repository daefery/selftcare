SelfCareContent.controller("StartingDevicesController", function ($scope, $location, ManageDeviceCacheService, CommonEnum, SelfCareCache, Notification) {
    $scope.isCompiled = false;
    $scope.isStartCompiled = false;
    $scope.Devices = {};
    $scope.CustomerID = {};
    $scope.ZeroActiveDevice = false;
    var wrap = JSON.parse(localStorage.self_scope);
    var totalactivedevice = wrap.totalSubscriptionActive;
    var totalinitdevice = wrap.totalSubscriptionInit;
    $scope.Devices = wrap.multiDevice;
    $scope.Username = wrap.customerInfo.FirstName + ' ' + wrap.customerInfo.LastName

    
    var checkInitNotification = function () {
        if (totalinitdevice > 0) {
            Notification.warning({
                message: '<p><strong>You have ' + totalinitdevice + ' device(s) that need to be</strong></p>'+
                '<p><strong>activate</strong></p>',
                positionY: 'top',
                positionX: 'right',
                delay: 10000
            });
        }
    }

    var putLocalStorageVal = function (redirectTo) {
        localStorage.setItem("self_scope", JSON.stringify(wrap));
        switch (redirectTo) {
            //redirect to selfcare dashboard
            case 0:
                $location.path("SelfCare/Customer/App");
                break;
                //redirect to selfcare activation
            case 1:
                $location.path("SelfCare/Customer/App/Activate");
                break;
        }
    };
    if (totalactivedevice === 0) {
        $scope.ZeroActiveDevice = true;
    } else {
        $scope.ZeroActiveDevice = false;
    };

    if (totalactivedevice < 2 && totalactivedevice!=0) {
        putLocalStorageVal(0);
        checkInitNotification();
    } else {
        $scope.isStartCompiled = true;
    };
    $scope.isCompiled = true;
    $scope.selectDevice = function (data) {
        wrap.activeDevice = data;
        putLocalStorageVal(0);
    };
    $scope.activation = function (data) {
        wrap.selectedNotActiveDevice = data;
        putLocalStorageVal(1);
    };
});

