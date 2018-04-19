
CSRContent.controller("ManageTTSubTypeController", function ($scope, LocalStorageProvider, CommonEnum, CSRCache, CacheSearch, CacheEnumService, CacheTroubleTicketService, Notification, SubTypeConfigurationService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.form = {}; //to set default name on UI Form
    $scope.currentPage = 1;

    $scope.keySearch = {
        keyMVNO: ''
    };
    var keySearchDefault = angular.copy($scope.keySearch);

    $scope.Modal_RemoveTTSubTypeModal = '';

    var cacheKey = 'TTSubTypeData';
    $scope.CstData = '';
    $scope.getSearch = function (object, clearCache) {

        $scope.Modal_RemoveTTSubTypeModal = ''; //setdefault

        $scope.selectedRow = undefined;
        $scope.data = undefined;

        CacheTroubleTicketService.getAllSubtype(clearCache).then(function (result) {
            result.TTSubTypeList.forEach(function (e) {
                e.name = e.NameId.DefaultMessage;
                e.description = e.DescriptionId == undefined ? null : e.DescriptionId.DefaultMessage;
            });
            $scope.CstData = result.TTSubTypeList;
        });

    };
    $scope.getSearch(null);

    $scope.doing = function (param) {

        if (param == 'Add') {
            $scope.add.openAddTTSubTypeInterface();
        }

        if ($scope.data != undefined) {
            if (param == 'Modify') {
                $scope.update.openModifyTTSubTypeInterface($scope.data);
            }
        }
    }

    $scope.update = {};
    $scope.add = {};

    $scope.setClickedRow = function (data) {
        $scope.selectedRow = data.SubTypeId;

        $scope.data = data;

        $scope.Modal_RemoveTTSubTypeModal = '#RemoveTTSubTypeModal';
    }

    $scope.deleteDisabled = true;

    $scope.removeTTSubType = function () {
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
            SubTypeConfigurationService.TTSubTypeDelete.delete({
                SubTypeId: $scope.selectedRow
            }, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    angular.element('#RemoveTTSubTypeModal').modal('hide');
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>SubType Is Successfully deleted.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    angular.element('#RemoveTTSubTypeModal').modal('hide');
                    $scope.getSearch($scope.keySearch, clearCache = true);
                }
            })
            */

        }

    }
});

CSRContent.controller("AddTTSubTypeController", function ($scope, CommonEnum, CSRCache, CacheEnumService, CacheTroubleTicketService, Notification, SubTypeConfigurationService) {

    $scope.add.openAddTTSubTypeInterface = function () {

        angular.element('#AddTTSubTypeModal').modal('show');

    }

    $scope.submitAddTTSubType = function (data) {
        var param = {
            Name: data.Name,
            Description: data.Description
        };

        SubTypeConfigurationService.TTSubTypeAdd.add(param, function (response) {
            if (response.ResultType != 0 || response.ResultCode != 0) {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                return false;
            } else {
                Notification.success({
                    message: '<strong>Success!</strong> <span>SubType Is Successfully Added.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });

                data.Name = '';
                data.Description = '';

                angular.element('#AddTTSubTypeModal').modal('hide');
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
                name: "btnSubmitAddTTSubType",
                type: "submit",
                text: "Submit",
                click: "submitAddTTSubType(add)"
            },
            {
                name: "btnCancelAddTTSubType",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});

CSRContent.controller("ModifyTTSubTypeController", function ($scope, CommonEnum, CSRCache, CacheEnumService, CacheTroubleTicketService, Notification, SubTypeConfigurationService) {

    $scope.update.openModifyTTSubTypeInterface = function (data) {
        $scope.update.data = data;

        angular.element('#ModifyTTSubTypeModal').modal('show');

        $scope.update.Name = data.name;
        $scope.update.Description = data.description;

    }

    $scope.submitModifyTTSubType = function (data) {
        var param = {
            SubTypeId: data.data.SubTypeId,
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
            SubTypeConfigurationService.TTSubTypeUpdate.update(param, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    return false;
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>SubType Is Successfully Updated.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    $scope.update.Name = '';
                    $scope.update.Description = '';

                    angular.element('#ModifyTTSubTypeModal').modal('hide');
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
                name: "btnSubmitModifyTTSubType",
                type: "submit",
                text: "Submit",
                click: "submitModifyTTSubType(update)"
            },
            {
                name: "btnCancelModifyTTSubType",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});
