
CSRContent.controller('CSRMaintenanceManagementController', function ($scope, GetMaintenancePlan) {

    GetMaintenancePlan.get({}, function (result) {
        $scope.maintenancePlan = result.MaintenanceInfo;
        result.MaintenanceInfo.forEach(function (e) {
            temp = moment(e.MaintenanceDate);
            temp2 = moment(e.MaintenanceDate).add(e.MaintenanceDuration, 'm');
            e.Date = moment(temp).format(config.DateFormatMoment);
            e.StartTime = moment(temp).format('h:mm a');
            e.EndDate = moment(temp2).format(config.DateFormatMoment);
            e.EndTime = moment(temp2).format('h:mm a');
            if (moment(temp).isSame(temp2, 'day')) {
                e.EndDate = null;
            } else {
                e.EndDate = ' - '.concat(e.EndDate);
            }
        });
    });
});
