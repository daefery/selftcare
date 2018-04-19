
CSRContent.controller('CSRMaintenanceManagementController', function ($scope, GetMaintenancePlan) {

    GetMaintenancePlan.query({}, function (result) {

        result.MaintenanceInfo.Date = moment(result.MaintenanceInfo.MaintenanceDate).format(config.DateFormatMoment);
        result.MaintenanceInfo.StartTime = moment(result.MaintenanceInfo.MaintenanceDate).format('h:mm a');
        result.MaintenanceInfo.EndDate = moment(result.MaintenanceInfo.MaintenanceDate).add(result.MaintenanceInfo.MaintenanceDuration, 'm').format(config.DateFormatMoment);
        result.MaintenanceInfo.EndTime = moment(result.MaintenanceInfo.MaintenanceDate).add(result.MaintenanceInfo.MaintenanceDuration, 'm').format('h:mm a');
        if (moment(result.MaintenanceInfo.MaintenanceDate).isSame(moment(result.MaintenanceInfo.MaintenanceDate).add(result.MaintenanceInfo.MaintenanceDuration).format(), 'day')) {
            result.MaintenanceInfo.EndDate = null;
        } else {
            result.MaintenanceInfo.EndDate = ' - '.concat(result.MaintenanceInfo.EndDate);
        }

        result.MaintenanceInfo.DetailWithLink = '<div>'+result.MaintenanceInfo.Detail+'</div>';
        if ((result.MaintenanceInfo.URLReference != '') && (result.MaintenanceInfo.URLReference != null)) {
            result.MaintenanceInfo.DetailWithLink += '<a href="'+result.MaintenanceInfo.URLReference+'">More details...</a>';
        };
        
        if (result.MaintenanceInfo.MaintenanceInfoID != '') $scope.maintenance = result.MaintenanceInfo;
        else $scope.maintenance = null;
    });
});
