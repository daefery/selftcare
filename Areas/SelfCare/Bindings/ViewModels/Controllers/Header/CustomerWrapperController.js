SelfCareHeader.controller("CustomerWrapperController", function ($scope, CustomerCache) {
    $scope.info = {}
    var wrapperfunction = function () {
        var customerInfo = {
            username: wrapper.customerInfo.FirstName,
            mobile: wrapper.activeDevice.Msisdn,
            customerid: wrapper.customerInfo.CustomerID,
        }
        $scope.info = {
            main: customerInfo,
            child: customerInfo
        }
    }

    $scope.withbalance = function () {
        if (wrapper.activeDevice.Msisdn) {
            CustomerCache.getBalanceCommon({ mobileNumber: wrapper.activeDevice.Msisdn }).then(function (data) {
                wrapperfunction();
                $scope.info.child.balance = data.Balance;
            })
        } else {
            $scope.info.child.mobile = "-";
            $scope.info.child.balance = "-";
        }
    };

    wrapperfunction();
    
    /*
    SelfcareSecureSection.get({ ModuleId: 75 }, function (result) {
        $scope.isCustomerContactEnable = false;
        var oSection = $filter('filter')(result, { SectionKey: 'SELF_TT_CUST' })[0];
        if (oSection != null) $scope.isCustomerContactEnable = true;
    });
    */
});