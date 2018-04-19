
CSRContent.controller("ManageTTPriorityController", function ($scope, LocalStorageProvider, CommonEnum, CSRCache, CacheSearch, CacheEnumService, CacheTroubleTicketService, Notification, PriorityConfigurationService) {

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

    $scope.Modal_RemoveTTPriorityModal = '';

    var cacheKey = 'TTPriorityData';
    $scope.CstData = '';
    $scope.getSearch = function (object, clearCache) {

        $scope.Modal_RemoveTTPriorityModal = ''; //setdefault

        $scope.selectedRow = undefined;
        $scope.data = undefined;

        var objectTTClassandPriority = {
            dealerId: object.keyMVNO
        };

        CacheEnumService.getTTClassandPriority(objectTTClassandPriority, clearCache).then(function (result) {
            result.PriorityList.forEach(function (e) {
                e.PriorityId = e.PriorityId == undefined ? e.Id : e.PriorityId;
                e.name = e.Name;
                e.description = e.Description;
            });
            $scope.CstData = result.PriorityList;
        });

    };

    $scope.doing = function (param) {

        if (param == 'Add') {
            $scope.add.openAddTTPriorityInterface();
        }

        if ($scope.data != undefined) {
            if (param == 'Modify') {
                $scope.update.openModifyTTPriorityInterface($scope.data);
            }
        }
    }

    $scope.update = {};
    $scope.add = {};

    $scope.setClickedRow = function (data) {
        $scope.selectedRow = data.PriorityId;

        $scope.data = data;

        $scope.Modal_RemoveTTPriorityModal = '#RemoveTTPriorityModal';
    }

    $scope.deleteDisabled = true;

    $scope.removeTTPriority = function () {
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
            PriorityConfigurationService.TTPriorityDelete.delete({
                PriorityId: $scope.selectedRow
            }, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    angular.element('#RemoveTTPriorityModal').modal('hide');
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Priority Is Successfully deleted.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    angular.element('#RemoveTTPriorityModal').modal('hide');
                    $scope.getSearch($scope.keySearch, clearCache = true);
                }
            })
            */

        }

    }
});

CSRContent.controller("AddTTPriorityController", function ($scope, CommonEnum, CSRCache, CacheEnumService, CacheTroubleTicketService, Notification, PriorityConfigurationService) {

    $scope.add.openAddTTPriorityInterface = function () {

        angular.element('#AddTTPriorityModal').modal('show');

    }

    $scope.submitAddTTPriority = function (data) {
        var param = {
            MvnoId: $scope.keySearch.keyMVNO,
            Name: data.Name,
            Description: data.Description
        };

        PriorityConfigurationService.TTPriorityAdd.add(param, function (response) {
            if (response.ResultType != 0 || response.ResultCode != 0) {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                return false;
            } else {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Priority Is Successfully Added.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });

                data.Name = '';
                data.Description = '';

                angular.element('#AddTTPriorityModal').modal('hide');
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
                name: "btnSubmitAddTTPriority",
                type: "submit",
                text: "Submit",
                click: "submitAddTTPriority(add)"
            },
            {
                name: "btnCancelAddTTPriority",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});

CSRContent.controller("ModifyTTPriorityController", function ($scope, CommonEnum, CSRCache, CacheEnumService, CacheTroubleTicketService, Notification, PriorityConfigurationService) {

    $scope.update.openModifyTTPriorityInterface = function (data) {
        $scope.update.data = data;

        angular.element('#ModifyTTPriorityModal').modal('show');

        $scope.update.Name = data.name;
        $scope.update.Description = data.description;

    }

    $scope.submitModifyTTPriority = function (data) {
        var param = {
            PriorityId: data.data.PriorityId,
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
            PriorityConfigurationService.TTPriorityUpdate.update(param, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    return false;
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Priority Is Successfully Updated.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    $scope.update.Name = '';
                    $scope.update.Description = '';

                    angular.element('#ModifyTTPriorityModal').modal('hide');
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
                name: "btnSubmitModifyTTPriority",
                type: "submit",
                text: "Submit",
                click: "submitModifyTTPriority(update)"
            },
            {
                name: "btnCancelModifyTTPriority",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});
