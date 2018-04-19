CSRContent.controller('CSRUpdateHistoryController', function ($scope, $filter, GetUpdateHistory, CacheAdmin, LocalStorageProvider) {

    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    GetUpdateHistory.query({}, function (result) {
        CacheAdmin.getallMvno().then(function (result2) {
            var getMVNOName = function (OrgID) {
                temp2 = $filter('filter')(result2, { "orgid": OrgID }, true);
                if (temp2.length == 0) return "unknown";
                else {
                    return temp2[0].mvnoname;
                }
            };

            $scope.UpdateHistories = result;
            result.forEach(function (element) {
                temp = moment(element.MaintenanceDate);
                element.UpdateDate = moment(temp).format(config.DateFormatMoment); //format date

                if (element.Detail.length > 100) {
                    element.Detail = element.Detail.substring(0, 99) + "..."; //limit text
                }
            });

            result.forEach(function (element, index, array) {
                $scope.UpdateHistories[index].Affected_MVNOs = "";
                foo = '';
                element.MaintenanceInfoMVNOes.forEach(function (e, i, a) {
                    if (getMVNOName(e.OrgID) != "unknown") {
                        if (i < element.MaintenanceInfoMVNOes.length - 1) {
                            foo = foo + getMVNOName(e.OrgID) + ", ";
                        } else {
                            foo = foo + getMVNOName(e.OrgID);
                        }
                        $scope.UpdateHistories[index].Affected_MVNOs = foo;
                    }
                });
                var trim = $scope.UpdateHistories[index].Affected_MVNOs.replace(/(^,)|(,$)/g, "");
                $scope.UpdateHistories[index].Affected_MVNOs = trim;
            });
        });
    });

    

});