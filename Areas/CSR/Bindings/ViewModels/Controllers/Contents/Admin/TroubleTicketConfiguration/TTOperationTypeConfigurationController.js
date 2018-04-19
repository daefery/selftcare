
CSRContent.controller("ManageTTOperationTypeController", function ($scope, LocalStorageProvider, CommonEnum, CSRCache, CacheSearch, CacheEnumService, Notification, OperationTypeConfigurationService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.form = {}; //to set default name on UI Form
    $scope.currentPage = 1;

    $scope.Modal_RemoveTTOperationTypeModal = '';

    var cacheKey = 'TTOperationTypeData';
    $scope.CstData = '';
    $scope.getSearch = function (object, clearCache) {

        $scope.Modal_RemoveTTOperationTypeModal = ''; //setdefault

        $scope.selectedRow = undefined;
        $scope.data = undefined;

        CacheEnumService.getTTOperationType(clearCache).then(function (result) {
            result.TTOperationTypeInfo.forEach(function (e) {
                e.name = e.Names.DefaultMessage;
                e.description = e.Description == undefined ? null : e.Description.DefaultMessage;
            });
            $scope.CstData = result.TTOperationTypeInfo;
        });

    };
    $scope.getSearch(null);

    $scope.doing = function (param) {

        if (param == 'Add') {
            $scope.add.openAddTTOperationTypeInterface();
        }

        if ($scope.data != undefined) {
            if (param == 'Modify') {
                $scope.update.openModifyTTOperationTypeInterface($scope.data);
            }
        }
    }

    $scope.update = {};
    $scope.add = {};

    $scope.setClickedRow = function (data) {
        $scope.selectedRow = data.Id;

        $scope.data = data;

        $scope.Modal_RemoveTTOperationTypeModal = '#RemoveTTOperationTypeModal';
    }

    $scope.deleteDisabled = false;

    $scope.removeTTOperationType = function () {
        if ($scope.selectedRow == undefined) {
            Notification.error({
                message: '<span>Please select one</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 10000
            });
        } else {
            OperationTypeConfigurationService.TTOperationTypeDelete.delete({
                OperationTypeId: $scope.selectedRow
            }, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    angular.element('#RemoveTTOperationTypeModal').modal('hide');
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>OperationType Is Successfully deleted.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    angular.element('#RemoveTTOperationTypeModal').modal('hide');
                    $scope.getSearch($scope.keySearch, clearCache = true);
                }
            })

        }

    }
});

CSRContent.controller("AddTTOperationTypeController", function ($scope, CommonEnum, CSRCache, CacheEnumService, Notification, OperationTypeConfigurationService) {

    $scope.add.openAddTTOperationTypeInterface = function () {

        $scope.AddTTOperationTypeForm.$setPristine();
        angular.element('#AddTTOperationTypeModal').modal('show');

    }

    $scope.submitAddTTOperationType = function (data) {
        var param = {
            Name: data.Name,
            Description: data.Description
        };

        OperationTypeConfigurationService.TTOperationTypeAdd.add(param, function (response) {
            if (response.ResultType != 0 || response.ResultCode != 0) {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                return false;
            } else {
                Notification.success({
                    message: '<strong>Success!</strong> <span>OperationType Is Successfully Added.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });

                data.Name = '';
                data.Description = '';

                angular.element('#AddTTOperationTypeModal').modal('hide');
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
                name: "btnSubmitAddTTOperationType",
                type: "submit",
                text: "Submit",
                click: "submitAddTTOperationType(add)"
            },
            {
                name: "btnCancelAddTTOperationType",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});

CSRContent.controller("ModifyTTOperationTypeController", function ($scope, CommonEnum, CSRCache, CacheEnumService, Notification, OperationTypeConfigurationService) {

    $scope.update.openModifyTTOperationTypeInterface = function (data) {
        $scope.ModifyTTOperationTypeForm.$setPristine();
        $scope.update.data = data;

        angular.element('#ModifyTTOperationTypeModal').modal('show');

        $scope.update.Name = data.name;
        $scope.update.Description = data.description;

    }

    $scope.isFormChanged = function (data) {
        if (data.data == undefined) {
            return false;
        }
        var param = {
            OperationTypeId: data.data.Id,
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

    $scope.submitModifyTTOperationType = function (data) {
        var param = {
            OperationTypeId: data.data.Id,
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
            OperationTypeConfigurationService.TTOperationTypeUpdate.update(param, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    return false;
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>OperationType Is Successfully Updated.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    $scope.update.Name = '';
                    $scope.update.Description = '';

                    angular.element('#ModifyTTOperationTypeModal').modal('hide');
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
                name: "btnSubmitModifyTTOperationType",
                type: "submit",
                text: "Submit",
                disabled: "!isFormChanged(update)",
                click: "submitModifyTTOperationType(update)"
            },
            {
                name: "btnCancelModifyTTOperationType",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});
