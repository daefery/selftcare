CSRContent.controller('TTDashboardSidebarController', function ($scope, $location, SideBarModule, CacheNavigationService) {

    if ($location.path() == '/CSR/Customer/App/TroubleTickets/SupportRequestDetail' && $location.$$search.searchpage != undefined) {
        SideBarModule.setModuleId(29);  //SearchPage
    } else {
        SideBarModule.setModuleId(37);  //Dashboard
    }

    var curModuleId = SideBarModule.getModuleId();
    if (curModuleId == null) curModuleId = 37;
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
