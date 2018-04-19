
CSRContent.controller("ManageTTClassController", function ($scope, LocalStorageProvider, CommonEnum, CSRCache, CacheSearch, CacheEnumService, CacheTroubleTicketService, Notification, ClassConfigurationService) {

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

    $scope.Modal_RemoveTTClassModal = '';

    var cacheKey = 'TTClassData';
    $scope.CstData = '';
    $scope.getSearch = function (object, clearCache) {

        $scope.Modal_RemoveTTClassModal = ''; //setdefault

        $scope.selectedRow = undefined;
        $scope.data = undefined;

        var objectTTClassandPriority = {
            dealerId: object.keyMVNO
        };

        CacheEnumService.getTTClassandPriority(objectTTClassandPriority, clearCache).then(function (result) {
            result.ClassList.forEach(function (e) {
                e.ClassId = e.ClassId == undefined ? e.Id : e.ClassId;
                e.name = e.Name;
                e.description = e.Description;
            });
            $scope.CstData = result.ClassList;
            console.log($scope.CstData);
        });
    };

    $scope.doing = function (param) {

        if (param == 'Add') {
            $scope.add.openAddTTClassInterface();
        }

        if ($scope.data != undefined) {
            if (param == 'Modify') {
                $scope.update.openModifyTTClassInterface($scope.data);
            }
        }
    }

    $scope.update = {};
    $scope.add = {};

    $scope.setClickedRow = function (data) {
        $scope.selectedRow = data.ClassId;

        $scope.data = data;

        $scope.Modal_RemoveTTClassModal = '#RemoveTTClassModal';
    }

    $scope.deleteDisabled = true;

    $scope.removeTTClass = function () {
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
            ClassConfigurationService.TTClassDelete.delete({
                ClassId: $scope.selectedRow
            }, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    angular.element('#RemoveTTClassModal').modal('hide');
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Class Is Successfully deleted.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    angular.element('#RemoveTTClassModal').modal('hide');
                    $scope.getSearch($scope.keySearch, clearCache = true);
                }
            })
            */

        }

    }
});

CSRContent.controller("AddTTClassController", function ($scope, CommonEnum, CSRCache, CacheEnumService, CacheTroubleTicketService, Notification, ClassConfigurationService) {

    $scope.add.openAddTTClassInterface = function () {

        angular.element('#AddTTClassModal').modal('show');

    }

    $scope.submitAddTTClass = function (data) {
        var param = {
            MvnoId: $scope.keySearch.keyMVNO,
            Name: data.Name,
            Description: data.Description
        };

        ClassConfigurationService.TTClassAdd.add(param, function (response) {
            if (response.ResultType != 0 || response.ResultCode != 0) {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                return false;
            } else {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Class Is Successfully Added.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });

                data.Name = '';
                data.Description = '';

                angular.element('#AddTTClassModal').modal('hide');
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
                name: "btnSubmitAddTTClass",
                type: "submit",
                text: "Submit",
                click: "submitAddTTClass(add)"
            },
            {
                name: "btnCancelAddTTClass",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});

CSRContent.controller("ModifyTTClassController", function ($scope, CommonEnum, CSRCache, CacheEnumService, CacheTroubleTicketService, Notification, ClassConfigurationService) {

    $scope.update.openModifyTTClassInterface = function (data) {
        $scope.update.data = data;

        angular.element('#ModifyTTClassModal').modal('show');

        $scope.update.Name = data.name;
        $scope.update.Description = data.description;

    }

    $scope.submitModifyTTClass = function (data) {
        var param = {
            ClassId: data.data.ClassId,
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
            ClassConfigurationService.TTClassUpdate.update(param, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    return false;
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Class Is Successfully Updated.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    $scope.update.Name = '';
                    $scope.update.Description = '';

                    angular.element('#ModifyTTClassModal').modal('hide');
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
                name: "btnSubmitModifyTTClass",
                type: "submit",
                text: "Submit",
                click: "submitModifyTTClass(update)"
            },
            {
                name: "btnCancelModifyTTClass",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});
