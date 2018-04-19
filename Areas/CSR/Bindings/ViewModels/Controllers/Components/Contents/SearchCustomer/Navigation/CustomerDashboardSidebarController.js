CSRContent.controller('CustomerDashboardSidebarController', function ($scope, $location, CSRSideBar, SideBarModule) {

    if ($location.path() == '/CSR/Customer/App/SearchPage/TroubleTicketInfo' && $location.$$search.dashboard != undefined) {
        SideBarModule.setModuleId(37);  //Dashboard
    } else if ($location.path() == '/CSR/Customer/App/SearchPage/TroubleTicketInfo') {
        SideBarModule.setModuleId(29);  //SearchPage
    }

    var curModuleId = SideBarModule.getModuleId();
    if (curModuleId == null) curModuleId = 29;
    CSRSideBar.get({ ModuleId: curModuleId }, function (data) {
        $scope.SidebarMenus = getItemState(data);
    });
    SideBarModule.resetModuleId();

    $scope.showChilds = function (item, e) {
        item.active = !item.active;
        e.preventDefault();
        e.stopPropagation();

        setItemState(item);
        if (item.Link != "") $location.path(item.Link);
    };

    $scope.isItemSelected = function (item) {
        return ($location.$$path == '/' + item.Link)
    };
});