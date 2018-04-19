
CSRContent.controller("ManageTTFlowTypeController", function ($scope, LocalStorageProvider, CommonEnum, CSRCache, CacheSearch, CacheEnumService, Notification, FlowTypeConfigurationService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.form = {}; //to set default name on UI Form
    $scope.currentPage = 1;

    $scope.Modal_RemoveTTFlowTypeModal = '';

    var cacheKey = 'TTFlowTypeData';
    $scope.CstData = '';
    $scope.getSearch = function (object, clearCache) {

        $scope.Modal_RemoveTTFlowTypeModal = ''; //setdefault

        $scope.selectedRow = undefined;
        $scope.data = undefined;

        CacheEnumService.getTTFlowType(clearCache).then(function (result) {
            result.TTFlowTypeList.forEach(function (e) {
                e.name = e.Names.DefaultMessage;
                e.description = e.Description == undefined ? null : e.Description.DefaultMessage;
            });
            $scope.CstData = result.TTFlowTypeList;
        });

    };
    $scope.getSearch(null);

    $scope.doing = function (param) {

        if (param == 'Add') {
            $scope.add.openAddTTFlowTypeInterface();
        }

        if ($scope.data != undefined) {
            if (param == 'Modify') {
                $scope.update.openModifyTTFlowTypeInterface($scope.data);
            }
        }
    }

    $scope.update = {};
    $scope.add = {};

    $scope.setClickedRow = function (data) {
        $scope.selectedRow = data.FlowTypeId;

        $scope.data = data;

        $scope.Modal_RemoveTTFlowTypeModal = '#RemoveTTFlowTypeModal';
    }

    $scope.deleteDisabled = false;

    $scope.removeTTFlowType = function () {
        if ($scope.selectedRow == undefined) {
            Notification.error({
                message: '<span>Please select one</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 10000
            });
        } else {
            FlowTypeConfigurationService.TTFlowTypeDelete.delete({
                FlowTypeId: $scope.selectedRow
            }, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    angular.element('#RemoveTTFlowTypeModal').modal('hide');
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>FlowType Is Successfully deleted.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    angular.element('#RemoveTTFlowTypeModal').modal('hide');
                    $scope.getSearch($scope.keySearch, clearCache = true);
                }
            })

        }

    }
});

CSRContent.controller("AddTTFlowTypeController", function ($scope, CommonEnum, CSRCache, CacheEnumService, Notification, FlowTypeConfigurationService) {

    $scope.add.openAddTTFlowTypeInterface = function () {

        $scope.AddTTFlowTypeForm.$setPristine();
        angular.element('#AddTTFlowTypeModal').modal('show');

    }

    $scope.submitAddTTFlowType = function (data) {
        var param = {
            Name: data.Name,
            Description: data.Description
        };

        FlowTypeConfigurationService.TTFlowTypeAdd.add(param, function (response) {
            if (response.ResultType != 0 || response.ResultCode != 0) {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                return false;
            } else {
                Notification.success({
                    message: '<strong>Success!</strong> <span>FlowType Is Successfully Added.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });

                data.Name = '';
                data.Description = '';

                angular.element('#AddTTFlowTypeModal').modal('hide');
                $scope.getSearch($scope.keySearch, clearCache = true);
            }
        });
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
                name: "btnSubmitAddTTFlowType",
                type: "submit",
                text: "Submit",
                click: "submitAddTTFlowType(add)"
            },
            {
                name: "btnCancelAddTTFlowType",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});

CSRContent.controller("ModifyTTFlowTypeController", function ($scope, CommonEnum, CSRCache, CacheEnumService, Notification, FlowTypeConfigurationService) {

    $scope.update.openModifyTTFlowTypeInterface = function (data) {
        $scope.ModifyTTFlowTypeForm.$setPristine();
        $scope.update.data = data;

        angular.element('#ModifyTTFlowTypeModal').modal('show');

        $scope.update.Name = data.name;
        $scope.update.Description = data.description;

    }

    $scope.isFormChanged = function (data) {
        if (data.data == undefined) {
            return false;
        }
        var param = {
            FlowTypeId: data.data.FlowTypeId,
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

    $scope.submitModifyTTFlowType = function (data) {
        var param = {
            FlowTypeId: data.data.FlowTypeId,
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
            FlowTypeConfigurationService.TTFlowTypeUpdate.update(param, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    return false;
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>FlowType Is Successfully Updated.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    $scope.update.Name = '';
                    $scope.update.Description = '';

                    angular.element('#ModifyTTFlowTypeModal').modal('hide');
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
                name: "btnSubmitModifyTTFlowType",
                type: "submit",
                text: "Submit",
                disabled: "!isFormChanged(update)",
                click: "submitModifyTTFlowType(update)"
            },
            {
                name: "btnCancelModifyTTFlowType",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});
