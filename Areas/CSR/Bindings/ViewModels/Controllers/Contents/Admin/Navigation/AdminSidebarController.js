CSRContent.controller('AdminSidebarController', function ($scope, $location, SideBarModule, CacheNavigationService) {
    var curModuleId = SideBarModule.getModuleId();
    if (curModuleId == null) curModuleId = 40;
    CacheNavigationService.getSidebar(curModuleId).then(function (data) {
        $scope.SidebarMenus = getItemState(data, $location.$$path);
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
        return ($location.$$path == '/' + item.Link);
    };
});
