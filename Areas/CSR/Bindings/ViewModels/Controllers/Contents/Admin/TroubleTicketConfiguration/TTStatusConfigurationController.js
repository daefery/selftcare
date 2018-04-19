
CSRContent.controller("ManageTTStatusController", function ($scope, LocalStorageProvider, CommonEnum, CSRCache, CacheSearch, CacheEnumService, Notification, StatusConfigurationService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.form = {}; //to set default name on UI Form
    $scope.currentPage = 1;

    $scope.Modal_RemoveTTStatusModal = '';

    var cacheKey = 'TTStatusData';
    $scope.CstData = '';
    $scope.getSearch = function (object, clearCache) {

        $scope.Modal_RemoveTTStatusModal = ''; //setdefault

        $scope.selectedRow = undefined;
        $scope.data = undefined;

        CacheEnumService.getTTStatus(clearCache).then(function (result) {
            result.TTStatusInfo.forEach(function (e) {
                e.name = e.Names.DefaultMessage;
                e.description = e.Description == undefined ? null : e.Description.DefaultMessage;
            });
            $scope.CstData = result.TTStatusInfo;
        });

    };
    $scope.getSearch(null);

    $scope.doing = function (param) {

        if (param == 'Add') {
            $scope.add.openAddTTStatusInterface();
        }

        if ($scope.data != undefined) {
            if (param == 'Modify') {
                $scope.update.openModifyTTStatusInterface($scope.data);
            }
        }
    }

    $scope.update = {};
    $scope.add = {};

    $scope.setClickedRow = function (data) {
        $scope.selectedRow = data.StatusId;

        $scope.data = data;

        $scope.Modal_RemoveTTStatusModal = '#RemoveTTStatusModal';
    }

    $scope.deleteDisabled = false;

    $scope.removeTTStatus = function () {
        if ($scope.selectedRow == undefined) {
            Notification.error({
                message: '<span>Please select one</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 10000
            });
        } else {
            StatusConfigurationService.TTStatusDelete.delete({
                StatusId: $scope.selectedRow
            }, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    angular.element('#RemoveTTStatusModal').modal('hide');
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Status Is Successfully deleted.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    angular.element('#RemoveTTStatusModal').modal('hide');
                    $scope.getSearch($scope.keySearch, clearCache = true);
                }
            })

        }

    }
});

CSRContent.controller("AddTTStatusController", function ($scope, CommonEnum, CSRCache, CacheEnumService, Notification, StatusConfigurationService) {

    $scope.add.openAddTTStatusInterface = function () {

        $scope.AddTTStatusForm.$setPristine();
        angular.element('#AddTTStatusModal').modal('show');

    }

    $scope.submitAddTTStatus = function (data) {
        var param = {
            StatusId: data.StatusId,
            Name: data.Name,
            Description: data.Description
        };

        StatusConfigurationService.TTStatusAdd.add(param, function (response) {
            if (response.ResultType != 0 || response.ResultCode != 0) {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                return false;
            } else {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Status Is Successfully Added.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });

                data.StatusId = '';
                data.Name = '';
                data.Description = '';

                angular.element('#AddTTStatusModal').modal('hide');
                $scope.getSearch($scope.keySearch, clearCache = true);
            }
        });
    }

    $scope.datas = {

        field: [
            {
                type: "number",
                name: "StatusId",
                size: 6,
                text: "StatusId",
                model: "add.StatusId",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }, {value: "number"}]
            },
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
                name: "btnSubmitAddTTStatus",
                type: "submit",
                text: "Submit",
                click: "submitAddTTStatus(add)"
            },
            {
                name: "btnCancelAddTTStatus",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});

CSRContent.controller("ModifyTTStatusController", function ($scope, CommonEnum, CSRCache, CacheEnumService, Notification, StatusConfigurationService) {

    $scope.update.openModifyTTStatusInterface = function (data) {
        $scope.ModifyTTStatusForm.$setPristine();
        $scope.update.data = data;

        angular.element('#ModifyTTStatusModal').modal('show');

        $scope.update.Name = data.name;
        $scope.update.Description = data.description;

    }

    $scope.isFormChanged = function (data) {
        if (data.data == undefined) {
            return false;
        }
        var param = {
            StatusId: data.data.StatusId,
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

    $scope.submitModifyTTStatus = function (data) {
        var param = {
            StatusId: data.data.StatusId,
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
            StatusConfigurationService.TTStatusUpdate.update(param, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    return false;
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Status Is Successfully Updated.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    $scope.update.Name = '';
                    $scope.update.Description = '';

                    angular.element('#ModifyTTStatusModal').modal('hide');
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
                name: "btnSubmitModifyTTStatus",
                type: "submit",
                text: "Submit",
                disabled: "!isFormChanged(update)",
                click: "submitModifyTTStatus(update)"
            },
            {
                name: "btnCancelModifyTTStatus",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});
