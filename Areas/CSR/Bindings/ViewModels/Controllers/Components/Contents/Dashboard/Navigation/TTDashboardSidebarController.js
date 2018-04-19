CSRContent.controller('TTDashboardSidebarController', function ($scope, $location, CSRSideBar, SideBarModule) {
    var curModuleId = SideBarModule.getModuleId();
    if (curModuleId == null) curModuleId = 37;
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
