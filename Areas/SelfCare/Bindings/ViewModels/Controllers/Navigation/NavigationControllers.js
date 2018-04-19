function activatedCartHeader($scope, CustomerWrapperService) {
    var promise = CustomerWrapperService.ShoppingHeader();
    promise.then(function (result) {
        if (result) {
            $scope.shoppingcart = shopping;
        }
    });
}
SelfCareNav.controller("NavMenuCtrl", function ($scope, $timeout, $rootScope, SelfCareNavigation, SelfCareCache, NavigationMenuCache, CustomerWrapperService, SelfCareCommonService) {
    //var cacheKey = 'NavMenu';
    //SelfCareNavigation.get(function (data) {
    //    $scope.getVal = data.NavigationMenu;
    //    SelfCareCache.put(cacheKey, data);
    //})

    $scope.recheck_cart = function () {
        activatedCartHeader($scope, CustomerWrapperService);
    }

    activatedCartHeader($scope, CustomerWrapperService);
    NavigationMenuCache.getDataNavMenu().then(function (data) {
        var listModule = SelfCareCommonService.SubscriptionListMenu(data);
        SelfCareCache.put('DynamicMenu', data);
        $scope.getVal = angular.copy(listModule);
    });
});

SelfCareNav.controller("NavChangeCtrl", function ($scope, $timeout, $location) {
    checkLocation();
    $scope.check = function () {
        $timeout(function () {
            checkLocation()
        }, 1);
    }

    function checkLocation() {
        if ($location.path() === '/SelfCare/Customer/App') {
            $scope.show = true;
        }
        else {
            $scope.show = false;
        };
    };
});

SelfCareNav.controller("NavSortCtrl", function ($scope, $location, $window, SelfCareCache, SelfCareNavigation, SelfCareNavigationDefault, SelfCareUserPreference) {
    var cacheKey = 'NavMenu';
    $scope.getVal = angular.copy(SelfCareCache.get(cacheKey));
    if (typeof $scope.getVal === 'undefined') {
        SelfCareNavigation.get(function (data) {
            $scope.getVal = data;
            SelfCareCache.put(cacheKey, $scope.getVal);
            $scope.sortableArray = htmlContent($scope.getVal)
        });
    }
    else {
        $scope.sortableArray = htmlContent($scope.getVal)
    };

    $scope.save = function () {
        $scope.SelfCareNavigation = $scope.sortableArray
        $scope.SelfCareNavigation.$save(function () {
            $window.location.reload();
        });
    }
    $scope.savepref = function () {
        var menus = $scope.sortableArray.NavigationMenu;
        var finalMenu = "[";
        for (var i = 0; i < menus.length; i++) {
            finalMenu += "\"" + menus[i].Menu + "\",";
        }
        finalMenu = finalMenu.substring(0, finalMenu.length - 1);
        finalMenu += "]";

        var inputData = encodeURIComponent(finalMenu); //encodeURIComponent(JSON.stringify(menu_list));
        SelfCareUserPreference.update({ inputData: inputData }, function () {
            $window.location.reload();
        });
    }
    $scope.default = function () {
        SelfCareNavigationDefault.get(function (data) {
            //$scope.getVal = data.NavigationDefault;
            //$scope.sortableArray.NavigationMenu = $scope.getVal;
            $scope.sortableArray.NavigationMenu = data.NavigationMenu;
        });
    }
});