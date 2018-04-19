
CSRContent.controller("ManageTTQuestionCodeController", function ($scope, LocalStorageProvider, CommonEnum, CSRCache, CacheSearch, CacheEnumService, CacheTroubleTicketService, Notification, QuestionCodeConfigurationService) {

    $scope.isETAKUser = false;
    $scope.isETAKUser = LocalStorageProvider.isETAKUser();

    $scope.form = {}; //to set default name on UI Form
    $scope.currentPage = 1;

    $scope.Modal_RemoveTTQuestionCodeModal = '';

    var cacheKey = 'TTQuestionCodeData';
    $scope.CstData = '';
    $scope.getSearch = function (object, clearCache) {

        $scope.Modal_RemoveTTQuestionCodeModal = ''; //setdefault

        $scope.selectedRow = undefined;
        $scope.data = undefined;

        CacheTroubleTicketService.getAllQuestionCode(clearCache).then(function (result) {
            result.TTQuestionCodeList.forEach(function (e) {
                e.name = e.NameId.DefaultMessage;
                e.description = e.DescriptionId == undefined ? null : e.DescriptionId.DefaultMessage;
            });
            $scope.CstData = result.TTQuestionCodeList;
        });

    };
    $scope.getSearch(null);

    $scope.doing = function (param) {

        if (param == 'Add') {
            $scope.add.openAddTTQuestionCodeInterface();
        }

        if ($scope.data != undefined) {
            if (param == 'Modify') {
                $scope.update.openModifyTTQuestionCodeInterface($scope.data);
            }
        }
    }

    $scope.update = {};
    $scope.add = {};

    $scope.setClickedRow = function (data) {
        $scope.selectedRow = data.QuestionCodeId;

        $scope.data = data;

        $scope.Modal_RemoveTTQuestionCodeModal = '#RemoveTTQuestionCodeModal';
    }

    $scope.deleteDisabled = true;

    $scope.removeTTQuestionCode = function () {
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
            QuestionCodeConfigurationService.TTQuestionCodeDelete.delete({
                QuestionCodeId: $scope.selectedRow
            }, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    angular.element('#RemoveTTQuestionCodeModal').modal('hide');
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>QuestionCode Is Successfully deleted.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    angular.element('#RemoveTTQuestionCodeModal').modal('hide');
                    $scope.getSearch($scope.keySearch, clearCache = true);
                }
            })
            */

        }

    }
});

CSRContent.controller("AddTTQuestionCodeController", function ($scope, CommonEnum, CSRCache, CacheEnumService, Notification, QuestionCodeConfigurationService) {

    $scope.add.openAddTTQuestionCodeInterface = function () {

        angular.element('#AddTTQuestionCodeModal').modal('show');

    }

    $scope.submitAddTTQuestionCode = function (data) {
        var param = {
            Name: data.Name,
            Description: data.Description
        };

        QuestionCodeConfigurationService.TTQuestionCodeAdd.add(param, function (response) {
            if (response.ResultType != 0 || response.ResultCode != 0) {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                return false;
            } else {
                Notification.success({
                    message: '<strong>Success!</strong> <span>QuestionCode Is Successfully Added.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });

                data.Name = '';
                data.Description = '';

                angular.element('#AddTTQuestionCodeModal').modal('hide');
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
                name: "btnSubmitAddTTQuestionCode",
                type: "submit",
                text: "Submit",
                click: "submitAddTTQuestionCode(add)"
            },
            {
                name: "btnCancelAddTTQuestionCode",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});

CSRContent.controller("ModifyTTQuestionCodeController", function ($scope, CommonEnum, CSRCache, CacheEnumService, Notification, QuestionCodeConfigurationService) {

    $scope.update.openModifyTTQuestionCodeInterface = function (data) {
        $scope.update.data = data;

        angular.element('#ModifyTTQuestionCodeModal').modal('show');

        $scope.update.Name = data.name;
        $scope.update.Description = data.description;

    }

    $scope.submitModifyTTQuestionCode = function (data) {
        var param = {
            QuestionCodeId: data.data.QuestionCodeId,
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
            QuestionCodeConfigurationService.TTQuestionCodeUpdate.update(param, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    return false;
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>QuestionCode Is Successfully Updated.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    $scope.update.Name = '';
                    $scope.update.Description = '';

                    angular.element('#ModifyTTQuestionCodeModal').modal('hide');
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
                name: "btnSubmitModifyTTQuestionCode",
                type: "submit",
                text: "Submit",
                click: "submitModifyTTQuestionCode(update)"
            },
            {
                name: "btnCancelModifyTTQuestionCode",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});
