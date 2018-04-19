
CSRContent.controller("ManageTTKPIController", function ($scope, LocalStorageProvider, CommonEnum, CSRCache, CacheSearch, CacheEnumService, CacheTroubleTicketService, Notification, KPIConfigurationService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.form = {}; //to set default name on UI Form
    $scope.currentPage = 1;

    $scope.keySearch = {
        keyMVNO: '',
        keyType: '',
    };
    var keySearchDefault = angular.copy($scope.keySearch);

    $scope.updateOnChangeMVNO = function (data) {
        $scope.keySearch = data;
        $scope.getSearch($scope.keySearch);
    }

    $scope.TTMVNO = [];
    CacheEnumService.getTTMVNO().then(function (result) {
        result.forEach(function (e) {
            e.value = e.dealerid;
            e.name = e.mvnoname;
        });

        $scope.TTMVNO = result;

        //$scope.keySearch.keyMVNO = $scope.TTMVNO[0].value; // selected first index
        result.forEach(function (e) {
            // selected index
            if (LocalStorageProvider.getMvnoid() == e.orgid) {
                $scope.keySearch.keyMVNO = e.value;
            }
        })

        $scope.updateOnChangeMVNO($scope.keySearch);
    });

    $scope.Modal_RemoveTTKPIModal = '';

    var cacheKey = 'TTKPIData';
    $scope.CstData = '';
    $scope.getSearch = function (object, clearCache) {

        $scope.Modal_RemoveTTKPIModal = ''; //setdefault

        $scope.selectedRow = undefined;
        $scope.data = undefined;

        CacheTroubleTicketService.getAllKPI(object, clearCache).then(function (result) {
            $scope.CstData = result.TTClassType;
        });

    };

    $scope.doing = function (param) {

        if (param == 'Add') {
            $scope.add.openAddTTKPIInterface();
        }

        if ($scope.data != undefined) {
            if (param == 'Modify') {
                $scope.update.openModifyTTKPIInterface($scope.data);
            }
        }
    }

    $scope.update = {};
    $scope.add = {};

    $scope.setClickedRow = function (data) {
        $scope.selectedRow = data.ClassTypeId;

        $scope.data = data;

        $scope.Modal_RemoveTTKPIModal = '#RemoveTTKPIModal';
    }

    $scope.deleteDisabled = true;

    $scope.removeTTKPI = function () {
        if ($scope.selectedRow == undefined) {
            Notification.error({
                message: '<span>Please select one</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 10000
            });
        } else {
            Notification.error({
                message: '<strong>Failed!</strong> <span>Not Yet Available ...</span>',
                positionY: 'top',
                positionX: 'center'
            });

            /*
            KPIConfigurationService.TTKPIDelete.delete({
                ClassTypeId: $scope.selectedRow
            }, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    angular.element('#RemoveTTKPIModal').modal('hide');
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>KPI Is Successfully deleted.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    angular.element('#RemoveTTKPIModal').modal('hide');
                    $scope.getSearch($scope.keySearch, clearCache = true);
                }
            })
            */

        }

    }
});

CSRContent.controller("ModifyTTKPIController", function ($scope, CommonEnum, CSRCache, CacheEnumService, CacheTroubleTicketService, Notification, KPIConfigurationService) {

    $scope.KpiDateLimitHoursTypeEnum = [
        {
            name: "Business",
            value: "Business"
        },
        {
            name: "Calendar",
            value: "Calendar"
        }
    ];

    $scope.update.openModifyTTKPIInterface = function (data) {
        $scope.update.data = data;

        angular.element('#ModifyTTKPIModal').modal('show');

        $scope.update.KpiResponseTimeHours = data.KpiResponseTimeHours;
        $scope.update.KpiDateLimitHours = data.KpiDateLimitHours;
        $scope.update.KpiDateLimitHoursType = { name: data.KpiDateLimitHoursType, value: data.KpiDateLimitHoursType };

    }

    $scope.submitModifyTTKPI = function (data) {
        var param = {
            ClassTypeId: data.data.ClassTypeId,
            KpiResponseTimeHours: data.KpiResponseTimeHours,
            KpiDateLimitHours: data.KpiDateLimitHours,
            KpiDateLimitHoursType: data.KpiDateLimitHoursType.value,
        };
        
        var valid = false;
        if (data.data.KpiResponseTimeHours == param.KpiResponseTimeHours && data.data.KpiDateLimitHours == param.KpiDateLimitHours && data.data.KpiDateLimitHoursType == param.KpiDateLimitHoursType) {
            Notification.error({
                message: '<strong>Failed!</strong> <span>You havent changed anything yet</span>',
                positionY: 'top',
                positionX: 'center'
            });
            valid = false;
        } else {
            valid = true;
        }

        if (valid) {
            if (param.KpiResponseTimeHours < 0) {
                var msg = 'KpiResponseTimeHours must be > 0';
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + msg + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
            else if (param.KpiDateLimitHours < 0) {
                var msg = 'KpiDateLimitHours must be > 0';
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + msg + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
            }
            else {
                KPIConfigurationService.TTKPIUpdate.update(param, function (response) {
                    if (response.ResultType != 0 || response.ResultCode != 0) {
                        Notification.error({
                            message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });
                        return false;
                    } else {
                        Notification.success({
                            message: '<strong>Success!</strong> <span>KPI Is Successfully Updated.</span>',
                            positionY: 'top',
                            positionX: 'center'
                        });

                        angular.element('#ModifyTTKPIModal').modal('hide');
                        $scope.getSearch($scope.keySearch, clearCache = true);
                    }
                });
            }
        }
    };

    $scope.datas = {

        field: [
            {
                type: "number",
                name: "KpiResponseTimeHours",
                size: 6,
                text: "KPI_RESPONSE_TIME_HOURS",
                model: "update.KpiResponseTimeHours",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "number",
                name: "KpiDateLimitHours",
                size: 6,
                text: "KPI_DATE_LIMIT_HOURS",
                model: "update.KpiDateLimitHours",
                required: true,
                validation: [{ value: "mandatory" }]
            },
            {
                type: "select",
                name: "KpiDateLimitHoursType",
                size: 6,
                text: "KPI_DATE_LIMIT_HOURS_TYPE",
                model: "update.KpiDateLimitHoursType",
                required: true,
                value: "KpiDateLimitHoursTypeEnum",
                validation: [{ value: "mandatory" }]
            },
        ],
        button: [
            {
                name: "btnSubmitModifyTTKPI",
                type: "submit",
                text: "Submit",
                click: "submitModifyTTKPI(update)"
            },
            {
                name: "btnCancelModifyTTKPI",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});
