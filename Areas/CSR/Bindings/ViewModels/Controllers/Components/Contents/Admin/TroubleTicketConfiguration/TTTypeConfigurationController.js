
CSRContent.controller("ManageTTTypeController", function ($scope, LocalStorageProvider, CommonEnum, CSRCache, CacheSearch, CacheEnumService, CacheTroubleTicketService, Notification, TypeConfigurationService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.form = {}; //to set default name on UI Form
    $scope.currentPage = 1;

    $scope.keySearch = {
        keyMVNO: ''
    };
    var keySearchDefault = angular.copy($scope.keySearch);

    $scope.Modal_RemoveTTTypeModal = '';

    var cacheKey = 'TTTypeData';
    $scope.CstData = '';
    $scope.getSearch = function (object, clearCache) {

        $scope.Modal_RemoveTTTypeModal = ''; //setdefault

        $scope.selectedRow = undefined;
        $scope.data = undefined;

        CacheTroubleTicketService.getAllType(clearCache).then(function (result) {
            result.TTTypeList.forEach(function (e) {
                e.name = e.NameId.DefaultMessage;
                e.description = e.DescriptionId == undefined ? null : e.DescriptionId.DefaultMessage;
            });
            $scope.CstData = result.TTTypeList;
        });

    };
    $scope.getSearch(null);

    $scope.doing = function (param) {

        if (param == 'Add') {
            $scope.add.openAddTTTypeInterface();
        }

        if ($scope.data != undefined) {
            if (param == 'Modify') {
                $scope.update.openModifyTTTypeInterface($scope.data);
            }
        }
    }

    $scope.update = {};
    $scope.add = {};

    $scope.setClickedRow = function (data) {
        $scope.selectedRow = data.TypeId;

        $scope.data = data;

        $scope.Modal_RemoveTTTypeModal = '#RemoveTTTypeModal';
    }

    $scope.deleteDisabled = true;

    $scope.removeTTType = function () {
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
            TypeConfigurationService.TTTypeDelete.delete({
                TypeId: $scope.selectedRow
            }, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    angular.element('#RemoveTTTypeModal').modal('hide');
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Type Is Successfully deleted.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    angular.element('#RemoveTTTypeModal').modal('hide');
                    $scope.getSearch($scope.keySearch, clearCache = true);
                }
            })
            */

        }

    }
});

CSRContent.controller("AddTTTypeController", function ($scope, CommonEnum, CSRCache, CacheEnumService, CacheTroubleTicketService, Notification, TypeConfigurationService) {

    $scope.add.openAddTTTypeInterface = function () {

        angular.element('#AddTTTypeModal').modal('show');

    }

    $scope.submitAddTTType = function (data) {
        var param = {
            Name: data.Name,
            Description: data.Description
        };

        TypeConfigurationService.TTTypeAdd.add(param, function (response) {
            if (response.ResultType != 0 || response.ResultCode != 0) {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                return false;
            } else {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Type Is Successfully Added.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });

                data.Name = '';
                data.Description = '';

                angular.element('#AddTTTypeModal').modal('hide');
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
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "Description",
                size: 6,
                text: "Description",
                model: "add.Description",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
        ],
        button: [
            {
                name: "btnSubmitAddTTType",
                type: "submit",
                text: "Submit",
                click: "submitAddTTType(add)"
            },
            {
                name: "btnCancelAddTTType",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});

CSRContent.controller("ModifyTTTypeController", function ($scope, CommonEnum, CSRCache, CacheEnumService, CacheTroubleTicketService, Notification, TypeConfigurationService) {

    $scope.update.openModifyTTTypeInterface = function (data) {
        $scope.update.data = data;

        angular.element('#ModifyTTTypeModal').modal('show');

        $scope.update.Name = data.name;
        $scope.update.Description = data.description;

    }

    $scope.submitModifyTTType = function (data) {
        var param = {
            TypeId: data.data.TypeId,
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
            TypeConfigurationService.TTTypeUpdate.update(param, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    return false;
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Type Is Successfully Updated.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    $scope.update.Name = '';
                    $scope.update.Description = '';

                    angular.element('#ModifyTTTypeModal').modal('hide');
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
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
            {
                type: "text",
                name: "Description",
                size: 6,
                text: "Description",
                model: "update.Description",
                required: true,
                maxlength: 50,
                validation: [{ value: "mandatory" }, { value: "maxlength" }]
            },
        ],
        button: [
            {
                name: "btnSubmitModifyTTType",
                type: "submit",
                text: "Submit",
                click: "submitModifyTTType(update)"
            },
            {
                name: "btnCancelModifyTTType",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});
