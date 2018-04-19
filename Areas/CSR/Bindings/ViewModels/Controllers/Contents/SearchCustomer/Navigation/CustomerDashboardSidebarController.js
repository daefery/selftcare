CSRContent.controller('CustomerDashboardSidebarController', function ($scope, $location, SideBarModule, CacheNavigationService) {

    if ($location.path() == '/CSR/Customer/App/SearchPage/TroubleTicketInfo' && $location.$$search.dashboard != undefined) {
        SideBarModule.setModuleId(37);  //Dashboard
    } else if ($location.path() == '/CSR/Customer/App/SearchPage/TroubleTicketInfo') {
        SideBarModule.setModuleId(29);  //SearchPage
    }

    var curModuleId = SideBarModule.getModuleId();
    if (curModuleId == null) curModuleId = 29;
    CacheNavigationService.getSidebar(curModuleId).then(function (data) {
        $scope.SidebarMenus = getItemState(data);
    });
    SideBarModule.resetModuleId();

    $scope.showChilds = function (item, e) {
        if (e.currentTarget.localName == "i") {
            item.active = !item.active;
            e.preventDefault();
            e.stopPropagation();
            setItemState(item);
        }
        if (e.currentTarget.localName == "a") {
            var url = item.Link;
            if (!(url == "" || url == null || url == undefined)) {
                $location.path(item.Link);
            }
        }
    };

    $scope.isItemSelected = function (item) {
        return ($location.$$path == '/' + item.Link)
    };
});