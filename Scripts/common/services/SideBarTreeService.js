function getItemState(data, curpath) {
    var openedItemKey = "oi";
    var openedItem = [];
    var sideMenus = data.NavigationMenu;
    if (curpath == undefined) curpath = '';

    if (sessionStorage.getItem(openedItemKey) != null) {
        var dummy = sessionStorage.getItem(openedItemKey);
        openedItem = angular.fromJson(dummy);

        for (var i = 0; i < openedItem.length; i++) {
            for (var j = 0; j < sideMenus.length; j++) {
                //
                if (openedItem[i] == sideMenus[j].Id) {
                    sideMenus[j].active = true;
                } else {
                    for (var k = 0; k < sideMenus[j].SubMenus.length; k++) {
                        if (openedItem[i] == sideMenus[j].SubMenus[k].Id) {
                            sideMenus[j].SubMenus[k].active = true;
                        }
                    }
                }
                //
            }
        }
    }
    else
    {
        if (curpath != '')
        {
            var curParent1 = -1;
            var curParent2 = -1;

            level1:
            for (var i = 0; i < sideMenus.length; i++) {
                var item = sideMenus[i];
                if (curpath == '/' + item.Link) {
                    break level1;
                } else {

                    level2:
                    for (var j = 0; j < item.SubMenus.length; j++) {
                        var subItem = item.SubMenus[j];
                        if (curpath == "/" + subItem.Link) {
                            curParent1 = i;
                            break level1;
                        } else {

                            level3:
                            for (var k = 0; k < subItem.SubMenus.length; k++) {
                                var subSubItem = subItem.SubMenus[k];
                                if (curpath == "/" + subSubItem.Link) {
                                    curParent2 = j;
                                    break level1;
                                }
                            }

                        }
                    }

                }
            }

            if (curParent1 != -1) sideMenus[curParent1].active = true;
            if (curParent2 != -1) sideMenus[curParent2].active = true;
        }
    }

    return sideMenus;
}

function setItemState(item) {
    var openedItemKey = "oi";
    var openedItem = [];

    if (sessionStorage.getItem(openedItemKey) != null) {
        var dummy = sessionStorage.getItem(openedItemKey);
        openedItem = angular.fromJson(dummy);
    }

    if (item.SubMenus.length > 0) {
        if (item.active) {
            openedItem.push(item.Id);
        } else {
            var idx = $.inArray(item.Id, openedItem);
            if (idx >= 0) openedItem.splice(idx, 1);
        }
        sessionStorage.setItem(openedItemKey, angular.toJson(openedItem));
    }
}