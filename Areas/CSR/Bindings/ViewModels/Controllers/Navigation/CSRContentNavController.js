/// <reference path="C:\Project\WebClientSprint3\Core\console\console\Templates/Common/DynamicNavigation/NavigationSort.html" />
//Revani Bagus Amrulloh DynamicNav Start
//Controller for load nav from local machine
//controller for controlling menu
function setMainMenuSlick() {
    setTimeout(function () {
        $(".csrMenu").slick({
            slide: 'ul',
            infinite: false,
            slidesToShow: 9,
            draggable: false,
            slidesToScroll: 1,
            arrows: true,
            variableWidth: true,
            prevArrow: ".prev",
            nextArrow: ".next"
        });
    }, 0);
}
CSRContent.controller('NavMenuCtrl', function ($scope, CacheNavigationService) {
    CacheNavigationService.getCSRNavigation().then(function (data) {
        $scope.getVal = data.NavigationMenu;
        setMainMenuSlick();
    });

    $scope.$on('refresh.csr.mainmenu.sort', function (event, value) {
        if (value) {
            CacheNavigationService.removeAllCSRNavigationKey();
            CacheNavigationService.getCSRNavigation().then(function (data) {
                $scope.getVal = data.NavigationMenu;
                setMainMenuSlick();
            })
        };
    });

    $scope.$on('refresh.csr.mainmenu', function (event, value) {
        if (value) {
            CacheNavigationService.removeAllKeys();
        };
    });

    $scope.$on('refresh.csr.securesection', function (event, value) {
        if (value) {
            CacheNavigationService.removeAllSecureSectionKey();
        };
    });
    
    $scope.isHotAction = function (nav) {
        return (nav.Translate_Key == 'HOT_ACTIONS')
    }

    $scope.isHomeItem = function (nav) {
        return (nav.Id == 0)
    }

    //return false for HotAction and Home
    $scope.isMenuItem = function (nav) {
        return !(nav.Translate_Key == 'HOT_ACTIONS' | nav.Id == 0)
    }
})


.controller("NavSortCtrl", function ($rootScope, $scope, CacheNavigationService, CSRNavigationDefault, CSRUserPreference) {
    CacheNavigationService.getCSRNavigation().then(function (data) {
        $scope.sortableArray = htmlContent(data)
    });

    $scope.savepref = function () {
        var menus = $scope.sortableArray.NavigationMenu;
        var finalMenu = "[";
        for (var i = 0; i < menus.length; i++) {
            finalMenu += "\"" + menus[i].Menu + "\",";
        }
        finalMenu = finalMenu.substring(0, finalMenu.length - 1);
        finalMenu += "]";

        var inputData = encodeURIComponent(finalMenu);
        CSRUserPreference.update({ inputData: inputData }, function () {
            $rootScope.$broadcast('refresh.csr.mainmenu.sort', true);
            $scope.close();
        });
    }

    $scope.default = function () {
        CSRNavigationDefault.get(function (data) {
            $scope.sortableArray.NavigationMenu = data.NavigationMenu;
        })
    }
})

.controller('ComboBoxNavController', function ($location, $scope, CSRHotAction) {
    $scope.go = function (page) {
        $location.path(page);
    }
    CSRHotAction.get(function (data) {
        $scope.getValHotAction = data.NavigationMenu;
    })
});

//Revani end
