
CSRContent.controller("ManageTTDepartmentController", function ($scope, LocalStorageProvider, CommonEnum, CSRCache, CacheSearch, CacheEnumService, Notification, DepartmentConfigurationService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.form = {}; //to set default name on UI Form
    $scope.currentPage = 1;

    $scope.keySearch = {
        keyMVNO: ''
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

    $scope.Modal_RemoveTTDepartmentModal = '';

    var cacheKey = 'TTDepartmentData';
    $scope.CstData = '';
    $scope.getSearch = function (object, clearCache) {

        $scope.Modal_RemoveTTDepartmentModal = ''; //setdefault

        $scope.selectedRow = undefined;
        $scope.data = undefined;

        CacheEnumService.getTTGetDepartment(object.keyMVNO, clearCache).then(function (result) {
            result.TTDepartments.forEach(function (e) {
                e.name = e.Names.DefaultMessage;
                e.description = e.Description == undefined ? null : e.Description.DefaultMessage;
            });
            $scope.CstData = result.TTDepartments;
        });

    };

    $scope.doing = function (param) {

        if (param == 'Add') {
            $scope.add.openAddTTDepartmentInterface();
        }

        if ($scope.data != undefined) {
            if (param == 'Modify') {
                $scope.update.openModifyTTDepartmentInterface($scope.data);
            }
        }
    }

    $scope.update = {};
    $scope.add = {};
    $scope.$watch('add.addTTDepartment_done', function () {
        if ($scope.add.addTTDepartment_done == true) {
            $scope.getSearch($scope.keySearch, clearCache = true);
        }
    })

    $scope.setClickedRow = function (data) {
        $scope.selectedRow = data.Id;

        $scope.data = data;

        $scope.Modal_RemoveTTDepartmentModal = '#RemoveTTDepartmentModal';
    }

    $scope.deleteDisabled = false;

    $scope.removeTTDepartment = function () {
        if ($scope.selectedRow == undefined) {
            Notification.error({
                message: '<span>Please select one</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 10000
            });
        } else {
            DepartmentConfigurationService.TTDepartmentDelete.delete({
                DepartmentId: $scope.selectedRow
            }, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    angular.element('#RemoveTTDepartmentModal').modal('hide');
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Department Is Successfully deleted.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    angular.element('#RemoveTTDepartmentModal').modal('hide');
                    $scope.getSearch($scope.keySearch, clearCache = true);
                }
            })

        }

    }
});

CSRContent.controller("AddTTDepartmentController", function ($scope, CommonEnum, CSRCache, CacheEnumService, Notification, DepartmentConfigurationService) {

    $scope.add.openAddTTDepartmentInterface = function () {
        $scope.AddTTDepartmentForm.$setPristine();

        $scope.add.addTTDepartment_done = false;
        angular.element('#AddTTDepartmentModal').modal('show');

    }

    $scope.submitAddTTDepartment = function (data) {
        var param = {
            DealerId: $scope.keySearch.keyMVNO,
            Name: data.Name,
            Description: data.Description,
        };

        DepartmentConfigurationService.TTDepartmentAdd.add(param, function (response) {
            if (response.ResultType != 0 || response.ResultCode != 0) {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                return false;
            } else {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Department Is Successfully Added.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });

                data.Name = '';
                data.Description = '';

                angular.element('#AddTTDepartmentModal').modal('hide');
                $scope.add.addTTDepartment_done = true;
            }
        });
    }

    $scope.add.overrideFunction_closeTTDepartmentModal = function (Overridefunc) {
        $scope.closeTTDepartmentModal = Overridefunc;
    }
    $scope.closeTTDepartmentModal = function () {
        angular.element('#AddTTDepartmentModal').modal('hide');
    }

    $scope.datas = {

        field: [
            {
                type: "text",
                name: "Name",
                size: 6,
                text: "Name",
                model: "add.Name",
                required: true,
                maxlength: 1024,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "Description",
                size: 6,
                text: "Description",
                model: "add.Description",
                required: true,
                maxlength: 1024,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
        ],
        button: [
            {
                name: "btnSubmitAddTTDepartment",
                type: "submit",
                text: "Submit",
                click: "submitAddTTDepartment(add)"
            },
            {
                name: "btnCancelAddTTDepartment",
                type: "custom",
                text: "Cancel",
                item: "<a type=\"button\" " +
                                    "id=\"" + 'btnCancelAddTTDepartment' + "_btn_" + 'cancel' + "\" " +
                                    "class=\"btn btn-danger\" " +
                                    "ng-click=\"" + 'closeTTDepartmentModal()' + "\" " +
                                    "ng-bind=\"lang." + 'Cancel' + "\">" + 'Cancel' +
                                    "</a>"
            }
        ]
    }
});

CSRContent.controller("ModifyTTDepartmentController", function ($scope, CommonEnum, CSRCache, CacheEnumService, Notification, DepartmentConfigurationService) {

    $scope.update.openModifyTTDepartmentInterface = function (data) {
        $scope.ModifyTTDepartmentForm.$setPristine();
        $scope.update.data = data;

        angular.element('#ModifyTTDepartmentModal').modal('show');

        $scope.update.Name = data.name;
        $scope.update.Description = data.description;

    }

    $scope.isFormChanged = function (data) {
        if (data.data == undefined) {
            return false;
        }
        var param = {
            DealerId: data.data.DealerId,
            DepartmentId: data.data.Id,
            Name: data.Name,
            Description: data.Description,
        };

        var valid = false;
        if (data.data.name == param.Name && data.data.description == param.Description) {
            valid = false;
        } else {
            valid = true;
        }
        return valid;
    }

    $scope.submitModifyTTDepartment = function (data) {
        var param = {
            DealerId: data.data.DealerId,
            DepartmentId: data.data.Id,
            Name: data.Name,
            Description: data.Description,
        };
        
        var valid = false;
        if (data.data.name == param.Name && data.data.description == param.Description) {
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
            DepartmentConfigurationService.TTDepartmentUpdate.update(param, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    return false;
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Department Is Successfully Updated.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    $scope.update.Name = '';
                    $scope.update.Description = '';

                    angular.element('#ModifyTTDepartmentModal').modal('hide');
                    $scope.getSearch($scope.keySearch, clearCache = true);
                }
            });
        }
    };

    $scope.datas = {

        field: [
            {
                type: "text",
                name: "Name",
                size: 6,
                text: "Name",
                model: "update.Name",
                required: true,
                maxlength: 1024,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "Description",
                size: 6,
                text: "Description",
                model: "update.Description",
                required: true,
                maxlength: 1024,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
        ],
        button: [
            {
                name: "btnSubmitModifyTTDepartment",
                type: "submit",
                text: "Submit",
                disabled: "!isFormChanged(update)",
                click: "submitModifyTTDepartment(update)"
            },
            {
                name: "btnCancelModifyTTDepartment",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});
