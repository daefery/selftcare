
CSRContent.controller("ManageTTQuestionController", function ($scope, LocalStorageProvider, CommonEnum, CSRCache, CacheSearch, CacheEnumService, CacheTroubleTicketService, Notification, QuestionConfigurationService) {

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

    $scope.Modal_RemoveTTQuestionModal = '';

    var cacheKey = 'TTQuestionData';
    $scope.CstData = '';
    $scope.getSearch = function (object, clearCache) {

        $scope.Modal_RemoveTTQuestionModal = ''; //setdefault

        $scope.selectedRow = undefined;
        $scope.data = undefined;

        CacheTroubleTicketService.getAllQuestion(object, clearCache).then(function (result) {
            $scope.CstData = result.TTQuestionList;
        });

    };

    $scope.doing = function (param) {

        if (param == 'Add') {
            $scope.add.openAddTTQuestionInterface();
        }

        if ($scope.data != undefined) {
            if (param == 'Modify') {
                $scope.update.openModifyTTQuestionInterface($scope.data);
            }
        }
    }

    $scope.update = {};
    $scope.add = {};

    $scope.setClickedRow = function (data) {
        $scope.selectedRow = data.QuestionId;

        $scope.data = data;

        $scope.Modal_RemoveTTQuestionModal = '#RemoveTTQuestionModal';
    }

    $scope.deleteDisabled = false;

    $scope.removeTTQuestion = function () {
        if ($scope.selectedRow == undefined) {
            Notification.error({
                message: '<span>Please select one</span>',
                positionY: 'top',
                positionX: 'center',
                delay: 10000
            });
        } else {
            QuestionConfigurationService.TTQuestionDelete.delete({
                QuestionId: $scope.selectedRow
            }, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    angular.element('#RemoveTTQuestionModal').modal('hide');
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Question Is Successfully deleted.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    angular.element('#RemoveTTQuestionModal').modal('hide');
                    $scope.getSearch($scope.keySearch, clearCache = true);
                }
            })

        }

    }
});

CSRContent.controller("AddTTQuestionController", function ($scope, CommonEnum, CSRCache, CacheEnumService, CacheTroubleTicketService, Notification, QuestionConfigurationService) {

    $scope.$watch('add.TypeId', function () {
        if ($scope.add.TypeId !== undefined && $scope.add.TypeId !== null) {
            var TypeId = $scope.add.TypeId.value;
            $scope.add.getAllSubtypeInFlowRuleByTypeId(TypeId);
        }
    })

    $scope.add.openAddTTQuestionInterface = function () {

        $scope.AddTTQuestionForm.$setPristine();
        angular.element('#AddTTQuestionModal').modal('show');

        $scope.add.TTType = [];
        CacheTroubleTicketService.getAllTypeInFlowRule().then(function (result) {
            result.TTTypeFromFlowRuleList.forEach(function (e) {
                e.name = e.Name;
                e.value = e.Id;
            });
            $scope.add.TTType = result.TTTypeFromFlowRuleList;
        });

        $scope.add.TTSubType = [];
        $scope.add.getAllSubtypeInFlowRuleByTypeId = function (TypeId) {
            $scope.add.TTSubType = [];
            $scope.add.SubTypeId = null;    //set selected SubType into blank
            CacheTroubleTicketService.getAllSubtypeInFlowRule(false, TypeId).then(function (result) {
                result.TTSubTypeFromFlowRuleList.forEach(function (e) {
                    e.name = e.Name;
                    e.value = e.Id;
                });
                $scope.add.TTSubType = result.TTSubTypeFromFlowRuleList;
            });
        }

        $scope.add.TTQuestionCode = [];
        CacheTroubleTicketService.getAllQuestionCode().then(function (result) {
            result.TTQuestionCodeList.forEach(function (e) {
                e.name = e.NameId.DefaultMessage;
                e.value = e.QuestionCodeId;
            });
            $scope.add.TTQuestionCode = result.TTQuestionCodeList;
        });
    }

    $scope.submitAddTTQuestion = function (data) {
        var param = {
            MvnoId: $scope.keySearch.keyMVNO,
            TypeId: data.TypeId.value,
            SubTypeId: data.SubTypeId.value,
            QuestionCodeId: data.QuestionCodeId.value,
        };

        QuestionConfigurationService.TTQuestionAdd.add(param, function (response) {
            if (response.ResultType != 0 || response.ResultCode != 0) {
                Notification.error({
                    message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });
                return false;
            } else {
                Notification.success({
                    message: '<strong>Success!</strong> <span>Question Is Successfully Added.</span>',
                    positionY: 'top',
                    positionX: 'center'
                });

                $scope.add.TypeId = null;
                $scope.add.SubTypeId = null;
                $scope.add.QuestionCodeId = null;

                angular.element('#AddTTQuestionModal').modal('hide');
                $scope.getSearch($scope.keySearch, clearCache = true);
            }
        });
    }

    $scope.datas = {

        field: [
            {
                type: "select",
                name: "TypeId",
                size: 6,
                text: "TT_Type",
                model: "add.TypeId",
                required: true,
                value: "add.TTType",
                validation: [{ value: "mandatory" }]
            },
            {
                type: "select",
                name: "SubTypeId",
                size: 6,
                text: "TT_Subtype",
                model: "add.SubTypeId",
                required: true,
                value: "add.TTSubType",
                validation: [{ value: "mandatory" }]
            },
            {
                type: "select",
                name: "QuestionCodeId",
                size: 6,
                text: "Question",
                model: "add.QuestionCodeId",
                required: true,
                value: "add.TTQuestionCode",
                validation: [{ value: "mandatory" }]
            },
        ],
        button: [
            {
                name: "btnSubmitAddTTQuestion",
                type: "submit",
                text: "Submit",
                click: "submitAddTTQuestion(add)"
            },
            {
                name: "btnCancelAddTTQuestion",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});

CSRContent.controller("ModifyTTQuestionController", function ($scope, CommonEnum, CSRCache, CacheEnumService, CacheTroubleTicketService, Notification, QuestionConfigurationService) {

    $scope.$watch('update.TypeId', function () {
        if ($scope.update.TypeId !== undefined && $scope.update.TypeId !== null) {
            var TypeId = $scope.update.TypeId.value;
            $scope.update.getAllSubtypeInFlowRuleByTypeId(TypeId);
        }
    })

    $scope.update.openModifyTTQuestionInterface = function (data) {
        $scope.ModifyTTQuestionForm.$setPristine();
        $scope.update.data = data;
        $scope.update.TypeId = null;
        $scope.update.SubTypeId = null;

        angular.element('#ModifyTTQuestionModal').modal('show');

        $scope.update.TTType = [];
        CacheTroubleTicketService.getAllTypeInFlowRule().then(function (result) {
            result.TTTypeFromFlowRuleList.forEach(function (e) {
                e.name = e.Name;
                e.value = e.Id;

                //info any type selected equal to updatedata, set Type into updatedata
                if (e.name == data.Type.NameId.DefaultMessage && e.value == data.Type.TypeId) {
                    $scope.update.TypeId = { name: data.Type.NameId.DefaultMessage, value: data.Type.TypeId };
                }
            });
            $scope.update.TTType = result.TTTypeFromFlowRuleList;
        });

        $scope.update.TTSubType = [];
        $scope.update.getAllSubtypeInFlowRuleByTypeId = function (TypeId) {
            $scope.update.TTSubType = [];
            $scope.update.SubTypeId = null;    //set selected SubType into blank
            CacheTroubleTicketService.getAllSubtypeInFlowRule(false, TypeId).then(function (result) {
                result.TTSubTypeFromFlowRuleList.forEach(function (e) {
                    e.name = e.Name;
                    e.value = e.Id;

                    //info any subtype selected equal to updatedata, set SubType into updatedata
                    if (e.name == data.SubType.NameId.DefaultMessage && e.value == data.SubType.SubTypeId) {
                        $scope.update.SubTypeId = { name: data.SubType.NameId.DefaultMessage, value: data.SubType.SubTypeId };
                    }
                });
                $scope.update.TTSubType = result.TTSubTypeFromFlowRuleList;
            });
        }

        $scope.update.TTQuestionCode = [];
        CacheTroubleTicketService.getAllQuestionCode().then(function (result) {
            result.TTQuestionCodeList.forEach(function (e) {
                e.name = e.NameId.DefaultMessage;
                e.value = e.QuestionCodeId;
            });
            $scope.update.TTQuestionCode = result.TTQuestionCodeList;
            $scope.update.QuestionCodeId = { name: data.QuestionCode.NameId.DefaultMessage, value: data.QuestionCode.QuestionCodeId };
        });

    }

    $scope.isFormChanged = function (data) {
        if (data.data == undefined
            || data.TypeId == undefined
            || data.SubTypeId == undefined
            || data.QuestionCodeId == undefined
        ) {
            return false;
        }
        var param = {
            QuestionId: data.data.QuestionId,
            MvnoId: $scope.keySearch.keyMVNO,
            TypeId: data.TypeId.value,
            SubTypeId: data.SubTypeId.value,
            QuestionCodeId: data.QuestionCodeId.value,
        };

        var valid = false;
        if (data.data.Type.TypeId == param.TypeId && data.data.SubType.SubTypeId == param.SubTypeId && data.data.QuestionCode.QuestionCodeId == param.QuestionCodeId) {
            valid = false;
        } else {
            valid = true;
        }
        return valid;
    }

    $scope.submitModifyTTQuestion = function (data) {
        var param = {
            QuestionId: data.data.QuestionId,
            MvnoId: $scope.keySearch.keyMVNO,
            TypeId: data.TypeId.value,
            SubTypeId: data.SubTypeId.value,
            QuestionCodeId: data.QuestionCodeId.value,
        };

        var valid = false;
        if (data.data.Type.TypeId == param.TypeId && data.data.SubType.SubTypeId == param.SubTypeId && data.data.QuestionCode.QuestionCodeId == param.QuestionCodeId) {
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
            QuestionConfigurationService.TTQuestionUpdate.update(param, function (response) {
                if (response.ResultType != 0 || response.ResultCode != 0) {
                    Notification.error({
                        message: '<strong>Failed!</strong> <span>' + response.Messages + '.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });
                    return false;
                } else {
                    Notification.success({
                        message: '<strong>Success!</strong> <span>Question Is Successfully Updated.</span>',
                        positionY: 'top',
                        positionX: 'center'
                    });

                    angular.element('#ModifyTTQuestionModal').modal('hide');
                    $scope.getSearch($scope.keySearch, clearCache = true);
                }
            });
        }
    };

    $scope.datas = {

        field: [
            {
                type: "select",
                name: "TypeId",
                size: 6,
                text: "TT_Type",
                model: "update.TypeId",
                required: true,
                value: "update.TTType",
                validation: [{ value: "mandatory" }]
            },
            {
                type: "select",
                name: "SubTypeId",
                size: 6,
                text: "TT_Subtype",
                model: "update.SubTypeId",
                required: true,
                value: "update.TTSubType",
                validation: [{ value: "mandatory" }]
            },
            {
                type: "select",
                name: "QuestionCodeId",
                size: 6,
                text: "Question",
                model: "update.QuestionCodeId",
                required: true,
                value: "update.TTQuestionCode",
                validation: [{ value: "mandatory" }]
            },
        ],
        button: [
            {
                name: "btnSubmitModifyTTQuestion",
                type: "submit",
                text: "Submit",
                disabled: "!isFormChanged(update)",
                click: "submitModifyTTQuestion(update)"
            },
            {
                name: "btnCancelModifyTTQuestion",
                type: "cancel",
                text: "Cancel",
                click: "modal"
            }
        ]
    }
});
